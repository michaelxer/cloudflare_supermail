import { Context } from 'hono'
import { Jwt } from 'hono/utils/jwt'

import i18n from '../i18n'
import { getBooleanValue } from '../utils'
import { newAddress, handleListQuery } from '../common'
import { CONSTANTS } from '../constants'

const listAddresses = async (c: Context<HonoCustomType>) => {
    const { limit, offset, query, sort_by, sort_order } = c.req.query();
    const allowedSortColumns: Record<string, string> = {
        'id': 'a.id',
        'name': 'a.name',
        'created_at': 'a.created_at',
        'updated_at': 'a.updated_at',
        'source_meta': 'a.source_meta',
        'mail_count': 'mail_count',
        'send_count': 'send_count',
    };
    const sortColumn = Object.hasOwn(allowedSortColumns, sort_by) ? allowedSortColumns[sort_by] : 'a.id';
    const sortDirection = sort_order === 'ascend' ? 'asc' : 'desc';
    const orderBy = `${sortColumn} ${sortDirection}`;
    if (query) {
        // D1 caps LIKE pattern length at 50 bytes; fall back to instr() for
        // longer queries to avoid "LIKE or GLOB pattern too complex" (#956).
        const useInstr = new TextEncoder().encode(query).length + 2 > 50;
        const whereClause = useInstr ? `instr(name, ?) > 0` : `name like ?`;
        const param = useInstr ? query : `%${query}%`;
        return await handleListQuery(c,
            `SELECT a.*,`
            + ` (SELECT COUNT(*) FROM raw_mails WHERE address = a.name) AS mail_count,`
            + ` (SELECT COUNT(*) FROM sendbox WHERE address = a.name) AS send_count`
            + ` FROM address a`
            + ` where ${whereClause}`,
            `SELECT count(*) as count FROM address where ${whereClause}`,
            [param], limit, offset, orderBy, ['password']
        );
    }
    return await handleListQuery(c,
        `SELECT a.*,`
        + ` (SELECT COUNT(*) FROM raw_mails WHERE address = a.name) AS mail_count,`
        + ` (SELECT COUNT(*) FROM sendbox WHERE address = a.name) AS send_count`
        + ` FROM address a`,
        `SELECT count(*) as count FROM address`,
        [], limit, offset, orderBy, ['password']
    );
};

const createNewAddress = async (c: Context<HonoCustomType>) => {
    const { name, domain, enablePrefix, enableRandomSubdomain } = await c.req.json();
    const msgs = i18n.getMessagesbyContext(c);
    if (!name) {
        return c.text(msgs.RequiredFieldMsg, 400)
    }
    try {
        const res = await newAddress(c, {
            name, domain, enablePrefix,
            enableRandomSubdomain: getBooleanValue(enableRandomSubdomain),
            checkLengthByConfig: false,
            addressPrefix: null,
            checkAllowDomains: false,
            enableCheckNameRegex: false,
            sourceMeta: 'admin'
        });
        return c.json(res);
    } catch (e) {
        return c.text(`${msgs.FailedCreateAddressMsg}: ${(e as Error).message}`, 400)
    }
};

const deleteAddress = async (c: Context<HonoCustomType>) => {
    const msgs = i18n.getMessagesbyContext(c);
    const { id } = c.req.param();
    const { success } = await c.env.DB.prepare(
        `DELETE FROM address WHERE id = ? `
    ).bind(id).run();
    if (!success) {
        return c.text(msgs.OperationFailedMsg, 500)
    }
    const { success: mailSuccess } = await c.env.DB.prepare(
        `DELETE FROM raw_mails WHERE address IN`
        + ` (select name from address where id = ?) `
    ).bind(id).run();
    if (!mailSuccess) {
        return c.text(msgs.OperationFailedMsg, 500)
    }
    const { success: sendAccess } = await c.env.DB.prepare(
        `DELETE FROM address_sender WHERE address IN`
        + ` (select name from address where id = ?) `
    ).bind(id).run();
    const { success: usersAddressSuccess } = await c.env.DB.prepare(
        `DELETE FROM users_address WHERE address_id = ?`
    ).bind(id).run();
    return c.json({
        success: success && mailSuccess && sendAccess && usersAddressSuccess
    })
};

const clearInbox = async (c: Context<HonoCustomType>) => {
    const msgs = i18n.getMessagesbyContext(c);
    const { id } = c.req.param();
    const { success: mailSuccess } = await c.env.DB.prepare(
        `DELETE FROM raw_mails WHERE address IN`
        + ` (select name from address where id = ?) `
    ).bind(id).run();
    if (!mailSuccess) {
        return c.text(msgs.OperationFailedMsg, 500)
    }
    return c.json({ success: mailSuccess });
};

const clearSentItems = async (c: Context<HonoCustomType>) => {
    const msgs = i18n.getMessagesbyContext(c);
    const { id } = c.req.param();
    const { success: sendboxSuccess } = await c.env.DB.prepare(
        `DELETE FROM sendbox WHERE address IN`
        + ` (select name from address where id = ?) `
    ).bind(id).run();
    if (!sendboxSuccess) {
        return c.text(msgs.OperationFailedMsg, 500)
    }
    return c.json({ success: sendboxSuccess });
};

const showPassword = async (c: Context<HonoCustomType>) => {
    const { id } = c.req.param();
    const name = await c.env.DB.prepare(
        `SELECT name FROM address WHERE id = ? `
    ).bind(id).first("name");
    const jwt = await Jwt.sign({
        address: name,
        address_id: id
    }, c.env.JWT_SECRET, "HS256")
    return c.json({ jwt });
};

const resetPassword = async (c: Context<HonoCustomType>) => {
    const msgs = i18n.getMessagesbyContext(c);
    const { id } = c.req.param();
    const { password } = await c.req.json();
    // NOTE: Keep the admin API field as password, but the value is a frontend SHA-256 hash.
    if (!getBooleanValue(c.env.ENABLE_ADDRESS_PASSWORD)) {
        return c.text(msgs.PasswordChangeDisabledMsg, 403);
    }
    if (!password) {
        return c.text(msgs.NewPasswordRequiredMsg, 400);
    }
    const { success } = await c.env.DB.prepare(
        `UPDATE address SET password = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(password, id).run();
    if (!success) {
        return c.text(msgs.FailedUpdatePasswordMsg, 500);
    }
    return c.json({ success: true });
};

const bulkBindTelegram = async (c: Context<HonoCustomType>) => {
    const { userId } = await c.req.json();
    if (!userId) {
        return c.text('userId is required', 400);
    }
    if (!c.env.KV) {
        return c.text('KV is not available', 400);
    }
    // Get all addresses from DB
    const { results } = await c.env.DB.prepare(
        `SELECT id, name FROM address`
    ).all<{ id: number, name: string }>();

    // Get already-bound addresses for this user
    const jwtList = await c.env.KV.get<string[]>(
        `${CONSTANTS.TG_KV_PREFIX}:${userId}`, 'json'
    ) || [];
    const boundAddresses = new Set<string>();
    for (const jwt of jwtList) {
        try {
            const { address } = await Jwt.verify(jwt, c.env.JWT_SECRET, "HS256");
            if (address) boundAddresses.add(address as string);
        } catch (_) { /* skip invalid */ }
    }

    const newJwtList = [...jwtList];
    const bound: string[] = [];
    const skipped: string[] = [];

    for (const row of results) {
        const fullAddress = row.name;
        if (boundAddresses.has(fullAddress)) {
            skipped.push(fullAddress);
            continue;
        }
        const jwt = await Jwt.sign(
            { address: fullAddress, address_id: row.id },
            c.env.JWT_SECRET, "HS256"
        );
        newJwtList.push(jwt);
        // for mail push to telegram
        await c.env.KV.put(`${CONSTANTS.TG_KV_PREFIX}:${fullAddress}`, userId.toString());
        bound.push(fullAddress);
        boundAddresses.add(fullAddress);
    }

    await c.env.KV.put(
        `${CONSTANTS.TG_KV_PREFIX}:${userId}`,
        JSON.stringify(newJwtList)
    );

    return c.json({ bound, skipped, total: bound.length });
};

export default {
    listAddresses, createNewAddress, deleteAddress, clearInbox, clearSentItems,
    showPassword, resetPassword, bulkBindTelegram
};

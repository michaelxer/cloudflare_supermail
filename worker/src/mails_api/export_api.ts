import { Context } from 'hono'

import { resolveRawEmailList } from '../gzip'
import { RawMailRow } from '../models'

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;
const DEFAULT_OFFSET = 0;

/**
 * Parse and clamp the limit query param (default 100, max 500).
 */
const parseLimit = (raw: string | undefined): number => {
    const n = Number.parseInt(raw ?? '');
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
    return Math.min(n, MAX_LIMIT);
}

/**
 * Parse and clamp the offset query param (default 0, >= 0).
 */
const parseOffset = (raw: string | undefined): number => {
    const n = Number.parseInt(raw ?? '');
    if (!Number.isFinite(n) || n < 0) return DEFAULT_OFFSET;
    return n;
}

/**
 * Escape a value for RFC 4180 CSV: wrap in double quotes if it contains
 * comma, double-quote, CR, or LF; double any embedded double-quotes.
 */
const escapeCsvField = (value: string): string => {
    if (/[",\r\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/**
 * Build a CSV document from mail rows.
 * Columns: id, subject, source, created_at
 * Subject is parsed from the raw email body via commonParseMail.
 */
const buildCsv = async (rows: RawMailRow[]): Promise<string> => {
    const { commonParseMail } = await import('../common');
    const header = 'id,subject,source,created_at';
    const lines: string[] = [header];
    for (const row of rows) {
        const parsed = row.raw ? await commonParseMail({ rawEmail: row.raw }) : undefined;
        const subject = parsed?.subject ?? '';
        const id = row.id?.toString() ?? '';
        const source = row.source ?? '';
        const createdAt = row.created_at ?? '';
        lines.push([
            escapeCsvField(id),
            escapeCsvField(subject),
            escapeCsvField(source),
            escapeCsvField(createdAt),
        ].join(','));
    }
    return lines.join('\n');
}

/**
 * Build a JSON document from mail rows (array of resolved mail objects).
 */
const buildJson = (rows: RawMailRow[]): string => {
    return JSON.stringify(rows);
}

/**
 * Build an EML document by concatenating raw email bodies with a separator.
 */
const buildEml = (rows: RawMailRow[]): string => {
    const separator = '\n\n--- --- --- --- --- --- --- --- --- --- ---\n\n';
    return rows
        .map(row => row.raw ?? '')
        .filter(raw => raw.length > 0)
        .join(separator);
}

const exportMails = async (c: Context<HonoCustomType>) => {
    const { address } = c.get("jwtPayload")
    if (!address) {
        return c.json({ "error": "No address" }, 400)
    }
    const { format, limit, offset } = c.req.query();
    const fmt = (format ?? 'json').toLowerCase();
    if (!['csv', 'json', 'eml'].includes(fmt)) {
        return c.json({ "error": "Invalid format. Must be one of: csv, json, eml" }, 400)
    }
    const lim = parseLimit(limit);
    const off = parseOffset(offset);

    // Query raw_mails scoped to the authenticated address (parameterized).
    const { results } = await c.env.DB.prepare(
        `SELECT * FROM raw_mails where address = ? order by id desc limit ? offset ?`
    ).bind(address, lim, off).all<RawMailRow>();

    // Resolve raw_blob → raw for each row (decompress gzip if present).
    const resolved = await resolveRawEmailList(results);

    const timestamp = new Date().toISOString().slice(0, 10);
    let body: string;
    let contentType: string;
    let fileExtension: string;

    if (fmt === 'csv') {
        body = await buildCsv(resolved);
        contentType = 'text/csv; charset=utf-8';
        fileExtension = 'csv';
    } else if (fmt === 'eml') {
        body = buildEml(resolved);
        contentType = 'message/rfc822; charset=utf-8';
        fileExtension = 'eml';
    } else {
        body = buildJson(resolved);
        contentType = 'application/json; charset=utf-8';
        fileExtension = 'json';
    }

    const filename = `mails-${timestamp}.${fileExtension}`;
    return c.body(body, 200, {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
    });
}

export default { exportMails };

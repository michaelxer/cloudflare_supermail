import { Context } from "hono";

export const isS3Enabled = (c: Context<HonoCustomType>) => {
    return !!c.env.S3_BUCKET;
}

export default {
    getSignedGetUrl: async (c: Context<HonoCustomType>) => {
        const { address } = c.get("jwtPayload")
        const { key } = await c.req.json()
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        // For R2 bindings, we return a proxy URL through the worker
        const url = new URL(c.req.url);
        url.pathname = `/api/attachment/download/${address}/${key}`;
        return c.json({ url: url.toString() });
    },
    getSignedPutUrl: async (c: Context<HonoCustomType>) => {
        const { address } = c.get("jwtPayload")
        const { key } = await c.req.json()
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        // For R2 bindings, we return a proxy URL through the worker
        const url = new URL(c.req.url);
        url.pathname = `/api/attachment/upload/${address}/${key}`;
        return c.json({ url: url.toString() });
    },
    list: async (c: Context<HonoCustomType>) => {
        const { address } = c.get("jwtPayload")
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        const objects = await bucket.list({ prefix: `${address}/` });
        return c.json(
            {
                results: objects.objects
                    ?.map((v) => v.key?.replace(`${address}/`, ""))
                    ?.filter(k => k)
                    ?.map((k) => ({ key: k }))
            }
        );
    },
    deleteKey: async (c: Context<HonoCustomType>) => {
        const { address } = c.get("jwtPayload")
        const { key } = await c.req.json()
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        await bucket.delete(`${address}/${key}`);
        return c.json({ success: true });
    },
    // New endpoints for R2 proxy
    download: async (c: Context<HonoCustomType>) => {
        const address = c.req.param('address');
        const key = c.req.param('key');
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        const object = await bucket.get(`${address}/${key}`);
        if (!object) {
            return c.text('Not found', 404);
        }
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        return new Response(object.body, { headers });
    },
    upload: async (c: Context<HonoCustomType>) => {
        const address = c.req.param('address');
        const key = c.req.param('key');
        const bucket = c.env.S3_BUCKET;
        if (!bucket) {
            throw new Error("R2 bucket not configured");
        }
        const body = await c.req.arrayBuffer();
        await bucket.put(`${address}/${key}`, body);
        return c.json({ success: true });
    }
}

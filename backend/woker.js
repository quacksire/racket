export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname.slice(1);
        const method = request.method;

        const TABLES = new Set([
            "locations",
            "orgs",
            "players",
            "events",
            "venues",
            "courts",
            "event_participants",
            "event_participant_players",
            "beacons"
        ]);

        function corsify(res) {
            const newHeaders = new Headers(res.headers);
            newHeaders.set("Access-Control-Allow-Origin", "*");
            newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            newHeaders.set("Access-Control-Allow-Headers", "Content-Type");
            return new Response(res.body, {
                status: res.status,
                statusText: res.statusText,
                headers: newHeaders
            });
        }

        // Handle preflight
        if (method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            });
        }

        if (!TABLES.has(path)) {
            return corsify(new Response("Not found", { status: 404 }));
        }

        try {
            if (method === "GET") {

                // get all parameters from the URL
                const params = Object.fromEntries(url.searchParams.entries());
                // If there are any parameters, we assume it's a filter
                if (Object.keys(params).length > 0) {
                    const conditions = Object.entries(params)
                        .map(([key, value]) => `"${key}" = ?`)
                        .join(" AND ");
                    const values = Object.values(params);
                    const sql = `SELECT * FROM ${path} WHERE ${conditions}`;
                    const query = env.DB.prepare(sql).bind(...values);
                    const result = await query.all();
                    return corsify(Response.json(result));
                }

                env.DB.prepare(`SELECT * FROM ${path}`)

                const result = id ? await query.first() : await query.all();
                return corsify(Response.json(result ?? {}));
            }

            if (method === "POST") {
                const body = await request.json();
                const keys = Object.keys(body);
                const values = Object.values(body);
                const placeholders = keys.map(() => "?").join(", ");
                const columns = keys.map((k) => `"${k}"`).join(", ");
                const sql = `INSERT INTO ${path} (${columns}) VALUES (${placeholders})`;

                await env.DB.prepare(sql).bind(...values).run();
                return corsify(new Response("Inserted", { status: 201 }));
            }

            return corsify(new Response("Method not allowed", { status: 405 }));
        } catch (err) {
            return corsify(new Response(`Error: ${err.message}`, { status: 400 }));
        }
    }
};

// api/server.js
const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const dbFile = path.join(__dirname, "..", "db.json"); // <-- explicit path
const router = jsonServer.router(dbFile);

server.use(middlewares);
server.use(jsonServer.bodyParser);

// optional: simple health check
server.get("/_health", (req, res) => res.json({ ok: true }));

server.use((req, res, next) => {
    // log requests for Vercel logs
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

server.use(router);

// export as function so Vercel calls it reliably
module.exports = (req, res) => {
    try {
        return server(req, res);
    } catch (err) {
        console.error("Server error:", err && err.stack ? err.stack : err);
        res.statusCode = 500;
        res.end("internal server error");
    }
};

const express = require("express");
const next = require("next");
const db = require("./API/db").default;
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/search/:annotation", (req, res) => {
    return app.render(req, res, "/search", {
      annotation: req.params.annotation
    });
  });

  server.get("/posts/:id/:search", (req, res) => {
    return app.render(req, res, "/posts", {
      id: req.params.id,
      search: req.params.search
    });
  });

  server.get("/API", (req, res) => {
    res.status(200).send({ hi: 12 });
  });

  server.get("*", (req, res) => {
    return app.render(req, res, "/index", req.query);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

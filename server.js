var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const port = 5000;

const rootFile = "index.html";
const root = path.resolve(__dirname, rootFile);

// mime/types
extensions = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
  ".ico": "image/vnd.microsoft.icon"
};

fs.exists(root, function(exists) {
  if (exists) {
    http
      .createServer(function(req, res) {
        var uri = url.parse(req.url).pathname;
        var filename = path.join(process.cwd(), uri);

        fs.exists(filename, function(exists) {
          if (exists) {
            if (fs.statSync(filename).isDirectory()) filename += rootFile;
            const ext = path.extname(filename);
            fs.readFile(filename, function(err, contents) {
              if (err) throw err;
              if (extensions[ext]) {
                res.writeHeader(200, {
                  "Content-Type": extensions[ext],
                  "Content-Length": contents.length
                });
                res.write(contents);
                res.end();
              }
            });
          }
        });
      })
      .listen(port, err => {
        if (dev) console.log(`> Ready on http://localhost:${port}`);
      });
  }
});

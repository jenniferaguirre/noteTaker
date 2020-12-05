const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function (req, res) {
  let savedPage = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedPage[Number(req.params.id)]);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/api/notes", function (req, res) {
  let savedPage = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newPage = req.body;
  let uniqueID = (savedPage.length).toString();
  newPage.id = uniqueID;
  savedPage.push(newPage);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedPage));
  res.json(savedPage);
})

app.delete("/api/notes/:id", function (req, res) {
  let savedPage = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let pageID = req.params.id;
  let newID = 0;
  savedPage = savedPage.filter(current => {
    return current.id != pageID;
  })

  for (current of savedPage) {
    current.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedPage));
  res.json(savedPage);
})

app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
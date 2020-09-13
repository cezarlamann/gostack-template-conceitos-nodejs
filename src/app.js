const express = require("express");
const cors = require("cors");
const { isUuid } = require("uuidv4");
const { Repository } = require("./Repository");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkIfParameterIsUuid(request, response, next) {
  const { id } = request.params;
  if (isUuid(id)) {
    return next();
  }
  return response.status(400).json({ error: "Id is not in UUID format" });
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = new Repository(title, url, techs, 0);
  repositories.push(repo);

  console.log(repo);

  return response.status(201).json(repo);
});

app.put("/repositories/:id", checkIfParameterIsUuid, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) {
    return response.sendStatus(404);
  }

  const { title, url, techs } = request.body;
  let actualRepo = repositories[repoIndex];
  actualRepo.title = title ? title : actualRepo.title;
  actualRepo.url = url ? url : actualRepo.url;
  actualRepo.techs = techs ? techs : actualRepo.techs;

  repositories[repoIndex] = actualRepo;

  return response.json(actualRepo);
});

app.delete("/repositories/:id", checkIfParameterIsUuid, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) {
    return response.sendStatus(404);
  }

  repositories.splice(repoIndex, 1);

  return response.sendStatus(204);
});

app.post(
  "/repositories/:id/like",
  checkIfParameterIsUuid,
  (request, response) => {
    const { id } = request.params;

    const repoIndex = repositories.findIndex((repo) => repo.id === id);
    if (repoIndex < 0) {
      return response.sendStatus(404);
    }

    repositories[repoIndex].likeRepo();

    return response.json(repositories[repoIndex]);
  }
);

module.exports = app;

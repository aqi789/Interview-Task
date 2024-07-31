const express = require("express");
const router = express.Router();

let projects = [
  { id: 1, name: "Project 1" },
  { id: 2, name: "Project 2" },
];

router.get("/", (req, res) => {
  res.json(projects);
});

router.post("/", (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  projects.push(newProject);
  res.status(201).json(newProject);
});

router.delete("/:id", (req, res) => {
  projects = projects.filter((p) => p.id !== parseInt(req.params.id));
  res.status(204).end();
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const project = projects.find((p) => p.id === parseInt(id));
  if (project) {
    project.name = name;
    res.json(project);
  } else {
    res.status(404).send("Project not found");
  }
});

module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });

let tasks = [
  { id: 1, projectId: 1, name: "Task 1" },
  { id: 2, projectId: 1, name: "Task 2" },
];

router.get("/", (req, res) => {
  const projectTasks = tasks.filter(
    (t) => t.projectId === parseInt(req.params.projectId)
  );
  res.json(projectTasks);
});

router.post("/", (req, res) => {
  const newTask = {
    id: Date.now(),
    projectId: parseInt(req.params.projectId),
    ...req.body,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.delete("/:id", (req, res) => {
  tasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
  res.status(204).end();
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const task = tasks.find((t) => t.id === parseInt(id));
  if (task) {
    task.name = name;
    res.json(task);
  } else {
    res.status(404).send("Task not found");
  }
});

module.exports = router;

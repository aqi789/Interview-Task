const express = require("express");
const router = express.Router({ mergeParams: true });

let timeEntries = [
  { id: 1, taskId: 1, duration: { hours: 1, minutes: 30, seconds: 0 } },
];

router.get("/", (req, res) => {
  const taskEntries = timeEntries.filter(
    (te) => te.taskId === parseInt(req.params.taskId)
  );
  res.json(taskEntries);
});

router.post("/", (req, res) => {
  const newEntry = {
    id: Date.now(),
    taskId: parseInt(req.params.taskId),
    ...req.body,
  };
  timeEntries.push(newEntry);
  res.status(201).json(newEntry);
});

router.delete("/:id", (req, res) => {
  timeEntries = timeEntries.filter((te) => te.id !== parseInt(req.params.id));
  res.status(204).end();
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { duration } = req.body;
  const entry = timeEntries.find((te) => te.id === parseInt(id));
  if (entry) {
    entry.duration = duration;
    res.json(entry);
  } else {
    res.status(404).send("Time entry not found");
  }
});

module.exports = router;

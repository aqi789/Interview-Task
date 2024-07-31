const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const timeEntryRoutes = require("./routes/timeTracking");
app.use(cors());
app.use(bodyParser.json());

app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/tasks/:taskId/time_entries", timeEntryRoutes);

app.get("/api/projects", (req, res) => {
  res.json([{ id: 1, name: "Project 1" }]);
});

app.post("/api/projects", (req, res) => {
  const newProject = req.body;
  res.status(201).json({ id: Date.now(), ...newProject });
});

app.delete("/api/projects/:id", (req, res) => {
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

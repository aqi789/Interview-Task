import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  name: string;
}

const Task = ({ projectId }: { projectId: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskName, setEditingTaskName] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>(
          `http://localhost:5000/api/projects/${projectId}/tasks`
        );
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error("Unexpected response data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  const addTask = async () => {
    try {
      const response = await axios.post<Task>(
        `http://localhost:5000/api/projects/${projectId}/tasks`,
        { name: newTask }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${projectId}/tasks/${id}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (id: number, name: string) => {
    setEditingTaskId(id);
    setEditingTaskName(name);
  };

  const updateTask = async () => {
    try {
      if (editingTaskId !== null) {
        const response = await axios.put<Task>(
          `http://localhost:5000/api/projects/${projectId}/tasks/${editingTaskId}`,
          { name: editingTaskName }
        );
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? response.data : task
          )
        );
        setEditingTaskId(null);
        setEditingTaskName("");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Task Management</h1>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded mb-2 bg-blue to-sky-300"
          type="text"
          value={newTask}
          placeholder="Enter your task"
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <ul className="list-disc list-inside text-white">
        {Array.isArray(tasks) ? (
          tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center mb-2"
            >
              {editingTaskId === task.id ? (
                <>
                  <input
                    className="w-full p-2 border rounded mb-2"
                    type="text"
                    value={editingTaskName}
                    onChange={(e) => setEditingTaskName(e.target.value)}
                  />
                  <button
                    className="mb-2 ml-2 mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={updateTask}
                  >
                    Save
                  </button>
                  <button
                    className="mb-2 ml-2 mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setEditingTaskId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                <span className="text-black w-full">{task.name}</span>
                  
                  <button
                    onClick={() => editTask(task.id, task.name)}
                    className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-600 ml-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 bg-[#ce0000] text-white rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>Error: tasks is not an array</li>
        )}
      </ul>
    </div>
  );
};

export default Task;

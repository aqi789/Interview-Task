import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  id: number;
  name: string;
}

const Project = () => {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<string>("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<string>("");

  const fetchProjects = async () => {
    try {
      const response = await axios.get<Project[]>(
        "http://localhost:5000/api/projects"
      );
      if (Array.isArray(response.data)) {
        setProjectList(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const addProject = async () => {
    try {
      const response = await axios.post<Project>(
        "http://localhost:5000/api/projects",
        { name: newProject }
      );
      setProjectList((prevList) => [...prevList, response.data]);
      setNewProject("");
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjectList((prevList) =>
        prevList.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const editProject = (id: number, name: string) => {
    setEditingProjectId(id);
    setEditingProjectName(name);
  };

  const updateProject = async () => {
    try {
      if (editingProjectId !== null) {
        const response = await axios.put<Project>(
          `http://localhost:5000/api/projects/${editingProjectId}`,
          { name: editingProjectName }
        );
        setProjectList((prevList) =>
          prevList.map((project) =>
            project.id === editingProjectId ? response.data : project
          )
        );
        setEditingProjectId(null);
        setEditingProjectName("");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 pb-0">
      <h1 className="text-2xl font-bold mb-4 text-black">Project Management</h1>
      <div className="mb-4">
        <input
          className="w-full p-2 border rounded mb-2 bg-blue to-sky-300"
          type="text"
          placeholder="Enter new project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={addProject}
        >
          Add Project
        </button>
      </div>
      <ul className="list-disc list-inside">
        {Array.isArray(projectList) ? (
          projectList.map((project) => (
            <li
              key={project.id}
              className="flex justify-between items-center mb-2"
            >
              {editingProjectId === project.id ? (
                <>
                  <input
                    className="w-full p-2 border rounded mb-2"
                    type="text"
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                  />
                  <button
                    className="mb-2 ml-2 mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={updateProject}
                  >
                    Save
                  </button>
                  <button
                    className="mb-2 ml-2 mr-2 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setEditingProjectId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-black w-full">{project.name}</span>
                  <button
                    className="p-1 bg-yellow-600 text-white rounded hover:bg-yellow-600 ml-2"
                    onClick={() => editProject(project.id, project.name)}
                  >
                    Edit
                  </button>
                  <button
                    className="p-1 bg-[#ce0000] text-white rounded hover:bg-red-600 ml-2"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>Error: projectList is not an array</li>
        )}
      </ul>
    </div>
  );
};

export default Project;

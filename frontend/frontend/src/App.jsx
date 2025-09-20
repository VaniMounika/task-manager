import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000"; // FastAPI URL

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Fetch tasks from backend on load
  useEffect(() => {
    axios.get(`${API_URL}/tasks`).then((res) => setTasks(res.data));
  }, []);

  // Add new task
  const addTask = () => {
    if (title.trim() === "") return;

    const newTask = {
      id: Date.now(), // unique id
      title,
      completed: false,
    };

    axios.post(`${API_URL}/tasks`, newTask).then((res) => {
      setTasks([...tasks, res.data.task]);
      setTitle("");
    });
  };

  // Delete task
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  const clearAllTasks = () => {
    axios.delete(`${API_URL}/tasks`).then(() => setTasks([]));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="input-wrapper">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <div className="button-group">
          <button onClick={addTask}>Add</button>
          <button className="clear-btn" onClick={clearAllTasks}>
            Clear All
          </button>
        </div>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <span onClick={() => deleteTask(task.id)}>✖</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

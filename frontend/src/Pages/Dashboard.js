import React, { useEffect, useState } from "react";
import { axiosInstance, FILE_BASE_URL } from "../utils/axiosInstance";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    attached_documents: [],
    assigned_to: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!editTask) {
      fetchTasks(); 
    }
  }, [editTask]);

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks", {
        headers: { Authorization: localStorage.getItem("token") },
      });

      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      attached_documents: task.attached_documents || [],
      assigned_to: task.assigned_to ? task.assigned_to._id : "",
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("status", formData.status);
    updatedData.append("priority", formData.priority);
    updatedData.append("assigned_to", formData.assigned_to);

    if (Array.isArray(formData.attached_documents)) {
      formData.attached_documents.forEach((file, index) => {
        if (typeof file === "string") {
          updatedData.append(`existing_documents[${index}]`, file);
        } else {
          updatedData.append("attached_documents", file);
        }
      });
    }

    try {
      await axiosInstance.put(`/tasks/${editTask._id}`, updatedData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      setEditTask(null);
      fetchTasks(); 
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      console.log("Task being checked:", task);

      const statusMatch =
        !filterStatus ||
        task.status?.toLowerCase() === filterStatus.toLowerCase();
      const priorityMatch =
        !filterPriority ||
        task.priority?.toLowerCase() === filterPriority.toLowerCase();

      console.log(
        `Checking task: ${task.title} | Status Match: ${statusMatch} | Priority Match: ${priorityMatch}`
      );

      return statusMatch && priorityMatch;
    })
    .sort((a, b) => {
      console.log("Sorting by:", sortBy);

      if (sortBy === "due_date") {
        console.log(
          `Comparing: ${a.title} (${a.due_date}) with ${b.title} (${b.due_date})`
        );

        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }

      return 0;
    });
  const role = localStorage.getItem("role");

  return (
    <div className="bg-light">
      <div className="container-lg">
        <div className="py-5 px-4 bg-white mvh-100">
          <h2 className="title">Task Dashboard</h2>
          <div className="pb-3 mb-4 border-bottom d-flex gap-3">
            <select
              className="form-control form-select"
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus}
            >
              <option value="">Filter by Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="form-control form-select"
              onChange={(e) => setFilterPriority(e.target.value)}
              value={filterPriority}
            >
              <option value="">Filter by Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              className="form-control form-select"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="">Sort by</option>
              <option value="due_date">Due Date</option>
            </select>
          </div>
          <div className="table-responsive">
            <table className="table ">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Attachments</th>
                  {role === "admin" && (
        <><th>Actions</th> </>
      )}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.description}</td>
                    <td>{task.priority}</td>
                    <td>{new Date(task.due_date).toLocaleDateString()}</td>
                    <td>
                      {task.assigned_to ? task.assigned_to.email : "Unassigned"}
                    </td>
                    <td>
                      {task.attached_documents?.length ? (
                        <ul className="list-inline">
                          {task.attached_documents.map((file, index) => (
                            <li key={index}>
                              <a
                                href={`${FILE_BASE_URL}${file.replace(/\\/g, "/")}`}
                                className="viewmore"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View File {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No Attachments"
                      )}
                    </td>
                    {role === "admin" && (
                      <>
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handleEdit(task)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(task._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editTask && (
            <div className="card mt-4">
              <div className="card-body">
                <h4>Edit Task</h4>
                <form onSubmit={handleUpdateTask}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Documents</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          attached_documents: [
                            ...formData.attached_documents,
                            ...e.target.files,
                          ],
                        })
                      }
                      multiple
                    />
                    {formData.attached_documents.length > 0 && (
                      <ul className="mt-2">
                        {formData.attached_documents.map((file, index) => (
                          <li key={index}>
                            {typeof file === "string" ? (
                              <a
                                href={`${FILE_BASE_URL}${file.replace(/\\/g, "/")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Existing File {index + 1}
                              </a>
                            ) : (
                              file.name
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assign To</label>
                    <select
                      className="form-select"
                      value={formData.assigned_to}
                      onChange={(e) =>
                        setFormData({ ...formData, assigned_to: e.target.value })
                      }
                    >
                      <option value="">Select Assignee</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Update Task
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditTask(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

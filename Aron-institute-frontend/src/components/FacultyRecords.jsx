import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Alert from "./Alert";
import Loading from "./Loading";

import courses from "../context/courseDetail/CoursesData";

const initialFacultyState = {
  name: "",
  email: "",
  phone: "",
  department: "",
  courses: [],
  address: "",
};

export default function FacultyRecord() {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFaculty, setNewFaculty] = useState(initialFacultyState);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(initialFacultyState);

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const api_url = import.meta.env.VITE_URL;
  const token = localStorage.getItem("auth-token");

  const config = {
    headers: {
      "auth-token": token,
      "Content-Type": "application/json",
    },
  };

  const showAlert = (msg, type = "info") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchFaculty = useCallback(async () => {
    try {
      const { data } = await axios.get(`${api_url}/api/faculty/fetchfaculty`, config);
      setFaculty(data);
      setFilteredFaculty(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      showAlert("Failed to fetch faculty", "danger");
    }
  }, [api_url]);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = faculty.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, faculty]);

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const { data } = await axios.post(`${api_url}/api/faculty/addfaculty`, newFaculty, config);
      const updatedList = [...faculty, data.savedFaculty];
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      setNewFaculty(initialFacultyState);
      showAlert("Faculty added successfully", "success");
    } catch (error) {
      console.error("Add failed:", error);
      showAlert("Failed to add faculty", "danger");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${api_url}/api/faculty/deletefaculty/${id}`, config);
      const updatedList = faculty.filter((f) => f._id !== id);
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      showAlert("Faculty deleted", "warning");
    } catch (error) {
      console.error("Delete failed:", error);
      showAlert("Failed to delete faculty", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await axios.put(`${api_url}/api/faculty/updatefaculty/${id}`, editData, config);
      const updatedList = faculty.map((f) => (f._id === id ? data.updatedRecord : f));
      setFaculty(updatedList);
      setFilteredFaculty(updatedList);
      setEditId(null);
      showAlert("Faculty updated successfully", "success");
    } catch (error) {
      console.error("Update failed:", error);
      showAlert("Failed to update faculty", "danger");
    }
  };

  const formFields = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "phone", type: "tel", placeholder: "Phone (10 digits)" },
    { name: "department", type: "text", placeholder: "Department" },
    { name: "courses", type: "select", placeholder: "Courses (multiple)" },
    { name: "address", type: "text", placeholder: "Address" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-lg shadow-lg">
      <Alert alert={alert} />
      {loading && <Loading />}

      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Faculty Management Panel
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Add Faculty */}
        <section className="lg:w-1/2 bg-slate-900 rounded-lg shadow p-6 space-y-4 border border-none">
          <h3 className="text-xl font-semibold text-white">Add New Faculty</h3>
          <div className="space-y-3">
            {formFields.map(({ name, type, placeholder }) =>
              name === "courses" ? (
                <select
                  key={name}
                  name={name}
                  multiple
                  value={newFaculty.courses}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                    setNewFaculty((prev) => ({ ...prev, courses: selected }));
                  }}
                  className="w-full px-3 py-2 rounded-md bg-slate-700 text-white"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  key={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={newFaculty[name]}
                  onChange={handleInputChange(setNewFaculty)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-md shadow-sm"
                />
              )
            )}
            <button
              onClick={handleAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Faculty
            </button>
          </div>
        </section>

        {/* Faculty List */}
        <section className="lg:w-1/2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Faculty Records</h3>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-4 py-2 bg-slate-700 text-white rounded-md"
            />
          </div>

          {filteredFaculty.length > 0 ? (
            filteredFaculty.map((f) => (
              <div
                key={f._id}
                className="flex justify-between items-start gap-4 bg-slate-900 p-4 rounded-md"
              >
                {editId === f._id ? (
                  <div className="flex-1 space-y-2 text-white">
                    {formFields.map(({ name, type, placeholder }) =>
                      name === "courses" ? (
                        <select
                          key={name}
                          name={name}
                          multiple
                          value={editData.courses}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                            setEditData((prev) => ({ ...prev, courses: selected }));
                          }}
                          className="w-full px-3 py-2 rounded-md bg-slate-700 text-white"
                        >
                          {courses.map((course) => (
                            <option key={course.id} value={course.name}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          key={name}
                          name={name}
                          type={type}
                          placeholder={placeholder}
                          value={editData[name]}
                          onChange={handleInputChange(setEditData)}
                          className="w-full bg-slate-700 text-white px-3 py-2 rounded-md shadow-sm"
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex-1 space-y-1 text-white">
                    <p className="font-semibold">{f.name}</p>
                    <p>{f.email}</p>
                    <p>{f.phone}</p>
                    <p>{f.department}</p>
                    <p>{Array.isArray(f.courses) ? f.courses.join(", ") : f.courses}</p>
                    <p>{f.address}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {editId === f._id ? (
                    <>
                      <button onClick={() => handleUpdate(f._id)} className="text-green-500 hover:underline">Save</button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(f._id);
                          setEditData({
                            name: f.name,
                            email: f.email,
                            phone: f.phone,
                            department: f.department,
                            courses: Array.isArray(f.courses) ? f.courses : [],
                            address: f.address,
                          });
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:underline">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No faculty found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

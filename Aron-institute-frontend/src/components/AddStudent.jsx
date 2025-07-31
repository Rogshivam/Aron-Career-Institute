import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function AddStudent() {
  const [newStudent, setNewStudent] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    address: "",
    enrolled: true,
  });

  const [loading, setLocalLoading] = useState(false);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const api_url = import.meta.env.VITE_URL;

  const handleChange = (field, value) => {
    setNewStudent((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.entries(newStudent).every(
      ([key, val]) => typeof val === "boolean" || val.trim() !== ""
    );
  };

  const addStudent = async () => {
    if (!isFormValid()) {
      showAlert("Please fill all fields", "danger");
      return;
    }

    setLoading(true);
    setLocalLoading(true);

    try {
      const res = await fetch(`${api_url}/api/students/addstudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(newStudent),
      });

      const data = await res.json();

      showAlert(data.msg || "Student added successfully", "success");

      setNewStudent({
        name: "",
        dob: "",
        email: "",
        phone: "",
        gender: "",
        course: "",
        address: "",
        enrolled: true,
      });
    } catch (err) {
      showAlert(err.message || "Error adding student", "danger");
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  const fieldList = [
    { label: "Name", type: "text", field: "name" },
    { label: "Date of Birth", type: "date", field: "dob" },
    { label: "Email", type: "email", field: "email" },
    { label: "Phone", type: "tel", field: "phone" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">Add New Student</h2>

      <form className="space-y-4 ">
        {fieldList.map(({ label, type, field }) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1 ">{label}</label>
            <input
              type={type}
              placeholder={label}
              value={newStudent[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full px-4 py-2   shadow-sm bg-slate-700 text-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={newStudent.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-slate-700 text-white   shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Course</label>
          <select
            value={newStudent.course}
            onChange={(e) => handleChange("course", e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-slate-700 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select Course</option>
            <option value="ReactJS">ReactJS</option>
            <option value="HTML">HTML</option>
            <option value="Python">Python</option>
            <option value="JavaScript">Advanced JavaScript</option>
            <option value="CWCM">Content Writing & Content Marketing</option>
            <option value="VEPE">Video Editing & Photo Editing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            rows={3}
            placeholder="Address"
            value={newStudent.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 text-white  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={addStudent}
            disabled={loading}
            className={`w-full py-2 px-6 rounded-md font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

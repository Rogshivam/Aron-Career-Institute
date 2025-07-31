import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function AddStudent() {
  const api_url = import.meta.env.VITE_URL;

  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const { students, setStudents, fetchStuRecord } = useContext(FetchContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fetch students on component mount
  useEffect(() => {
    fetchStuRecord();
  }, []);

  // Update filtered list when students data changes
  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  // Debounce utility
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Filter logic
  const filterStudents = (query) => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  // Debounced version of filter function
  const debounceFilterStudents = useMemo(() => debounce(filterStudents, 300), [students]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debounceFilterStudents(query);
  };

  // Enroll student
  const enrollStudent = useCallback(async (student) => {
    setLoading(true);
    try {
      const updatedStudent = { ...student, enrolled: true };
      const response = await fetch(`${api_url}/api/students/updatestudent/${student._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(updatedStudent),
      });
      const data = await response.json();
      showAlert(data.msg, "success");
      fetchStuRecord();
    } catch (error) {
      showAlert(error.message, "danger");
      console.error("Error enrolling student:", error);
    } finally {
      setLoading(false);
    }
  }, [api_url, fetchStuRecord, setLoading, showAlert]);

  // Delete student
  const deleteStudent = useCallback(async (id) => {
    setLoading(true);
    try {
      await fetch(`${api_url}/api/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });
      const updatedList = students.filter((student) => student._id !== id);
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      showAlert("Student record deleted successfully", "success");
    } catch (error) {
      showAlert("Error deleting student", "danger");
      console.error("Error deleting student:", error);
    } finally {
      setLoading(false);
    }
  }, [api_url, students, setStudents, setLoading, showAlert]);

  const unenrolledStudents = filteredStudents.filter((student) => !student.enrolled);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-white">
        New Registered Students for Enquiry
      </h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full md:w-1/2 px-4 py-2 border border-none bg-slate-700 text-white  rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="space-y-4">
        {unenrolledStudents.length > 0 ? (
          unenrolledStudents.map((student) => (
            <div
              key={student._id}
              className="p-4 bg-slate-900 rounded-lg shadow-sm flex flex-col md:flex-row justify-between"
            >
              <div className="text-white space-y-1">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>DOB:</strong> {student.dob}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Address:</strong> {student.address}</p>
              </div>

              <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => enrollStudent(student)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Add Student
                </button>
                <button
                  onClick={() => deleteStudent(student._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Remove Student
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No records to show</p>
        )}
      </div>
    </div>
  );
}

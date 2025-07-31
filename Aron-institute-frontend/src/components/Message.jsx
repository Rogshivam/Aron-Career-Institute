import { useState, useEffect, useContext, useCallback } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

export default function Message() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  const { students, fetchStuRecord } = useContext(FetchContext);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const api_url = import.meta.env.VITE_URL;

  useEffect(() => {
    fetchStuRecord();
  }, [fetchStuRecord]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const filterStudents = useCallback((query) => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students]);

  // Debounced filter using timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      filterStudents(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterStudents]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setMessage("");
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      showAlert("Message cannot be empty.", "danger");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${api_url}/api/send-message/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ studentId: selectedStudent._id, message }),
      });

      setSelectedStudent(null);
      const data = await response.json();
      setLoading(false);
      showAlert(data.msg, "success");
    } catch (error) {
      setLoading(false);
      showAlert("Failed to send message.", "danger");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white">Send Messages to Students</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border bg-slate-700 text-white border-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <ul className="space-y-4">
        {filteredStudents.filter((stu) => stu.enrolled).length > 0 ? (
          filteredStudents
            .filter((student) => student.enrolled)
            .map((student) => (
              <li
                key={student._id}
                className="p-4 border-none bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 rounded-xl shadow-lg   flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="text-sm md:text-base space-y-1 text-white">
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Phone:</strong> {student.phone}</p>
                  <p><strong>Course:</strong> {student.course}</p>
                  <p><strong>Gender:</strong> {student.gender}</p>
                  <p><strong>DOB:</strong> {student.dob}</p>
                  <p><strong>Address:</strong> {student.address}</p>
                </div>
                <button
                  className="mt-4 md:mt-0 bg--600 text-white bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-300 via-amber-300 to-yellow-500 px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => openModal(student)}
                >
                  Send Message
                </button>
              </li>
            ))
        ) : (
          <p className="text-center text-gray-500">No enrolled students found.</p>
        )}
      </ul>

      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 text-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold">
                ✉️ Message to {selectedStudent.name}
              </h3>
              <button
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setSelectedStudent(null)}
              >
                <span className="text-xl font-bold">×</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <textarea
                rows="5"
                className="w-full p-3 bg-slate-800 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <p className="text-sm text-slate-400">
                Characters: {message.length} | Lines: {message.split("\n").length}
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 font-medium rounded hover:from-yellow-500 hover:to-amber-500 transition-all"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

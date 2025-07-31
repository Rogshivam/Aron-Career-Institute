import { useState, useEffect, useContext, useCallback } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";
import FetchContext from "../context/fetchStudentRecord/fetchContex";

import UpdateStudent from "./UpdateStudent";
import ManualFeePayment from "./ManualFeePayment";
import AddFeeModal from "./AddFeeModal";

export default function StudentsRecord() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modal, setModal] = useState({ update: false, fee: false, addFee: false });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const api_url = import.meta.env.VITE_URL;
  const { students, setStudents, fetchStuRecord } = useContext(FetchContext);
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);

  // Fetch students on mount
  useEffect(() => {
    fetchStuRecord();
  }, [fetchStuRecord]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  // Filter logic with debounce
  const filterStudents = useCallback((query) => {
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students]);

  useEffect(() => {
    const timer = setTimeout(() => filterStudents(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStudents]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Modal toggles
  const handleModal = (type, student = null) => {
    setSelectedStudent(student);
    setModal({ update: false, fee: false, addFee: false, [type]: true });
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setModal({ update: false, fee: false, addFee: false });
  };

  const deleteStudent = async (id) => {
    setLoading(true);
    try {
      await fetch(`${api_url}/api/students/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      const updatedList = students.filter((s) => s._id !== id);
      setStudents(updatedList);
      setFilteredStudents(updatedList);
      showAlert("Student record deleted successfully", "success");
    } catch (error) {
      showAlert("Error deleting student", "danger");
      console.error(error);
    }
    setLoading(false);
  };

  const confirmDeleteStudent = async () => {
    if (!confirmDeleteId) return;
    await deleteStudent(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  // Student card UI
  const renderStudentCard = (student) => {
    const { total = 0, paid = 0, due = total - paid } = student.fees || {};
    return (
      <li
        key={student._id}
        className="p-4 bg-slate-900 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="text-white text-sm space-y-1">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>DOB:</strong> {student.dob}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>Total Fee:</strong> ₹{total}</p>
          <p><strong>Paid:</strong> ₹{paid}</p>
          <p className={due === 0 ? "text-green-500" : "text-red-500"}>
            <strong>Due:</strong> ₹{due} ({due === 0 ? "Fully Paid" : "Pending"})
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            onClick={() => handleModal("update", student)}
          >
            Update
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
            onClick={() => setConfirmDeleteId(student._id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            onClick={() => handleModal("fee", student)}
          >
            Pay Fee
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
            onClick={() => handleModal("addFee", student)}
          >
            Add Fee
          </button>
        </div>
      </li>
    );
  };

  const ConfirmDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg p-6 w-full max-w-sm shadow-xl text-center">
        <h3 className="text-lg font-semibold mb-4 text-white">Confirm Deletion</h3>
        <p className="text-sm text-white mb-6">
          Are you sure you want to delete this student record? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 min-h-screen">
      <h2 className="text-3xl font-semibold text-white text-center mb-8">Student Records</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-md px-4 py-2 bg-slate-700 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <ul className="space-y-6">
        {filteredStudents.filter((s) => s.enrolled).length > 0 ? (
          filteredStudents.filter((s) => s.enrolled).map(renderStudentCard)
        ) : (
          <p className="text-center text-gray-400">No enrolled students found.</p>
        )}
      </ul>

      {/* Modals */}
      {modal.update && selectedStudent && (
        <UpdateStudent
          student={selectedStudent}
          onClose={handleCloseModal}
          students={students}
          setStudents={setStudents}
        />
      )}

      {modal.fee && selectedStudent && (
        <ManualFeePayment
          student={selectedStudent}
          onClose={handleCloseModal}
          onSuccess={fetchStuRecord}
        />
      )}

      {modal.addFee && selectedStudent && (
        <AddFeeModal
          student={selectedStudent}
          onClose={handleCloseModal}
          onSuccess={fetchStuRecord}
        />
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          onConfirm={confirmDeleteStudent}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

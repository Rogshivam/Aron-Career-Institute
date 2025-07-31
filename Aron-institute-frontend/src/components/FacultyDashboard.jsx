import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import alertContext from "../context/alert/alertContext";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const { showAlert } = useContext(alertContext);
  const api_url = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const authToken = localStorage.getItem("auth-token");

  const axiosConfig = {
    headers: { "auth-token": authToken },
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${api_url}/api/faculty/profile`, axiosConfig);
        setFaculty(res.data);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return;
      try {
        const res = await axios.get(`${api_url}/api/faculty/courses/${selectedCourse}/students`, axiosConfig);
        setStudents(res.data);
        const initialAttendance = {};
        res.data.forEach((student) => {
          initialAttendance[student._id] = "present";
        });
        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    const presentStudents = Object.entries(attendance)
      .filter(([_, status]) => status === "present")
      .map(([id]) => id);
    const absentStudents = Object.entries(attendance)
      .filter(([_, status]) => status === "absent")
      .map(([id]) => id);

    try {
      await axios.post(
        `${api_url}/api/faculty/courses/${selectedCourse}/attendance`,
        { presentStudents, absentStudents },
        axiosConfig
      );
      showAlert("Attendance submitted successfully!", "success");
    } catch (error) {
      showAlert("Failed submitting attendance", "danger");
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <div className="px-10 py-7 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 min-h-screen space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white">Faculty Dashboard</h1>
          {faculty && (
            <h2 className="text-xl text-white mt-2">
              Welcome, {faculty.name}
            </h2>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {["profile", "attendance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-md text-white space-y-4">
          <h2 className="text-2xl font-semibold">Faculty Profile</h2>
          {faculty ? (
            <>
              <p><span className="font-semibold">Name:</span> {faculty.name}</p>
              <p><span className="font-semibold">Email:</span> {faculty.email}</p>
              <p><span className="font-semibold">Department:</span> {faculty.department}</p>
              <div>
                <p className="font-semibold">Allotted Courses:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {courses.map((course, idx) => (
                    <span key={idx} className="bg-blue-700 px-3 py-1 rounded-full text-sm">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-300 italic">Loading profile...</p>
          )}
        </div>
      )}

      {/* Attendance Section */}
      {activeTab === "attendance" && (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-md text-white space-y-6">
          <h2 className="text-2xl font-semibold">Mark Attendance</h2>

          <div className="flex flex-wrap gap-3">
            {courses.map((course, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCourse(course)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                  selectedCourse === course
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          {selectedCourse && (
            <div className="space-y-4">
              {students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-600 pb-4"
                  >
                    <div>
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-sm text-slate-300">{student.email}</p>
                    </div>
                    <div className="flex gap-4 mt-2 sm:mt-0">
                      {["present", "absent"].map((status) => (
                        <label key={status} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === status}
                            onChange={() =>
                              handleAttendanceChange(student._id, status)
                            }
                          />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="min-h-[100px] flex items-center justify-center">
                  <p className="text-gray-300 italic">No students found for this course.</p>
                </div>
              )}

              {students.length > 0 && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={submitAttendance}
                    className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg"
                  >
                    Submit Attendance
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
// // 🔁 Existing imports
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import alertContext from "../context/alert/alertContext";

// const FacultyDashboard = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [faculty, setFaculty] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(""); // course ID
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});

//   const { showAlert } = useContext(alertContext);
//   const api_url = import.meta.env.VITE_URL;
//   const navigate = useNavigate();
//   const authToken = localStorage.getItem("auth-token");

//   const axiosConfig = {
//     headers: { "auth-token": authToken },
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("auth-token");
//     navigate("/login");
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`${api_url}/api/faculty/profile`, axiosConfig);
//         setFaculty(res.data);
//         setCourses(res.data.courses || []); // courses = [{ _id, name }]
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//     };
//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!selectedCourse) return;
//       try {
//         const res = await axios.get(`${api_url}/api/faculty/courses/${selectedCourse}/students`, axiosConfig);
//         setStudents(res.data);
//         const initialAttendance = {};
//         res.data.forEach((student) => {
//           initialAttendance[student._id] = "present";
//         });
//         setAttendance(initialAttendance);
//       } catch (err) {
//         console.error("Error fetching students:", err);
//       }
//     };
//     fetchStudents();
//   }, [selectedCourse]);

//   const handleAttendanceChange = (studentId, status) => {
//     setAttendance((prev) => ({ ...prev, [studentId]: status }));
//   };

//   const submitAttendance = async () => {
//     const presentStudents = Object.entries(attendance)
//       .filter(([_, status]) => status === "present")
//       .map(([id]) => id);
//     const absentStudents = Object.entries(attendance)
//       .filter(([_, status]) => status === "absent")
//       .map(([id]) => id);

//     try {
//       await axios.post(
//         `${api_url}/api/faculty/courses/${selectedCourse}/attendance`,
//         { presentStudents, absentStudents },
//         axiosConfig
//       );
//       showAlert("Attendance submitted successfully!", "success");
//     } catch (error) {
//       showAlert("Failed submitting attendance", "danger");
//       console.error("Error submitting attendance:", error);
//     }
//   };

//   return (
//     <div className="px-10 py-7 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 min-h-screen space-y-10">

//       {/* Header */}
//       <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//         <div className="text-center md:text-left">
//           <h1 className="text-4xl font-bold text-white">Faculty Dashboard</h1>
//           {faculty && (
//             <h2 className="text-xl text-white mt-2">
//               Welcome, {faculty.name}
//             </h2>
//           )}
//         </div>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex flex-wrap justify-center gap-2">
//         {["profile", "attendance"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white shadow-lg"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Profile Section */}
//       {activeTab === "profile" && (
//         <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-md text-white space-y-4">
//           <h2 className="text-2xl font-semibold">Faculty Profile</h2>
//           {faculty ? (
//             <>
//               <p><span className="font-semibold">Name:</span> {faculty.name}</p>
//               <p><span className="font-semibold">Email:</span> {faculty.email}</p>
//               <p><span className="font-semibold">Department:</span> {faculty.department}</p>
//               <div>
//                 <p className="font-semibold">Allotted Courses:</p>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {courses.map((course) => (
//                     <span key={course._id} className="bg-blue-700 px-3 py-1 rounded-full text-sm">
//                       {course.name}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-300 italic">Loading profile...</p>
//           )}
//         </div>
//       )}

//       {/* Attendance Section */}
//       {activeTab === "attendance" && (
//         <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-md text-white space-y-6">
//           <h2 className="text-2xl font-semibold">Mark Attendance</h2>

//           {/* Course selection */}
//           <div className="flex flex-wrap gap-3">
//             {courses.map((course) => (
//               <button
//                 key={course._id}
//                 onClick={() => setSelectedCourse(course._id)}
//                 className={`px-4 py-2 rounded-full border transition-all duration-300 ${
//                   selectedCourse === course._id
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
//                 }`}
//               >
//                 {course.name}
//               </button>
//             ))}
//           </div>

//           {/* Student list */}
//           {selectedCourse && (
//             <div className="space-y-4">
//               {students.length > 0 ? (
//                 students.map((student) => (
//                   <div
//                     key={student._id}
//                     className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-600 pb-4"
//                   >
//                     <div>
//                       <p className="font-medium text-white">{student.name}</p>
//                       <p className="text-sm text-slate-300">{student.email}</p>
//                     </div>
//                     <div className="flex gap-4 mt-2 sm:mt-0">
//                       {["present", "absent"].map((status) => (
//                         <label key={status} className="flex items-center gap-2">
//                           <input
//                             type="radio"
//                             name={`attendance-${student._id}`}
//                             checked={attendance[student._id] === status}
//                             onChange={() =>
//                               handleAttendanceChange(student._id, status)
//                             }
//                           />
//                           {status.charAt(0).toUpperCase() + status.slice(1)}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="min-h-[100px] flex items-center justify-center">
//                   <p className="text-gray-300 italic">No students found for this course.</p>
//                 </div>
//               )}

//               {students.length > 0 && (
//                 <div className="flex justify-end mt-6">
//                   <button
//                     onClick={submitAttendance}
//                     className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-lg"
//                   >
//                     Submit Attendance
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FacultyDashboard;

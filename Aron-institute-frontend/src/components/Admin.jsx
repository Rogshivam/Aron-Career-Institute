import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notification";
import Message from "./Message";
import StudentsRecord from "./StudentsRecord";
import AddStudent from './AddStudent';
import EnrollStudent from './EnrollStudent';
import FacultyRecord from "./FacultyRecords";
import Logo from "../assets/logo-temp.png";
const tabs = [
  { key: "notifications", label: "Notifications" },
  { key: "message", label: "Send Message" },
  { key: "showStudents", label: "Students Record" },
  { key: "addStudent", label: "Add Student" },
  { key: "enrollStudent", label: "New Registration Enquiry" },
  { key: "faculty", label: "Manage Faculty" }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("notifications");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "notifications":
        return <Notifications />;
      case "message":
        return <Message />;
      case "showStudents":
        return <StudentsRecord />;
      case "addStudent":
        return <AddStudent />;
      case "enrollStudent":
        return <EnrollStudent />;
      case "faculty":
        return <FacultyRecord />;
      default:
        return <Notifications />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700 shadow-sm bg-blue-900/70 backdrop-blur-md sticky top-0 z-50">
        <button onClick={handleLogout} className="flex items-center text-lime-400 font-bold text-lg">
          <img src={Logo} alt="Logo" className="h-10 w-9 mr-2" />
          <span>Aron Career Institute</span>
        </button>

        <h1 className="text-xl font-semibold tracking-wide">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Logout
        </button>
      </header>

      {/* Tab Navigation */}
      <nav className="sticky top-[64px] z-40 flex flex-wrap justify-center gap-3 px-4 py-3 bg-[#0C111B]/70 backdrop-blur-md border-b border-slate-800 shadow">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
              activeTab === key
                ? "bg-white text-blue-700 shadow border border-gray-300"
                : "bg-slate-700 text-white hover:bg-slate-600 focus:ring-2 focus:ring-blue-400"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-4">
        <div className="min-h-[calc(100vh-160px)] w-full bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 rounded-xl shadow-lg p-6 text-gray-100 transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

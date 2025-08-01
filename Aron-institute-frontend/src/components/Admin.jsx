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
  { key: "faculty", label: "Manage Faculty" },
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
      case "notifications": return <Notifications />;
      case "message": return <Message />;
      case "showStudents": return <StudentsRecord />;
      case "addStudent": return <AddStudent />;
      case "enrollStudent": return <EnrollStudent />;
      case "faculty": return <FacultyRecord />;
      default: return <Notifications />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700 shadow-sm bg-blue-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-9 w-9 sm:h-10 sm:w-10" />
          <span className="font-bold text-lime-400 text-base sm:text-lg">Aron Career Institute</span>
        </div>

        <h1 className="text-base sm:text-xl font-semibold text-center flex-1 sm:flex-none mt-2 sm:mt-0">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition text-sm sm:text-base"
        >
          Logout
        </button>
      </header>

      {/* Scrollable Tab Navigation */}
      <nav className="sticky top-[64px] z-40 overflow-x-auto whitespace-nowrap px-3 py-3 bg-[#0C111B]/70 backdrop-blur-md border-b border-slate-800 shadow scrollbar-hide">
        <div className="flex gap-2 sm:gap-3 min-w-max">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-white text-blue-700 shadow-md border border-gray-300"
                  : "bg-slate-700 text-white hover:bg-slate-600 focus:ring-2 focus:ring-blue-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-3 sm:p-4">
        <div className="w-full rounded-xl shadow-xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 p-4 sm:p-6 transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

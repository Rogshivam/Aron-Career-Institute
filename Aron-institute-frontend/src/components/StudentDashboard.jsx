import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { loadScript } from "../utils/loadRazorpayScirpt";
import alertContext from "../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState({
    presentCount: 0,
    absentCount: 0,
  });

  const COLORS = ["#22c55e", "#FF0E0E"]; // bright green and red
  const attendanceData = [
    { name: "Present", value: attendance.presentCount },
    { name: "Absent", value: attendance.absentCount },
  ];
  const totalDays = attendance.presentCount + attendance.absentCount;
  const attendancePercentage =
    totalDays > 0
      ? ((attendance.presentCount / totalDays) * 100).toFixed(1)
      : 0;

  const [notifications, setNotifications] = useState([]);
  const [amount, setAmount] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const { showAlert } = useContext(alertContext);
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
    fetchAttendance();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${api}/api/handle-students/profile`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      setStudent(res.data);
      setAmount(res.data?.fees?.due || 0);
      setPaymentHistory(res.data?.fees?.paymentHistory || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${api}/api/handle-students/attendance`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.post(
        `${api}/api/handle-students/fetchnotification`,
        { access_code: import.meta.env.VITE_ACCESS_CODE },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handlePayment = async () => {
    const isLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!isLoaded) {
      showAlert("Razorpay SDK failed to load. Are you online?", "danger");
      return;
    }

    try {
      const { data } = await axios.post(
        `${api}/api/fees/initiate-payment`,
        { amount },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: "INR",
        name: "Institute Fee Payment",
        description: "Fee Payment",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${api}/api/fees/verify-payment`,
              {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount,
                method: "Razorpay",
              },
              {
                headers: { "auth-token": localStorage.getItem("auth-token") },
              }
            );
            showAlert("Payment successful!", "success");
            fetchProfile();
          } catch (err) {
            console.error("Payment verification failed:", err);
            showAlert("Payment verification failed", "danger");
          }
        },
        prefill: {
          name: student?.name,
          email: student?.email,
          contact: student?.phone,
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      showAlert("Failed to initiate payment", "danger");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold">Student Dashboard</h1>
            {student && (
              <p className="text-lg text-gray-300 mt-1">
                Welcome, <span className="font-semibold">{student.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-6 border-b border-gray-700 pb-4 mb-8">
          {["profile", "attendance", "notifications", "fee"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-4 py-1 font-medium transition ${
                activeTab === tab
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-6 ">
          {activeTab === "profile" && student && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                <p><strong>Course:</strong> {student.course}</p>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Attendance</h2>
              <p><strong>Present:</strong> {attendance.presentCount}</p>
              <p><strong>Absent:</strong> {attendance.absentCount}</p>

              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-green-400 mt-4 font-medium">
                  Attendance Percentage: {attendancePercentage}%
                </p>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              {notifications.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-rose-400">
                  {notifications.map((note, idx) => (
                    <li key={idx}>{note.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No notifications</p>
              )}
            </div>
          )}

          {activeTab === "fee" && (
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-2xl font-bold">Fee Payment</h2>
              <p>
                <strong>Due Fee:</strong>{" "}
                <span className="text-yellow-400">₹{student?.fees?.due || 0}</span>
              </p>
              <input
                type="number"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                placeholder="Enter amount to pay"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <button
                onClick={handlePayment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Pay Fee
              </button>

              {paymentHistory?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mt-4 mb-2">
                    Payment History
                  </h4>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1">
                    {paymentHistory.map((entry, index) => (
                      <li key={index}>
                        ₹{entry.amount} -{" "}
                        {new Date(entry.date).toLocaleDateString()} (
                        {entry.method})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

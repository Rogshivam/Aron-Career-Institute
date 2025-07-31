import { useState, useContext } from "react";
import alertContext from "../context/alert/alertContext";
import loadingContext from "../context/loading/loadingContext";

export default function EnrollNow() {
  const { showAlert } = useContext(alertContext);
  const { setLoading } = useContext(loadingContext);
  const api_url = import.meta.env.VITE_URL;

  const [newStudent, setNewStudent] = useState({
    name: "",
    dob: "",
    email: "",
    phone: "",
    gender: "",
    course: "",
    address: "",
    enrolled: false,
  });

  const enrollStudent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api_url}/api/students/enrollstudent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      const result = await response.json();

      if (response.ok) {
        showAlert(result.msg, "success");
        setNewStudent({
          name: "",
          dob: "",
          email: "",
          phone: "",
          gender: "",
          course: "",
          address: "",
          enrolled: false,
        });
      } else {
        showAlert(result.msg || "Enrollment failed", "danger");
      }
    } catch (error) {
      showAlert(error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-900 py-12 px-4 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Course Enrollment
        </h1>

        <form className="space-y-6">
          <InputField
            label="Full Name"
            id="fullname"
            type="text"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />

          {/* Uncomment if DOB and gender fields are needed */}
          <InputField
            label="Date of Birth"
            id="dob"
            type="date"
            value={newStudent.dob}
            onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
          />

          <SelectField
            label="Gender"
            id="gender"
            value={newStudent.gender}
            onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
            options={["Male", "Female"]}
          />

          <SelectField
            label="Course"
            id="course"
            value={newStudent.course}
            onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
            options={[
              "ReactJS",
              "HTML Advanced Tutorial",
              "Python",
              "Advanced JavaScriptt",
              "Content Writing & Content Marketing",
              "Video Editing & Photo Editing",
            ]}
          />

          <InputField
            label="Phone No"
            id="phone"
            type="tel"
            value={newStudent.phone}
            onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
          />

          <InputField
            label="Email"
            id="email"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
          />

          <TextAreaField
            label="Address"
            id="address"
            value={newStudent.address}
            onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
          />

          <div className="text-center">
            <button
              type="button"
              onClick={enrollStudent}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition"
            >
              Register Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, id, type = "text", value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-gray-200">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={label}
      />
    </div>
  );
}

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-gray-200">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, id, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1 font-medium text-gray-200">
        {label}
      </label>
      <textarea
        id={id}
        rows="3"
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
  );
}

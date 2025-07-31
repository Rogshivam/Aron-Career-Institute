import { Link } from "react-router-dom";
import { useContext } from "react";
import courseContext from "../context/courseDetail/CourseContext";

import ReactJS from "../assets/ReactJS.jpg";

import Python from "../assets/Python.jpg";
import HTML from "../assets/HTML.jpg";
import JavaScript from "../assets/JavaScript.jpg";
import CWCM from "../assets/content-writting.jpg";
import VEPE from "../assets/editing.jpg";

export default function Courses() {
  const { courses } = useContext(courseContext);

  const courseImages = {
    ReactJS,
    HTML,
    Python,
    JavaScript,
    CWCM,
    VEPE,
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-400 mb-12">
          Courses Offered by Aron Career Institutes
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <img
                src={courseImages[course.id]}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-300 mb-2">
                  {course.name}
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  {course.description.length > 100
                    ? `${course.description.slice(0, 100)}...`
                    : course.description}
                </p>
                <Link
                  to={`/course/${course.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

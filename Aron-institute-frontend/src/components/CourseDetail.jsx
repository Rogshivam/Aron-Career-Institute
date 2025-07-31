import { useContext } from "react";
import { useParams } from "react-router-dom";
import courseContext from "../context/courseDetail/CourseContext";

export default function CourseDetail() {
  const { courses } = useContext(courseContext);
  const { id } = useParams();

  const course = courses.find((course) => course.id === id);

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-xl font-semibold text-red-600">
        Course not found!
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start px-4 py-12 bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-500 mb-8">
          {course.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 text-base md:text-lg">
          <Detail label="Duration" value={course.duration} />
          <Detail label="Fees" value={course.fees} />
          <Detail label="Scholarship" value={course.scholarship} />
          <Detail label="Eligibility" value={course.eligibility} />
          <Detail label="Certificate" value={course.certification} />
          <Detail label="Career Options" value={course.careerProspects} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Course Description</h2>
          <p className="text-gray-200 leading-relaxed">{course.description}</p>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 font-medium">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}

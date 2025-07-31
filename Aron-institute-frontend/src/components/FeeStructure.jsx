export default function FeeStructure() {
  const courses = [
    { name: "ReactJS", duration: "4 months", fee: "₹3000 per month", scholarship: "No Scholarship" },
    { name: "HTML Advanced Tutorial", duration: "2 months", fee: "₹1000 per month", scholarship: "No Scholarship" },
    { name: "Python", duration: "7 months", fee: "₹800 per month", scholarship: "No Scholarship" },
    { name: "Advanced JavaScript", duration: "6 months", fee: "1500 per month", scholarship: "No Scholarship" },
    { name: "Content Writing and Content Marketing", duration: "1 year", fee: "₹70000 yearly", scholarship: "No Scholarship" },
    { name: "Video Editing & Photo Editing", duration: "6 months", fee: "₹9000 yearly", scholarship: "No Scholarship" },
  ];

  return (

    <div className="bg-gradient-to-r from-black to-gray-900 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Fee Structure of Aron Career Institutes
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-slate-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6"
            >
              <div className="text-indigo-600 font-semibold text-xl mb-2">{course.name}</div>
              <p className="text-white mb-1">
                <span className="font-medium text-white">Duration:</span> {course.duration}
              </p>
              <p className="text-white mb-1">
                <span className="font-medium text-white">Fee:</span> {course.fee}
              </p>
              <p className="text-white   ">
                <span className="font-medium text-white">Scholarship:</span> {course.scholarship}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

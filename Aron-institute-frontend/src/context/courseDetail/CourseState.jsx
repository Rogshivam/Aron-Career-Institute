import { useState } from "react";
import CourseContext from "./CourseContext";
import courses from "./CoursesData";

const CourseState = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <CourseContext.Provider value={{ courses, selectedCourse, setSelectedCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseState;

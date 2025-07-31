import { useState } from "react";
import Footer from "./Footer";
import Courses from "./Courses";
import EnrollNow from "./EnrollNow";

import student1 from "../assets/photo1.jpg";
import student2 from "../assets/photo2.jpg";
import student3 from "../assets/photo3.jpg";
import student4 from "../assets/photo4.jpg";
import student5 from "../assets/photo5.jpg";

const images = [student1, student2, student3, student4, student5];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-gradient-to-r from-black to-gray-900 text-white min-h-screen">
      {/* Logo (example insertion) */}
      {/* <div className="p-4">
        <img
          src="/logo.png"
          alt="Institute Logo"
          className="rounded-full h-[100px] w-[100px] my-[9px] mx-[13px]"
        />
      </div> */}

      {/* Hero Section / Carousel */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-b from-black to-gray-900">
        <img
          src={images[currentIndex]}
          alt={`Student Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg transition duration-700 ease-in-out"
        />

        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Aron Career Institute
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 italic">
            "We Build for a Better Future"
          </p>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full"
          aria-label="Previous Slide"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full"
          aria-label="Next Slide"
        >
          ❯
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses">
        <Courses />
      </section>

      {/* Enroll Section */}
      <section id="enroll">
        <EnrollNow />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

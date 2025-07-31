export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-4">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h5 className="text-xl font-semibold mb-4">Contact Us</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>
              📍 Aron Career Institute, Aron, India
            </li>
            <li>
              📧 info@AronCareerinstitutes.ac.in
            </li>
            <li>
              📞 +91 6969696969
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
          <ul className="text-sm space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-lime-400">Home</a></li>
            <li><a href="/Courses" className="hover:text-lime-400">Courses</a></li>
            <li><a href="/FeeStructure" className="hover:text-lime-400">Fee Structure</a></li>
            <li><a href="/EnrollNow" className="hover:text-lime-400">Enroll Now</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h5 className="text-xl font-semibold mb-4">About</h5>
          <p className="text-sm text-gray-300">
            Aron Career Institute is committed to empowering future leaders through innovative and quality education since 1969.
          </p>
          <div>
            <p>
              made with ❤️ by <a href="https://github.com/Rogshivam" className=" text-blue-400 hover:underline space-y-2">Rogshivam</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; 1969-2025 Aron Career Institute. All Rights Reserved.
      </div>
    </footer>
  );
}

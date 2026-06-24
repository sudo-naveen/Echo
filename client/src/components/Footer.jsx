import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-bold text-primary-600">Echo</Link>
            <p className="mt-2 text-sm text-gray-500">
              Community-driven interview preparation platform. Share real interview experiences and prepare together.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Platform</h3>
            <ul className="mt-2 space-y-1">
              <li><Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition">Home</Link></li>
              <li><Link to="/tags" className="text-sm text-gray-500 hover:text-primary-600 transition">Tags</Link></li>
              <li><Link to="/?company=Google" className="text-sm text-gray-500 hover:text-primary-600 transition">Companies</Link></li>
              <li><Link to="/ask" className="text-sm text-gray-500 hover:text-primary-600 transition">Ask Question</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
            <ul className="mt-2 space-y-1">
              <li><a href="mailto:johnysins09134@gmail.com" className="text-sm text-gray-500 hover:text-primary-600 transition">johnysins09134@gmail.com</a></li>
              <li><span className="text-sm text-gray-500">Built with React & Express</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Echo. All rights reserved. For support: <a href="mailto:johnysins09134@gmail.com" className="hover:text-primary-600 transition">johnysins09134@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}

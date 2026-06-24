import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mt-4">Page not found</h2>
      <p className="text-sm text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}

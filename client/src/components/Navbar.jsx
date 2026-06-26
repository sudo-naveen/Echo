import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';

function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
        <p className="mt-2 text-sm text-gray-500">Are you sure you want to logout?</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    addToast('Logged out successfully.', 'success');
    navigate('/', { replace: true });
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">Echo</span>
              <span className="hidden sm:inline text-gray-500 text-sm">Interview Q&A</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-primary-600 transition px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/tags" className="text-gray-600 hover:text-primary-600 transition px-3 py-2 text-sm font-medium">
                Tags
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/ask"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                  >
                    Ask Question
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-primary-600 transition px-3 py-2 text-sm font-medium">
                    {user?.username}
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-gray-500 hover:text-red-600 transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-600 transition px-3 py-2 text-sm font-medium">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                Home
              </Link>
              <Link to="/tags" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                Tags
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/ask" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-primary-600 font-medium hover:bg-gray-50 rounded-lg text-sm">
                    Ask Question
                  </Link>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                    Profile
                  </Link>
                  <button onClick={() => { setShowLogoutModal(true); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50 rounded-lg text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-primary-600 font-medium hover:bg-gray-50 rounded-lg text-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

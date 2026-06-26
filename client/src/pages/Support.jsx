import { Link } from 'react-router-dom';

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Support & Contact</h1>
        <p className="text-gray-500 mb-6">
          Have questions, feedback, or need help? We're here for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-500">
              Reach out to our support team at{' '}
              <a href="mailto:johnysins09134@gmail.com" className="text-primary-600 hover:underline">
                johnysins09134@gmail.com
              </a>
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">About Echo</h3>
            <p className="text-sm text-gray-500">
              Echo is a community-driven interview preparation platform. Share real interview
              experiences and prepare together with fellow engineers.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><strong>How do I ask a question?</strong> Sign in and click "Ask Question" in the navbar.</li>
              <li><strong>How do I bookmark?</strong> Click the bookmark icon on any question.</li>
              <li><strong>Can I edit my answers?</strong> Yes, click "Edit" on your own answers.</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><Link to="/" className="text-primary-600 hover:underline">Home</Link></li>
              <li><Link to="/tags" className="text-primary-600 hover:underline">Tags</Link></li>
              <li><Link to="/ask" className="text-primary-600 hover:underline">Ask Question</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

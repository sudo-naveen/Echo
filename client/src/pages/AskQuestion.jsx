import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuestion } from '../services/questionService';

const COMPANY_OPTIONS = [
  '', 'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
  'Netflix', 'Adobe', 'Oracle', 'Salesforce', 'IBM',
  'Intel', 'NVIDIA', 'Cisco', 'Accenture', 'TCS',
  'Infosys', 'Wipro', 'Cognizant', 'Zoho', 'Freshworks',
];

export default function AskQuestion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', tags: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.title.trim().length < 5) return setError('Title must be at least 5 characters.');
    if (form.description.trim().length < 10) return setError('Description must be at least 10 characters.');

    setLoading(true);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const { data } = await createQuestion({
        title: form.title.trim(),
        description: form.description.trim(),
        tags,
        company: form.company,
      });
      navigate(`/questions/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ask a Question</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., What is the difference between var, let, and const in JavaScript?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
            <select
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              {COMPANY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c || '-- General Question --'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
              placeholder="Describe your question in detail. Include what you've tried and what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., javascript, react, nodejs (comma separated)"
            />
            <p className="mt-1 text-xs text-gray-400">Add up to 5 tags, separated by commas.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Your Question'}
          </button>
        </form>
      </div>
    </div>
  );
}

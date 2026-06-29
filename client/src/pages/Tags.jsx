import { useState, useEffect } from 'react';
import { getTags } from '../services/questionService';
import Tag from '../components/Tag';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTags()
      .then(({ data }) => setTags(data?.tags || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Tags</h1>
      <p className="text-sm text-gray-500 mb-6">
        Browse questions by topic. Click a tag to see related questions.
      </p>

      {tags.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-500">No tags yet</h3>
          <p className="text-sm text-gray-400 mt-1">Tags appear when questions are posted.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <Tag key={t.tag} name={t.tag} count={t.count} />
          ))}
        </div>
      )}
    </div>
  );
}

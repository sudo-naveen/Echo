import { Link } from 'react-router-dom';
import { formatDate, parseTags, truncate } from '../utils/helpers';

function StatusBadge({ status }) {
  if (!status || status === 'submitted') return null;
  const badges = {
    verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
    community_verified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Community Verified' },
  };
  const b = badges[status];
  if (!b) return null;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${b.bg} ${b.text}`}>
      {b.label}
    </span>
  );
}

export default function QuestionCard({ question }) {
  const tags = parseTags(question.tags);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center min-w-[60px] text-sm">
          <span className="font-bold text-gray-700">{question.answer_count || 0}</span>
          <span className="text-gray-400 text-xs">answers</span>
          <span className="font-bold text-gray-700 mt-2">{question.views}</span>
          <span className="text-gray-400 text-xs">views</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/questions/${question.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition line-clamp-2"
            >
              {question.title}
            </Link>
            <StatusBadge status={question.status} />
          </div>

          <p className="text-sm text-gray-500 line-clamp-2">
            {truncate(question.description, 250)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {question.company && (
              <Link
                to={`/?company=${encodeURIComponent(question.company)}`}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 transition font-medium"
              >
                {question.company}
              </Link>
            )}
            {(Array.isArray(tags) ? tags : []).slice(0, 3).map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${encodeURIComponent(tag)}`}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-primary-100 hover:text-primary-700 transition"
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="mt-3 text-xs text-gray-400">
            asked {formatDate(question.created_at)} by{' '}
            <span className="font-medium text-gray-600">{question.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

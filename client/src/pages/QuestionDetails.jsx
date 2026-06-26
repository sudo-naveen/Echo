import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestion, addAnswer, deleteQuestion, toggleBookmark, getBookmarks } from '../services/questionService';
import { useAuth } from '../hooks/useAuth';
import AnswerCard from '../components/AnswerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, parseTags } from '../utils/helpers';

function StatusBadge({ status }) {
  const badges = {
    verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
    community_verified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Community Verified' },
    submitted: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'User Submitted' },
  };
  const b = badges[status] || badges.submitted;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.bg} ${b.text}`}>
      {b.label}
    </span>
  );
}

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const fetchQuestion = async () => {
    try {
      const { data } = await getQuestion(id);
      setQuestion(data);
      setAnswers(data.answers || []);
      setError('');
    } catch (err) {
      setError('Failed to load question.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      getBookmarks()
        .then(({ data }) => {
          const isBookmarked = data.some((b) => b.id === parseInt(id));
          setBookmarked(isBookmarked);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this question permanently? This cannot be undone.')) return;
    try {
      await deleteQuestion(id);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Failed to delete question.');
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await addAnswer({ content: answerContent, question_id: parseInt(id) });
      setAnswerContent('');
      fetchQuestion();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await toggleBookmark(parseInt(id));
      setBookmarked(data.bookmarked);
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!question) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-500">Question not found</h2>
        <Link to="/" className="text-primary-600 hover:underline mt-2 inline-block">Back to Home</Link>
      </div>
    );
  }

  const tags = parseTags(question.tags);
  const isOwner = user?.id === question.user_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={question.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{question.title}</h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition ${
                bookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {question.company && (
            <Link
              to={`/?company=${encodeURIComponent(question.company)}`}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-200 transition font-medium"
            >
              {question.company}
            </Link>
          )}
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-primary-100 hover:text-primary-700 transition"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Asked {formatDate(question.created_at)} by{' '}
          <span className="font-medium text-gray-600">{question.username}</span>
          <span className="ml-3">{question.views} views</span>
        </div>

        <div className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
          {question.description}
        </div>

        {isOwner && (
          <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={handleDelete} className="text-sm text-gray-500 hover:text-red-600 transition">
              Delete Question
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        {answers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-400">No answers yet. Be the first to answer!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} onUpdate={fetchQuestion} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        <form onSubmit={handleAnswer}>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            required
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
            placeholder={isAuthenticated ? 'Write your answer...' : 'Login to post an answer'}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || !isAuthenticated}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Answer'}
            </button>
            {!isAuthenticated && (
              <Link to="/login" className="text-sm text-primary-600 hover:underline">
                Sign in to answer
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

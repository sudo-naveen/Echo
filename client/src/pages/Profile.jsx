import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authService';
import { getBookmarks } from '../services/questionService';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const AVATAR_COLORS = [
  '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#d97706', '#65a30d', '#059669',
  '#0891b2', '#2563eb',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function generateAvatarSvg(name, size = 64) {
  const color = getAvatarColor(name);
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}"/>
    </svg>`
  )}`;
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('questions');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    let cancelled = false;
    Promise.all([getProfile(), getBookmarks()])
      .then(([profileRes, bookmarksRes]) => {
        if (!cancelled) {
          setProfile(profileRes?.data || null);
          setBookmarks(Array.isArray(bookmarksRes?.data) ? bookmarksRes.data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center py-20 text-gray-500">Failed to load profile.</div>;

  const tabs = [
    { key: 'questions', label: 'Questions', count: profile.questions?.length || 0 },
    { key: 'answers', label: 'Answers', count: profile.answers?.length || 0 },
    { key: 'bookmarks', label: 'Bookmarks', count: bookmarks.length },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <img
            src={generateAvatarSvg(profile.user.username, 64)}
            alt={`${profile.user.username}'s avatar`}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{profile.user.username}</h1>
            <p className="text-sm text-gray-500">{profile.user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Joined {formatDate(profile.user.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition ${
                tab === t.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'questions' && (
            <>
              {profile.questions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No questions yet.</div>
              ) : (
                <div className="space-y-3">
                  {profile.questions.map((q) => (
                    <Link
                      key={q.id}
                      to={`/questions/${q.id}`}
                      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                    >
                      <h3 className="font-medium text-gray-900">{q.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>{q.views} views</span>
                        {q.company && <span className="text-purple-500">{q.company}</span>}
                        {q.status === 'verified' && <span className="text-green-600">Verified</span>}
                        <span>{formatDate(q.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'answers' && (
            <>
              {profile.answers.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No answers yet.</div>
              ) : (
                <div className="space-y-3">
                  {profile.answers.map((a) => (
                    <Link
                      key={a.id}
                      to={`/questions/${a.question_id}`}
                      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                    >
                      <h3 className="font-medium text-gray-900 text-sm">{a.question_title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{a.content}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{formatDate(a.created_at)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'bookmarks' && (
            <>
              {bookmarks.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No bookmarks yet.</div>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((q) => (
                    <Link
                      key={q.id}
                      to={`/questions/${q.id}`}
                      className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                    >
                      <h3 className="font-medium text-gray-900">{q.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span>{q.views} views</span>
                        <span>{q.answer_count} answers</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

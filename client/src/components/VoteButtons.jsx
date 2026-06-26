import { useState, useEffect } from 'react';
import { vote } from '../services/questionService';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function VoteButtons({ answerId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);

  useEffect(() => {
    setUpvotes(initialUpvotes);
    setDownvotes(initialDownvotes);
    setUserVote(initialUserVote);
  }, [initialUpvotes, initialDownvotes, initialUserVote, answerId]);

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const { data } = await vote({ answer_id: answerId, vote_type: voteType });
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setUserVote(data.userVote);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const score = upvotes - downvotes;

  return (
    <div className="flex flex-col items-center gap-1 min-w-[40px]">
      <button
        onClick={() => handleVote('upvote')}
        className={`p-1 rounded transition ${
          userVote === 'upvote' ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'
        }`}
        title="Upvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <span className={`text-sm font-bold ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-500' : 'text-gray-500'}`}>
        {score}
      </span>

      <button
        onClick={() => handleVote('downvote')}
        className={`p-1 rounded transition ${
          userVote === 'downvote' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
        title="Downvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

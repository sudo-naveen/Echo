import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateAnswer, deleteAnswer } from '../services/questionService';
import VoteButtons from './VoteButtons';
import { formatDate } from '../utils/helpers';

export default function AnswerCard({ answer, onUpdate }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(answer?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isOwner = user?.id === answer.user_id;

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    setError('');
    try {
      await updateAnswer(answer.id, { content });
      setEditing(false);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update answer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this answer?')) return;
    try {
      await deleteAnswer(answer.id);
      onUpdate();
    } catch (err) {
      setError('Failed to delete answer.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>
      )}
      <div className="flex gap-4">
        <VoteButtons
          answerId={answer.id}
          initialUpvotes={answer.upvotes}
          initialDownvotes={answer.downvotes}
          initialUserVote={answer.userVote}
        />

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y min-h-[100px]"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setContent(answer.content); setError(''); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {answer.content}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  answered {formatDate(answer.created_at)} by{' '}
                  <span className="font-medium text-gray-600">{answer.username}</span>
                </div>

                {isOwner && (
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(true)} className="text-xs text-gray-500 hover:text-primary-600 transition">
                      Edit
                    </button>
                    <button onClick={handleDelete} className="text-xs text-gray-500 hover:text-red-600 transition">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

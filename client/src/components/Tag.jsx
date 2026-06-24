import { Link } from 'react-router-dom';

export default function Tag({ name, count }) {
  return (
    <Link
      to={`/?tag=${encodeURIComponent(name)}`}
      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-primary-100 hover:text-primary-700 transition"
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">×{count}</span>
      )}
    </Link>
  );
}

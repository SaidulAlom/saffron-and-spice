import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-amber-100 gap-4">
      <p className="text-amber-600 text-6xl font-serif">404</p>
      <h1 className="text-2xl font-serif">Page not found</h1>
      <p className="text-stone-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded text-white transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

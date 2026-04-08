import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found',
    description: 'The requested route does not exist in the Saffron & Spice portfolio.',
    noIndex: true,
  });

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl rounded-[2rem] border border-subtle bg-card/90 p-8 text-center shadow-2xl md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-saffron">404 Error</p>
        <h1 className="mt-4 text-4xl font-serif sm:text-5xl">This page is off the menu.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-70 sm:text-base">
          The route you were looking for does not exist, but the rest of the portfolio experience is ready to explore.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-saffron px-6 py-3 font-medium text-white transition-all hover:bg-saffron-dark micro-button"
          >
            Back to Home
          </Link>
          <Link
            to="/menu"
            className="rounded-full border border-subtle px-6 py-3 font-medium transition-all hover:border-saffron hover:text-saffron micro-button"
          >
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

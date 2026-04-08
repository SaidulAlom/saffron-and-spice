import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  message?: string | null;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, message, onRetry, className = '' }: ErrorStateProps) {
  return (
    <div className={`rounded-3xl border border-subtle bg-card/80 p-8 md:p-10 text-center shadow-xl ${className}`}>
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle size={22} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-serif">{title}</h3>
        <p className="mx-auto max-w-xl text-sm leading-relaxed opacity-65">
          {message || 'Something interrupted this section. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-saffron px-5 py-2.5 text-sm font-medium text-saffron transition-all hover:bg-saffron hover:text-white micro-button"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

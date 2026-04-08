import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(242,125,38,0.16),_transparent_35%),linear-gradient(180deg,#100907_0%,#050505_100%)] px-4 text-white">
          <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center text-center">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-10">
              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-saffron">Portfolio Recovery</p>
              <h1 className="text-3xl font-serif md:text-4xl">Something interrupted the experience.</h1>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
                The page can recover without losing the whole app. Reload to continue the demo flow or return to the home page.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-full bg-saffron px-6 py-3 font-medium text-white transition-all hover:bg-saffron-dark micro-button"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="rounded-full border border-white/15 px-6 py-3 font-medium text-white transition-all hover:border-saffron hover:text-saffron micro-button"
                >
                  Dismiss Error
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

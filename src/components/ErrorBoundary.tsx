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
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-950 text-amber-100 gap-4">
          <h1 className="text-3xl font-serif">Something went wrong</h1>
          <p className="text-stone-400">Please refresh the page or try again later.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded text-white transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

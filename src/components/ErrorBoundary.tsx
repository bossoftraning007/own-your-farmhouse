import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Without this, any render-time error unmounts the whole site to a blank page.
 * This keeps the property name, price and WhatsApp number reachable so a lead
 * is never lost because of a rendering bug.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled error in app:", error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, message: "" });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-5xl mb-4">🌿</p>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-slate-400 mb-6 text-sm">
            We hit an unexpected error loading this page. Please try again, or
            contact us directly and we will help you right away.
          </p>

          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5 mb-6 text-left">
            <p className="text-emerald-400 font-semibold mb-1">
              Green Orchid Farm Land
            </p>
            <p className="text-slate-300 text-sm mb-3">
              1BHK Farmhouse · ₹21,00,000 · Kothur, Hyderabad
            </p>
            <a
              href="https://wa.me/919505903371"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              💬 WhatsApp Us
            </a>
          </div>

          <button
            onClick={this.handleReset}
            className="text-slate-400 hover:text-emerald-400 text-sm underline underline-offset-4"
          >
            Try again
          </button>

          {this.state.message && (
            <p className="text-slate-600 text-xs mt-6 break-words">
              {this.state.message}
            </p>
          )}
        </div>
      </div>
    );
  }
}
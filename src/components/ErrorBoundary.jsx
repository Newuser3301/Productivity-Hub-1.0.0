// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error, info) {
    console.error(`${this.props.name || 'Module'} failed`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="panel flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{this.props.name || 'Module'} could not load</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{this.state.message}</p>
          </div>
          <button className="btn-primary" onClick={() => this.setState({ hasError: false, message: '' })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

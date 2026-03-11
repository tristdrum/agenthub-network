import React from "react";

import { captureException } from "@/lib/analytics";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    captureException(error, {
      boundary: "app",
      component_stack: errorInfo?.componentStack || undefined,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The client error was captured. Reload the page and try again.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

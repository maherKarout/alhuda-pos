import React, { ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can handle or log the error here
    console.error("Error caught by error boundary:", error+"", errorInfo+"");
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can customize the fallback UI for the error boundary
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>Something went wrong.</h1>
          <p>please contact with supports</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

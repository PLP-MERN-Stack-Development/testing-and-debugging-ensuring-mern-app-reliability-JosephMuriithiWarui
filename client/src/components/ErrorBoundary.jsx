import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    /* eslint-disable no-console */
    console.error('ErrorBoundary caught an error', error, info);
    /* eslint-enable no-console */
  }

  render() {
    if (this.state.hasError) {
      return <div role="alert">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

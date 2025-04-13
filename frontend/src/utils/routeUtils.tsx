import React, { Suspense } from "react";
import { ProtectedRoute } from "components/ProtectedRoute";

/**
 * Wraps a component with Suspense and ProtectedRoute if it should be protected
 * @param Component The component to wrap
 * @param protect Whether the route should be protected (require authentication)
 * @returns Wrapped component
 */
export const wrapRoute = (Component: React.LazyExoticComponent<() => JSX.Element>, protect: boolean = false) => {
  if (protect) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      </Suspense>
    );
  }
  
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <Component />
    </Suspense>
  );
};

import { Outlet, ScrollRestoration } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <Outlet />
      <ScrollRestoration getKey={(location) => {
        // Always scroll to top on navigation
        return location.pathname;
      }} />
    </>
  );
} 
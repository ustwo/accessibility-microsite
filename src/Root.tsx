import { Outlet, ScrollRestoration } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DataPreloader from './components/DataPreloader';

export default function Root() {
  return (
    <DataProvider>
      <DataPreloader />
      <Outlet />
      <ScrollRestoration getKey={(location) => {
        // Always scroll to top on navigation
        return location.pathname;
      }} />
    </DataProvider>
  );
}
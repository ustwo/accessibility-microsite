import { Outlet, ScrollRestoration } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import DataPreloader from './components/DataPreloader';

export default function Root() {
  return (
    <DataProvider>
      <DataPreloader />
      <Outlet />
      <ScrollRestoration />
    </DataProvider>
  );
}
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout() {
  return (
    <div>
      <Navbar />
      <main className="pt-16 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

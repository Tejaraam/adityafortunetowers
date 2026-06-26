import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import RootLayout from './components/layout/RootLayout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Documents from './pages/Documents';
import Committee from './pages/Committee';
import Contact from './pages/Contact';

// Admin Pages
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminEvents from './admin/AdminEvents';
import AdminDocuments from './admin/AdminDocuments';
import AdminCommittee from './admin/AdminCommittee';
import AdminContractors from './admin/AdminContractors';
import AdminSettings from './admin/AdminSettings';
import AdminAnnouncements from './admin/AdminAnnouncements';
import AdminContacts from './admin/AdminContacts';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:slug" element={<EventDetails />} />
          <Route path="documents" element={<Documents />} />
          <Route path="committee" element={<Committee />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="committee" element={<AdminCommittee />} />
          <Route path="contractors" element={<AdminContractors />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

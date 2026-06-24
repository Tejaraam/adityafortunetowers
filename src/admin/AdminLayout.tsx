import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { 
  Building2, LayoutDashboard, Calendar, FileText, 
  Users, Briefcase, Bell, Settings, LogOut 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
  { name: 'Committee', href: '/admin/committee', icon: Users },
  { name: 'Contractors', href: '/admin/contractors', icon: Briefcase },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col h-full flex-shrink-0">
        <div className="h-16 flex items-center px-6 bg-primary-light">
          <Building2 className="h-8 w-8 text-accent mr-3" />
          <span className="font-heading font-bold text-xl">AFT Admin</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive ? 'bg-accent text-primary' : 'text-gray-300 hover:bg-primary-light hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 bg-primary-light flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-primary rounded-md transition-colors"
          >
            <Building2 className="mr-3 h-5 w-5 text-gray-400" />
            Back to Website
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-primary rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin Session</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

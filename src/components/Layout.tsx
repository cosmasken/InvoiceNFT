import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Settings, 
  User, 
  Store, 
  LogOut,
  Wallet,
  History
} from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();
  
  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/marketplace', icon: Store, label: 'Marketplace' },
    ...(user?.role === 'seller' ? [{ to: '/invoices/create', icon: FileText, label: 'Invoices' }] : []),
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/transactions', icon: History, label: 'Transactions' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="w-8 h-8 text-indigo-600" />
        <span className="text-xl font-bold">InvoiceNFT</span>
      </div>
      
      <nav className="space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors relative ${
              location.pathname === to
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {location.pathname === to && (
              <motion.div
                layoutId="sidebar-highlight"
                className="absolute inset-0 bg-indigo-50 rounded-lg"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              />
            )}
            <Icon className="w-5 h-5" />
            <span className="relative">{label}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-auto absolute bottom-4 w-[calc(100%-2rem)]"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default function Layout() {
  const user = useStore(state => state.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
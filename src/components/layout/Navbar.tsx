import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalSearch from './GlobalSearch';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Documents', href: '/documents' },
  { name: 'Committee', href: '/committee' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img src="/images/logo.png" alt="Aditya Construction Company" className="h-8 w-auto" />
            <span className="font-heading font-bold text-xl text-primary hidden sm:inline-block">Aditya Fortune Towers</span>
          </Link>
        </div>
        <div className="flex lg:hidden items-center gap-4">
          <button
            type="button"
            className="text-gray-700 hover:text-accent transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <span className="sr-only">Search</span>
            <Search className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'text-base font-semibold leading-6 transition-colors duration-200 px-3 py-2 rounded-md',
                location.pathname === item.href ? 'text-accent bg-gray-50' : 'text-gray-900 hover:text-accent hover:bg-gray-50'
              )}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-gray-600 hover:text-accent hover:bg-gray-100 rounded-full transition-all"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/admin/login"
            className="ml-4 px-6 py-3 text-base font-bold text-white bg-primary hover:bg-primary-light rounded-lg transition-colors shadow-sm"
          >
            Admin Login
          </Link>
        </div>
      </nav>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <img src="/images/logo.png" alt="Aditya" className="h-8 w-auto" />
                <span className="font-heading font-bold text-xl text-primary">AFT</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={clsx(
                        '-mx-3 block rounded-lg px-4 py-3 text-lg font-semibold leading-7 hover:bg-gray-50',
                        location.pathname === item.href ? 'text-accent bg-gray-50' : 'text-gray-900'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-4 py-3 text-lg font-bold leading-7 text-primary hover:bg-gray-50"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

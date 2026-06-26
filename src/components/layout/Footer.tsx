import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt="Aditya Construction Company" className="h-12 w-auto bg-white p-1 rounded" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              A premium residential community in Visakhapatnam offering luxury living with world-class amenities.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-accent mb-4">Quick Links</h3>
            <ul role="list" className="space-y-2">
              <li><Link to="/about" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/events" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Events</Link></li>
              <li><Link to="/documents" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Documents</Link></li>
              <li><Link to="/gallery" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Gallery</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-accent mb-4">Community</h3>
            <ul role="list" className="space-y-2">
              <li><Link to="/committee" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Committee</Link></li>
              <li><Link to="/vendors" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Vendors</Link></li>
              <li><Link to="/contact" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-sm font-semibold leading-6 text-accent mb-4">Contact Info</h3>
            <ul role="list" className="space-y-2">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-gray-300">
                  Midhilapuri VUDA Colony,<br />
                  Madhurawada, Visakhapatnam,<br />
                  AP 530041
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm leading-6 text-gray-300">+91 891 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:association@adityafortunetowers.com" className="text-sm leading-6 text-gray-300 hover:text-white transition-colors duration-200 break-all">
                  association@adityafortunetowers.com
                </a>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="text-sm leading-5 text-gray-400">
            {new Date().getFullYear()} Aditya Fortune Towers
          </p>
        </div>
      </div>
    </footer>
  );
}

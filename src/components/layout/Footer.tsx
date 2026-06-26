import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white relative z-10">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/images/logo.png" alt="Aditya Construction Company" className="h-10 w-auto bg-white p-1 rounded" />
            </Link>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              A premium residential community in Visakhapatnam offering luxury living with world-class amenities.
            </p>
            <div className="flex space-x-6">
              {/* Social links can go here if needed */}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-bold leading-6 text-accent">Quick Links</h3>
                <ul role="list" className="mt-6 space-y-5">
                  <li><Link to="/about" className="text-base leading-6 text-gray-300 hover:text-white">About Us</Link></li>
                  <li><Link to="/events" className="text-base leading-6 text-gray-300 hover:text-white">Events</Link></li>
                  <li><Link to="/documents" className="text-base leading-6 text-gray-300 hover:text-white">Documents</Link></li>
                  <li><Link to="/gallery" className="text-base leading-6 text-gray-300 hover:text-white">Gallery</Link></li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-base font-bold leading-6 text-accent">Community</h3>
                <ul role="list" className="mt-6 space-y-5">
                  <li><Link to="/committee" className="text-base leading-6 text-gray-300 hover:text-white">Committee</Link></li>
                  <li><Link to="/vendors" className="text-base leading-6 text-gray-300 hover:text-white">Vendors</Link></li>
                  <li><Link to="/contact" className="text-base leading-6 text-gray-300 hover:text-white">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-base font-bold leading-6 text-accent">Contact Info</h3>
                <ul role="list" className="mt-6 space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
                    <span className="text-base leading-relaxed text-gray-300">
                      Midhilapuri VUDA Colony, Madhurawada,<br />
                      Visakhapatnam, Andhra Pradesh 530041
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-accent flex-shrink-0" />
                    <span className="text-base leading-6 text-gray-300">+91 00000 00000</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-accent flex-shrink-0" />
                    <span className="text-base leading-6 text-gray-300">contact@adityafortunetowers.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} Aditya Fortune Towers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

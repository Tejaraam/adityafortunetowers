import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, AlertTriangle, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Contact() {
  const [settings, setSettings] = useState<any>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      const { data: settingsData } = await supabase.from('site_settings').select('*').single();
      if (settingsData) setSettings(settingsData);

      const { data: emergencyData } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('display_order', { ascending: true });
      if (emergencyData) setEmergencyContacts(emergencyData);

      setLoading(false);
    };
    fetchContactData();
  }, []);

  return (
    <div className="flex flex-col relative z-0">
      <div className="fixed inset-0 bg-[url('/images/bg_contact.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg_contact.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-primary/40 py-10 rounded-2xl mx-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">Contact Us</h1>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-gray-100 text-xl font-medium max-w-3xl mx-auto px-4 leading-relaxed drop-shadow">
            Get in touch with the association office or find emergency contacts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Office Info & Emergency */}
            <div className="lg:col-span-5 space-y-8">
              {/* Association Office */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-gray-50">
                  <Building2 className="h-40 w-40" />
                </div>
                
                <h2 className="text-3xl font-black text-primary mb-8 relative z-10">Association Office</h2>
                
                <ul className="space-y-8 relative z-10">
                  <li className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl text-primary flex-shrink-0">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Address</h4>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {settings?.address || 'Midhilapuri VUDA Colony, Madhurawada, Visakhapatnam, Andhra Pradesh 530041'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl text-primary flex-shrink-0">
                      <Phone className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Phone</h4>
                      <a href={`tel:${settings?.phone}`} className="text-accent hover:text-accent-light font-bold text-lg transition-colors">
                        {settings?.phone || '+91 891 234 5678'}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl text-primary flex-shrink-0">
                      <Mail className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Email</h4>
                      <a href={`mailto:${settings?.email}`} className="text-accent hover:text-accent-light font-bold text-lg transition-colors">
                        {settings?.email || 'association@adityafortunetowers.com'}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-6">
                    <div className="bg-primary/10 p-4 rounded-xl text-primary flex-shrink-0">
                      <Clock className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Office Hours</h4>
                      <p className="text-gray-700 text-lg">Mon - Sat: 9:00 AM - 6:00 PM<br/>Sun: Closed</p>
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Emergency Contacts */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 rounded-2xl p-8 shadow-md border-2 border-red-200"
              >
                <h2 className="text-3xl font-black text-red-700 mb-6 flex items-center gap-4">
                  <AlertTriangle className="h-8 w-8" />
                  Emergency Contacts
                </h2>
                
                {emergencyContacts.length > 0 ? (
                  <div className="space-y-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="bg-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-red-100 hover:border-red-300 transition-colors">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{contact.name}</h4>
                          <p className="text-base font-medium text-gray-600">{contact.designation}</p>
                        </div>
                        <a 
                          href={`tel:${contact.phone}`} 
                          className="flex items-center justify-center gap-3 bg-red-100 hover:bg-red-200 text-red-800 px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
                        >
                          <Phone className="h-5 w-5" />
                          <span>{contact.phone}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600/70 italic text-sm">No emergency contacts listed at the moment.</p>
                )}
              </motion.div>
            </div>

            {/* Right Column: Google Maps & Message Form */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-md border-2 border-gray-200 h-[450px]"
              >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.156843460662!2d83.3652439!3d17.8037653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a395ba5676b6fcd%3A0xf200e6af58c1f5af!2sAditya%20Fortune%20Towers!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin" 
                  className="w-full h-full rounded-xl" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-md border-2 border-gray-200"
              >
                <h3 className="text-2xl font-black text-primary mb-3">Send a Message</h3>
                <p className="text-gray-600 mb-8 text-base">Please note that this is a public portal. For official complaints, please contact the office directly.</p>
                
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('This is a static display portal. Messaging is not implemented as per specifications.'); }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="flat" className="block text-sm font-medium text-gray-700 mb-1">Flat No. (Optional)</label>
                      <input type="text" id="flat" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow" placeholder="e.g. A-101" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow" placeholder="What is this regarding?" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-shadow resize-none" placeholder="Your message here..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Send Message
                  </button>
                </form>
              </motion.div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

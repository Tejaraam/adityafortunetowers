import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, UserCircle2, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Committee() {
  const [members, setMembers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cData } = await supabase
        .from('committee')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });
      
      if (cData) setMembers(cData);

      const { data: vData } = await supabase
        .from('vendors')
        .select('*')
        .order('service_category', { ascending: true })
        .order('name', { ascending: true });
      
      if (vData) setVendors(vData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <div className="fixed inset-0 bg-[url('/images/bg_committee.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg_committee.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-primary/40 py-10 rounded-2xl mx-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">Executive Committee</h1>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-gray-100 text-xl font-medium max-w-3xl mx-auto px-4 leading-relaxed drop-shadow">
            Meet the dedicated team managing and maintaining the Aditya Fortune Towers community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-accent transition-all group"
              >
                <div className="h-48 bg-primary/5 flex items-center justify-center relative overflow-hidden">
                  {member.photo_url ? (
                    <img 
                      src={member.photo_url} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <UserCircle2 className="h-24 w-24 text-primary/20" />
                  )}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/90 to-transparent p-4">
                    <div className="text-white font-bold tracking-wider text-base uppercase">
                      {member.tenure}
                    </div>
                  </div>
                </div>
                
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-accent text-lg font-bold mb-6">{member.position}</p>
                  
                  <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-3 text-base font-medium text-gray-700 hover:text-primary transition-colors">
                        <Phone className="h-5 w-5 text-gray-400" />
                        {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-3 text-base font-medium text-gray-700 hover:text-primary transition-colors">
                        <Mail className="h-5 w-5 text-gray-400" />
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <UserCircle2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Committee Members Found</h3>
            <p className="text-gray-500">The executive committee list is currently empty.</p>
          </div>
        )}

        {/* Contractors Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl font-heading font-black text-primary mb-6">Service Contractors</h2>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-12"></div>
        </div>

        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, idx) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 hover:shadow-xl hover:border-accent transition-all group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                    <p className="text-base font-bold text-accent uppercase tracking-wider">{vendor.service_category}</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  {vendor.contact_number && (
                    <a href={`tel:${vendor.contact_number}`} className="flex items-center gap-4 text-gray-700 text-lg hover:text-primary transition-colors">
                      <Phone className="h-6 w-6 text-gray-400" />
                      <span className="font-medium">{vendor.contact_number}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No contractors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

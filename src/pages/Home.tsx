import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Bell, Users, Building, MapPin, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [featuredDocs, setFeaturedDocs] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Fetch active featured announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_featured', true)
        .or(`expiry_date.is.null,expiry_date.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (annData) setAnnouncements(annData);

      // Fetch featured events
      const { data: evData } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('event_date', { ascending: false })
        .limit(3);

      if (evData) setFeaturedEvents(evData);

      // Fetch featured documents
      const { data: docData } = await supabase
        .from('documents')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'published')
        .order('document_date', { ascending: false })
        .limit(3);

      if (docData) setFeaturedDocs(docData);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <div className="fixed inset-0 bg-[url('/images/aditya-fortune-towers.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image of the actual building */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply z-10" />
          <img
            src="/images/aditya-fortune-towers.jpg"
            alt="Aditya Fortune Towers Exterior"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight drop-shadow-lg">
              Aditya Fortune Towers
            </h1>
            <p className="text-2xl md:text-4xl text-accent font-bold mb-4 drop-shadow-md">
              Visakhapatnam
            </p>
            <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow">
              Welcome to the official community portal. A premium residential experience offering luxury, comfort, and a vibrant community life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <div className="bg-slate-900 text-white py-3 px-4 relative z-20 shadow-md flex items-center overflow-hidden group">
          <div className="flex-shrink-0 flex items-center gap-2 font-bold whitespace-nowrap bg-slate-900 z-10 px-4 rounded-r-xl border-r-2 border-accent shadow-md">
            <Bell className="h-5 w-5 text-accent animate-pulse" />
            Latest Notice:
          </div>
          <div className="flex-grow overflow-hidden relative flex items-center">
            <div className="flex w-max animate-ticker hover:[animation-play-state:paused] cursor-default transition-transform duration-1000 ease-linear">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center pr-[150px]">
                  {announcements.map((ann, idx) => (
                    <span key={ann.id} className="flex items-center text-sm md:text-base font-medium whitespace-nowrap">
                      {idx > 0 && <span className="text-accent mx-8">•</span>}
                      {ann.title}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Highlights */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Community Highlights</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building, title: 'Premium Towers', value: '3+', desc: 'Luxury Blocks' },
              { icon: Users, title: 'Happy Families', value: '162+', desc: 'Vibrant Community' },
              { icon: Award, title: 'Years of Excellence', value: '8+', desc: 'Est. 2018' },
              { icon: MapPin, title: 'Prime Location', value: 'Madhurawada', desc: 'IT Hub Proximity' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center border-2 border-gray-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mx-auto bg-primary/10 w-20 h-20 flex items-center justify-center rounded-full mb-6 text-primary">
                  <stat.icon className="h-10 w-10" />
                </div>
                <div className="text-4xl font-black text-primary mb-3">{stat.value}</div>
                <div className="text-xl font-bold text-gray-900 mb-2">{stat.title}</div>
                <div className="text-base font-medium text-gray-600">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">About Our Community</h2>
              <p className="text-gray-700 text-xl mb-6 leading-relaxed">
                Vizag is a beautiful place with the most promising future and Madhurawada is the most upcoming premium location in Vizag. Aditya Fortune Towers is a super luxury apartment project of the kinds Vizag has probably not seen before.
              </p>
              <p className="text-gray-700 text-xl mb-8 leading-relaxed">
                Offering 126 most modern luxury units—spacious, thoughtful and exquisite—designed to re-define the word "luxury".
              </p>
              <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h4 className="text-2xl font-bold text-primary mb-6 border-b border-gray-100 pb-2">Project Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                  <div><span className="font-bold text-gray-900 block mb-1">Project Name:</span> Adityas Fortune Towers</div>
                  <div><span className="font-bold text-gray-900 block mb-1">Location:</span> Madhurawada, Vizag</div>
                  <div><span className="font-bold text-gray-900 block mb-1">Built Up Area:</span> 1640-1980 sft</div>
                  <div><span className="font-bold text-gray-900 block mb-1">Bedrooms:</span> 3 BHK</div>
                </div>
              </div>
              <Link to="/about" className="btn-primary mt-4">
                Read full details
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] group"
            >
              <div className="absolute inset-0 bg-[url('/images/community_amenities_upscaled.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent flex flex-col justify-end p-8">
                
                <div className="flex flex-wrap gap-3 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">Swimming Pool</span>
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">Clubhouse</span>
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">Gymnasium</span>
                </div>

                <div className="text-white">
                  <h3 className="text-3xl font-black mb-2 drop-shadow-lg">World-Class Amenities</h3>
                  <p className="text-gray-100 text-lg font-medium drop-shadow">Experience premium lifestyle facilities</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Latest Updates</h2>
              <div className="w-16 h-1 bg-accent rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Events Column */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calendar className="mr-3 h-6 w-6 text-accent" />
                  Upcoming & Recent Events
                </h3>
                <Link to="/events" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                  View All &rarr;
                </Link>
              </div>
              <div className="space-y-6">
                {featuredEvents.length > 0 ? featuredEvents.map((event) => (
                  <Link to={`/events/${event.slug}`} key={event.id} className="block group">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-base font-bold text-accent mb-2">
                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <h4 className="text-xl font-bold text-primary group-hover:text-accent transition-colors mb-3">
                            {event.title}
                          </h4>
                          <p className="text-gray-700 line-clamp-2 text-base leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="text-gray-500 italic p-6 bg-gray-50 rounded-xl text-center">No featured events at this time.</div>
                )}
              </div>
            </div>

            {/* Documents Column */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-accent" />
                  Important Documents
                </h3>
                <Link to="/documents" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                  View All &rarr;
                </Link>
              </div>
              <div className="space-y-6">
                {featuredDocs.length > 0 ? featuredDocs.map((doc) => (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" key={doc.id} className="block group">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors mb-1">
                            {doc.title}
                          </h4>
                          <div className="text-sm text-gray-500">
                            {doc.category} • {new Date(doc.document_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                )) : (
                  <div className="text-gray-500 italic p-6 bg-gray-50 rounded-xl text-center">No featured documents at this time.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

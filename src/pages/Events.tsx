import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: sortOrder === 'asc' });
      
      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, [sortOrder]);

  const availableYears = useMemo(() => {
    const years = new Set(events.map(e => format(parseISO(e.event_date), 'yyyy')));
    return ['All', ...Array.from(years)].sort((a, b) => b.localeCompare(a));
  }, [events]);

  const availableMonths = [
    'All', 'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const date = parseISO(e.event_date);
      const year = format(date, 'yyyy');
      const month = format(date, 'MMMM');

      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'All' || year === selectedYear;
      const matchesMonth = selectedMonth === 'All' || month === selectedMonth;

      return matchesSearch && matchesYear && matchesMonth;
    });
  }, [events, searchTerm, selectedYear, selectedMonth]);

  // Group by Year -> Month
  const groupedEvents = useMemo(() => {
    const grouped: Record<string, Record<string, any[]>> = {};
    
    filteredEvents.forEach(event => {
      const date = parseISO(event.event_date);
      const year = format(date, 'yyyy');
      const month = format(date, 'MMMM');
      
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      
      grouped[year][month].push(event);
    });
    
    return grouped;
  }, [filteredEvents]);

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <div className="fixed inset-0 bg-[url('/images/bg_events.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      {/* Page Header */}
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg_events.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-primary/40 py-10 rounded-2xl mx-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">Events & Celebrations</h1>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-gray-100 text-xl font-medium max-w-3xl mx-auto px-4 leading-relaxed drop-shadow">
            Explore the vibrant community life at Aditya Fortune Towers. Browse past memories and upcoming events.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Search Bar & Sort & Filters */}
        <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow text-gray-900"
              placeholder="Search events by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="py-4 pl-4 pr-10 bg-[position:right_1rem_center] bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 w-full md:w-auto cursor-pointer"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
            ))}
          </select>

          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="py-4 pl-4 pr-10 bg-[position:right_1rem_center] bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 w-full md:w-auto cursor-pointer"
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>{month === 'All' ? 'All Months' : month}</option>
            ))}
          </select>

          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="py-4 pl-4 pr-10 bg-[position:right_1rem_center] bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 w-full md:w-auto cursor-pointer"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(groupedEvents).length > 0 ? (
          <div className="space-y-16 max-w-6xl mx-auto">
            {Object.keys(groupedEvents)
              .sort((a, b) => sortOrder === 'desc' ? Number(b) - Number(a) : Number(a) - Number(b))
              .map(year => (
              <div key={year} className="relative">
                {/* Year Marker */}
                <div className="sticky top-20 z-20 bg-gray-50/95 backdrop-blur py-4 px-6 mb-8 border border-gray-200 rounded-2xl shadow-sm">
                  <h2 className="text-4xl font-heading font-bold text-primary">{year}</h2>
                </div>
                
                <div className="space-y-12">
                  {Object.keys(groupedEvents[year])
                    // Simple sort for months - relies on events being pre-sorted by date in query
                    .map(month => (
                    <div key={`${year}-${month}`} className="ml-0 md:ml-8">
                      <h3 className="text-2xl font-bold text-gray-400 mb-6 flex items-center">
                        <span className="w-8 h-px bg-gray-300 mr-4 hidden md:block"></span>
                        {month}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedEvents[year][month].map((event, idx) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            key={event.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-accent transition-all group flex flex-col"
                          >
                            <Link to={`/events/${event.slug}`} className="flex-grow flex flex-col">
                              {event.cover_image ? (
                                <div className="h-56 overflow-hidden relative border-b-2 border-gray-100">
                                  <img 
                                    src={event.cover_image} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg text-sm font-black text-primary shadow-sm border border-gray-200">
                                    {event.category}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-56 bg-primary/5 flex items-center justify-center relative border-b-2 border-gray-100">
                                  <Calendar className="h-16 w-16 text-primary/30" />
                                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg text-sm font-black text-primary shadow-sm border border-gray-200">
                                    {event.category}
                                  </div>
                                </div>
                              )}
                              
                              <div className="p-8 flex-grow flex flex-col">
                                <div className="text-base font-bold text-accent mb-3">
                                  {format(parseISO(event.event_date), 'MMMM d, yyyy')}
                                </div>
                                <h4 className="text-2xl font-black text-primary mb-4 group-hover:text-accent transition-colors">
                                  {event.title}
                                </h4>
                                <p className="text-gray-700 text-lg line-clamp-3 mb-6 flex-grow leading-relaxed">
                                  {event.description}
                                </p>
                                <div className="mt-auto">
                                  <div className="btn-secondary w-full text-center">
                                    View Details
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-500">We couldn't find any events matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

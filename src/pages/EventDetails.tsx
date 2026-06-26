import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery Filters
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc');

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      // Fetch event
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (eventData) {
        setEvent(eventData);
        
        // Fetch event media
        const { data: mediaData } = await supabase
          .from('event_media')
          .select('*')
          .eq('event_id', eventData.id);
        
        if (mediaData) setMedia(mediaData);
      }
      setLoading(false);
    };

    if (slug) fetchEventDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col bg-gray-50 items-center justify-center p-4 text-center">
        <Calendar className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The event you are looking for does not exist or has been removed.</p>
        <Link to="/events" className="text-accent font-semibold hover:text-primary transition-colors flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Event Header */}
      <div className="relative bg-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {event.cover_image && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${event.cover_image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
          </>
        )}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Link to="/events" className="inline-flex items-center text-gray-300 hover:text-white transition-colors text-sm font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center justify-center text-gray-200 text-lg font-medium">
            <Calendar className="mr-2 h-6 w-6 text-accent" />
            {format(parseISO(event.event_date), 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6">About this Event</h2>
          <div className="prose prose-lg prose-primary max-w-none text-gray-600 whitespace-pre-wrap">
            {event.description}
          </div>
        </div>

        {/* Media Gallery */}
        {media.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-heading font-bold text-primary">Event Gallery</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 bg-white px-2 py-2 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'images' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Images
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'videos' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Videos
                  </button>
                </div>
                <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                  className="text-sm border-none bg-transparent focus:ring-0 text-gray-700 font-medium cursor-pointer pl-0 mr-4"
                >
                  <option value="asc">Oldest First</option>
                  <option value="desc">Newest First</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {media
                .filter(item => {
                  if (activeTab === 'images' && item.media_type !== 'image') return false;
                  if (activeTab === 'videos' && item.media_type !== 'youtube_url') return false;
                  return true;
                })
                .sort((a, b) => {
                  const dateA = new Date(a.created_at || 0).getTime();
                  const dateB = new Date(b.created_at || 0).getTime();
                  return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                })
                .map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-square bg-gray-100">
                  {item.media_type === 'youtube_url' ? (
                    <div 
                      className="w-full h-full cursor-pointer relative"
                      onClick={() => window.open(item.media_url, '_blank')}
                    >
                      <img 
                        src={`https://img.youtube.com/vi/${getYoutubeId(item.media_url)}/hqdefault.jpg`} 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.media_url} 
                      alt="Event Memory" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => window.open(item.media_url, '_blank')}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

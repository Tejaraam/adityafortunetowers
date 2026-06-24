import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, FileText, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{events: any[], documents: any[], committee: any[]}>({
    events: [],
    documents: [],
    committee: []
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ events: [], documents: [], committee: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim() || query.length < 2) {
        setResults({ events: [], documents: [], committee: [] });
        return;
      }

      setLoading(true);
      const searchStr = `%${query}%`;

      const [eventsRes, docsRes, commRes] = await Promise.all([
        supabase.from('events').select('id, title, slug, event_date').ilike('title', searchStr).eq('status', 'published').limit(5),
        supabase.from('documents').select('id, title, file_url').ilike('title', searchStr).eq('status', 'published').limit(5),
        supabase.from('committee').select('id, name, position').ilike('name', searchStr).limit(5)
      ]);

      setResults({
        events: eventsRes.data || [],
        documents: docsRes.data || [],
        committee: commRes.data || []
      });
      setLoading(false);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.events.length + results.documents.length + results.committee.length;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-gray-900/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative border-b border-gray-100">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              className="w-full pl-12 pr-12 py-4 text-lg bg-transparent border-none focus:ring-0 outline-none placeholder-gray-400"
              placeholder="Search events, documents, people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button 
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && query.length >= 2 ? (
              <div className="p-8 text-center text-gray-500">Searching...</div>
            ) : query.length >= 2 && totalResults === 0 ? (
              <div className="p-8 text-center text-gray-500">No results found for "{query}"</div>
            ) : query.length >= 2 ? (
              <div className="p-2 space-y-4">
                
                {results.events.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Events</div>
                    {results.events.map(event => (
                      <Link 
                        key={event.id} 
                        to={`/events/${event.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                      >
                        <Calendar className="h-5 w-5 text-accent" />
                        <div>
                          <div className="text-gray-900 font-medium group-hover:text-primary">{event.title}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.documents.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</div>
                    {results.documents.map(doc => (
                      <a 
                        key={doc.id} 
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                      >
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-gray-900 font-medium group-hover:text-blue-600">{doc.title}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {results.committee.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Committee</div>
                    {results.committee.map(member => (
                      <Link 
                        key={member.id} 
                        to="/committee"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg group"
                      >
                        <UserCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-gray-900 font-medium group-hover:text-green-600">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.position}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                Type at least 2 characters to search across the community portal.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

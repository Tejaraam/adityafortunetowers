import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('status', 'published')
        .eq('is_public', true)
        .order('document_date', { ascending: false });
      
      if (data) setDocuments(data);
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(documents.map(d => d.category));
    return ['All', ...Array.from(cats)].sort();
  }, [documents]);

  const availableYears = useMemo(() => {
    const years = new Set(documents.map(d => format(parseISO(d.document_date), 'yyyy')));
    return ['All', ...Array.from(years)].sort((a, b) => b.localeCompare(a));
  }, [documents]);

  const availableMonths = [
    'All', 'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const date = parseISO(d.document_date);
      const year = format(date, 'yyyy');
      const month = format(date, 'MMMM');

      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchesYear = selectedYear === 'All' || year === selectedYear;
      const matchesMonth = selectedMonth === 'All' || month === selectedMonth;

      return matchesSearch && matchesCategory && matchesYear && matchesMonth;
    });
  }, [documents, searchTerm, selectedCategory, selectedYear, selectedMonth]);

  return (
    <div className="flex flex-col min-h-screen relative z-0">
      <div className="fixed inset-0 bg-[url('/images/bg_documents.jpg')] bg-cover bg-center bg-no-repeat -z-20"></div>
      <div className="fixed inset-0 bg-gray-100/90 backdrop-blur-sm -z-10"></div>
      <div className="bg-primary py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/bg_documents.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-primary/40 py-10 rounded-2xl mx-4 shadow-lg backdrop-blur-sm">
          <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6 drop-shadow-lg">Documents Repository</h1>
          <div className="w-20 h-2 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-gray-100 text-xl font-medium max-w-3xl mx-auto px-4 leading-relaxed drop-shadow">
            Access important association documents, circulars, and reports.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow text-gray-900"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative md:w-48 flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-11 pr-10 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent appearance-none text-gray-900 font-medium"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            <div className="relative md:w-32 flex-shrink-0">
              <select
                className="block w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 font-medium"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
                ))}
              </select>
            </div>

            <div className="relative md:w-40 flex-shrink-0">
              <select
                className="block w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900 font-medium"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month === 'All' ? 'All Months' : month}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredDocs.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {filteredDocs.map((doc, idx) => (
                <motion.li 
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="p-8 hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-6">
                      <div className="bg-primary/10 p-4 rounded-xl text-primary mt-1 shadow-sm">
                        <FileText className="h-10 w-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-base text-gray-600 mb-3 font-medium">
                          <span className="bg-gray-100 px-3 py-1 rounded-md text-gray-800">{doc.category}</span>
                          <span>•</span>
                          <span>{format(parseISO(doc.document_date), 'MMM d, yyyy')}</span>
                        </div>
                        {doc.description && <p className="text-gray-700 text-lg max-w-4xl leading-relaxed">{doc.description}</p>}
                      </div>
                    </div>
                    
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-6 flex-shrink-0 bg-white border-2 border-gray-200 text-primary p-4 rounded-full hover:bg-accent hover:text-white hover:border-transparent transition-all shadow-sm group-hover:shadow-md"
                      title="Download/View"
                    >
                      <Download className="h-8 w-8" />
                    </a>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500">We couldn't find any documents matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, FileText, Bell, Briefcase, ExternalLink, Database } from 'lucide-react';


export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    documents: 0,
    committee: 0,
    vendors: 0,
    announcements: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [events, docs, comm, vend, ann] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('committee').select('*', { count: 'exact', head: true }),
        supabase.from('vendors').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        events: events.count || 0,
        documents: docs.count || 0,
        committee: comm.count || 0,
        vendors: vend.count || 0,
        announcements: ann.count || 0
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to the Admin Portal</h2>
        <p className="mt-1 text-sm text-gray-500">Manage community content, events, and announcements.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Total Events', stat: stats.events, icon: Calendar, color: 'bg-blue-500' },
          { name: 'Documents', stat: stats.documents, icon: FileText, color: 'bg-indigo-500' },
          { name: 'Active Announcements', stat: stats.announcements, icon: Bell, color: 'bg-orange-500' },
          { name: 'Committee Members', stat: stats.committee, icon: Users, color: 'bg-green-500' },
          { name: 'Service Vendors', stat: stats.vendors, icon: Briefcase, color: 'bg-teal-500' },
        ].map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm border border-gray-100 sm:px-6 sm:pt-6">
            <dt>
              <div className={`absolute rounded-md ${item.color} p-3`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
            <Database className="h-5 w-5 text-accent" /> Content Management System
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Your backend is powered securely by Supabase. For full CRUD operations, complex file uploads (PDFs, Images), and data management, use the Supabase Dashboard. This ensures maximum security and utilizes Supabase's native file storage tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://app.supabase.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-accent hover:bg-white transition-all group"
            >
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">Manage Database Tables</h4>
                <p className="text-sm text-gray-500">Edit Events, Vendors, Committee, etc.</p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-accent" />
            </a>
            
            <a 
              href="https://app.supabase.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-accent hover:bg-white transition-all group"
            >
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">Manage Storage Buckets</h4>
                <p className="text-sm text-gray-500">Upload PDF Documents and Images</p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-accent" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


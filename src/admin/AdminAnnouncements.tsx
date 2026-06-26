import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Bell, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';

type Announcement = {
  id: string;
  title: string;
  is_featured: boolean;
  expiry_date: string | null;
  created_at: string;
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    is_featured: true,
    expiry_date: null
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load announcements');
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (announcement?: Announcement) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      setFormData(announcement);
    } else {
      setSelectedAnnouncement(null);
      setFormData({
        title: '',
        is_featured: true,
        expiry_date: ''
      });
    }
    setIsModalOpen(true);
  };

  const saveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Clean up empty expiry date
      const payload: any = { ...formData };
      if (!payload.expiry_date) {
        payload.expiry_date = null;
      }

      if (selectedAnnouncement) {
        const { error } = await supabase.from('announcements').update(payload).eq('id', selectedAnnouncement.id);
        if (error) throw error;
        toast.success('Announcement updated');
      } else {
        // Generate a slug for new announcements
        payload.slug = payload.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Date.now();
          
        payload.content = payload.title; // Satisfy the not-null constraint for content
          
        const { error } = await supabase.from('announcements').insert([payload]);
        if (error) throw error;
        toast.success('Announcement added');
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Remove this announcement?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Announcement removed');
      fetchAnnouncements();
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Announcements" 
        description="Create and manage the scrolling notice banner on the home page."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Notice
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notice Text</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active (Scrolling)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : announcements.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No announcements found.</td></tr>
            ) : (
              announcements.map((ann) => (
                <tr key={ann.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="font-medium text-gray-900">{ann.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ann.is_featured ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        <X className="h-3 w-3 mr-1" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ann.expiry_date ? new Date(ann.expiry_date).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(ann)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedAnnouncement ? 'Edit Notice' : 'Add Notice'}>
        <form onSubmit={saveAnnouncement} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notice Text</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" placeholder="Enter the scrolling text here..." />
            </div>

            <div className="flex items-center mt-2">
              <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Show on Homepage Banner (Active)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
              <input type="date" value={formData.expiry_date || ''} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
              <p className="mt-1 text-xs text-gray-500">If set, the notice will stop showing after this date.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


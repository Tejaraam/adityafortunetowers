import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';

type ExternalLinkType = {
  id: string;
  title: string;
  description: string;
  url: string;
  is_active: boolean;
  sort_order: number;
};

export default function AdminLinks() {
  const [links, setLinks] = useState<ExternalLinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ExternalLinkType | null>(null);
  
  const [formData, setFormData] = useState<Partial<ExternalLinkType>>({
    title: '',
    description: '',
    url: '',
    is_active: true,
    sort_order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('external_links')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load links');
    } else {
      setLinks(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (link?: ExternalLinkType) => {
    if (link) {
      setSelectedLink(link);
      setFormData(link);
    } else {
      setSelectedLink(null);
      setFormData({
        title: '',
        description: '',
        url: '',
        is_active: true,
        sort_order: links.length > 0 ? Math.max(...links.map(l => l.sort_order)) + 1 : 1
      });
    }
    setIsModalOpen(true);
  };

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedLink) {
        const { error } = await supabase.from('external_links').update(formData).eq('id', selectedLink.id);
        if (error) throw error;
        toast.success('Link updated');
      } else {
        const { error } = await supabase.from('external_links').insert([formData]);
        if (error) throw error;
        toast.success('Link added');
      }
      setIsModalOpen(false);
      fetchLinks();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Remove this link?')) return;
    const { error } = await supabase.from('external_links').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Link removed');
      fetchLinks();
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Utility & Tax Links" 
        description="Add external links for residents to pay bills and access services."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Link
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : links.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No external links found.</td></tr>
            ) : (
              links.map((link) => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFaviconUrl(link.url) ? (
                        <img src={getFaviconUrl(link.url)} alt="" className="h-6 w-6 mr-3 rounded" />
                      ) : (
                        <LinkIcon className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{link.title}</div>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                          {new URL(link.url).hostname} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs" title={link.description}>
                      {link.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      link.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(link)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteLink(link.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedLink ? 'Edit Link' : 'Add Link'}>
        <form onSubmit={saveLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" placeholder="e.g. APEPDCL Bill Pay" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">External URL</label>
            <input type="url" required value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" placeholder="https://..." />
            <p className="text-xs text-gray-500 mt-1">The website's icon will be fetched automatically from this URL.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows={2} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" placeholder="Brief description of the service..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Order</label>
              <input type="number" required value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible)</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Link'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

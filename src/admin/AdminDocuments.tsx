import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, FileText, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';
import FileUpload from './components/FileUpload';

type Document = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  file_url: string;
  document_date: string;
  is_public: boolean;
  status: string;
  is_featured: boolean;
};

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const [formData, setFormData] = useState<Partial<Document>>({
    title: '',
    slug: '',
    category: 'Association Documents',
    description: '',
    file_url: '',
    document_date: new Date().toISOString().slice(0, 10),
    is_public: true,
    status: 'published',
    is_featured: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('document_date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load documents');
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: !selectedDoc ? generateSlug(title) : formData.slug });
  };

  const handleOpenModal = (doc?: Document) => {
    if (doc) {
      setSelectedDoc(doc);
      setFormData({ ...doc, document_date: doc.document_date.slice(0, 10) });
    } else {
      setSelectedDoc(null);
      setFormData({
        title: '',
        slug: '',
        category: 'Association Documents',
        description: '',
        file_url: '',
        document_date: new Date().toISOString().slice(0, 10),
        is_public: true,
        status: 'published',
        is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const saveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file_url) {
      toast.error('Please upload a document file.');
      return;
    }

    setIsSaving(true);
    const finalData = { ...formData, document_date: new Date(formData.document_date!).toISOString() };

    try {
      if (selectedDoc) {
        const { error } = await supabase.from('documents').update(finalData).eq('id', selectedDoc.id);
        if (error) throw error;
        toast.success('Document updated');
      } else {
        const { error } = await supabase.from('documents').insert([finalData]);
        if (error) throw error;
        toast.success('Document uploaded');
      }
      setIsModalOpen(false);
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Document deleted');
      fetchDocuments();
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Documents" 
        description="Upload and manage community guidelines, meeting minutes, and financial reports."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : documents.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No documents found.</td></tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.document_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      doc.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 mr-4" title="View Document">
                      <ExternalLink className="h-5 w-5 inline" />
                    </a>
                    <button onClick={() => handleOpenModal(doc)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDoc ? 'Edit Document' : 'Upload Document'}>
        <form onSubmit={saveDocument} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" required value={formData.title} onChange={handleTitleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-white">
                <option value="Association Documents">Association Documents</option>
                <option value="Financial Reports">Financial Reports</option>
                <option value="Minutes of Meeting">Minutes of Meeting</option>
                <option value="Guidelines">Guidelines</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Document Date</label>
              <input type="date" required value={formData.document_date} onChange={e => setFormData({...formData, document_date: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div className="md:col-span-2 flex gap-6 mt-2 border-t pt-4">
              <div className="flex items-center">
                <input type="checkbox" id="is_public" checked={formData.is_public} onChange={e => setFormData({...formData, is_public: e.target.checked})} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">Public Document</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">Featured</label>
              </div>
            </div>

            <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border">
              <FileUpload 
                bucket="documents" 
                accept=".pdf,.doc,.docx"
                label="PDF/Document File"
                currentImageUrl={formData.file_url}
                onUploadSuccess={(url) => setFormData({...formData, file_url: url})} 
              />
              {formData.file_url && (
                 <a href={formData.file_url} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline mt-2 inline-block">
                    Current file uploaded.
                 </a>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Document'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';
import FileUpload from './components/FileUpload';

type CommitteeMember = {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  photo_url: string;
  tenure: string;
  display_order: number;
};

export default function AdminCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  
  const [formData, setFormData] = useState<Partial<CommitteeMember>>({
    name: '',
    position: '',
    phone: '',
    email: '',
    photo_url: '',
    tenure: '2025-2026',
    display_order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('committee')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      toast.error('Failed to load committee members');
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (member?: CommitteeMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData(member);
    } else {
      setSelectedMember(null);
      setFormData({
        name: '',
        position: '',
        phone: '',
        email: '',
        photo_url: '',
        tenure: '2025-2026',
        display_order: members.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedMember) {
        const { error } = await supabase.from('committee').update(formData).eq('id', selectedMember.id);
        if (error) throw error;
        toast.success('Member updated');
      } else {
        const { error } = await supabase.from('committee').insert([formData]);
        if (error) throw error;
        toast.success('Member added');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Remove this committee member?')) return;
    const { error } = await supabase.from('committee').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Member removed');
      fetchMembers();
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Committee" 
        description="Add and update executive committee members."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenure</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No members found.</td></tr>
            ) : (
              members.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {member.photo_url ? (
                           <img className="h-10 w-10 rounded-full object-cover" src={member.photo_url} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.phone || '-'}</div>
                    <div className="text-sm text-gray-500">{member.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {member.tenure}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(member)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteMember(member.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedMember ? 'Edit Member' : 'Add Member'}>
        <form onSubmit={saveMember} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position/Role</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tenure</label>
              <input type="text" required placeholder="e.g. 2025-2026" value={formData.tenure} onChange={e => setFormData({...formData, tenure: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Display Order</label>
              <input type="number" required value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border">
              <FileUpload 
                bucket="images" 
                folder="committee"
                label="Profile Photo"
                currentImageUrl={formData.photo_url}
                onUploadSuccess={(url) => setFormData({...formData, photo_url: url})} 
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


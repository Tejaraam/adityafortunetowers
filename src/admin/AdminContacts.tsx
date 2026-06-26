import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';

type EmergencyContact = {
  id: string;
  name: string;
  designation: string;
  phone: string;
  display_order: number;
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({
    name: '',
    designation: '',
    phone: '',
    display_order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      toast.error('Failed to load contacts');
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (contact?: EmergencyContact) => {
    if (contact) {
      setSelectedContact(contact);
      setFormData(contact);
    } else {
      setSelectedContact(null);
      setFormData({
        name: '',
        designation: '',
        phone: '',
        display_order: contacts.length > 0 ? Math.max(...contacts.map(c => c.display_order)) + 1 : 1
      });
    }
    setIsModalOpen(true);
  };

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedContact) {
        const { error } = await supabase.from('emergency_contacts').update(formData).eq('id', selectedContact.id);
        if (error) throw error;
        toast.success('Contact updated');
      } else {
        const { error } = await supabase.from('emergency_contacts').insert([formData]);
        if (error) throw error;
        toast.success('Contact added');
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Remove this emergency contact?')) return;
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Contact removed');
      fetchContacts();
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Emergency Contacts" 
        description="Add and manage emergency contacts displayed on the contact page."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No emergency contacts found.</td></tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(contact)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteContact(contact.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContact ? 'Edit Contact' : 'Add Contact'}
      >
        <form onSubmit={saveContact} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation (e.g. Plumber, Security, Ambulance)</label>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={e => setFormData({...formData, designation: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              required
              value={formData.display_order}
              onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-3 py-2 border"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Contact
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


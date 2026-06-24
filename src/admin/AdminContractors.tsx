import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';

type Vendor = {
  id: string;
  name: string;
  service_category: string;
  contact_number: string;
  notes: string;
};

export default function AdminContractors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: '',
    service_category: 'Electrical',
    contact_number: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('service_category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      toast.error('Failed to load contractors');
    } else {
      setVendors(data || []);
    }
    setLoading(false);
  };

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setSelectedVendor(vendor);
      setFormData(vendor);
    } else {
      setSelectedVendor(null);
      setFormData({
        name: '',
        service_category: 'Electrical',
        contact_number: '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const saveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedVendor) {
        const { error } = await supabase.from('vendors').update(formData).eq('id', selectedVendor.id);
        if (error) throw error;
        toast.success('Contractor updated');
      } else {
        const { error } = await supabase.from('vendors').insert([formData]);
        if (error) throw error;
        toast.success('Contractor added');
      }
      setIsModalOpen(false);
      fetchVendors();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVendor = async (id: string) => {
    if (!confirm('Remove this contractor?')) return;
    const { error } = await supabase.from('vendors').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Contractor removed');
      fetchVendors();
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Contractors" 
        description="Add and manage service providers and contractors."
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Contractor
          </button>
        }
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : vendors.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No contractors found.</td></tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{vendor.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {vendor.service_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vendor.contact_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenModal(vendor)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteVendor(vendor.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedVendor ? 'Edit Contractor' : 'Add Contractor'}>
        <form onSubmit={saveVendor} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contractor / Business Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Service Category</label>
              <select value={formData.service_category} onChange={e => setFormData({...formData, service_category: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-white">
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Security">Security</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Elevator">Elevator Maintenance</option>
                <option value="General Maintenance">General Maintenance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="tel" required value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes / Description</label>
              <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Contractor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

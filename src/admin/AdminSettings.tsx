import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';

type SiteSettings = {
  id: string;
  community_name: string;
  address: string;
  phone: string;
  email: string;
  google_maps_link: string;
  facebook_link: string;
  youtube_link: string;
};

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    community_name: '',
    address: '',
    phone: '',
    email: '',
    google_maps_link: '',
    facebook_link: '',
    youtube_link: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      toast.error('Failed to load site settings');
    } else if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (settings.id) {
        const { error } = await supabase.from('site_settings').update(settings).eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([settings]);
        if (error) throw error;
      }
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader 
        title="Site Settings" 
        description="Update global community information like contact details and social links."
      />

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden max-w-3xl">
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-gray-900/10 pb-6 mb-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Basic Information</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">Community Name</label>
                <div className="mt-2">
                  <input type="text" required value={settings.community_name || ''} onChange={e => setSettings({...settings, community_name: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                <div className="mt-2">
                  <textarea rows={3} value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-6 mb-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Details</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                <div className="mt-2">
                  <input type="tel" value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                <div className="mt-2">
                  <input type="email" value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="pb-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900">External Links</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-full">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Google Maps Embed URL</label>
                <div className="mt-2">
                  <input type="url" value={settings.google_maps_link || ''} onChange={e => setSettings({...settings, google_maps_link: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
                <p className="mt-1 text-sm text-gray-500">Copy the 'src' attribute from a Google Maps embed iframe.</p>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Facebook Page URL</label>
                <div className="mt-2">
                  <input type="url" value={settings.facebook_link || ''} onChange={e => setSettings({...settings, facebook_link: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">YouTube Channel URL</label>
                <div className="mt-2">
                  <input type="url" value={settings.youtube_link || ''} onChange={e => setSettings({...settings, youtube_link: e.target.value})} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-6">
            <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


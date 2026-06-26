import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminPageHeader from './components/AdminPageHeader';
import Modal from './components/Modal';
import FileUpload from './components/FileUpload';

type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  category: string;
  status: string;
  cover_image: string;
  is_featured: boolean;
};

type EventMedia = {
  id: string;
  event_id: string;
  media_url: string;
  media_type: string;
};

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  // Selected Event state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventMedia, setEventMedia] = useState<EventMedia[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    slug: '',
    description: '',
    event_date: new Date().toISOString().slice(0, 16),
    category: 'Community Meetings',
    status: 'draft',
    is_featured: false,
    cover_image: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Media Form State
  const [newMediaType, setNewMediaType] = useState<'image' | 'youtube_url'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load events');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleOpenEventModal = (event?: Event) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        ...event,
        event_date: event.event_date.slice(0, 16) // format for datetime-local
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        event_date: new Date().toISOString().slice(0, 16),
        category: 'Community Meetings',
        status: 'draft',
        is_featured: false,
        cover_image: ''
      });
    }
    setIsEventModalOpen(true);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ 
      ...formData, 
      title, 
      slug: !selectedEvent ? generateSlug(title) : formData.slug 
    });
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Convert local datetime to ISO with timezone for Postgres
    const finalData = {
      ...formData,
      event_date: new Date(formData.event_date!).toISOString()
    };

    try {
      if (selectedEvent) {
        const { error } = await supabase.from('events').update(finalData).eq('id', selectedEvent.id);
        if (error) throw error;
        toast.success('Event updated');
      } else {
        const { error } = await supabase.from('events').insert([finalData]);
        if (error) throw error;
        toast.success('Event created');
      }
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all associated media.')) return;
    
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Event deleted');
      fetchEvents();
    }
  };

  const openMediaModal = async (event: Event) => {
    setSelectedEvent(event);
    setIsMediaModalOpen(true);
    fetchMedia(event.id);
  };

  const fetchMedia = async (eventId: string) => {
    const { data, error } = await supabase
      .from('event_media')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setEventMedia(data);
    }
  };

  const handleAddMedia = async (url: string) => {
    if (!url) return;
    setIsSavingMedia(true);
    try {
      const { error } = await supabase.from('event_media').insert([{
        event_id: selectedEvent!.id,
        media_url: url,
        media_type: newMediaType
      }]);
      if (error) throw error;
      toast.success('Media added');
      setNewMediaUrl('');
      fetchMedia(selectedEvent!.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingMedia(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Remove this media?')) return;
    const { error } = await supabase.from('event_media').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Media removed');
      fetchMedia(selectedEvent!.id);
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Manage Events" 
        description="Create, edit, and manage community events and their media galleries."
        action={
          <button onClick={() => handleOpenEventModal()} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Event
          </button>
        }
      />

      {/* Events Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No events found.</td></tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.category} {event.is_featured && <span className="text-accent ml-2">(Featured)</span>}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openMediaModal(event)} 
                      className="inline-flex items-center gap-1 bg-accent/10 text-accent hover:bg-accent hover:text-white px-3 py-1.5 rounded-md transition-colors mr-4"
                      title="Upload Images & Videos"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Gallery
                    </button>
                    <button onClick={() => handleOpenEventModal(event)} className="text-blue-600 hover:text-blue-900 mr-4" title="Edit Event Details">
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-900" title="Delete Event">
                      <Trash2 className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Event Add/Edit Modal */}
      <Modal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        title={selectedEvent ? 'Edit Event' : 'Add New Event'}
      >
        <form onSubmit={saveEvent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" required value={formData.title} onChange={handleTitleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Slug (URL Friendly)</label>
              <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-gray-50" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input type="datetime-local" required value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-white">
                <option value="Community Meetings">Community Meetings</option>
                <option value="Festivals">Festivals</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center mt-6">
              <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded" />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">Featured Event (Shows on Homepage)</label>
            </div>

            <div className="md:col-span-2 mt-4">
              <FileUpload 
                bucket="images" 
                folder="events"
                label="Cover Image"
                currentImageUrl={formData.cover_image}
                onUploadSuccess={(url) => setFormData({...formData, cover_image: url})} 
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button type="button" onClick={() => setIsEventModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Event'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Media Management Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        title={`Gallery for ${selectedEvent?.title}`}
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Add New Media</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                <select value={newMediaType} onChange={e => setNewMediaType(e.target.value as any)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border bg-white">
                  <option value="image">Image Upload</option>
                  <option value="youtube_url">YouTube URL</option>
                </select>
              </div>

              {newMediaType === 'image' ? (
                <FileUpload 
                  bucket="images"
                  folder={`gallery/${selectedEvent?.id}`}
                  onUploadSuccess={handleAddMedia}
                />
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">YouTube Video URL</label>
                  <input type="url" placeholder="https://youtube.com/watch?v=..." value={newMediaUrl} onChange={e => setNewMediaUrl(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 border" />
                  <button type="button" onClick={() => handleAddMedia(newMediaUrl)} disabled={!newMediaUrl || isSavingMedia} className="w-full btn-primary mt-2">
                    {isSavingMedia ? 'Adding...' : 'Add Video'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Current Media</h4>
            <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {eventMedia.length === 0 ? (
                <p className="text-gray-500 col-span-2 text-sm italic">No media added yet.</p>
              ) : (
                eventMedia.map(media => (
                  <div key={media.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                    {media.media_type === 'youtube_url' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-xs font-bold text-gray-500">YouTube Video</div>
                    ) : (
                      <img src={media.media_url} alt="Gallery" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a href={media.media_url} target="_blank" rel="noreferrer" className="bg-white p-1.5 rounded text-gray-900 hover:text-accent">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button onClick={() => deleteMedia(media.id)} className="bg-white p-1.5 rounded text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { ExternalLink } from 'lucide-react';


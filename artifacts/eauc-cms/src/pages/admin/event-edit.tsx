import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { useGetEvent, useCreateEvent, useUpdateEvent } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  address: string;
  registrationUrl: string;
  organizer: string;
  status: string;
};

export default function AdminEventEdit() {
  const [matchEdit, params] = useRoute<{ id: string }>('/admin/events/:id');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isNew = !matchEdit || params?.id === 'new';
  const eventId = !isNew && params?.id ? parseInt(params.id, 10) : undefined;

  const { data: event } = useGetEvent({ id: eventId! }, { enabled: !!eventId });
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { status: 'published' }
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description || '',
        startDate: event.startDate,
        endDate: event.endDate || '',
        time: event.time || '',
        location: event.location || '',
        address: event.address || '',
        registrationUrl: event.registrationUrl || '',
        organizer: event.organizer || '',
        status: event.status,
      });
    }
  }, [event, reset]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      time: data.time || undefined,
      location: data.location || undefined,
      address: data.address || undefined,
      registrationUrl: data.registrationUrl || undefined,
      organizer: data.organizer || undefined,
      status: data.status as 'published' | 'draft',
    };

    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Event created');
          queryClient.invalidateQueries({ queryKey: ['/api/events'] });
          setLocation('/admin/events');
        },
        onError: () => toast.error('Failed to create event'),
      });
    } else {
      updateMutation.mutate({ id: eventId!, ...payload }, {
        onSuccess: () => {
          toast.success('Event saved');
          queryClient.invalidateQueries({ queryKey: ['/api/events'] });
          setLocation('/admin/events');
        },
        onError: () => toast.error('Failed to save event'),
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/events')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Events
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? 'New Event' : 'Edit Event'}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input {...register('title', { required: true })} placeholder="Event title" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea {...register('description')} placeholder="Event description" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Start Date *</Label>
                  <Input {...register('startDate', { required: true })} type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input {...register('endDate')} type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input {...register('time')} placeholder="e.g. 09:00–17:00" />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select defaultValue="published" onValueChange={v => setValue('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Location</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Venue / Location</Label>
                <Input {...register('location')} placeholder="e.g. University of Copenhagen" />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input {...register('address')} placeholder="Street address, city" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Registration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Registration URL</Label>
                <Input {...register('registrationUrl')} placeholder="https://..." type="url" />
              </div>
              <div className="space-y-1.5">
                <Label>Organizer</Label>
                <Input {...register('organizer')} placeholder="Organizer name" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setLocation('/admin/events')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {isNew ? 'Create Event' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { useGetProject, useCreateProject, useUpdateProject } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: string;
  startDate: string;
  endDate: string;
  buttonLabel: string;
  buttonUrl: string;
  featured: boolean;
};

export default function AdminProjectEdit() {
  const [matchEdit, params] = useRoute<{ id: string }>('/admin/projects/:id');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isNew = !matchEdit || params?.id === 'new';
  const projectId = !isNew && params?.id ? parseInt(params.id, 10) : undefined;

  const { data: project } = useGetProject({ id: projectId! }, { enabled: !!projectId });
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { status: 'active', featured: false }
  });

  const featured = watch('featured');

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        status: project.status,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        buttonLabel: project.buttonLabel || '',
        buttonUrl: project.buttonUrl || '',
        featured: project.featured ?? false,
      });
    }
  }, [project, reset]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      title: data.title,
      shortDescription: data.shortDescription || undefined,
      fullDescription: data.fullDescription || undefined,
      status: data.status as 'active' | 'completed' | 'planned',
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      buttonLabel: data.buttonLabel || undefined,
      buttonUrl: data.buttonUrl || undefined,
      featured: data.featured,
    };

    if (isNew) {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Project created');
          queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
          setLocation('/admin/projects');
        },
        onError: () => toast.error('Failed to create project'),
      });
    } else {
      updateMutation.mutate({ id: projectId!, ...payload }, {
        onSuccess: () => {
          toast.success('Project saved');
          queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
          setLocation('/admin/projects');
        },
        onError: () => toast.error('Failed to save project'),
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/projects')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Projects
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? 'New Project' : 'Edit Project'}</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title *</Label>
                <Input {...register('title', { required: true })} placeholder="Project title" />
              </div>
              <div className="space-y-1.5">
                <Label>Short Description</Label>
                <Textarea {...register('shortDescription')} placeholder="Brief one-line summary" rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label>Full Description</Label>
                <Textarea {...register('fullDescription')} placeholder="Full project description (HTML supported)" rows={6} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select defaultValue="active" onValueChange={v => setValue('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input {...register('startDate')} type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input {...register('endDate')} type="date" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={v => setValue('featured', v)}
                />
                <Label htmlFor="featured">Featured project (shown on homepage)</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Button Label</Label>
                  <Input {...register('buttonLabel')} placeholder="e.g. Learn More" />
                </div>
                <div className="space-y-1.5">
                  <Label>Button URL</Label>
                  <Input {...register('buttonUrl')} placeholder="https://..." type="url" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setLocation('/admin/projects')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {isNew ? 'Create Project' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { useListTeamMembers, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = {
  name: string; position: string; bio: string;
  email: string; phone: string; linkedin: string;
  facebook: string; instagram: string; visible: boolean;
};

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useListTeamMembers();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();
  const deleteMutation = useDeleteTeamMember();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: { visible: true }
  });
  const visible = watch('visible');

  const openNew = () => {
    reset({ name: '', position: '', bio: '', email: '', phone: '', linkedin: '', facebook: '', instagram: '', visible: true });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (member: NonNullable<typeof members>[0]) => {
    reset({
      name: member.name, position: member.position || '', bio: member.bio || '',
      email: member.email || '', phone: member.phone || '', linkedin: member.linkedin || '',
      facebook: member.facebook || '', instagram: member.instagram || '', visible: member.visible ?? true,
    });
    setEditingId(member.id);
    setDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    const payload = {
      name: data.name,
      position: data.position || undefined,
      bio: data.bio || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      linkedin: data.linkedin || undefined,
      facebook: data.facebook || undefined,
      instagram: data.instagram || undefined,
      visible: data.visible,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => { toast.success('Team member updated'); queryClient.invalidateQueries({ queryKey: ['/api/team'] }); setDialogOpen(false); },
        onError: () => toast.error('Failed to update'),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success('Team member added'); queryClient.invalidateQueries({ queryKey: ['/api/team'] }); setDialogOpen(false); },
        onError: () => toast.error('Failed to create'),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this team member?')) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['/api/team'] }); }
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground">Manage your team members.</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (members || []).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No team members yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(members || []).map(member => (
              <Card key={member.id} className="relative">
                <CardContent className="p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {member.photo ? <img src={member.photo} alt={member.name} className="w-full h-full rounded-full object-cover" /> : member.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{member.name}</p>
                      {!member.visible && <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                    </div>
                    {member.position && <p className="text-sm text-primary truncate">{member.position}</p>}
                    {member.email && <p className="text-xs text-muted-foreground truncate mt-0.5">{member.email}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(member)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input {...register('name', { required: true })} placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Position</Label>
              <Input {...register('position')} placeholder="Job title / role" />
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea {...register('bio')} placeholder="Short biography" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input {...register('email')} type="email" placeholder="email@..." />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input {...register('phone')} placeholder="+45..." />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>LinkedIn</Label>
                <Input {...register('linkedin')} placeholder="URL" />
              </div>
              <div className="space-y-1.5">
                <Label>Facebook</Label>
                <Input {...register('facebook')} placeholder="URL" />
              </div>
              <div className="space-y-1.5">
                <Label>Instagram</Label>
                <Input {...register('instagram')} placeholder="URL" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="visible-toggle" checked={visible} onCheckedChange={v => setValue('visible', v)} />
              <Label htmlFor="visible-toggle">Visible on public site</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

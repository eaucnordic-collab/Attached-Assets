import { useState } from 'react';
import { useListNavigation, useCreateNavItem, useUpdateNavItem, useDeleteNavItem } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = { label: string; url: string; visible: boolean; openInNewTab: boolean; };
type NavItem = { id: number; label: string; url?: string | null; visible?: boolean | null; openInNewTab?: boolean | null; children?: NavItem[] };

export default function AdminNavigation() {
  const queryClient = useQueryClient();
  const { data: navItems, isLoading } = useListNavigation();
  const createMutation = useCreateNavItem();
  const updateMutation = useUpdateNavItem();
  const deleteMutation = useDeleteNavItem();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({ defaultValues: { visible: true, openInNewTab: false } });
  const visible = watch('visible');
  const openInNewTab = watch('openInNewTab');

  const openNew = () => { reset({ label: '', url: '', visible: true, openInNewTab: false }); setEditingId(null); setDialogOpen(true); };
  const openEdit = (item: NavItem) => {
    reset({ label: item.label, url: item.url || '', visible: item.visible ?? true, openInNewTab: item.openInNewTab ?? false });
    setEditingId(item.id); setDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    const payload = { label: data.label, url: data.url || undefined, visible: data.visible, openInNewTab: data.openInNewTab };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => { toast.success('Nav item updated'); queryClient.invalidateQueries({ queryKey: ['/api/navigation'] }); setDialogOpen(false); }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success('Nav item added'); queryClient.invalidateQueries({ queryKey: ['/api/navigation'] }); setDialogOpen(false); }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this nav item?')) return;
    deleteMutation.mutate({ id }, { onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['/api/navigation'] }); } });
  };

  const flatItems = navItems ? [...navItems, ...(navItems.flatMap((i: NavItem) => i.children || []))] : [];

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
            <p className="text-muted-foreground">Manage the site navigation menu.</p>
          </div>
          <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : flatItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No navigation items yet.</div>
        ) : (
          <div className="space-y-2">
            {flatItems.map((item: NavItem) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.label}</span>
                      {item.openInNewTab && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                      {!item.visible && <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Hidden</span>}
                    </div>
                    {item.url && <span className="text-sm text-muted-foreground">{item.url}</span>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => handleDelete(item.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Nav Item' : 'Add Nav Item'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1.5"><Label>Label *</Label><Input {...register('label', { required: true })} placeholder="Menu label" /></div>
            <div className="space-y-1.5"><Label>URL</Label><Input {...register('url')} placeholder="/page or https://..." /></div>
            <div className="flex items-center gap-3">
              <Switch checked={visible} onCheckedChange={v => setValue('visible', v)} />
              <Label>Visible in menu</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={openInNewTab} onCheckedChange={v => setValue('openInNewTab', v)} />
              <Label>Open in new tab</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

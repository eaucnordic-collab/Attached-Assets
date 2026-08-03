import { useState } from 'react';
import { useListPartners, useCreatePartner, useUpdatePartner, useDeletePartner } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type FormValues = { name: string; description: string; url: string; category: string; visible: boolean; };

export default function AdminPartners() {
  const queryClient = useQueryClient();
  const { data: partners, isLoading } = useListPartners();
  const createMutation = useCreatePartner();
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({ defaultValues: { visible: true } });
  const visible = watch('visible');

  const openNew = () => {
    reset({ name: '', description: '', url: '', category: '', visible: true });
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (p: NonNullable<typeof partners>[0]) => {
    reset({ name: p.name, description: p.description || '', url: p.url || '', category: p.category || '', visible: p.visible ?? true });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const onSubmit = (data: FormValues) => {
    const payload = { name: data.name, description: data.description || undefined, url: data.url || undefined, category: data.category || undefined, visible: data.visible };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload }, {
        onSuccess: () => { toast.success('Partner updated'); queryClient.invalidateQueries({ queryKey: ['/api/partners'] }); setDialogOpen(false); }
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success('Partner added'); queryClient.invalidateQueries({ queryKey: ['/api/partners'] }); setDialogOpen(false); }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
            <p className="text-muted-foreground">Manage partner organisations.</p>
          </div>
          <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Partner</Button>
        </div>

        <div className="border rounded-md bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : (partners || []).length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No partners yet.</TableCell></TableRow>
              ) : (partners || []).map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category ? <Badge variant="outline">{p.category}</Badge> : '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.url}</a> : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.visible ? 'default' : 'secondary'}>{p.visible ? 'Visible' : 'Hidden'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(p)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { if (confirm('Delete?')) deleteMutation.mutate({ id: p.id }, { onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['/api/partners'] }); } }); }} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingId ? 'Edit Partner' : 'Add Partner'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1.5"><Label>Name *</Label><Input {...register('name', { required: true })} placeholder="Organisation name" /></div>
            <div className="space-y-1.5"><Label>Category</Label><Input {...register('category')} placeholder="e.g. University, Government" /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea {...register('description')} rows={2} placeholder="Short description" /></div>
            <div className="space-y-1.5"><Label>Website URL</Label><Input {...register('url')} type="url" placeholder="https://..." /></div>
            <div className="flex items-center gap-3">
              <Switch checked={visible} onCheckedChange={v => setValue('visible', v)} />
              <Label>Visible on public site</Label>
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

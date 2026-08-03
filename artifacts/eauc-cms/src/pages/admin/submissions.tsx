import { useState } from 'react';
import { useListSubmissions, useListForms, useDeleteSubmission } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSubmissions() {
  const queryClient = useQueryClient();
  const { data: forms } = useListForms();
  const [formId, setFormId] = useState<number | undefined>(undefined);
  const { data: submissions, isLoading } = useListSubmissions(
    formId ? { formId } : {},
  );
  const deleteMutation = useDeleteSubmission();
  const [viewData, setViewData] = useState<Record<string, unknown> | null>(null);

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            <p className="text-muted-foreground">View and manage form submissions.</p>
          </div>
          <Select onValueChange={v => setFormId(v === 'all' ? undefined : parseInt(v, 10))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All forms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All forms</SelectItem>
              {(forms || []).map(f => (
                <SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : (submissions || []).length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No submissions yet.</TableCell></TableRow>
              ) : (submissions || []).map(sub => {
                const data = sub.data as Record<string, unknown>;
                const preview = Object.entries(data).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' | ');
                return (
                  <TableRow key={sub.id}>
                    <TableCell><Badge variant="outline">{sub.formName}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{preview}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(sub.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewData(data)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => { if (confirm('Delete this submission?')) deleteMutation.mutate({ id: sub.id }, { onSuccess: () => { toast.success('Deleted'); queryClient.invalidateQueries({ queryKey: ['/api/submissions'] }); } }); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submission Details</DialogTitle></DialogHeader>
          <div className="space-y-2 mt-2">
            {viewData && Object.entries(viewData).map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{k}</span>
                <span className="text-sm border rounded px-3 py-1.5 bg-muted/30">{String(v)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

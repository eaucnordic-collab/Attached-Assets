import { useState } from 'react';
import { useListPages, useCreatePage, useDeletePage, usePublishPage, useUnpublishPage } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, Plus, Search, CheckCircle2, Circle, Pencil, Layout, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPages() {
  const queryClient = useQueryClient();
  const { data: pages, isLoading } = useListPages();
  const [search, setSearch] = useState('');
  
  const createMutation = useCreatePage();
  const deleteMutation = useDeletePage();
  const publishMutation = usePublishPage();
  const unpublishMutation = useUnpublishPage();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({ title: '', slug: '' });

  const filteredPages = pages?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    createMutation.mutate({ data: createData }, {
      onSuccess: () => {
        toast.success('Page created');
        setIsCreateOpen(false);
        setCreateData({ title: '', slug: '' });
        queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      },
      onError: () => toast.error('Failed to create page')
    });
  };

  const handleStatusToggle = (id: number, currentStatus: string) => {
    const mutation = currentStatus === 'published' ? unpublishMutation : publishMutation;
    mutation.mutate({ id }, {
      onSuccess: () => {
        toast.success(`Page ${currentStatus === 'published' ? 'unpublished' : 'published'}`);
        queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast.success('Page deleted');
        queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">Manage your website's pages and structure.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" />
          Create Page
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search pages..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading pages...</TableCell></TableRow>
            ) : filteredPages?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pages found.</TableCell></TableRow>
            ) : (
              filteredPages?.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {page.isHome && <Badge variant="secondary" className="text-xs">Home</Badge>}
                      {page.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">/{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'} className="gap-1">
                      {page.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/builder/${page.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Layout className="mr-2 h-4 w-4" /> Builder
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleStatusToggle(page.id, page.status)}>
                          {page.status === 'published' ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(page.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>Add a new page to your website. You can edit its content later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input 
                value={createData.title}
                onChange={e => setCreateData({ ...createData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })}
                placeholder="e.g. About Us"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input 
                value={createData.slug}
                onChange={e => setCreateData({ ...createData, slug: e.target.value })}
                placeholder="e.g. about-us"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!createData.title || !createData.slug || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useGetNewsPost, useCreateNewsPost, useUpdateNewsPost, usePublishNewsPost } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminNewsEdit() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isNew = !params.id || params.id === 'new';
  const id = isNew ? 0 : Number(params.id);

  const { data: article, isLoading } = useGetNewsPost(id, { 
    query: { enabled: !isNew && !!id, queryKey: ['/api/news', id] } 
  });

  const createMutation = useCreateNewsPost();
  const updateMutation = useUpdateNewsPost();
  const publishMutation = usePublishNewsPost();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    coverImage: ''
  });

  useEffect(() => {
    if (article && !isNew) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category || '',
        author: article.author || '',
        coverImage: article.coverImage || ''
      });
    }
  }, [article, isNew]);

  const handleSave = () => {
    if (isNew) {
      createMutation.mutate({ data: formData }, {
        onSuccess: (newArticle) => {
          toast.success('Article created');
          queryClient.invalidateQueries({ queryKey: ['/api/news'] });
          setLocation(`/admin/news/${newArticle.id}`);
        }
      });
    } else {
      updateMutation.mutate({ id, data: formData }, {
        onSuccess: () => {
          toast.success('Article updated');
          queryClient.invalidateQueries({ queryKey: ['/api/news', id] });
        }
      });
    }
  };

  const handlePublish = () => {
    if (isNew) {
      toast.error('Save the article first before publishing');
      return;
    }
    publishMutation.mutate({ id }, {
      onSuccess: () => {
        toast.success('Article published');
        queryClient.invalidateQueries({ queryKey: ['/api/news', id] });
      }
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (!isNew && isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center gap-4 text-sm mb-4">
        <Button variant="ghost" size="sm" onClick={() => setLocation('/admin/news')} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? 'Write Article' : 'Edit Article'}</h1>
          {!isNew && <p className="text-muted-foreground mt-1 text-sm">Status: {article?.status}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          {!isNew && article?.status !== 'published' && (
            <Button onClick={handlePublish} disabled={publishMutation.isPending} className="gap-2">
              <Globe className="w-4 h-4" />
              Publish Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value, slug: isNew ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : formData.slug })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea 
                  rows={3}
                  value={formData.excerpt} 
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Full Content</Label>
                <Textarea 
                  rows={15}
                  value={formData.content} 
                  onChange={e => setFormData({ ...formData, content: e.target.value })} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input 
                  value={formData.slug} 
                  onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input 
                  value={formData.author} 
                  onChange={e => setFormData({ ...formData, author: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input 
                  value={formData.coverImage} 
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })} 
                />
                {formData.coverImage && (
                  <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted border">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

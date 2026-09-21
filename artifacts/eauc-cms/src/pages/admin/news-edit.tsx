import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useGetNewsPost, useCreateNewsPost, useUpdateNewsPost, usePublishNewsPost, useListNews } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Globe, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/rich-text-editor';
import { generateArticleExcerpt, sanitizeArticleHtml } from '@/lib/sanitize-article-html';

type ArticleLanguage = 'da' | 'uk' | 'en';

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
  const { data: allNewsData } = useListNews({ status: 'all', limit: 100 });
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    coverImage: '',
    language: 'da' as ArticleLanguage,
    translationGroup: '',
    galleryImages: [] as string[],
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
        coverImage: article.coverImage || '',
        language: article.language,
        translationGroup: article.translationGroup,
        galleryImages: article.galleryImages ?? [],
      });
    }
  }, [article, isNew]);

  const handleSave = () => {
    const content = sanitizeArticleHtml(formData.content);
    const excerpt = formData.excerpt.trim() || generateArticleExcerpt(content);
    const payload = { ...formData, content, excerpt };
    if (isNew) {
      createMutation.mutate({ data: payload }, {
        onSuccess: (newArticle) => {
          toast.success('Article created');
          queryClient.invalidateQueries({ queryKey: ['/api/news'] });
          setLocation(`/admin/news/${newArticle.id}`);
        },
        onError: () => toast.error('Не удалось сохранить статью. Проверьте обязательные поля.'),
      });
    } else {
      updateMutation.mutate({ id, data: payload }, {
        onSuccess: () => {
          toast.success('Article updated');
          queryClient.invalidateQueries({ queryKey: ['/api/news', id] });
        },
        onError: () => toast.error('Не удалось сохранить изменения статьи.'),
      });
    }
  };

  const handlePublish = () => {
    if (isNew) {
      toast.error('Save the article first before publishing');
      return;
    }
    publishMutation.mutate({ id, data: { publish: true } }, {
      onSuccess: () => {
        toast.success('Статья опубликована');
        queryClient.invalidateQueries({ queryKey: ['/api/news', id] });
        queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      },
      onError: () => toast.error('Не удалось опубликовать статью. Попробуйте ещё раз.'),
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('INVALID_IMAGE_TYPE');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('IMAGE_TOO_LARGE');
    }

    const urlResponse = await fetch('/api/storage/uploads/request-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type,
      }),
    });
    if (!urlResponse.ok) throw new Error('UPLOAD_URL_FAILED');

    const { uploadURL, objectPath } = await urlResponse.json();
    const uploadResponse = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error('UPLOAD_FAILED');
    return `/api/storage${objectPath}`;
  };

  const handleCoverUpload = async (file: File) => {
    setIsUploadingCover(true);
    try {
      const imagePath = await uploadImage(file);
      setFormData((current) => ({
        ...current,
        coverImage: imagePath,
      }));
      toast.success('Изображение загружено');
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      toast.error(
        message === 'INVALID_IMAGE_TYPE'
          ? 'Выберите файл изображения.'
          : message === 'IMAGE_TOO_LARGE'
            ? 'Размер изображения не должен превышать 10 МБ.'
            : 'Не удалось загрузить изображение. Попробуйте ещё раз.',
      );
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const handleInlineImageUpload = async (files: File[]): Promise<string[]> => {
    try {
      const imagePaths = await Promise.all(files.map(uploadImage));
      toast.success(
        imagePaths.length === 1
          ? 'Зображення додано до статті'
          : `До статті додано зображень: ${imagePaths.length}`,
      );
      return imagePaths;
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      toast.error(
        message === 'INVALID_IMAGE_TYPE'
          ? 'Оберіть лише файли зображень.'
          : message === 'IMAGE_TOO_LARGE'
            ? 'Розмір кожного зображення не повинен перевищувати 10 МБ.'
            : 'Не вдалося завантажити зображення. Спробуйте ще раз.',
      );
      throw error;
    }
  };

  const handleGalleryUpload = async (files: File[]) => {
    try {
      const imagePaths = await Promise.all(files.map(uploadImage));
      setFormData((current) => ({ ...current, galleryImages: [...current.galleryImages, ...imagePaths] }));
      toast.success(`${imagePaths.length} gallery image${imagePaths.length === 1 ? '' : 's'} added`);
    } catch {
      toast.error('Не удалось загрузить изображения галереи.');
    }
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
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData((current) => ({ ...current, content }))}
                  onUploadImages={handleInlineImageUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Use “Insert images” to add one or several photos directly into the article.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="article-language">Article language</Label>
                <select
                  id="article-language"
                  value={formData.language}
                  onChange={(event) => setFormData({ ...formData, language: event.target.value as ArticleLanguage })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="da">Dansk</option>
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="translation-group">Translation of</Label>
                <select
                  id="translation-group"
                  value={formData.translationGroup}
                  onChange={(event) => setFormData({ ...formData, translationGroup: event.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">New independent article</option>
                  {(allNewsData?.items ?? [])
                    .filter((item) => item.id !== id)
                    .filter((item, index, items) =>
                      items.findIndex((candidate) =>
                        (candidate.translationGroup || candidate.slug) === (item.translationGroup || item.slug)
                      ) === index
                    )
                    .map((item) => (
                      <option key={item.translationGroup || item.slug} value={item.translationGroup || item.slug}>
                        {item.title} ({item.language.toUpperCase()})
                      </option>
                    ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Select the same material for its Danish, Ukrainian and English versions.
                </p>
              </div>
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
                <Label>Cover Image</Label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleCoverUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  disabled={isUploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingCover ? 'Uploading image...' : 'Choose image from device'}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or paste a URL</span>
                  </div>
                </div>
                <Input
                  value={formData.coverImage}
                  onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                />
                {formData.coverImage && (
                  <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted border">
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Article gallery</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length) void handleGalleryUpload(files);
                    event.currentTarget.value = '';
                  }}
                />
                {formData.galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.galleryImages.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative aspect-square overflow-hidden rounded-md border">
                        <img src={url} alt={`Gallery image ${index + 1}`} className="h-full w-full object-cover" />
                        <Button type="button" variant="destructive" size="icon" className="absolute right-1 top-1 h-6 w-6" onClick={() => setFormData((current) => ({ ...current, galleryImages: current.galleryImages.filter((_, i) => i !== index) }))}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
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

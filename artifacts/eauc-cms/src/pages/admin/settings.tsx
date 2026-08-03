import { useEffect } from 'react';
import { useGetSettings, useUpdateSettings, useGetTheme, useUpdateTheme } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Globe, Palette } from 'lucide-react';
import { toast } from 'sonner';

type SiteFormValues = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerCopyright: string;
};

type ThemeFormValues = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
};

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings } = useGetSettings();
  const { data: theme } = useGetTheme();
  const updateSettingsMutation = useUpdateSettings();
  const updateThemeMutation = useUpdateTheme();

  const siteForm = useForm<SiteFormValues>({ defaultValues: { siteName: 'EAUC Nordic' } });
  const themeForm = useForm<ThemeFormValues>({ defaultValues: {
    primaryColor: '#1a6b5a', secondaryColor: '#e8f5f2', accentColor: '#2d9977',
    backgroundColor: '#ffffff', textColor: '#1a1f2e',
  }});

  useEffect(() => {
    if (settings) {
      siteForm.reset({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        footerCopyright: settings.footerCopyright || '',
      });
    }
  }, [settings]);

  useEffect(() => {
    if (theme) {
      themeForm.reset({
        primaryColor: theme.primaryColor || '#1a6b5a',
        secondaryColor: theme.secondaryColor || '#e8f5f2',
        accentColor: theme.accentColor || '#2d9977',
        backgroundColor: theme.backgroundColor || '#ffffff',
        textColor: theme.textColor || '#1a1f2e',
      });
    }
  }, [theme]);

  const onSiteSubmit = (data: SiteFormValues) => {
    updateSettingsMutation.mutate({
      siteName: data.siteName,
      siteDescription: data.siteDescription || undefined,
      contactEmail: data.contactEmail || undefined,
      contactPhone: data.contactPhone || undefined,
      address: data.address || undefined,
      footerCopyright: data.footerCopyright || undefined,
    }, {
      onSuccess: () => { toast.success('Settings saved'); queryClient.invalidateQueries({ queryKey: ['/api/settings'] }); },
      onError: () => toast.error('Failed to save settings'),
    });
  };

  const onThemeSubmit = (data: ThemeFormValues) => {
    updateThemeMutation.mutate(data, {
      onSuccess: () => { toast.success('Theme saved'); queryClient.invalidateQueries({ queryKey: ['/api/settings/theme'] }); },
      onError: () => toast.error('Failed to save theme'),
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your site settings and appearance.</p>
        </div>

        {/* Site Settings */}
        <form onSubmit={siteForm.handleSubmit(onSiteSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4" /> Site Information</CardTitle>
              <CardDescription>General site configuration and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Site Name</Label>
                <Input {...siteForm.register('siteName')} placeholder="EAUC Nordic" />
              </div>
              <div className="space-y-1.5">
                <Label>Site Description</Label>
                <Textarea {...siteForm.register('siteDescription')} rows={2} placeholder="Brief description of the site" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Contact Email</Label>
                  <Input {...siteForm.register('contactEmail')} type="email" placeholder="info@eaucnordic.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Phone</Label>
                  <Input {...siteForm.register('contactPhone')} placeholder="+45 12 34 56 78" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Textarea {...siteForm.register('address')} rows={2} placeholder="Copenhagen, Denmark" />
              </div>
              <div className="space-y-1.5">
                <Label>Footer Copyright</Label>
                <Input {...siteForm.register('footerCopyright')} placeholder="© 2024 EAUC Nordic. All rights reserved." />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateSettingsMutation.isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Theme Settings */}
        <form onSubmit={themeForm.handleSubmit(onThemeSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="w-4 h-4" /> Theme & Colors</CardTitle>
              <CardDescription>Customize the site's color scheme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'primaryColor' as const, label: 'Primary Color' },
                  { name: 'secondaryColor' as const, label: 'Secondary Color' },
                  { name: 'accentColor' as const, label: 'Accent Color' },
                  { name: 'backgroundColor' as const, label: 'Background Color' },
                  { name: 'textColor' as const, label: 'Text Color' },
                ].map(field => (
                  <div key={field.name} className="space-y-1.5">
                    <Label>{field.label}</Label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        {...themeForm.register(field.name)}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <Input {...themeForm.register(field.name)} placeholder="#000000" className="font-mono text-sm" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateThemeMutation.isPending} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLogin } from '@workspace/api-client-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@eaucnordic.com');
  const [password, setPassword] = useState('admin123');
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate login for this prototype since backend is mocked or might need real creds.
    // Wait, the instructions say: 
    // "- /admin/login — Login page (email + password, test: admin@eaucnordic.com / admin123, store session in localStorage)
    // - On login: call useLogin(), on success store { user, token: 'local-session' } in localStorage key "eauc_auth_session""
    
    loginMutation.mutate({ data: { email, password } }, {
      onSuccess: (user) => {
        login(user, 'local-session');
        setLocation('/admin');
      },
      onError: () => {
        setError('Invalid credentials. Please check your email and password.');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto mb-2">
            <img src="/logo.png" alt="EAUC Nordic" className="h-16 w-16 rounded-xl object-contain bg-black" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">EAUC Nordic Admin</CardTitle>
          <CardDescription>Enter your credentials to access the CMS</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                data-testid="input-password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
              data-testid="button-submit-login"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground border-t p-4 bg-muted/20">
          <a href="/" className="hover:text-primary transition-colors">Return to public site</a>
        </CardFooter>
      </Card>
    </div>
  );
}

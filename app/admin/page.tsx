'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAdminAuthenticated } from '@/lib/store';
import { Lock, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mot de passe admin (à changer en production)
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      router.push('/admin/dashboard');
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-luxury-navy via-luxury-darkNavy to-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="card-luxury space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-luxury-gold" />
                <div className="absolute inset-0 bg-luxury-gold/20 blur-xl"></div>
              </div>
            </div>
            <h1 className="text-3xl font-serif text-luxury-gold">
              Administration
            </h1>
            <p className="text-luxury-lightGold/70">
              Choose Your Mirror Dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-luxury-lightGold/70 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="input-luxury pl-12"
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button type="submit" className="w-full btn-primary">
              Se connecter
            </button>

            <p className="text-xs text-luxury-lightGold/50 text-center">
              Mot de passe par défaut: admin123
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

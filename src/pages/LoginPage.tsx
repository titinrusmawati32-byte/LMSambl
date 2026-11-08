import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Sparkles, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService.js';
import { User as UserType } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('reza.fahlevi');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await authService.login(username, password);
      if (res.success && res.data?.user) {
        onLoginSuccess(res.data.user);
      } else {
        setErrorMsg(res.error || 'Gagal masuk. Periksa username dan password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickAccount = (uname: string) => {
    setUsername(uname);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0a192f] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
        {/* Left Side: Brand & Visual (5 Cols Matching Image 1) */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-[#0a192f] p-8 flex-col justify-between border-r border-slate-800 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 mb-6">
              <Sparkles className="w-7 h-7 text-slate-950" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              Portal <br /> Administrasi Guru
            </h1>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Digitalisasi Administrasi Sekolah untuk Pendidikan yang Lebih Baik dan Terstruktur.
            </p>
          </div>

          {/* 3 Badges Matching Image 1 */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 bg-white/5 p-2 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Modern & Responsif</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 bg-white/5 p-2 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Terpercaya & Akurat</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 bg-white/5 p-2 rounded-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Terintegrasi Google Workspace</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            SDN SUMBEREJO 04 • TP 2026/2027
          </div>
        </div>

        {/* Right Side: Login Form (7 Cols Matching Image 1) */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="text-center sm:text-left mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Masuk ke Akun Anda
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gunakan username dan password terdaftar
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: reza.fahlevi"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#lupa" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gold Login Button Matching Image 1 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Login'}
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Pilih Akun Demo Cepat:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setQuickAccount('reza.fahlevi')}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition"
                >
                  Guru (Reza)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAccount('admin.sekolah')}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 transition"
                >
                  Admin Sekolah
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAccount('superadmin')}
                  className="px-2.5 py-1 text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 transition"
                >
                  Super Admin
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400">
            © 2026 Portal Administrasi Guru • SDN Sumberejo 04
          </div>
        </div>
      </div>
    </div>
  );
};

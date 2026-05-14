// src/components/Auth/LoginPage.jsx
import { useState } from 'react';
import { LockKeyhole, LogIn, Sparkles, UserRound } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loginError = useAuthStore((state) => state.loginError);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen min-w-[320px] items-center justify-center overflow-auto p-3 text-slate-950 dark:text-white sm:p-6 lg:p-8">
      <div className="glass-shell grid w-full max-w-6xl overflow-hidden lg:grid-cols-[1fr_440px]">
        <section className="relative min-h-[320px] overflow-hidden bg-gradient-to-br from-cyan-950 via-teal-950 to-slate-950 p-6 text-white sm:p-8 lg:min-h-[640px] lg:p-10">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-cyan-800 shadow-soft">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="text-sm font-black uppercase tracking-wide text-cyan-200">Productivity Hub</p>
              <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">Private admin workspace for serious focus.</h1>
              <p className="mt-5 max-w-lg text-base font-semibold leading-7 text-cyan-50/78">
                Sign in with the administrator account to manage the full productivity dashboard.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-0">
              {['Matrix', 'Schedule', 'Pomodoro'].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                  <p className="text-sm font-black">{item}</p>
                  <p className="mt-1 text-xs font-semibold text-cyan-100/70">Ready</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/72 p-5 backdrop-blur-2xl dark:bg-slate-950/72 sm:p-8">
          <div className="mb-8">
            <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-300">Sign in</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Enter your administrator credentials.</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block text-sm font-black text-slate-600 dark:text-slate-300">
              Username
              <span className="relative mt-2 block">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className="input pl-10" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoFocus />
              </span>
            </label>
            <label className="block text-sm font-black text-slate-600 dark:text-slate-300">
              Password
              <span className="relative mt-2 block">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input className="input pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
              </span>
            </label>
            {loginError && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{loginError}</div>}
            <button className="btn-primary w-full py-3" disabled={isSubmitting}>
              <LogIn className="h-5 w-5" /> {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

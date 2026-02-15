import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="text-xl font-bold tracking-tight">SmartBook</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link href="/register" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          Scheduling made simple for growing teams.
        </h1>
        <p className="mt-8 text-xl text-slate-600 max-w-2xl leading-relaxed">
          Book appointments, manage records, and stay organized with a shared calendar that works for everyone. No complexity, just focus.
        </p>

        <div className="mt-12 flex items-center gap-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            Start for free
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-32 w-full grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Effortless Booking',
              desc: 'Our intuitive interface makes scheduling a breeze for both you and your clients.'
            },
            {
              title: 'Team Sync',
              desc: 'Keep everyone on the same page with real-time updates and shared availability.'
            },
            {
              title: 'Secure & Private',
              desc: 'Your data is encrypted and protected with industry-standard security protocols.'
            }
          ].map((feature, i) => (
            <div key={i} className="text-left space-y-4">
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Basic Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 text-slate-400 text-sm flex justify-between items-center">
        <p>© 2026 SmartBook Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-slate-600">Privacy</Link>
          <Link href="#" className="hover:text-slate-600">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

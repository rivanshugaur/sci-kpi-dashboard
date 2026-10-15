import './globals.css';

export const metadata = {
  title: 'SCI KPI Dashboard | The Shipping Corporation of India',
  description: 'Executive Fleet Analytics & Financial KPI Management System',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle maritime background radial lighting */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-subtle-pulse" />
          <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-3xl animate-subtle-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-40 left-1/3 w-[36rem] h-[36rem] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

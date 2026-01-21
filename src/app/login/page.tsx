import type { Metadata } from 'next';
import LoginForm from './components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - CloudDrive',
  description: 'Sign in to your CloudDrive account to access your files, folders, and cloud storage. Secure authentication with email or OAuth providers.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-heading font-semibold text-foreground">
                Your Files,
                <br />
                Anywhere You Go
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Access, share, and collaborate on your files from any device. CloudDrive keeps your data secure and always available.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Secure Storage
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade encryption keeps your files safe and private
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-secondary"
                  >
                    <path
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Easy Collaboration
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share files and folders with team members instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-accent"
                  >
                    <path
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-foreground mb-1">
                    Access Anywhere
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sync across all your devices for seamless productivity
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-xs text-muted-foreground">
                Trusted by over 10,000+ users worldwide
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-foreground"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.9/5</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
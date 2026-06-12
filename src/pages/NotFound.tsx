import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import GrainOverlay from '@/components/layout/GrainOverlay';
import Marquee from '@/components/motion/Marquee';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background text-foreground">
      <GrainOverlay />

      <div className="page-margin">
        <p className="text-label mb-6 text-ink-muted">
          Error — 404 <span className="text-accent">/</span> {location.pathname}
        </p>
        <h1 className="text-display-2xl text-ink">
          Lost the <em className="font-serif-italic text-accent">thread.</em>
        </h1>
        <Link
          to="/"
          className="text-label mt-12 inline-block rounded-full bg-ink px-7 py-3.5 text-paper transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
        >
          ← Back to index
        </Link>
      </div>

      <div className="mt-20">
        <Marquee speed={26} className="hairline-t hairline-b py-3">
          <span className="text-label px-6 text-ink-muted">
            PAGE NOT FOUND — PAGE NOT FOUND — PAGE NOT FOUND —
          </span>
        </Marquee>
      </div>
    </div>
  );
};

export default NotFound;

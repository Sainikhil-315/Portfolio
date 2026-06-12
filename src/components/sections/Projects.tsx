import { useRef, useState } from 'react';
import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { gsap, useGSAP, MM } from '@/lib/gsap';
import { projects, isVideo, type Project } from '@/content/projects';

/** Horizontal scroll-snap strip of screenshots/videos with mono captions. */
const Filmstrip = ({ project }: { project: Project }) => (
  <div
    data-cursor="drag"
    className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
  >
    {project.media.map((src, i) => (
      <figure key={src} className="shrink-0 snap-start">
        <div className="bg-[#1A1714] p-2">
          {isVideo(src) ? (
            <video
              src={src}
              muted
              loop
              playsInline
              autoPlay
              className="h-56 w-auto md:h-72"
            />
          ) : (
            <img
              src={src}
              alt={`${project.title} screenshot ${i + 1}`}
              loading="lazy"
              className="h-56 w-auto md:h-72"
            />
          )}
        </div>
        <figcaption className="text-label mt-2 text-ink-muted">
          fig. {String(i + 1).padStart(2, '0')}/{String(project.media.length).padStart(2, '0')}
        </figcaption>
      </figure>
    ))}
  </div>
);

const Projects = () => {
  const ref = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  // cursor-following preview (desktop, fine pointer only)
  useGSAP(
    () => {
      const preview = previewRef.current;
      const container = ref.current;
      if (!preview || !container) return;

      const mm = gsap.matchMedia();

      mm.add(`${MM.motionOK} and ${MM.finePointer}`, () => {
        const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });

        const onMove = (e: PointerEvent) => {
          xTo(e.clientX + 24);
          yTo(e.clientY - 120);
        };
        container.addEventListener('pointermove', onMove);
        return () => container.removeEventListener('pointermove', onMove);
      });
    },
    { scope: ref }
  );

  const showPreview = (project: Project) => {
    if (openId !== null || !project.media.length) return;
    setPreviewSrc(project.media.find((m) => !isVideo(m)) ?? null);
    gsap.to(previewRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.4,
      ease: 'expo.out',
    });
  };

  const hidePreview = () => {
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.85,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const toggle = (id: number) => {
    hidePreview();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div ref={ref} className="section-pad">
      <SectionHeading
        index="04"
        label="Projects"
        headline="Selected work"
        accentWord="work"
      />

      {/* floating hover preview */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none invisible fixed left-0 top-0 z-50 w-72 scale-90 opacity-0 will-change-transform"
      >
        {previewSrc && (
          <div className="bg-[#1A1714] p-1.5">
            <img src={previewSrc} alt="" className="block w-full" />
          </div>
        )}
      </div>

      <Reveal childSelector="[data-project-row]" stagger={0.06}>
        <ol className="hairline-t">
          {projects.map((project) => {
            const open = openId === project.id;
            return (
              <li key={project.id} data-project-row className="hairline-b">
                <button
                  onClick={() => toggle(project.id)}
                  onPointerEnter={() => showPreview(project)}
                  onPointerLeave={hidePreview}
                  aria-expanded={open}
                  data-cursor="view"
                  className="page-margin group grid w-full grid-cols-12 items-baseline gap-4 py-7 text-left transition-colors duration-300 md:py-9"
                >
                  <span
                    className={`text-label col-span-2 transition-colors duration-300 md:col-span-1 ${open ? 'text-accent' : 'text-ink-muted group-hover:text-accent'}`}
                  >
                    {project.index}
                  </span>
                  <span
                    className={`text-display-xl col-span-10 transition-transform duration-500 ease-out md:col-span-7 ${open ? 'text-accent' : 'text-ink'} md:group-hover:translate-x-3`}
                  >
                    {project.title}
                  </span>
                  <span className="text-label col-span-6 col-start-3 text-ink-muted md:col-span-3 md:col-start-9 md:text-right">
                    {project.tagline}
                  </span>
                  <span className="text-label col-span-4 text-right text-ink-muted md:col-span-1">
                    {project.year} {open ? '−' : '+'}
                  </span>
                </button>

                {/* expanded case study */}
                <div
                  className={`grid transition-[grid-template-rows] duration-700 [transition-timing-function:cubic-bezier(0.76,0,0.24,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="page-margin grid grid-cols-12 gap-10 pb-12 pt-2">
                      <div className="col-span-12 lg:col-span-5">
                        <p className="max-w-xl text-base leading-relaxed text-ink-muted">
                          {project.description}
                        </p>
                        <p className="text-label mt-8 text-ink-muted">
                          Stack — {project.technologies.join(' · ')}
                        </p>
                        <div className="mt-8 flex gap-6">
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-label text-ink underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                          >
                            Live ↗
                          </a>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-label text-ink underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
                          >
                            Source ↗
                          </a>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-7">
                        {project.media.length > 0 ? (
                          <Filmstrip project={project} />
                        ) : (
                          <blockquote className="font-serif-italic max-w-md text-2xl leading-snug text-ink md:text-3xl">
                            “{project.tagline}.”
                            <footer className="text-label mt-4 not-italic text-ink-muted">
                              Case study in type — no captures for this one.
                            </footer>
                          </blockquote>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </div>
  );
};

export default Projects;

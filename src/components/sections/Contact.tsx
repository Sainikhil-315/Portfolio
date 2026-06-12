import { useState } from 'react';
import SectionHeading from '@/components/ui-custom/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import PillButton from '@/components/ui-custom/PillButton';
import {
  UnderlineInput,
  UnderlineTextarea,
} from '@/components/ui-custom/UnderlineField';
import { useToast } from '@/hooks/use-toast';
import { site, socials } from '@/content/site';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast({
        title: 'Email sent successfully!',
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Failed to send email',
        description:
          error instanceof Error
            ? error.message
            : 'Please try WhatsApp or email me directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSend = () => {
    const whatsappMessage =
      `*New Contact Form Submission*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Phone:* ${formData.phone}%0A%0A` +
      `*Message:*%0A${formData.message}`;

    window.open(
      `https://wa.me/${site.whatsappNumber}?text=${whatsappMessage}`,
      '_blank'
    );

    toast({
      title: 'Opening WhatsApp...',
      description: "You'll be redirected to WhatsApp to send your message.",
    });
  };

  const channels = [
    { label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { label: 'Phone', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    {
      label: 'WhatsApp',
      value: 'Chat directly',
      href: `https://wa.me/${site.whatsappNumber}`,
    },
    ...socials
      .filter((s) => s.label !== 'Email')
      .map((s) => ({ label: s.label, value: s.href.replace('https://', ''), href: s.href })),
  ];

  return (
    <div className="section-pad">
      <SectionHeading
        index="06"
        label="Contact"
        headline="Let's work together."
        accentWord="together."
      />

      <div className="page-margin">
        <Reveal>
          <p className="text-label mb-14 text-ink-muted">
            {site.availability} — {site.location.toUpperCase()}
          </p>
        </Reveal>

        <div className="grid grid-cols-12 gap-12">
          <Reveal className="col-span-12 lg:col-span-7">
            <form onSubmit={handleEmailSend} className="space-y-10">
              <div className="grid gap-10 md:grid-cols-2">
                <UnderlineInput
                  index="01"
                  label="Your name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
                <UnderlineInput
                  index="02"
                  label="Your email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@studio.com"
                  autoComplete="email"
                />
              </div>

              <UnderlineInput
                index="03"
                label="Phone (optional)"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 ..."
                autoComplete="tel"
              />

              <UnderlineTextarea
                index="04"
                label="Your message"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your idea..."
              />

              <div className="flex flex-wrap items-center gap-6">
                <PillButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Message →'}
                </PillButton>
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="text-label text-ink-muted transition-colors hover:text-accent"
                >
                  or WhatsApp ↗
                </button>
              </div>
            </form>
          </Reveal>

          <Reveal
            className="col-span-12 lg:col-span-4 lg:col-start-9"
            childSelector="[data-channel-row]"
          >
            <ul>
              {channels.map((c) => (
                <li key={c.label} data-channel-row className="hairline-b">
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-label text-ink-muted">{c.label}</span>
                    <span className="text-label max-w-[60%] truncate text-right text-ink transition-colors group-hover:text-accent">
                      {c.value} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;

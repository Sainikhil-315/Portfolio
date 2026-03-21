
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { toast } = useToast();

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration - Replace with your credentials
      const serviceId = 'service_xw4ez7h';
      const templateId = 'z1tzvuo';
      const publicKey = 'SkEEDLBCgMXsPbWiv';

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        to_email: 'sainikhilmullapudi1604@gmail.com'
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast({
        title: "Email sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
      setShowOptions(false);
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try WhatsApp or email me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const whatsappMessage = `*New Contact Form Submission*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Phone:* ${formData.phone}%0A%0A` +
      `*Message:*%0A${formData.message}`;

    const whatsappNumber = '917093647471';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');

    toast({
      title: "Opening WhatsApp...",
      description: "You'll be redirected to WhatsApp to send your message.",
    });

    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
      setShowOptions(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOptions(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'sainikkilmullapudi1604@gmail.com',
      href: 'mailto:sainikkilmullapudi1604@gmail.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7093647471',
      href: 'tel:+917093647471'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Bhimavaram, Andhra Pradesh',
      href: '#'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-playfair font-bold mb-6">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss your next project or collaboration opportunity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's talk about your project</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'm always interested in hearing about new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  className="flex items-center space-x-4 p-4 premium-border hover-lift glow-effect group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-3 bg-accent rounded-lg group-hover:scale-110 transition-transform">
                    <info.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{info.label}</p>
                    <p className="text-muted-foreground">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass-effect"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-effect"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="glass-effect"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="glass-effect resize-none"
                  placeholder="Tell me about your idea..."
                />
              </div>

              <div className="relative">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full group glow-effect"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </Button>

                {/* Send Options Modal */}
                <AnimatePresence>
                  {showOptions && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                        onClick={() => setShowOptions(false)}
                      />

                      {/* Options Panel */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 right-0 mb-4 space-y-3 z-50"
                      >
                        {/* Email Option */}
                        <motion.button
                          onClick={handleEmailSend}
                          disabled={isSubmitting}
                          className="w-full p-4 bg-white text-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group border-2 border-gray-200 hover:border-gray-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-sm">Send via Email</p>
                              <p className="text-xs text-gray-500">Instant delivery (Recommended)</p>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Direct
                          </div>
                        </motion.button>

                        {/* WhatsApp Option */}
                        <motion.button
                          onClick={handleWhatsAppSend}
                          disabled={isSubmitting}
                          className="w-full p-4 bg-[#25D366] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group border-2 border-[#128C7E] hover:border-[#075E54]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-sm">Send via WhatsApp</p>
                              <p className="text-xs text-green-100">Quick response</p>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                            Chat
                          </div>
                        </motion.button>

                        {/* Cancel Button */}
                        <motion.button
                          onClick={() => setShowOptions(false)}
                          className="w-full p-3 bg-background border-2 border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-t from-primary/5 to-transparent blur-3xl" />
    </section>
  );
};

export default Contact;

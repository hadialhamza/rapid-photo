import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageSquare,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  color: string;
  bgColor: string;
}

interface SocialLink {
  icon?: LucideIcon;
  iconPath?: string;
  href: string;
  label: string;
}

export default function ContactPage() {
  const contactInfo: ContactInfo[] = [
    {
      icon: Mail,
      label: "Email",
      value: "hamzaglory@gmail.com",
      href: "mailto:hamzaglory@gmail.com",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+880 1765-060631",
      href: "tel:+8801765060631",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Rangpur, Bangladesh",
      href: "#",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      iconPath: "/resource/github.svg",
      href: "https://github.com/hadialhamza",
      label: "Github",
    },
    {
      iconPath: "/resource/linkedin.svg",
      href: "https://www.linkedin.com/in/hadihamza",
      label: "Linkedin",
    },
    {
      icon: Globe,
      href: "https://hadialhamza.vercel.app",
      label: "Portfolio",
    },
  ];

  return (
    <main className="flex-1">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Have questions or feedback about Rapid Photo? I&apos;d love to
                hear from you.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Profile Card */}
              <div className="md:col-span-5">
                <AnimatedSection delay={0.1}>
                  <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                    <div className="relative aspect-square w-full">
                      <Image
                        src="https://res.cloudinary.com/djmfhatti/image/upload/v1777656037/hamza_ka05pm.png"
                        alt="MD HADI AL HAMZA"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h2 className="text-2xl font-bold">MD HADI AL HAMZA</h2>
                      <p className="text-primary font-medium mb-4">
                        Full Stack Developer
                      </p>

                      <div className="flex justify-center gap-4">
                        {socialLinks.map((social) => {
                          return (
                            <Link
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center bg-surface/50"
                            >
                              {social.iconPath ? (
                                <div className="relative w-5 h-5 hover:grayscale-0 transition-all">
                                  <Image
                                    src={social.iconPath}
                                    alt={social.label}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : social.icon ? (
                                <social.icon className="w-5 h-5" />
                              ) : null}
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-7 space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <AnimatedSection key={info.label} delay={0.1 + index * 0.1}>
                      <Link
                        href={info.href}
                        className="flex items-center gap-5 p-6 rounded-2xl border border-border/50 bg-surface/30 hover:border-primary/30 transition-all duration-300 group"
                      >
                        <div
                          className={`p-4 rounded-xl ${info.bgColor} ${info.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">
                            {info.label}
                          </p>
                          <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {info.value}
                          </p>
                        </div>
                      </Link>
                    </AnimatedSection>
                  );
                })}

                <AnimatedSection delay={0.4}>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Hire Me / Collaborate
                      </h3>
                      <p className="text-muted mb-6">
                        Looking for a Full Stack Developer for your next
                        project? Let&apos;s build something amazing together.
                      </p>
                      <Link
                        href="https://hadialhamza.vercel.app"
                        target="_blank"
                      >
                        <Button>Visit My Portfolio</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

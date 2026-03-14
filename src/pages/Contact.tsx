import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/Autoflexiiii@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Error sending message. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  const contactCards = [
    {
      icon: Mail,
      title: "Email",
      content: "Autoflexiiii@gmail.com",
      link: "mailto:Autoflexiiii@gmail.com",
      isEmail: true,
    },
    {
      icon: Phone,
      title: "Phone",
      numbers: ["8956967660", "9527806955"],
      isPhone: true,
    },
    {
      icon: MapPin,
      title: "Location",
      content: "India",
      isLocation: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      
      {/* Background animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 py-12 flex-1 max-w-5xl">
        {/* Header */}
        <div className="mb-14 animate-in fade-in duration-500">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" 
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have questions about our services? We're here to help! Reach out to us through any of the methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="space-y-6 animate-in slide-in-from-left duration-500">
            {contactCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={idx}
                  className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:border-accent/50 cursor-pointer"
                  style={{
                    animation: `slideUp 0.5s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-300" />
                  <CardContent className="p-6 space-y-4 relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {card.title}
                      </p>
                      {card.isEmail && (
                        <a
                          href={card.link}
                          className="text-sm text-muted-foreground hover:text-accent transition-colors duration-200 break-all"
                        >
                          {card.content}
                        </a>
                      )}
                      {card.isPhone && (
                        <div className="space-y-2">
                          {card.numbers?.map((num, i) => (
                            <a
                              key={i}
                              href={`tel:${num}`}
                              className="block text-sm text-muted-foreground hover:text-accent transition-colors duration-200 font-medium"
                            >
                              {num}
                            </a>
                          ))}
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            Available 9 AM - 6 PM IST
                          </p>
                        </div>
                      )}
                      {card.isLocation && (
                        <p className="text-sm text-muted-foreground">{card.content}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-in slide-in-from-right duration-500">
            <Card className="border-border/50 overflow-hidden shadow-lg">
              <div className="h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div
                    className="transition-all duration-300 transform"
                    style={{
                      transform: focusedField === "name" ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <Label htmlFor="name" className="text-sm font-semibold mb-2 block">
                      Name <span className="text-accent">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your name"
                      className="transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      required
                    />
                  </div>

                  <div
                    className="transition-all duration-300 transform"
                    style={{
                      transform: focusedField === "email" ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <Label htmlFor="email" className="text-sm font-semibold mb-2 block">
                      Email <span className="text-accent">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="your@email.com"
                      className="transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                      required
                    />
                  </div>

                  <div
                    className="transition-all duration-300 transform"
                    style={{
                      transform: focusedField === "phone" ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <Label htmlFor="phone" className="text-sm font-semibold mb-2 block">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your phone number"
                      className="transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                    />
                  </div>

                  <div
                    className="transition-all duration-300 transform"
                    style={{
                      transform: focusedField === "subject" ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <Label htmlFor="subject" className="text-sm font-semibold mb-2 block">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What is this about?"
                      className="transition-all duration-300 focus:shadow-lg focus:shadow-accent/20"
                    />
                  </div>

                  <div
                    className="transition-all duration-300 transform"
                    style={{
                      transform: focusedField === "message" ? "translateY(-2px)" : "translateY(0)",
                    }}
                  >
                    <Label htmlFor="message" className="text-sm font-semibold mb-2 block">
                      Message <span className="text-accent">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="transition-all duration-300 focus:shadow-lg focus:shadow-accent/20 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    <Send className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-300" />
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-in {
          animation: fadeIn 0.5s ease-out;
        }

        .slide-in-from-left {
          animation: slideInFromLeft 0.5s ease-out;
        }

        .slide-in-from-right {
          animation: slideInFromRight 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;

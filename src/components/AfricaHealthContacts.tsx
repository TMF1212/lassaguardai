import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Phone, ExternalLink, Building2, Heart, Shield } from "lucide-react";

const contacts = [
  {
    name: "NCDC Nigeria",
    role: "Nigeria Centre for Disease Control",
    description: "Nigeria's national public health institute — leads Lassa fever surveillance and response.",
    phone: "+234-6232",
    website: "https://ncdc.gov.ng",
    icon: Shield,
    color: "from-primary/20 to-primary/5 border-primary/30",
    iconColor: "bg-primary/20 text-primary",
  },
  {
    name: "FMOH Nigeria",
    role: "Federal Ministry of Health",
    description: "National health policy and regulation body overseeing Nigeria's health sector response.",
    phone: "+234-9-523-4000",
    website: "https://www.health.gov.ng",
    icon: Building2,
    color: "from-accent/20 to-accent/5 border-accent/30",
    iconColor: "bg-accent/20 text-accent",
  },
  {
    name: "WHO Nigeria",
    role: "World Health Organization — Nigeria",
    description: "WHO country office supporting Nigeria's epidemic preparedness and response capacity.",
    phone: "+234-9-461-5308",
    website: "https://www.who.int/nigeria",
    icon: Globe,
    color: "from-success/20 to-success/5 border-success/30",
    iconColor: "bg-success/20 text-success",
  },
  {
    name: "MSF / Doctors Without Borders",
    role: "Emergency Medical Response",
    description: "Provides emergency medical aid in Lassa fever outbreaks across Nigeria.",
    phone: "+41-22-849-8400",
    website: "https://www.msf.org",
    icon: Heart,
    color: "from-destructive/20 to-destructive/5 border-destructive/30",
    iconColor: "bg-destructive/20 text-destructive",
  },
  {
    name: "NPHCDA",
    role: "National Primary Health Care Development Agency",
    description: "Coordinates primary healthcare delivery and immunization across Nigeria's 36 states and FCT.",
    phone: "+234-9-290-8901",
    website: "https://nphcda.gov.ng",
    icon: Building2,
    color: "from-warning/20 to-warning/5 border-warning/30",
    iconColor: "bg-warning/20 text-warning",
  },
  {
    name: "Nigeria Emergency (112)",
    role: "National Emergency Number",
    description: "Nigeria's national emergency number for immediate assistance including health emergencies.",
    phone: "112",
    website: "https://nema.gov.ng",
    icon: Shield,
    color: "from-primary/20 to-primary/5 border-primary/30",
    iconColor: "bg-primary/20 text-primary",
  },
];

const NigeriaHealthContacts = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Phone className="w-4 h-4" />
            <span>Emergency & Support Contacts</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Nigeria Health Organisations & Contacts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Key organisations leading epidemic prevention and response across Nigeria. Reach out for guidance, reporting, or emergencies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${contact.color} border hover:shadow-lg transition-all duration-300 group`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${contact.iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <contact.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">{contact.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{contact.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{contact.description}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${contact.phone}`}>
                    <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {contact.phone}
                    </Button>
                  </a>
                  <a href={contact.website} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs h-9 gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Website
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NigeriaHealthContacts;

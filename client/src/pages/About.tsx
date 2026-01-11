import { PublicLayout } from '@/components/layout/PublicLayout';
import { Brain, Users, Target, Award, Shield, Zap } from 'lucide-react';

const teamMembers = [
  { name: 'Dr. Sarah Chen', role: 'Chief Medical Officer', specialty: 'Radiology' },
  { name: 'Alex Kumar', role: 'Head of AI Research', specialty: 'Machine Learning' },
  { name: 'Dr. Michael Roberts', role: 'Clinical Advisor', specialty: 'Pulmonology' },
  { name: 'Emily Zhang', role: 'Lead Developer', specialty: 'Full Stack Development' },
];

const values = [
  { icon: Shield, title: 'Patient Safety', description: 'Every algorithm is rigorously tested to ensure accurate and reliable diagnoses that healthcare professionals can trust.' },
  { icon: Brain, title: 'Innovation', description: 'We leverage cutting-edge AI research to continuously improve our diagnostic capabilities and expand disease detection.' },
  { icon: Users, title: 'Accessibility', description: 'Our mission is to make advanced medical imaging analysis accessible to healthcare providers worldwide.' },
  { icon: Zap, title: 'Speed', description: 'Rapid analysis enables faster clinical decisions, potentially saving lives through early detection.' },
];

export default function About() {
  return (
    <PublicLayout>
      
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Target className="h-4 w-4" />
              Our Mission
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Revolutionizing Medical Imaging with AI
            </h1>
            <p className="text-xl text-muted-foreground">
              MedVision AI combines advanced artificial intelligence with medical expertise to provide 
              accurate, explainable, and accessible diagnostic support for healthcare professionals worldwide.
            </p>
          </div>
        </div>
      </section>

      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2023, MedVision AI emerged from a collaboration between leading radiologists 
                  and AI researchers who shared a vision: making expert-level medical imaging analysis 
                  available to every healthcare provider, regardless of location or resources.
                </p>
                <p>
                  Our team recognized that early detection is crucial in treating many diseases, yet access 
                  to specialized radiologists remains limited in many parts of the world. By developing 
                  AI-powered diagnostic tools, we aim to bridge this gap and improve patient outcomes globally.
                </p>
                <p>
                  Today, MedVision AI is trusted by hospitals, clinics, and research institutions across 
                  multiple countries, helping healthcare professionals make faster, more accurate diagnoses 
                  while maintaining full transparency through our explainable AI approach.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-2xl border p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-sm text-muted-foreground">Scans Analyzed</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Partner Hospitals</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at MedVision AI
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-card p-6 rounded-xl border">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experts driving innovation in AI-powered medical imaging
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-card p-6 rounded-xl border text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

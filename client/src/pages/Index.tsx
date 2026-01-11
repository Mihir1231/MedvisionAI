import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, FileImage, Shield, Zap } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import heroBg from '@/assets/hero-image.jpg';

export default function Index() {
  return (
    <PublicLayout>
      
      <section 
        className="py-20 lg:py-32 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              
              AI-Powered Medical Imaging Analysis
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Early Disease Detection with{' '}
              <span className="text-primary">Explainable AI</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload X-ray and CT scan images for instant AI-powered diagnosis. 
              Detect tuberculosis, pneumonia, and bone fractures with contour mapping 
              and detailed explanations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Diagnosing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Powerful Features for Healthcare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for hospitals, clinics, and research institutions with advanced AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">AI Diagnosis</h3>
              <p className="text-muted-foreground">
                Detect tuberculosis, pneumonia, and bone fractures with high accuracy using 
                deep learning models trained on thousands of medical images.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <FileImage className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Contour Mapping</h3>
              <p className="text-muted-foreground">
                Visualize abnormal regions with AI-generated contour maps that highlight 
                areas of concern on X-ray and CT scan images.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Explainable AI</h3>
              <p className="text-muted-foreground">
                Understand why the AI made its diagnosis with detailed explanations, 
                affected regions, and clinical recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const footerLinks = {
  product: [
    { to: '/diagnose', label: 'Diagnose' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/research', label: 'Research' },
    { to: '/news', label: 'News' },
  ],
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4">
              <img src={logo} alt="MedVision AI Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">MedVision AI</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              AI-powered medical imaging analysis for early disease detection. 
              Detect tuberculosis, pneumonia, and bone fractures with explainable AI technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MedVision AI. For research and educational purposes only.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with AI technology for healthcare innovation.
          </p>
        </div>
      </div>
    </footer>
  );
}

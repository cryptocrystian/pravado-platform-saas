
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { PravadoLogo } from '@/components/PravadoLogo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-accent text-white relative z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PravadoLogo variant="full" className="h-12" />
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-secondary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a>
            <a href="#about" className="hover:text-secondary transition-colors">About</a>
            <a href="#contact" className="hover:text-secondary transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-secondary hover:bg-white/10">
              Sign In
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white border-0"
            >
              Start Free Trial
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-accent border-t border-white/10 animate-slide-down">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-secondary transition-colors">Features</a>
              <a href="#pricing" className="block hover:text-secondary transition-colors">Pricing</a>
              <a href="#about" className="block hover:text-secondary transition-colors">About</a>
              <a href="#contact" className="block hover:text-secondary transition-colors">Contact</a>
              <div className="pt-4 space-y-2 border-t border-white/10">
                <Button variant="ghost" className="w-full text-white hover:text-secondary hover:bg-white/10">
                  Sign In
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Start Free Trial
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

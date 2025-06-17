import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Download,
  Presentation,
  FileText,
  Image,
  Palette,
  Settings,
  Eye,
  Share2,
  Play,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Zap,
  CheckCircle,
  Calendar,
  Building
} from 'lucide-react';
import { enterpriseAnalyticsService } from '@/services/enterpriseAnalyticsService';

interface ClientPresentationExportProps {
  tenantId: string;
  reportData?: any;
  onClose: () => void;
  isOpen: boolean;
}

interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  slides: string[];
  duration: string;
  audience: string;
}

interface BrandingConfig {
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  company_name: string;
  website: string;
}

const ClientPresentationExport: React.FC<ClientPresentationExportProps> = ({
  tenantId,
  reportData,
  onClose,
  isOpen
}) => {
  const [exportFormat, setExportFormat] = useState<'powerpoint' | 'pdf' | 'interactive'>('powerpoint');
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>({
    logo_url: '',
    primary_color: '#2563eb',
    secondary_color: '#f97316',
    font_family: 'Inter',
    company_name: 'Your Company',
    website: 'www.yourcompany.com'
  });
  const [selectedSlides, setSelectedSlides] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const presentationTemplates: PresentationTemplate[] = [
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview for C-suite presentations',
      slides: [
        'Title Slide',
        'Executive Summary',
        'Key Performance Metrics',
        'ROI Analysis',
        'Pillar Performance',
        'Key Insights',
        'Recommendations',
        'Next Steps'
      ],
      duration: '15-20 minutes',
      audience: 'C-Suite, Board Members'
    },
    {
      id: 'detailed',
      name: 'Detailed Analysis',
      description: 'Comprehensive analysis for stakeholders',
      slides: [
        'Title Slide',
        'Agenda',
        'Executive Summary',
        'Performance Overview',
        'Content Marketing Results',
        'PR Campaign Impact',
        'SEO Performance',
        'Cross-Pillar Attribution',
        'ROI Deep Dive',
        'Competitive Analysis',
        'Recommendations',
        'Action Plan',
        'Q&A'
      ],
      duration: '30-45 minutes',
      audience: 'Marketing Teams, Stakeholders'
    },
    {
      id: 'client',
      name: 'Client Results',
      description: 'Client-focused results presentation',
      slides: [
        'Welcome',
        'Campaign Overview',
        'Results Summary',
        'Performance Highlights',
        'Content Performance',
        'Media Coverage',
        'SEO Achievements',
        'ROI & Value Delivered',
        'Success Stories',
        'Next Quarter Plan',
        'Thank You'
      ],
      duration: '20-30 minutes',
      audience: 'Clients, External Stakeholders'
    }
  ];

  const slideComponents = {
    'Title Slide': { icon: Presentation, color: 'text-blue-600' },
    'Executive Summary': { icon: BarChart3, color: 'text-green-600' },
    'Key Performance Metrics': { icon: TrendingUp, color: 'text-purple-600' },
    'ROI Analysis': { icon: DollarSign, color: 'text-green-600' },
    'Pillar Performance': { icon: Target, color: 'text-orange-600' },
    'Content Marketing Results': { icon: FileText, color: 'text-blue-600' },
    'PR Campaign Impact': { icon: Users, color: 'text-orange-600' },
    'SEO Performance': { icon: TrendingUp, color: 'text-purple-600' },
    'Cross-Pillar Attribution': { icon: PieChart, color: 'text-indigo-600' },
    'Competitive Analysis': { icon: BarChart3, color: 'text-red-600' },
    'Recommendations': { icon: CheckCircle, color: 'text-green-600' },
    'Next Steps': { icon: Calendar, color: 'text-blue-600' },
    'Action Plan': { icon: Target, color: 'text-orange-600' }
  };

  useEffect(() => {
    if (selectedTemplate) {
      const template = presentationTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        setSelectedSlides(template.slides);
      }
    }
  }, [selectedTemplate]);

  const handleGeneratePresentation = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate presentation generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, this would call the backend service
      console.log('Generating presentation with:', {
        format: exportFormat,
        template: selectedTemplate,
        slides: selectedSlides,
        branding: brandingConfig
      });
      
      // Simulate download
      const fileName = `Client_Presentation_${new Date().toISOString().split('T')[0]}.${exportFormat === 'powerpoint' ? 'pptx' : exportFormat === 'pdf' ? 'pdf' : 'html'}`;
      alert(`Presentation generated successfully! Download started: ${fileName}`);
      
      onClose();
    } catch (error) {
      console.error('Failed to generate presentation:', error);
      alert('Failed to generate presentation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlideToggle = (slide: string) => {
    setSelectedSlides(prev => 
      prev.includes(slide) 
        ? prev.filter(s => s !== slide)
        : [...prev, slide]
    );
  };

  const getSlideIcon = (slideName: string) => {
    const component = slideComponents[slideName as keyof typeof slideComponents];
    return component?.icon || FileText;
  };

  const getSlideColor = (slideName: string) => {
    const component = slideComponents[slideName as keyof typeof slideComponents];
    return component?.color || 'text-gray-600';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Presentation className="h-6 w-6 text-enterprise-blue" />
            <span>Client Presentation Export</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  exportFormat === 'powerpoint' ? 'border-enterprise-blue bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('powerpoint')}
              >
                <div className="text-center">
                  <Presentation className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h4 className="font-medium">PowerPoint</h4>
                  <p className="text-sm text-gray-600">Editable PPTX file</p>
                </div>
              </Card>
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  exportFormat === 'pdf' ? 'border-enterprise-blue bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('pdf')}
              >
                <div className="text-center">
                  <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-medium">PDF</h4>
                  <p className="text-sm text-gray-600">Print-ready format</p>
                </div>
              </Card>
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  exportFormat === 'interactive' ? 'border-enterprise-blue bg-blue-50' : 'hover:border-gray-300'
                }`}
                onClick={() => setExportFormat('interactive')}
              >
                <div className="text-center">
                  <Play className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium">Interactive</h4>
                  <p className="text-sm text-gray-600">Web-based slides</p>
                </div>
              </Card>
            </div>
          </Card>

          {/* Template Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Presentation Template</h3>
            <div className="space-y-4">
              {presentationTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTemplate === template.id ? 'border-enterprise-blue bg-blue-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{template.slides.length} slides</span>
                        <span>•</span>
                        <span>{template.duration}</span>
                        <span>•</span>
                        <span>{template.audience}</span>
                      </div>
                    </div>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="h-5 w-5 text-enterprise-blue" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Slide Customization */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Customize Slides</h3>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {presentationTemplates.find(t => t.id === selectedTemplate)?.slides.map((slide, index) => {
                const IconComponent = getSlideIcon(slide);
                const isSelected = selectedSlides.includes(slide);
                
                return (
                  <Card 
                    key={slide}
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected ? 'border-enterprise-blue bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleSlideToggle(slide)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <IconComponent className={`h-5 w-5 ${getSlideColor(slide)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{slide}</div>
                        <div className="text-xs text-gray-500">Slide {index + 1}</div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-enterprise-blue flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              {selectedSlides.length} of {presentationTemplates.find(t => t.id === selectedTemplate)?.slides.length} slides selected
            </div>
          </Card>

          {/* Branding Configuration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Brand Customization
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={brandingConfig.company_name}
                    onChange={(e) => setBrandingConfig({...brandingConfig, company_name: e.target.value})}
                    placeholder="Your Company Name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={brandingConfig.website}
                    onChange={(e) => setBrandingConfig({...brandingConfig, website: e.target.value})}
                    placeholder="www.yourcompany.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <Input
                    id="logo-url"
                    value={brandingConfig.logo_url}
                    onChange={(e) => setBrandingConfig({...brandingConfig, logo_url: e.target.value})}
                    placeholder="https://yourcompany.com/logo.png"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={brandingConfig.primary_color}
                      onChange={(e) => setBrandingConfig({...brandingConfig, primary_color: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandingConfig.primary_color}
                      onChange={(e) => setBrandingConfig({...brandingConfig, primary_color: e.target.value})}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={brandingConfig.secondary_color}
                      onChange={(e) => setBrandingConfig({...brandingConfig, secondary_color: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandingConfig.secondary_color}
                      onChange={(e) => setBrandingConfig({...brandingConfig, secondary_color: e.target.value})}
                      placeholder="#f97316"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select 
                    value={brandingConfig.font_family} 
                    onValueChange={(value) => setBrandingConfig({...brandingConfig, font_family: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Brand Preview */}
            <div className="mt-6 p-4 border rounded-lg" style={{ 
              borderColor: brandingConfig.primary_color,
              backgroundColor: `${brandingConfig.primary_color}10`
            }}>
              <div className="flex items-center space-x-3">
                {brandingConfig.logo_url && (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold" style={{ 
                    color: brandingConfig.primary_color,
                    fontFamily: brandingConfig.font_family 
                  }}>
                    {brandingConfig.company_name}
                  </h4>
                  <p className="text-sm text-gray-600">{brandingConfig.website}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGeneratePresentation} disabled={isGenerating || selectedSlides.length === 0}>
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Presentation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientPresentationExport;
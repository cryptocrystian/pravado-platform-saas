
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreateExpertiseProfile } from '@/hooks/useHARO';
import { useAuth } from '@/contexts/AuthContext';
import { User, Plus, X, Brain, Target } from 'lucide-react';

export function ExpertiseProfileSetup() {
  const { user } = useAuth();
  const createProfile = useCreateExpertiseProfile();
  
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    title: '',
    company: '',
    bio: '',
    credentials: '',
    contact_email: user?.email || '',
    phone: '',
    website: '',
    linkedin_url: '',
    twitter_handle: '',
  });
  
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  const addItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim()) {
      setter(prev => [...prev, item.trim()]);
      inputSetter('');
    }
  };

  const removeItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProfile.mutateAsync({
        ...formData,
        user_id: user?.id || '',
        expertise_areas: expertiseAreas,
        keywords: keywords,
        industries: industries,
        notification_preferences: {
          email: true,
          in_app: true,
          sms: false
        },
        matching_threshold: 70,
        is_active: true
      });
    } catch (error) {
      console.error('Error creating expertise profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-pravado-purple/10 rounded-full">
            <Brain className="h-8 w-8 text-pravado-purple" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-professional-gray mb-2">Setup Your Expertise Profile</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create your expertise profile to enable AI-powered HARO opportunity matching. 
          The more detailed your profile, the better we can match you with relevant opportunities.
        </p>
      </div>

      <Card className="p-8 bg-white border border-border-gray">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-professional-gray mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Professional Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Marketing Director, CEO, Consultant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Contact Email *</label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Background */}
          <div>
            <h3 className="text-lg font-semibold text-professional-gray mb-4">Professional Background</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Bio / Professional Summary</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Briefly describe your professional background and expertise..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Credentials & Achievements</label>
                <Textarea
                  value={formData.credentials}
                  onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
                  placeholder="List your relevant credentials, certifications, awards, or notable achievements..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Expertise Areas */}
          <div>
            <h3 className="text-lg font-semibold text-professional-gray mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Expertise & Specializations
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Expertise Areas</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="e.g., Digital Marketing, AI Implementation, Business Strategy"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newExpertise, setExpertiseAreas, setNewExpertise))}
                  />
                  <Button 
                    type="button" 
                    onClick={() => addItem(newExpertise, setExpertiseAreas, setNewExpertise)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="bg-enterprise-blue/10 text-enterprise-blue border-enterprise-blue">
                      {area}
                      <button
                        type="button"
                        onClick={() => removeItem(index, setExpertiseAreas)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Keywords</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="e.g., automation, ROI, scaling, technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newKeyword, setKeywords, setNewKeyword))}
                  />
                  <Button 
                    type="button" 
                    onClick={() => addItem(newKeyword, setKeywords, setNewKeyword)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-pravado-purple/10 text-pravado-purple border-pravado-purple">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeItem(index, setKeywords)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-professional-gray mb-2">Industries</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    placeholder="e.g., SaaS, Healthcare, E-commerce, Finance"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newIndustry, setIndustries, setNewIndustry))}
                  />
                  <Button 
                    type="button" 
                    onClick={() => addItem(newIndustry, setIndustries, setNewIndustry)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="bg-pravado-crimson/10 text-pravado-crimson border-pravado-crimson">
                      {industry}
                      <button
                        type="button"
                        onClick={() => removeItem(index, setIndustries)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border-gray">
            <Button type="submit" disabled={createProfile.isPending} className="bg-enterprise-blue hover:bg-enterprise-blue/90">
              {createProfile.isPending ? 'Creating Profile...' : 'Create Expertise Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

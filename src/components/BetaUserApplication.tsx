
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Building, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BetaApplication {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  currentMarketingChallenges: string;
  marketingBudget: string;
  automateExperience: string;
  expectedResults: string;
  commitmentLevel: string;
  referralSource: string;
  agreeToTerms: boolean;
  agreeToFeedback: boolean;
}

export function BetaUserApplication() {
  const { toast } = useToast();
  const [application, setApplication] = useState<BetaApplication>({
    fullName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    industry: '',
    currentMarketingChallenges: '',
    marketingBudget: '',
    automateExperience: '',
    expectedResults: '',
    commitmentLevel: '',
    referralSource: '',
    agreeToTerms: false,
    agreeToFeedback: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and get back to you within 24 hours.",
      });

      // Reset form
      setApplication({
        fullName: '',
        email: '',
        company: '',
        jobTitle: '',
        companySize: '',
        industry: '',
        currentMarketingChallenges: '',
        marketingBudget: '',
        automateExperience: '',
        expectedResults: '',
        commitmentLevel: '',
        referralSource: '',
        agreeToTerms: false,
        agreeToFeedback: false
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = application.fullName && 
                     application.email && 
                     application.company && 
                     application.jobTitle &&
                     application.companySize &&
                     application.currentMarketingChallenges &&
                     application.agreeToTerms &&
                     application.agreeToFeedback;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="w-8 h-8 text-pravado-orange" />
          <h1 className="text-3xl font-bold text-professional-gray">PRAVADO Beta Program</h1>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Join our exclusive beta program and get early access to revolutionary marketing automation
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-pravado-purple text-white">
            <Users className="w-4 h-4 mr-1" />
            Limited Spots
          </Badge>
          <Badge className="bg-pravado-orange text-white">
            <Zap className="w-4 h-4 mr-1" />
            Early Access
          </Badge>
          <Badge className="bg-enterprise-blue text-white">
            <Target className="w-4 h-4 mr-1" />
            Direct Impact
          </Badge>
        </div>
      </div>

      {/* Beta Benefits */}
      <Card className="mb-8 bg-gradient-to-r from-pravado-purple/10 to-pravado-orange/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-professional-gray">Beta Program Benefits</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <Building className="w-8 h-8 text-pravado-purple mx-auto mb-2" />
              <h4 className="font-medium">Enterprise Features</h4>
              <p className="text-sm text-gray-600">Access advanced features before general release</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-pravado-orange mx-auto mb-2" />
              <h4 className="font-medium">Direct Feedback</h4>
              <p className="text-sm text-gray-600">Shape the product with your input</p>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-enterprise-blue mx-auto mb-2" />
              <h4 className="font-medium">Premium Support</h4>
              <p className="text-sm text-gray-600">Priority support and personal onboarding</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Beta Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={application.fullName}
                  onChange={(e) => setApplication(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={application.email}
                  onChange={(e) => setApplication(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@company.com"
                  required
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={application.company}
                  onChange={(e) => setApplication(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company"
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={application.jobTitle}
                  onChange={(e) => setApplication(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Marketing Director"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Company Size *</Label>
                <Select
                  value={application.companySize}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, companySize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Industry</Label>
                <Select
                  value={application.industry}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Marketing Challenges */}
            <div>
              <Label htmlFor="challenges">Current Marketing Challenges *</Label>
              <Textarea
                id="challenges"
                value={application.currentMarketingChallenges}
                onChange={(e) => setApplication(prev => ({ ...prev, currentMarketingChallenges: e.target.value }))}
                placeholder="Describe your biggest marketing challenges and what you hope to achieve with PRAVADO"
                rows={4}
                required
              />
            </div>

            {/* Budget and Experience */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Monthly Marketing Budget</Label>
                <Select
                  value={application.marketingBudget}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, marketingBudget: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<10k">Less than $10k</SelectItem>
                    <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                    <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k+">$100k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>AUTOMATE Methodology Experience</Label>
                <Select
                  value={application.automateExperience}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, automateExperience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Commitment and Referral */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Commitment Level</Label>
                <Select
                  value={application.commitmentLevel}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, commitmentLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light testing (2-4 hours/week)</SelectItem>
                    <SelectItem value="moderate">Moderate testing (5-10 hours/week)</SelectItem>
                    <SelectItem value="heavy">Heavy testing (10+ hours/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>How did you hear about us?</Label>
                <Select
                  value={application.referralSource}
                  onValueChange={(value) => setApplication(prev => ({ ...prev, referralSource: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="events">Industry Events</SelectItem>
                    <SelectItem value="content">Content/Blog</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expected Results */}
            <div>
              <Label htmlFor="expectedResults">Expected Results</Label>
              <Textarea
                id="expectedResults"
                value={application.expectedResults}
                onChange={(e) => setApplication(prev => ({ ...prev, expectedResults: e.target.value }))}
                placeholder="What specific results do you hope to achieve with PRAVADO?"
                rows={3}
              />
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={application.agreeToTerms}
                  onCheckedChange={(checked) => setApplication(prev => ({ ...prev, agreeToTerms: !!checked }))}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the beta program terms and conditions, including NDA requirements *
                </Label>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="feedback"
                  checked={application.agreeToFeedback}
                  onCheckedChange={(checked) => setApplication(prev => ({ ...prev, agreeToFeedback: !!checked }))}
                />
                <Label htmlFor="feedback" className="text-sm">
                  I commit to providing regular feedback and participating in product interviews *
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-pravado-purple hover:bg-pravado-purple/90"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Submitting Application..." : "Apply for Beta Access"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

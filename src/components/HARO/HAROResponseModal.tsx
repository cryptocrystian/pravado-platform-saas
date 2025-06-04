
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useUpdateHAROMatch } from '@/hooks/useHARO';
import { Sparkles, Send, Edit, User, Building, Clock, Target, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface HAROResponseModalProps {
  request: any;
  expertiseProfile: any;
  open: boolean;
  onClose: () => void;
}

export function HAROResponseModal({ request, expertiseProfile, open, onClose }: HAROResponseModalProps) {
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMatch = useUpdateHAROMatch();

  // Simulate AI response generation
  const generateAIResponse = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiResponse = `Dear ${request.journalist_name || 'Editor'},

I hope this email finds you well. I came across your HARO request regarding "${request.subject}" and believe I can provide valuable insights for your article.

About My Expertise:
${expertiseProfile.bio || 'I am an experienced professional in this field with extensive knowledge and practical experience.'}

Relevant Experience:
• ${expertiseProfile.credentials || 'Industry expertise and professional background'}
• ${expertiseProfile.expertise_areas?.join(', ') || 'Specialized knowledge areas'}

Key Insights for Your Article:
Based on your requirements, I can provide specific examples and data points that would be valuable for your readers. I have firsthand experience with the challenges and solutions you're exploring in your piece.

I'm available for a brief phone interview at your convenience and can provide additional supporting materials if needed.

Best regards,
${expertiseProfile.full_name}
${expertiseProfile.title ? `${expertiseProfile.title}${expertiseProfile.company ? ` at ${expertiseProfile.company}` : ''}` : ''}
${expertiseProfile.contact_email || ''}
${expertiseProfile.phone || ''}`;

    setResponse(aiResponse);
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would also send the email
      await updateMatch.mutateAsync({
        id: `mock-${request.id}`, // In real implementation, this would be the actual match ID
        updates: {
          final_response: response,
          submitted: true,
          submitted_at: new Date().toISOString(),
          response_status: 'submitted'
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchReasons = [
    'Expertise in your industry focus areas',
    'Keywords match your content needs',
    'Geographic relevance to your target audience',
    'Previous media experience and credibility'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-pravado-purple" />
            AI-Generated HARO Response
          </DialogTitle>
          <DialogDescription>
            Review and customize your response before submission
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Request Summary */}
          <Card className="p-4 bg-soft-gray border border-border-gray">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-professional-gray">{request.subject}</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Target className="h-3 w-3 mr-1" />
                  85% Match
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {request.journalist_name && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{request.journalist_name}</span>
                  </div>
                )}
                {request.outlet && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{request.outlet}</span>
                  </div>
                )}
                {request.deadline && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{format(new Date(request.deadline), 'MMM dd, HH:mm')}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600">{request.description}</p>
              
              {request.requirements && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-xs font-medium text-professional-gray mb-1">Requirements:</p>
                  <p className="text-sm text-gray-600">{request.requirements}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Match Analysis */}
          <Card className="p-4 border border-border-gray">
            <h4 className="font-semibold text-professional-gray mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Why This is a Good Match
            </h4>
            <div className="space-y-2">
              {matchReasons.map((reason, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Response Generation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-professional-gray">AI-Generated Response</h4>
              <Button 
                onClick={generateAIResponse} 
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate AI Response'}
              </Button>
            </div>

            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder={isGenerating ? 'AI is generating your personalized response...' : 'Click "Generate AI Response" to create a personalized response based on your expertise profile'}
              className="min-h-[300px] resize-none"
              disabled={isGenerating}
            />

            {response && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Response generated and ready for customization
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 border-t pt-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            <Edit className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!response || isSubmitting}
              className="bg-enterprise-blue hover:bg-enterprise-blue/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MessageSquare, Star, Send, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'general';
  rating: number;
  message: string;
  page: string;
  userAgent: string;
  timestamp: string;
}

interface UserFeedbackProps {
  trigger?: React.ReactNode;
  defaultType?: 'bug' | 'feature' | 'improvement' | 'general';
  onSubmit?: (feedback: FeedbackData) => void;
}

export function UserFeedback({ trigger, defaultType = 'general', onSubmit }: UserFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<string>(defaultType);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', description: 'Report an issue or error' },
    { id: 'feature', label: 'Feature Request', description: 'Suggest a new feature' },
    { id: 'improvement', label: 'Improvement', description: 'Suggest an enhancement' },
    { id: 'general', label: 'General Feedback', description: 'Share your thoughts' }
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please provide your feedback message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const feedbackData: FeedbackData = {
      type: type as FeedbackData['type'],
      rating,
      message: message.trim(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    try {
      // In a real app, this would send to your feedback API
      console.log('Feedback submitted:', feedbackData);
      
      // Store in localStorage for development
      const feedback = JSON.parse(localStorage.getItem('pravado-feedback') || '[]');
      feedback.push(feedbackData);
      localStorage.setItem('pravado-feedback', JSON.stringify(feedback));

      if (onSubmit) {
        onSubmit(feedbackData);
      }

      setIsSubmitted(true);
      
      toast({
        title: "Feedback submitted!",
        description: "Thank you for helping us improve PRAVADO.",
      });

      // Reset form after delay
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setMessage('');
        setRating(0);
        setType(defaultType);
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="fixed bottom-20 right-4 z-40 bg-white shadow-lg border-pravado-purple text-pravado-purple hover:bg-pravado-purple hover:text-white"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Feedback
    </Button>
  );

  const triggerElement = trigger ? (
    <div onClick={() => setIsOpen(true)}>{trigger}</div>
  ) : defaultTrigger;

  if (!isOpen) return triggerElement;

  return (
    <>
      {triggerElement}
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <Card className="w-full max-w-md bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-pravado-purple" />
                <span>Share Feedback</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Thank you!
                </h3>
                <p className="text-green-600">
                  Your feedback helps us improve PRAVADO.
                </p>
              </div>
            ) : (
              <>
                {/* Feedback Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    What kind of feedback is this?
                  </Label>
                  <RadioGroup value={type} onValueChange={setType}>
                    {feedbackTypes.map((feedbackType) => (
                      <div key={feedbackType.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={feedbackType.id} id={feedbackType.id} />
                        <Label htmlFor={feedbackType.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{feedbackType.label}</div>
                          <div className="text-xs text-gray-500">{feedbackType.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Rating */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    How would you rate this feature/experience?
                  </Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="feedback-message" className="text-sm font-medium mb-3 block">
                    Your feedback *
                  </Label>
                  <Textarea
                    id="feedback-message"
                    placeholder="Tell us what you think, what could be improved, or report any issues..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Page Info */}
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <div>Page: {window.location.pathname}</div>
                  <div>Browser: {navigator.userAgent.split(' ').slice(-2).join(' ')}</div>
                </div>

                {/* Submit */}
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !message.trim()}
                    className="flex-1 bg-pravado-purple hover:bg-pravado-purple/90"
                  >
                    {isSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Quick feedback buttons for specific actions
interface QuickFeedbackProps {
  context: string;
  onFeedback?: (feedback: { context: string; type: 'helpful' | 'not-helpful'; timestamp: string }) => void;
}

export function QuickFeedback({ context, onFeedback }: QuickFeedbackProps) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    
    const feedbackData = {
      context,
      type,
      timestamp: new Date().toISOString()
    };

    // Store in localStorage
    const quickFeedback = JSON.parse(localStorage.getItem('pravado-quick-feedback') || '[]');
    quickFeedback.push(feedbackData);
    localStorage.setItem('pravado-quick-feedback', JSON.stringify(quickFeedback));

    if (onFeedback) {
      onFeedback(feedbackData);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-gray-600">Was this helpful?</span>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback('helpful')}
          className={`h-6 px-2 ${feedback === 'helpful' ? 'bg-green-100 text-green-800' : ''}`}
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFeedback('not-helpful')}
          className={`h-6 px-2 ${feedback === 'not-helpful' ? 'bg-red-100 text-red-800' : ''}`}
        >
          👎
        </Button>
      </div>
      {feedback && (
        <span className="text-xs text-gray-500 ml-2">
          Thanks for your feedback!
        </span>
      )}
    </div>
  );
}

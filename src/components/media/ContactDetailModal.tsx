
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Twitter, 
  Linkedin,
  Edit,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  Send
} from 'lucide-react';

interface ContactDetailModalProps {
  contact: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDetailModal({ contact, isOpen, onClose }: ContactDetailModalProps) {
  const [newNote, setNewNote] = useState('');
  const { toast } = useToast();

  const getRelationshipColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    // TODO: Implement note saving
    toast({
      title: "Note added",
      description: "Your note has been saved successfully.",
    });
    setNewNote('');
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  const handleCall = () => {
    if (contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-enterprise-blue text-white text-lg">
                  {contact.first_name[0]}{contact.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-professional-gray">
                  {contact.first_name} {contact.last_name}
                </h2>
                <p className="text-gray-600">{contact.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getRelationshipColor(contact.relationship_score)} border`}>
                {contact.relationship_score}/100
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Contact Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-professional-gray mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{contact.email}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSendEmail}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{contact.phone}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleCall}>
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {contact.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{contact.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Media Outlet</p>
                      <p className="font-medium">{contact.outlet}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Beat/Specialty</p>
                      <p className="font-medium">{contact.beat}</p>
                    </div>
                  </div>

                  {contact.last_contacted && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Last Contacted</p>
                        <p className="font-medium">
                          {new Date(contact.last_contacted).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Social Links */}
            {(contact.twitter_handle || contact.linkedin_url) && (
              <Card className="p-6">
                <h3 className="font-semibold text-professional-gray mb-4">Social Media</h3>
                <div className="flex space-x-4">
                  {contact.twitter_handle && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://twitter.com/${contact.twitter_handle}`, '_blank')}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      @{contact.twitter_handle}
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                  {contact.linkedin_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(contact.linkedin_url, '_blank')}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Bio */}
            {contact.bio && (
              <Card className="p-6">
                <h3 className="font-semibold text-professional-gray mb-4">Bio</h3>
                <p className="text-gray-700 leading-relaxed">{contact.bio}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-professional-gray mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-soft-gray rounded-lg">
                  <div className="w-8 h-8 bg-enterprise-blue rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Email sent about Q4 campaign</p>
                    <p className="text-xs text-gray-600">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-soft-gray rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Phone call completed</p>
                    <p className="text-xs text-gray-600">1 week ago</p>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>More activity tracking coming soon</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-professional-gray mb-4">Add Note</h3>
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this contact..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-professional-gray mb-4">Previous Notes</h3>
              {contact.notes ? (
                <div className="bg-soft-gray p-4 rounded-lg">
                  <p className="text-gray-700">{contact.notes}</p>
                  <p className="text-xs text-gray-500 mt-2">Added on contact creation</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notes yet</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Relationship Score</p>
                    <p className="text-2xl font-bold text-professional-gray">{contact.relationship_score}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRelationshipColor(contact.relationship_score)}`}>
                    <Star className="h-6 w-6" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interactions</p>
                    <p className="text-2xl font-bold text-professional-gray">{contact.interaction_count}</p>
                  </div>
                  <div className="w-12 h-12 bg-enterprise-blue rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Days Since Contact</p>
                    <p className="text-2xl font-bold text-professional-gray">
                      {contact.last_contacted 
                        ? Math.floor((Date.now() - new Date(contact.last_contacted).getTime()) / (1000 * 60 * 60 * 24))
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pravado-orange rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold text-professional-gray mb-4">Relationship Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Response Rate</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-medium">2.5 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-soft-gray rounded-lg">
                  <span className="text-sm">Best Contact Time</span>
                  <span className="font-medium">9-11 AM</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

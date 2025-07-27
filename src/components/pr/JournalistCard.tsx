import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  ShieldAlert,
  Twitter,
  Linkedin,
  TrendingUp,
  Star,
  Award,
  Zap,
  Globe,
  Headphones,
  Video,
  Sparkles,
  Timer,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedJournalistContact } from '@/hooks/useJournalists';

interface JournalistCardProps {
  journalist: EnhancedJournalistContact;
  onContact?: (method: string) => void;
  onViewDetails?: () => void;
  className?: string;
}

const tierConfig = {
  platinum: { color: 'bg-purple-500', textColor: 'text-purple-700', icon: Sparkles, label: 'Platinum' },
  gold: { color: 'bg-yellow-500', textColor: 'text-yellow-700', icon: Award, label: 'Gold' },
  silver: { color: 'bg-gray-400', textColor: 'text-gray-700', icon: Star, label: 'Silver' },
  bronze: { color: 'bg-orange-600', textColor: 'text-orange-700', icon: Circle, label: 'Bronze' },
};

const mediaCategoryConfig = {
  traditional_media: { color: 'bg-blue-500', icon: Globe, label: 'Traditional Media' },
  digital_first: { color: 'bg-green-500', icon: Zap, label: 'Digital First' },
  podcast_audio: { color: 'bg-purple-500', icon: Headphones, label: 'Podcast/Audio' },
  creator_economy: { color: 'bg-pink-500', icon: Video, label: 'Creator Economy' },
};

const verificationStatusConfig = {
  verified: { color: 'text-green-600', icon: ShieldCheck, label: 'Verified' },
  unverified: { color: 'text-gray-500', icon: Shield, label: 'Unverified' },
  needs_review: { color: 'text-yellow-600', icon: ShieldAlert, label: 'Needs Review' },
  invalid: { color: 'text-red-600', icon: ShieldX, label: 'Invalid' },
};

const expertiseLevelConfig = {
  expert: { color: 'bg-purple-100 text-purple-800', icon: Award, label: 'Expert' },
  regular: { color: 'bg-blue-100 text-blue-800', icon: Star, label: 'Regular' },
  occasional: { color: 'bg-gray-100 text-gray-800', icon: Circle, label: 'Occasional' },
};

export function JournalistCard({ journalist, onContact, onViewDetails, className }: JournalistCardProps) {
  const tier = journalist.dynamic_tier || journalist.static_tier || 'bronze';
  const tierInfo = tierConfig[tier as keyof typeof tierConfig] || tierConfig.bronze;
  const TierIcon = tierInfo.icon;

  const mediaCategory = journalist.media_category || 'traditional_media';
  const mediaCategoryInfo = mediaCategoryConfig[mediaCategory as keyof typeof mediaCategoryConfig] || mediaCategoryConfig.traditional_media;
  const MediaIcon = mediaCategoryInfo.icon;

  const verificationStatus = journalist.verification_status || 'unverified';
  const verificationInfo = verificationStatusConfig[verificationStatus as keyof typeof verificationStatusConfig] || verificationStatusConfig.unverified;
  const VerificationIcon = verificationInfo.icon;

  const expertiseLevel = journalist.beat_expertise_level || 'occasional';
  const expertiseInfo = expertiseLevelConfig[expertiseLevel as keyof typeof expertiseLevelConfig] || expertiseLevelConfig.occasional;
  const ExpertiseIcon = expertiseInfo.icon;

  const successRate = journalist.success_rate || 0;
  const responseRate = (journalist.response_rate || 0) * 100;
  const engagementRate = (journalist.engagement_rate || 0) * 100;
  const avgResponseTime = journalist.avg_response_time_hours || 48;

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  };

  const formatResponseTime = (hours: number) => {
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200 overflow-hidden", className)}>
      <div className={cn("h-2", tierInfo.color)} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={journalist.profile_image_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(journalist.first_name, journalist.last_name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {journalist.first_name} {journalist.last_name}
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <VerificationIcon className={cn("h-4 w-4", verificationInfo.color)} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{verificationInfo.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <p className="text-sm text-muted-foreground">{journalist.title || 'Journalist'}</p>
              <p className="text-sm font-medium">{journalist.outlet}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge className={cn("gap-1", tierInfo.textColor, "bg-opacity-10")}>
              <TierIcon className="h-3 w-3" />
              {tierInfo.label}
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <MediaIcon className="h-3 w-3" />
              {mediaCategoryInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Relationship</span>
              <span className="text-xs font-medium">{Math.round(journalist.relationship_score || 0)}</span>
            </div>
            <Progress value={journalist.relationship_score || 0} className="h-1.5" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Authority</span>
              <span className="text-xs font-medium">{Math.round(journalist.authority_score || 0)}</span>
            </div>
            <Progress value={journalist.authority_score || 0} className="h-1.5" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">AI Score</span>
              <span className="text-xs font-medium">{Math.round(journalist.ai_score || 0)}</span>
            </div>
            <Progress value={journalist.ai_score || 0} className="h-1.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{successRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{responseRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Response Rate</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{engagementRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Engagement</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatResponseTime(avgResponseTime)}</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("gap-1", expertiseInfo.color)}>
                <ExpertiseIcon className="h-3 w-3" />
                {journalist.beat} {expertiseInfo.label}
              </Badge>
            </div>
            
            {journalist.days_since_contact !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {journalist.days_since_contact === 0 
                  ? 'Today' 
                  : `${journalist.days_since_contact}d ago`}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{journalist.timezone || 'Unknown TZ'}</span>
            </div>
            
            <div className="flex gap-1">
              {journalist.total_interactions && journalist.total_interactions > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{journalist.successful_pitches || 0}</span>
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span>{journalist.declined_pitches || 0}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pitch History: {journalist.successful_pitches || 0} successful, {journalist.declined_pitches || 0} declined</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>

        {journalist.engagement_trend && (
          <div className="flex items-center justify-center">
            <Badge 
              variant={journalist.engagement_trend === 'increasing' ? 'default' : journalist.engagement_trend === 'declining' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              Engagement {journalist.engagement_trend}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-3">
        <div className="flex gap-1">
          {journalist.twitter_handle && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => window.open(`https://twitter.com/${journalist.twitter_handle}`, '_blank')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>@{journalist.twitter_handle}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {journalist.linkedin_url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => window.open(journalist.linkedin_url!, '_blank')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View LinkedIn Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex gap-2">
          {journalist.preferred_contact_method === 'email' && journalist.email && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => onContact?.('email')}
            >
              <Mail className="h-3 w-3" />
              Email
            </Button>
          )}
          
          {journalist.preferred_contact_method === 'phone' && journalist.phone && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => onContact?.('phone')}
            >
              <Phone className="h-3 w-3" />
              Call
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Globe, 
  BarChart3, 
  TrendingUp, 
  Settings,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useCreateSEOProject } from '@/hooks/useSEOData';

interface SEOProjectManagementProps {
  projects: any[];
  selectedProject: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function SEOProjectManagement({ 
  projects, 
  selectedProject, 
  onSelectProject 
}: SEOProjectManagementProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    domain: ''
  });

  const createProject = useCreateSEOProject();

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.domain) return;

    await createProject.mutateAsync({
      name: newProject.name,
      domain: newProject.domain
    });

    setNewProject({ name: '', domain: '' });
    setIsCreateModalOpen(false);
  };

  const getProjectHealthScore = (project: any) => {
    // Mock calculation - in real app would be based on actual audit data
    return Math.floor(Math.random() * 40) + 60; // 60-100 range
  };

  const getAutomateStepStatus = (project: any) => {
    // Mock AUTOMATE step completion for each project
    const steps = [
      { code: 'A', name: 'Assess', completed: true },
      { code: 'T', name: 'Target', completed: true },
      { code: 'O', name: 'Optimize', completed: false },
      { code: 'M', name: 'Monitor', completed: true },
      { code: 'T', name: 'Transform', completed: false }
    ];
    
    const completedSteps = steps.filter(s => s.completed).length;
    return { steps, progress: (completedSteps / steps.length) * 100 };
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Project */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-professional-gray">SEO Project Management</h3>
          <p className="text-sm text-gray-600">Manage your SEO projects with AUTOMATE methodology integration</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New SEO Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name..."
                />
              </div>
              <div>
                <Label htmlFor="project-domain">Domain</Label>
                <Input
                  id="project-domain"
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                  placeholder="example.com"
                />
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProject.name || !newProject.domain || createProject.isPending}
                  className="flex-1"
                >
                  {createProject.isPending ? 'Creating...' : 'Create Project'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AUTOMATE Integration Notice */}
      <Card className="bg-gradient-to-r from-pravado-purple/10 to-enterprise-blue/10 border-l-4 border-l-pravado-purple">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-5 h-5 text-pravado-purple" />
            <div>
              <div className="font-medium text-professional-gray">AUTOMATE Methodology Integration</div>
              <div className="text-sm text-gray-600">
                Each SEO project automatically tracks progress through the AUTOMATE framework for systematic optimization
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const healthScore = getProjectHealthScore(project);
            const automateStatus = getAutomateStepStatus(project);
            
            return (
              <Card 
                key={project.id} 
                className={`border cursor-pointer transition-all hover:shadow-lg ${
                  selectedProject === project.id ? 'ring-2 ring-pravado-purple' : ''
                }`}
                onClick={() => onSelectProject(
                  selectedProject === project.id ? null : project.id
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{project.domain}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Health Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Site Health Score</span>
                    <span className={`text-lg font-bold ${
                      healthScore >= 80 ? 'text-green-600' : 
                      healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {healthScore}%
                    </span>
                  </div>

                  {/* AUTOMATE Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AUTOMATE Progress</span>
                      <span className="text-sm text-pravado-purple font-medium">
                        {Math.round(automateStatus.progress)}%
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {automateStatus.steps.map((step, idx) => (
                        <div 
                          key={idx}
                          className={`flex-1 h-2 rounded ${
                            step.completed ? 'bg-pravado-purple' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-soft-gray rounded p-2">
                      <BarChart3 className="w-4 h-4 mx-auto text-enterprise-blue mb-1" />
                      <div className="text-xs text-gray-600">Keywords</div>
                      <div className="text-sm font-medium">0</div>
                    </div>
                    <div className="bg-soft-gray rounded p-2">
                      <TrendingUp className="w-4 h-4 mx-auto text-pravado-orange mb-1" />
                      <div className="text-xs text-gray-600">Avg. Rank</div>
                      <div className="text-sm font-medium">-</div>
                    </div>
                    <div className="bg-soft-gray rounded p-2">
                      <Settings className="w-4 h-4 mx-auto text-pravado-purple mb-1" />
                      <div className="text-xs text-gray-600">Audits</div>
                      <div className="text-sm font-medium">0</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No SEO Projects Yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first SEO project to start tracking your website's performance with the AUTOMATE methodology
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Project Details */}
      {selectedProject && (
        <Card className="border-l-4 border-l-pravado-purple bg-pravado-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-pravado-purple" />
              <span>Selected Project</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              Project "{projects.find(p => p.id === selectedProject)?.name}" is now active. 
              All SEO activities will be tracked within this project's AUTOMATE methodology framework.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

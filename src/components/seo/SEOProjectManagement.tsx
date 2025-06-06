
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Globe, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useCreateSEOProject, type SEOProject } from '@/hooks/useSEOData';

interface SEOProjectManagementProps {
  projects: SEOProject[];
  selectedProject: string | null;
  onSelectProject: (projectId: string) => void;
}

export function SEOProjectManagement({ projects, selectedProject, onSelectProject }: SEOProjectManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', domain: '', status: 'active' });
  const createProject = useCreateSEOProject();

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.domain) return;
    
    try {
      await createProject.mutateAsync(newProject);
      setNewProject({ name: '', domain: '', status: 'active' });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'paused': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO Project Management</h2>
          <p className="text-gray-600">Manage your SEO projects and domain tracking</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New SEO Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New SEO Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newProject.status} onValueChange={(value) => setNewProject({ ...newProject, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleCreateProject} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createProject.isPending}
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedProject === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => onSelectProject(project.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {project.name}
                </CardTitle>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(project.status)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{project.domain}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                <div className="text-xs text-gray-500">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">-</div>
                  <div className="text-xs text-gray-600">Keywords</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">-</div>
                  <div className="text-xs text-gray-600">Avg. Position</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {projects.length === 0 && (
          <Card className="col-span-full border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No SEO Projects Yet</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Create your first SEO project to start tracking your website's performance
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

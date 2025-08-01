import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/task";

export interface ProjectFormData {
  name: string;
  description: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectFormData) => void;
  isCreating?: boolean;
  isSaving?: boolean;
}

export function ProjectModal({ project, isOpen, onClose, onSave, isCreating, isSaving = false }: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  useEffect(() => {
    if (isOpen) {
      if (project && !isCreating) {
        setFormData({
          name: project.name,
          description: project.description
        });
      } else {
        setFormData({
          name: '',
          description: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, project, isCreating]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? 'Create New Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription>
            {isCreating ? 'Add a new project to the system.' : 'Edit project details.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description"
              rows={3}
            />
            {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 mr-2 border-b-2 border-current" />
                Saving...
              </>
            ) : (
              isCreating ? 'Create Project' : 'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
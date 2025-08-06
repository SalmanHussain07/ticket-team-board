import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, Holiday } from "@/types/task";
import { calculateEstimatedHours } from "@/lib/business-days";

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectFormData) => void;
  holidays: Holiday[];
  isCreating?: boolean;
  isSaving?: boolean;
}

export function ProjectModal({ project, isOpen, onClose, onSave, holidays, isCreating, isSaving = false }: ProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    estimatedHours: 0
  });
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  useEffect(() => {
    if (isOpen) {
      if (project && !isCreating) {
        setFormData({
          name: project.name,
          description: project.description,
          startDate: project.startDate,
          endDate: project.endDate,
          estimatedHours: project.estimatedHours
        });
      } else {
        const defaultStartDate = new Date();
        const defaultEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const estimatedHours = calculateEstimatedHours(defaultStartDate, defaultEndDate, holidays);
        
        setFormData({
          name: '',
          description: '',
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          estimatedHours
        });
      }
      setErrors({});
    }
  }, [isOpen, project, isCreating, holidays]);

  // Recalculate estimated hours when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.endDate > formData.startDate) {
      const estimatedHours = calculateEstimatedHours(formData.startDate, formData.endDate, holidays);
      setFormData(prev => ({ ...prev, estimatedHours }));
    }
  }, [formData.startDate, formData.endDate, holidays]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    // if (formData.endDate <= formData.startDate) {
    //   newErrors.endDate = 'End date must be after start date';
    // }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                    disabled={(date) => date <= formData.startDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              {/* {errors.endDate && <span className="text-sm text-destructive">{errors.endDate}</span>} */}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              readOnly
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Calculated automatically based on working days (8 hours/day, excluding weekends and holidays)
            </p>
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
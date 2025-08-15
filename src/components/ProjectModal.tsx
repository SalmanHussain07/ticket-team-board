import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectFormData } from "@/types/task";
import { Product } from "@/types/product";
import { calculateBusinessDays } from "@/lib/business-days";
import { toast } from "sonner";

interface ProjectModalProps {
  mode: 'create' | 'edit';
  project?: Project;
  products: Product[];
  onSave: (data: ProjectFormData) => void;
  trigger: React.ReactNode;
}

export function ProjectModal({ mode, project, products, onSave, trigger }: ProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    productId: project?.productId || '',
    startDate: project?.startDate || new Date(),
    endDate: project?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    estimatedHours: project?.estimatedHours || 0
  });

  const calculateHours = () => {
    if (formData.startDate && formData.endDate && formData.endDate >= formData.startDate) {
      const businessDays = calculateBusinessDays(formData.startDate, formData.endDate, []);
      const hours = businessDays * 8; // 8 hours per day
      setFormData(prev => ({ ...prev, estimatedHours: hours }));
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setFormData(prev => {
        const newData = { ...prev, [field]: date };
        
        // Recalculate hours when dates change
        if (newData.startDate && newData.endDate && newData.endDate >= newData.startDate) {
          const businessDays = calculateBusinessDays(newData.startDate, newData.endDate, []);
          newData.estimatedHours = businessDays * 8;
        }
        
        return newData;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!formData.productId) {
      toast.error("Please select a product");
      return;
    }

    if (formData.endDate <= formData.startDate) {
      toast.error("End date must be after start date");
      return;
    }

    onSave(formData);
    setOpen(false);
    
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        productId: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estimatedHours: 0
      });
    }
    
    toast.success(`Project ${mode === 'create' ? 'created' : 'updated'} successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Enter the details for the new project. Estimated hours are calculated automatically.'
              : 'Update the project information.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select 
              value={formData.productId} 
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    disabled={(date) => date < formData.startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <Input
              id="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              readOnly
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground">
              Calculated automatically based on business days (8 hours/day, excluding weekends and holidays)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create Project' : 'Update Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
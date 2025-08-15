import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Holiday, HolidayFormData } from "@/types/task";
import { toast } from "sonner";

interface HolidayModalProps {
  mode: 'create' | 'edit';
  holiday?: Holiday;
  onSave: (data: HolidayFormData) => void;
  trigger: React.ReactNode;
}

export function HolidayModal({ mode, holiday, onSave, trigger }: HolidayModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<HolidayFormData>({
    name: holiday?.name || '',
    date: holiday?.date || new Date()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Holiday name is required");
      return;
    }

    onSave(formData);
    setOpen(false);
    
    if (mode === 'create') {
      setFormData({ name: '', date: new Date() });
    }
    
    toast.success(`Holiday ${mode === 'create' ? 'created' : 'updated'} successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Holiday' : 'Edit Holiday'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new company holiday or non-working day.'
              : 'Update the holiday information.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Holiday Name</Label>
            <Input
              id="name"
              placeholder="Enter holiday name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData({ ...formData, date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
              {mode === 'create' ? 'Create Holiday' : 'Update Holiday'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
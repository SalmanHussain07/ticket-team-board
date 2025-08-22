import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Holiday, HolidayFormData } from "@/types/task";

interface HolidayModalProps {
  holiday: Holiday | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (holidayData: HolidayFormData) => void;
  isCreating?: boolean;
  isSaving?: boolean;
}

export function HolidayModal({ holiday, isOpen, onClose, onSave, isCreating, isSaving = false }: HolidayModalProps) {
  const [formData, setFormData] = useState<HolidayFormData>({
    name: '',
    date: new Date()
  });
  const [errors, setErrors] = useState<Partial<HolidayFormData>>({});

  useEffect(() => {
    if (isOpen) {
      if (holiday && !isCreating) {
        setFormData({
          name: holiday.name,
          date: holiday.date
        });
      } else {
        setFormData({
          name: '',
          date: new Date()
        });
      }
      setErrors({});
    }
  }, [isOpen, holiday, isCreating]);

  const validateForm = (): boolean => {
    const newErrors: Partial<HolidayFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Holiday name is required';
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
            {isCreating ? 'Add Gazetted Holiday' : 'Edit Holiday'}
          </DialogTitle>
          <DialogDescription>
            {isCreating ? 'Add a new gazetted holiday to the system.' : 'Edit holiday details.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Holiday Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter holiday name"
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
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
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
              isCreating ? 'Add Holiday' : 'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { HolidayModal } from "@/components/HolidayModal";
import { Holiday, HolidayFormData } from "@/types/task";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Holidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: "1",
      name: "New Year's Day",
      date: new Date("2024-01-01")
    },
    {
      id: "2",
      name: "Independence Day",
      date: new Date("2024-07-04")
    },
    {
      id: "3",
      name: "Christmas Day",
      date: new Date("2024-12-25")
    }
  ]);

  const handleCreateHoliday = (data: HolidayFormData) => {
    const newHoliday: Holiday = {
      id: Date.now().toString(),
      ...data
    };
    setHolidays([...holidays, newHoliday]);
  };

  const handleUpdateHoliday = (id: string, data: HolidayFormData) => {
    setHolidays(holidays.map(holiday => 
      holiday.id === id 
        ? { ...holiday, ...data }
        : holiday
    ));
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
    toast.success("Holiday deleted successfully");
  };

  const upcomingHolidays = holidays
    .filter(holiday => holiday.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Holidays</h1>
          <p className="text-muted-foreground">
            Manage company holidays and non-working days
          </p>
        </div>
        
        <HolidayModal
          mode="create"
          onSave={handleCreateHoliday}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Holidays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holiday Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Day of Week</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No holidays found. Add your first holiday to get started.
                  </TableCell>
                </TableRow>
              ) : (
                holidays
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map((holiday) => {
                    const isPast = holiday.date < new Date();
                    const isToday = format(holiday.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    
                    return (
                      <TableRow key={holiday.id}>
                        <TableCell className="font-medium">{holiday.name}</TableCell>
                        <TableCell>{format(holiday.date, "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(holiday.date, "EEEE")}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={isToday ? "default" : isPast ? "secondary" : "outline"}
                          >
                            {isToday ? "Today" : isPast ? "Past" : "Upcoming"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <HolidayModal
                              mode="edit"
                              holiday={holiday}
                              onSave={(data) => handleUpdateHoliday(holiday.id, data)}
                              trigger={
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                            />
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Holiday</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{holiday.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteHoliday(holiday.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Holidays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {holidays.filter(h => h.date.getFullYear() === new Date().getFullYear()).length}
            </div>
            <p className="text-xs text-muted-foreground">Current year holidays</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Next Holiday</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingHolidays.length > 0 ? (
              <div>
                <div className="font-medium">{upcomingHolidays[0].name}</div>
                <p className="text-xs text-muted-foreground">
                  {format(upcomingHolidays[0].date, "MMM dd, yyyy")}
                </p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No upcoming holidays</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
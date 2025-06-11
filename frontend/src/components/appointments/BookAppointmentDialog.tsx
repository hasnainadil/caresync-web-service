
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Doctor, Hospital } from '@/types';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BookAppointmentDialogProps {
  doctor: Doctor;
  hospital: Hospital;
  isOpen: boolean;
  onClose: () => void;
}

const BookAppointmentDialog: React.FC<BookAppointmentDialogProps> = ({
  doctor,
  hospital,
  isOpen,
  onClose,
}) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select both date and time.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      const appointmentDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      await apiClient.bookAppointment({
        doctor_hospital_id: doctor.id, // This would be the actual doctor-hospital relationship ID
        appointment_time: appointmentDateTime.toISOString(),
      });

      toast({
        title: "Appointment booked",
        description: `Your appointment with ${doctor.name} has been scheduled.`,
      });

      onClose();
      setDate(undefined);
      setTime('');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again or choose a different time.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            Schedule an appointment with {doctor.name} at {hospital.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="09:00"
              max="17:00"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Appointment Details</h4>
            <p><strong>Doctor:</strong> {doctor.name}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Hospital:</strong> {hospital.name}</p>
            {date && time && (
              <p><strong>Time:</strong> {format(date, "PPP")} at {time}</p>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={isBooking} className="flex-1">
              {isBooking ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;

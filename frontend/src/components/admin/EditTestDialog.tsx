import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api_dummy';
import { DiagnosticTest } from '@/types';
import { Pencil } from 'lucide-react';

const testSchema = z.object({
  name: z.string().min(3, 'Test name must be at least 3 characters long'),
  description: z.string().optional(),
  cost: z.coerce.number().min(0, 'Cost must be a positive number'),
  availability: z.string().min(1, 'Availability is required'),
});

interface EditTestDialogProps {
  hospitalId: string;
  test: DiagnosticTest;
  onTestUpdated: () => void;
}

const EditTestDialog: React.FC<EditTestDialogProps> = ({ hospitalId, test, onTestUpdated }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: test.name,
      description: test.description,
      cost: test.cost,
      availability: test.availability,
    },
  });

  const onSubmit = async (values: z.infer<typeof testSchema>) => {
    try {
      await apiClient.updateTest(hospitalId, test.id.toString(), values);
      toast({
        title: 'Test Updated',
        description: `The "${values.name}" test has been successfully updated.`,
      });
      onTestUpdated();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update the test. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Diagnostic Test</DialogTitle>
          <DialogDescription>
            Update the details for this test. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MRI Scan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mon-Fri, 9am-5pm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the test and its purpose."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTestDialog; 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trash, Edit } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Rating, FEEDBACK_TARGET_TYPE } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RatingFormProps {
  hospitalId: number;
  onRatingAdded: () => void;
  existingRating?: Rating;
}

const RatingForm: React.FC<RatingFormProps> = ({ hospitalId, onRatingAdded, existingRating }) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [reviewText, setReviewText] = useState(existingRating?.review_text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingRating) {
        await apiClient.updateFeedback(existingRating.id, {
          userId: user?.uid || '',
          rating,
          comment: reviewText,
        });
        toast({
          title: "Review updated",
          description: "Your review has been updated successfully!",
        });
      } else {
        await apiClient.addFeedback({
          userId: user?.uid || '',
          targetType: FEEDBACK_TARGET_TYPE.HOSPITAL,
          targetId: hospitalId,
          rating,
          comment: reviewText,
        });
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
      }
      
      setRating(0);
      setReviewText('');
      onRatingAdded();
    } catch (error) {
      toast({
        title: existingRating ? "Failed to update review" : "Failed to submit review",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingRating) return;

    try {
      await apiClient.deleteFeedbackById(existingRating.id, user?.uid || '');
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully.",
      });
      onRatingAdded();
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Failed to delete review",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Please login to submit a review for this hospital.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className='p-4 pb-3 pl-6'>
          <CardTitle className="flex justify-between items-center">
            <span>{existingRating ? 'Edit Your Review' : 'Write a Review'}</span>
            {existingRating && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-3 w-full'>
          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <div>
              <label className="block text-sm font-medium mb-1 pl-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Review</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this hospital..."
                rows={4}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : existingRating ? 'Update Review' : 'Submit Review'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Yes, Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RatingForm;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface SessionRatingFormProps {
  sessionId: number;
  sessionTitle: string;
}

export function SessionRatingForm({ sessionId, sessionTitle }: SessionRatingFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [studentName, setStudentName] = useState(user?.name || "");
  const [submitted, setSubmitted] = useState(false);

  const { data: ratings } = trpc.sessionRatings.getBySession.useQuery({ sessionId });
  const { data: averageData } = trpc.sessionRatings.average.useQuery({ sessionId });

  const addRatingMutation = trpc.sessionRatings.create.useMutation({
    onSuccess: () => {
      toast.success("شكراً لتقييمك!");
      setSubmitted(true);
      setRating(0);
      setReview("");
      // Invalidate queries to refetch
      trpc.useUtils().sessionRatings.getBySession.invalidate({ sessionId });
      trpc.useUtils().sessionRatings.average.invalidate({ sessionId });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("الرجاء اختيار تقييم بالنجوم");
      return;
    }
    addRatingMutation.mutate({
      sessionId,
      rating,
      review: review.trim() || undefined,
      studentName: !user && studentName.trim() ? studentName.trim() : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      {averageData && averageData.count > 0 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>تقييم الحصة</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageData.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold">{averageData.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({averageData.count} تقييم)</span>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Rating Form */}
      {!submitted ? (
        <Card>
          <CardHeader>
            <CardTitle>قيّم هذه الحصة</CardTitle>
            <CardDescription>شاركنا رأيك في حصة "{sessionTitle}"</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm font-medium mb-3">اختر التقييم</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input (for non-logged in users) */}
              {!user && (
                <div>
                  <Label htmlFor="studentName">الاسم (اختياري)</Label>
                  <Input
                    id="studentName"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="mt-2"
                  />
                </div>
              )}

              {/* Review Textarea */}
              <div>
                <Label htmlFor="review">تعليقك (اختياري)</Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="شاركنا رأيك حول الحصة..."
                  rows={4}
                  className="resize-none mt-2"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={addRatingMutation.isPending}
              >
                {addRatingMutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center">
            <p className="text-green-900 font-semibold">تم إرسال تقييمك بنجاح! شكراً لك.</p>
          </CardContent>
        </Card>
      )}

      {/* Previous Ratings */}
      {ratings && ratings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>التقييمات السابقة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {rating.studentName || "طالب"}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rating.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                {rating.review && (
                  <p className="text-sm text-muted-foreground">{rating.review}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function SiteRatingForm() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");


  const { data: averageRating } = trpc.siteRatings.average.useQuery();
  const addRatingMutation = trpc.siteRatings.create.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال تقييمك بنجاح");
      setRating(0);
      setComment("");
      setUserName("");
      // Invalidate query to refetch average
      trpc.useUtils().siteRatings.average.invalidate();
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
      rating,
      comment: comment.trim() || undefined,
      visitorName: userName.trim() || undefined,
    });
  };

  return (
    <Card className="border-2">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">قيّم تجربتك</CardTitle>
        <CardDescription className="text-base">
          ساعدنا في تحسين خدماتنا من خلال تقييمك
        </CardDescription>
        {averageRating && averageRating.count > 0 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">
              {averageRating.average.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({averageRating.count} تقييم)
            </span>
          </div>
        )}
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

          {/* Name Input */}
          <div>
            <label htmlFor="userName" className="text-sm font-medium block mb-2">
              الاسم (اختياري)
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="أدخل اسمك"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Comment Textarea */}
          <div>
            <label htmlFor="comment" className="text-sm font-medium block mb-2">
              تعليقك (اختياري)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا رأيك حول الموقع..."
              rows={4}
              className="resize-none"
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
  );
}

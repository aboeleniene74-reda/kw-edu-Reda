import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, User, Flag } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";

export function SiteRatingsList() {
  const [selectedStars, setSelectedStars] = useState<number | undefined>(undefined);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState<number | null>(null);
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reportReason, setReportReason] = useState("");

  // const { toast } = useToast();
  const toast = (options: any) => {
    alert(options.title + "\n" + options.description);
  };
  const utils = trpc.useUtils();

  // استخدام API الفلترة الجديد
  const { data: ratings, isLoading } = trpc.siteRatings.listByStars.useQuery({
    stars: selectedStars,
  });
  const { data: stats } = trpc.siteRatings.stats.useQuery();

  const reportMutation = trpc.siteRatings.report.useMutation({
    onSuccess: () => {
      alert("تم إرسال البلاغ\nشكراً لك! سيتم مراجعة البلاغ من قبل الإدارة.");
      setReportDialogOpen(false);
      setReporterName("");
      setReporterEmail("");
      setReportReason("");
    },
    onError: (error) => {
      alert("خطأ\n" + (error.message || "حدث خطأ أثناء إرسال البلاغ"));
    },
  });

  const handleReport = (ratingId: number) => {
    setSelectedRatingId(ratingId);
    setReportDialogOpen(true);
  };

  const submitReport = () => {
    if (!selectedRatingId) return;
    if (reportReason.length < 10) {
      alert("خطأ\nيجب أن يكون السبب 10 أحرف على الأقل");
      return;
    }

    reportMutation.mutate({
      ratingId: selectedRatingId,
      reporterName: reporterName || undefined,
      reporterEmail: reporterEmail || undefined,
      reason: reportReason,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">تقييمات الزوار</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            {selectedStars
              ? `لا توجد تقييمات بـ ${selectedStars} نجوم`
              : "لا توجد تقييمات بعد. كن أول من يقيّم الموقع!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">تقييمات الزوار</CardTitle>
          {stats && stats.total > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(stats.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xl font-bold">
                {stats.average.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({stats.total} تقييم)
              </span>
            </div>
          )}

          {/* أزرار الفلترة */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <Button
              variant={selectedStars === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStars(undefined)}
            >
              الكل
            </Button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <Button
                key={stars}
                variant={selectedStars === stars ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStars(stars)}
                className="flex items-center gap-1"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{stars}</span>
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratings.map((rating: any) => (
              <div
                key={rating.id}
                className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {rating.userName || "زائر"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(rating.createdAt).toLocaleDateString("ar-KW", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReport(rating.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نافذة الإبلاغ */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الإبلاغ عن تقييم</DialogTitle>
            <DialogDescription>
              إذا كنت تعتقد أن هذا التقييم غير لائق أو مسيء، يرجى تقديم بلاغ وسنقوم بمراجعته.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reporterName">الاسم (اختياري)</Label>
              <Input
                id="reporterName"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <Label htmlFor="reporterEmail">البريد الإلكتروني (اختياري)</Label>
              <Input
                id="reporterEmail"
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div>
              <Label htmlFor="reportReason">سبب الإبلاغ *</Label>
              <Textarea
                id="reportReason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="اشرح سبب الإبلاغ عن هذا التقييم (10 أحرف على الأقل)"
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {reportReason.length} / 10 حرف كحد أدنى
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={submitReport}
              disabled={reportMutation.isPending || reportReason.length < 10}
            >
              {reportMutation.isPending ? "جاري الإرسال..." : "إرسال البلاغ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

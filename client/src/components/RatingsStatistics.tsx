import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function RatingsStatistics() {
  const { data: stats, isLoading } = trpc.siteRatings.advancedStats.useQuery();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  if (!stats || stats.totalRatings === 0) {
    return null;
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl text-center">إحصائيات التقييمات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ملخص عام */}
          <div className="text-center pb-4 border-b">
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(stats.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              بناءً على {stats.totalRatings} تقييم
            </p>
          </div>

          {/* توزيع التقييمات */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars as keyof typeof stats.distribution];
              const percentage = stats.percentages[stars as keyof typeof stats.percentages];
              
              return (
                <div key={stars} className="flex items-center gap-3">
                  {/* عدد النجوم */}
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>

                  {/* شريط التقدم */}
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* النسبة المئوية والعدد */}
                  <div className="w-24 text-left">
                    <span className="text-sm font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({count})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* تفاصيل إضافية */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.distribution[5]}
              </div>
              <p className="text-xs text-muted-foreground">ممتاز</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.distribution[4] + stats.distribution[5]}
              </div>
              <p className="text-xs text-muted-foreground">جيد وأعلى</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.distribution[1] + stats.distribution[2]}
              </div>
              <p className="text-xs text-muted-foreground">يحتاج تحسين</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

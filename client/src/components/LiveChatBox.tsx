import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface LiveChatBoxProps {
  sessionId: number;
  sessionTitle: string;
}

export function LiveChatBox({ sessionId, sessionTitle }: LiveChatBoxProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [studentName, setStudentName] = useState(user?.name || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: comments, refetch } = trpc.liveComments.getBySession.useQuery(
    { sessionId },
    { refetchInterval: 5000 } // Auto-refresh every 5 seconds
  );

  const addCommentMutation = trpc.liveComments.create.useMutation({
    onSuccess: () => {
      setComment("");
      refetch();
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast.error(error.message || "فشل إرسال التعليق");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("الرجاء كتابة تعليق");
      return;
    }

    if (!user && !studentName.trim()) {
      toast.error("الرجاء إدخال اسمك");
      return;
    }

    addCommentMutation.mutate({
      sessionId,
      comment: comment.trim(),
      studentName: !user && studentName.trim() ? studentName.trim() : undefined,
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <CardTitle>الدردشة المباشرة</CardTitle>
        </div>
        <CardDescription>شارك أسئلتك وتعليقاتك أثناء الحصة</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-muted/30 rounded-lg min-h-[300px] max-h-[400px]">
          {!comments || comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد تعليقات بعد</p>
              <p className="text-sm">كن أول من يعلق!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-background p-3 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    {comment.studentName || "طالب"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!user && (
            <div>
              <Label htmlFor="chatName" className="text-sm">
                الاسم
              </Label>
              <Input
                id="chatName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسمك"
                className="mt-1"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تعليقك..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={addCommentMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useEffect } from "react";
import { X, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TextbookPDFViewerProps {
  fileUrl: string;
  title: string;
  onClose: () => void;
}

export function TextbookPDFViewer({ fileUrl, title, onClose }: TextbookPDFViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = () => {
    // فتح الملف في نافذة جديدة للتحميل
    window.open(fileUrl, '_blank');
  };

  // استخدام Google Docs Viewer لعرض PDF كاملاً
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="h-full w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 flex-1">
            <BookOpen className="h-5 w-5 text-green-400" />
            <div>
              <h2 className="text-lg font-bold" dir="rtl">{title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                  كتاب مدرسي مجاني
                </Badge>
                <p className="text-xs text-gray-300" dir="rtl">معاينة كاملة - جميع الصفحات</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Download className="ml-2 h-4 w-4" />
              تحميل مجاني
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-green-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* رسالة ترحيبية */}
        <div className="bg-green-500/20 border-y border-green-500/50 px-4 py-2" dir="rtl">
          <p className="text-center text-sm text-green-100">
            <BookOpen className="inline h-4 w-4 ml-1" />
            الكتب المدرسية متاحة مجاناً لجميع الطلاب - يمكنك المعاينة والتحميل بدون قيود
          </p>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-900 relative">
          <iframe
            src={googleViewerUrl}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-same-origin allow-scripts"
          />
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4" dir="rtl">
          <div className="text-center">
            <p className="font-bold text-lg mb-1">للحصول على المذكرات والمراجعات</p>
            <p className="text-sm flex items-center justify-center gap-2 flex-wrap">
              <span>تواصل مع مايسترو العلوم:</span>
              <a href="tel:99457080" className="font-bold hover:underline">99457080</a>
              <Badge variant="secondary" className="bg-green-500 text-white">
                التوصيل المجاني
              </Badge>
              <span>أو عبر واتساب:</span>
              <a 
                href="https://wa.me/96599457080" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                اضغط هنا
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowRight, GraduationCap, LogIn, User, BookOpen, FileText, ClipboardList, ClipboardCheck, Award, CheckCircle, FileQuestion } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link, useParams, useLocation } from "wouter";

export default function SubjectPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const [, setLocation] = useLocation();
  const subjectId = parseInt(params.id || "0");

  const { data: subject } = trpc.subjects.getById.useQuery({ id: subjectId });
  const { data: semesters } = trpc.semesters.list.useQuery();
  const { data: categories } = trpc.contentCategories.list.useQuery();

  // أيقونات الأقسام
  const categoryIcons: Record<string, any> = {
    "book-open": BookOpen,
    "file-text": FileText,
    "clipboard-list": ClipboardList,
    "clipboard-check": ClipboardCheck,
    "award": Award,
    "check-circle": CheckCircle,
    "file-question": FileQuestion,
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">المادة غير موجودة</h2>
          <Link href="/">
            <Button>
              <ArrowRight className="ml-2 w-5 h-5" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">علوم ثانوي</h1>
                <p className="text-xs text-muted-foreground">مذكرات علمية للمرحلة الثانوية</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button>
                  <LogIn className="ml-2 w-5 h-5" />
                  تسجيل الدخول
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="container py-16">
        {/* Subject Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: subject.color || "#3b82f6",
            }}
          >
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{subject.name}</h1>
          {subject.description && (
            <p className="text-lg text-muted-foreground">{subject.description}</p>
          )}
        </div>

        {/* Semesters Tabs */}
        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            {semesters?.map((semester) => (
              <TabsTrigger key={semester.id} value={semester.id.toString()}>
                {semester.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {semesters?.map((semester) => (
            <TabsContent key={semester.id} value={semester.id.toString()}>
              {/* Categories Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((category) => {
                  const IconComponent = categoryIcons[category.icon || "file-text"];
                  
                  return (
                    <Card
                      key={category.id}
                      className="hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => setLocation(`/subject/${subjectId}/semester/${semester.id}/category/${category.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: subject.color || "#3b82f6" }}
                          >
                            {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{category.name}</CardTitle>
                            {category.description && (
                              <CardDescription className="text-sm">
                                {category.description}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                          عرض المحتوى
                          <ArrowRight className="mr-2 w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowRight className="ml-2 w-5 h-5" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

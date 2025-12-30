import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, GraduationCap, LogIn, User, Star, FileText } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link, useParams } from "wouter";

export default function SubjectPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const subjectId = parseInt(params.id || "0");

  const { data: subject } = trpc.subjects.getById.useQuery({ id: subjectId });
  const { data: notebooks } = trpc.notebooks.listBySubject.useQuery({ subjectId });

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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: subject.color
                ? `color-mix(in oklch, ${subject.color}, transparent 85%)`
                : "oklch(0.48 0.18 250 / 0.15)",
            }}
          >
            <BookOpen
              className="w-12 h-12"
              style={{ color: subject.color || "oklch(0.48 0.18 250)" }}
            />
          </div>
          <h2 className="text-5xl font-bold mb-4">{subject.name}</h2>
          {subject.description && (
            <p className="text-xl text-muted-foreground">{subject.description}</p>
          )}
        </div>

        {/* Notebooks Grid */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-8">المذكرات المتاحة</h3>
          
          {!notebooks || notebooks.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">لا توجد مذكرات متاحة حالياً</h3>
              <p className="text-muted-foreground">سيتم إضافة المذكرات قريباً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notebooks.map((notebook) => (
                <Link key={notebook.id} href={`/notebook/${notebook.id}`}>
                  <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer group h-full flex flex-col">
                    {notebook.coverImageUrl && (
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={notebook.coverImageUrl}
                          alt={notebook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-xl line-clamp-2">{notebook.title}</CardTitle>
                        {notebook.isFeatured && (
                          <Badge variant="default" className="shrink-0">مميزة</Badge>
                        )}
                      </div>
                      {notebook.description && (
                        <CardDescription className="line-clamp-3">{notebook.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        {notebook.pages && (
                          <span className="text-muted-foreground">{notebook.pages} صفحة</span>
                        )}
                        {notebook.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{notebook.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {parseFloat(notebook.price).toFixed(3)} د.ك
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        عرض التفاصيل
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-muted-foreground">
          <p>© 2024 علوم ثانوي - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

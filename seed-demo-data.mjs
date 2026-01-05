import { drizzle } from "drizzle-orm/mysql2";
import { notebooks, sessions } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedDemoData() {
  console.log("🌱 بدء إضافة المحتوى التجريبي...");

  try {
    // إضافة مذكرات تجريبية
    const demoNotebooks = [
      // الصف العاشر - كيمياء
      {
        title: "مذكرة الكيمياء العضوية - الصف العاشر",
        description: "شرح مفصل للكيمياء العضوية مع أمثلة محلولة وتمارين شاملة",
        price: "5.000",
        subjectId: 1, // كيمياء عاشر
        gradeId: 1,
        coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      {
        title: "ملخص الكيمياء الحيوية",
        description: "ملخص شامل لجميع دروس الكيمياء الحيوية للصف العاشر",
        price: "4.500",
        subjectId: 1,
        gradeId: 1,
        coverImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف العاشر - أحياء
      {
        title: "مذكرة علم الخلية والأنسجة",
        description: "دراسة تفصيلية لتركيب الخلية ووظائفها مع رسومات توضيحية",
        price: "4.000",
        subjectId: 2, // أحياء عاشر
        gradeId: 1,
        coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      {
        title: "التنوع البيولوجي والبيئة",
        description: "شرح مبسط للتنوع البيولوجي والنظم البيئية",
        price: "3.500",
        subjectId: 2,
        gradeId: 1,
        coverImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف العاشر - فيزياء
      {
        title: "الحركة والقوة - فيزياء عاشر",
        description: "قوانين نيوتن والحركة مع تطبيقات عملية",
        price: "4.500",
        subjectId: 3, // فيزياء عاشر
        gradeId: 1,
        coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف الحادي عشر - كيمياء
      {
        title: "الكيمياء الحرارية والطاقة",
        description: "دراسة شاملة للتفاعلات الحرارية والطاقة الكيميائية",
        price: "5.500",
        subjectId: 4, // كيمياء حادي عشر
        gradeId: 2,
        coverImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف الحادي عشر - جيولوجيا
      {
        title: "علم الصخور والمعادن",
        description: "تصنيف الصخور والمعادن مع دراسة خصائصها",
        price: "4.000",
        subjectId: 7, // جيولوجيا حادي عشر
        gradeId: 2,
        coverImage: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف الثاني عشر - كيمياء
      {
        title: "الكيمياء التحليلية المتقدمة",
        description: "تقنيات التحليل الكيميائي الحديثة مع تطبيقات عملية",
        price: "6.000",
        subjectId: 8, // كيمياء ثاني عشر
        gradeId: 3,
        coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      {
        title: "الكيمياء الكهربائية",
        description: "دراسة التفاعلات الكهروكيميائية والخلايا الجلفانية",
        price: "5.500",
        subjectId: 8,
        gradeId: 3,
        coverImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
        pdfUrl: null,
        isPublished: true,
      },
      // الصف الثاني عشر - أحياء
      {
        title: "الوراثة وعلم الجينات",
        description: "شرح مفصل لقوانين مندل والهندسة الوراثية",
        price: "6.500",
        subjectId: 9, // أحياء ثاني عشر
        gradeId: 3,
        coverImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400",
        pdfUrl: null,
        isPublished: true,
      },
    ];

    for (const notebook of demoNotebooks) {
      await db.insert(notebooks).values(notebook);
      console.log(`✅ تم إضافة: ${notebook.title}`);
    }

    // إضافة حصص تجريبية قادمة
    const demoSessions = [
      {
        title: "حصة مراجعة الكيمياء العضوية",
        description: "مراجعة شاملة لجميع موضوعات الكيمياء العضوية مع حل التمارين",
        sessionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // بعد يومين
        duration: 90,
        meetingLink: "https://meet.google.com/demo-chemistry",
        maxStudents: 30,
        price: "3.000",
        teacherId: 1,
        uniqueSlug: `session-chemistry-${Date.now()}`,
        status: "scheduled",
        subjectId: 1,
        gradeId: 1,
      },
      {
        title: "حصة الفيزياء - قوانين الحركة",
        description: "شرح تفصيلي لقوانين نيوتن مع أمثلة عملية وتطبيقات",
        sessionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // بعد 3 أيام
        duration: 60,
        meetingLink: "https://zoom.us/j/demo-physics",
        maxStudents: 25,
        price: "0",
        teacherId: 1,
        uniqueSlug: `session-physics-${Date.now()}`,
        status: "scheduled",
        subjectId: 3,
        gradeId: 1,
      },
      {
        title: "حصة الأحياء - علم الوراثة",
        description: "دراسة قوانين مندل والهندسة الوراثية الحديثة",
        sessionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // بعد 5 أيام
        duration: 75,
        meetingLink: "https://meet.google.com/demo-biology",
        maxStudents: 20,
        price: "2.500",
        teacherId: 1,
        uniqueSlug: `session-biology-${Date.now()}`,
        status: "scheduled",
        subjectId: 9,
        gradeId: 3,
      },
    ];

    for (const session of demoSessions) {
      await db.insert(sessions).values(session);
      console.log(`✅ تم إضافة حصة: ${session.title}`);
    }

    console.log("\n✨ تم إضافة المحتوى التجريبي بنجاح!");
    console.log(`📚 تم إضافة ${demoNotebooks.length} مذكرة`);
    console.log(`🎓 تم إضافة ${demoSessions.length} حصص`);
  } catch (error) {
    console.error("❌ خطأ في إضافة المحتوى التجريبي:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedDemoData();

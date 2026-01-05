import { drizzle } from "drizzle-orm/mysql2";
import { notebooks } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedNewStructure() {
  console.log("🌱 بدء إضافة مذكرات بالهيكل الجديد...");

  try {
    // الصف: حادي عشر (ID: 2)
    // المواد: كيمياء (3), أحياء (4), فيزياء (5), جيولوجيا (6)
    // الفصول: الأول (1), الثاني (2)
    // الأقسام: 1-7

    const notebooksData = [
      // الفصل الأول - كيمياء
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 1,
        categoryId: 1,
        title: "كتاب الكيمياء المدرسي - الفصل الأول",
        description: "الكتاب المدرسي الرسمي لمادة الكيمياء للصف الحادي عشر - الفصل الدراسي الأول",
        price: "0.000",
        pages: 180,
        teacherId: 1,
        isPublished: true,
        isFeatured: true,
      },
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 1,
        categoryId: 2,
        title: "ملخص شامل للكيمياء - الفصل الأول",
        description: "ملخص مركز لجميع دروس الكيمياء في الفصل الأول مع الأمثلة والتمارين",
        price: "3.500",
        pages: 45,
        teacherId: 1,
        isPublished: true,
        isFeatured: true,
      },
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 1,
        categoryId: 3,
        title: "مراجعة الاختبار القصير الأول - كيمياء",
        description: "مراجعة شاملة للوحدات المقررة في الاختبار القصير الأول",
        price: "2.000",
        pages: 25,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 1,
        categoryId: 5,
        title: "مراجعة نهائية كيمياء - الفصل الأول",
        description: "مراجعة شاملة لجميع وحدات الفصل الأول مع نماذج أسئلة متنوعة",
        price: "4.000",
        pages: 60,
        teacherId: 1,
        isPublished: true,
        isFeatured: true,
      },
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 1,
        categoryId: 6,
        title: "نماذج اختبارات سابقة محلولة - كيمياء ف1",
        description: "10 نماذج اختبارات من الأعوام السابقة مع الحلول التفصيلية",
        price: "3.000",
        pages: 40,
        teacherId: 1,
        isPublished: true,
      },

      // الفصل الثاني - كيمياء
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 2,
        categoryId: 1,
        title: "كتاب الكيمياء المدرسي - الفصل الثاني",
        description: "الكتاب المدرسي الرسمي لمادة الكيمياء للصف الحادي عشر - الفصل الدراسي الثاني",
        price: "0.000",
        pages: 170,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 3,
        semesterId: 2,
        categoryId: 2,
        title: "ملخص شامل للكيمياء - الفصل الثاني",
        description: "ملخص مركز لجميع دروس الكيمياء في الفصل الثاني",
        price: "3.500",
        pages: 50,
        teacherId: 1,
        isPublished: true,
      },

      // الفصل الأول - أحياء
      {
        gradeId: 2,
        subjectId: 4,
        semesterId: 1,
        categoryId: 1,
        title: "كتاب الأحياء المدرسي - الفصل الأول",
        description: "الكتاب المدرسي الرسمي لمادة الأحياء للصف الحادي عشر - الفصل الدراسي الأول",
        price: "0.000",
        pages: 200,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 4,
        semesterId: 1,
        categoryId: 2,
        title: "ملخص شامل للأحياء - الفصل الأول",
        description: "ملخص مركز لجميع دروس الأحياء مع الرسومات التوضيحية",
        price: "3.500",
        pages: 55,
        teacherId: 1,
        isPublished: true,
        isFeatured: true,
      },
      {
        gradeId: 2,
        subjectId: 4,
        semesterId: 1,
        categoryId: 5,
        title: "مراجعة نهائية أحياء - الفصل الأول",
        description: "مراجعة شاملة مع أسئلة متنوعة وإجابات نموذجية",
        price: "4.000",
        pages: 65,
        teacherId: 1,
        isPublished: true,
      },

      // الفصل الأول - فيزياء
      {
        gradeId: 2,
        subjectId: 5,
        semesterId: 1,
        categoryId: 1,
        title: "كتاب الفيزياء المدرسي - الفصل الأول",
        description: "الكتاب المدرسي الرسمي لمادة الفيزياء للصف الحادي عشر - الفصل الدراسي الأول",
        price: "0.000",
        pages: 190,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 5,
        semesterId: 1,
        categoryId: 2,
        title: "ملخص شامل للفيزياء - الفصل الأول",
        description: "ملخص مركز للقوانين والنظريات مع أمثلة محلولة",
        price: "3.500",
        pages: 48,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 5,
        semesterId: 1,
        categoryId: 6,
        title: "نماذج اختبارات محلولة - فيزياء ف1",
        description: "8 نماذج اختبارات من الأعوام السابقة مع الحلول",
        price: "3.000",
        pages: 35,
        teacherId: 1,
        isPublished: true,
      },

      // الفصل الأول - جيولوجيا
      {
        gradeId: 2,
        subjectId: 6,
        semesterId: 1,
        categoryId: 1,
        title: "كتاب الجيولوجيا المدرسي - الفصل الأول",
        description: "الكتاب المدرسي الرسمي لمادة الجيولوجيا للصف الحادي عشر - الفصل الدراسي الأول",
        price: "0.000",
        pages: 160,
        teacherId: 1,
        isPublished: true,
      },
      {
        gradeId: 2,
        subjectId: 6,
        semesterId: 1,
        categoryId: 2,
        title: "ملخص شامل للجيولوجيا - الفصل الأول",
        description: "ملخص مركز مع الصور والخرائط التوضيحية",
        price: "3.000",
        pages: 40,
        teacherId: 1,
        isPublished: true,
      },
    ];

    for (const notebook of notebooksData) {
      await db.insert(notebooks).values(notebook);
      console.log(`✅ تم إضافة: ${notebook.title}`);
    }

    console.log(`\n✨ تم إضافة ${notebooksData.length} مذكرة بنجاح!`);
  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedNewStructure();

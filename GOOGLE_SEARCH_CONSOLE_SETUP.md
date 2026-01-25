# إعداد Google Search Console

## الخطوات المطلوبة

### 1. إنشاء حساب Google Search Console

1. اذهب إلى [Google Search Console](https://search.google.com/search-console)
2. سجل الدخول بحساب Google الخاص بك
3. اضغط على "إضافة موقع" أو "Add Property"

### 2. اختيار نوع الموقع

اختر **"نطاق"** (Domain) وأدخل:
```
kuwait-secondary-school.manus.space
```

أو اختر **"بادئة عنوان URL"** (URL prefix) وأدخل:
```
https://kuwait-secondary-school.manus.space
```

### 3. التحقق من الملكية

**الطريقة الأولى: ملف HTML (موصى بها)**
1. قم بتنزيل ملف التحقق من Google (مثال: `google1234567890abcdef.html`)
2. ارفع الملف إلى مجلد `client/public/` في المشروع
3. تأكد من أن الملف متاح على: `https://kuwait-secondary-school.manus.space/google1234567890abcdef.html`
4. اضغط على "تحقق" في Google Search Console

**الطريقة الثانية: Meta Tag**
1. انسخ meta tag من Google Search Console
2. أضفه في ملف `client/index.html` داخل `<head>`
3. مثال:
```html
<meta name="google-site-verification" content="your-verification-code" />
```

### 4. إرسال Sitemap

بعد التحقق من الموقع:
1. اذهب إلى قسم "Sitemaps" في القائمة الجانبية
2. أضف عنوان URL التالي:
```
https://kuwait-secondary-school.manus.space/sitemap.xml
```
3. اضغط على "إرسال" (Submit)

### 5. تفعيل الاستهداف الجغرافي

1. اذهب إلى "الإعدادات" (Settings) في القائمة الجانبية
2. ابحث عن "الاستهداف الدولي" (International Targeting)
3. في تبويب "البلد" (Country)، اختر **الكويت** (Kuwait)

### 6. مراقبة الأداء

بعد عدة أيام، ستبدأ البيانات بالظهور:
- **الأداء**: عدد النقرات، مرات الظهور، الكلمات المفتاحية
- **التغطية**: الصفحات المفهرسة والأخطاء
- **التحسينات**: تجربة المستخدم وسرعة الموقع

## ملاحظات مهمة

- قد يستغرق ظهور البيانات من 24-48 ساعة بعد التحقق
- تأكد من أن الموقع منشور ومتاح للعموم
- راجع تقرير "التغطية" بانتظام لإصلاح أي أخطاء في الفهرسة
- استخدم تقرير "الأداء" لمعرفة الكلمات المفتاحية الأكثر جلباً للزوار

## روابط مفيدة

- [مركز مساعدة Google Search Console](https://support.google.com/webmasters)
- [دليل تحسين محركات البحث من Google](https://developers.google.com/search/docs)

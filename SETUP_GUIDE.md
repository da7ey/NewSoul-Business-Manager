# 📊 تطبيق إدارة الأعمال مع Supabase

## خطوات الإعداد الكامل

### ✅ الخطوة 1: إنشاء حساب Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. اضغط "Sign Up" وسجل حساب جديد
3. تحقق من بريدك الإلكتروني
4. أنشئ مشروع جديد

---

### ✅ الخطوة 2: نسخ بيانات الاتصال

بعد إنشاء المشروع، اذهب إلى **Settings → API**:
- انسخ **Project URL** (الـ Supabase URL)
- انسخ **anon public key** (الـ API Key)

**ضعها في الكود هنا:**
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
```

---

### ✅ الخطوة 3: إنشاء جداول قاعدة البيانات

في Supabase، اذهب إلى **SQL Editor** والصق هذا الكود:

```sql
-- جدول العملاء
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- جدول المشاريع
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'نشط',
  budget DECIMAL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الفواتير
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'معلق',
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول عروض الأسعار
CREATE TABLE quotations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT,
  amount DECIMAL NOT NULL,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- تفعيل RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- السياسات الأمنية للعملاء
CREATE POLICY "Users can view their own clients" 
  ON clients FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" 
  ON clients FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
  ON clients FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
  ON clients FOR DELETE 
  USING (auth.uid() = user_id);

-- السياسات الأمنية للمشاريع
CREATE POLICY "Users can view their own projects" 
  ON projects FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" 
  ON projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  USING (auth.uid() = user_id);

-- السياسات الأمنية للفواتير
CREATE POLICY "Users can view their own invoices" 
  ON invoices FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" 
  ON invoices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
  ON invoices FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
  ON invoices FOR DELETE 
  USING (auth.uid() = user_id);

-- السياسات الأمنية لعروض الأسعار
CREATE POLICY "Users can view their own quotations" 
  ON quotations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotations" 
  ON quotations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotations" 
  ON quotations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotations" 
  ON quotations FOR DELETE 
  USING (auth.uid() = user_id);
```

---

### ✅ الخطوة 4: تفعيل المصادقة (Authentication)

1. اذهب إلى **Authentication → Providers**
2. تأكد أن **Email** مفعل (يجب أن يكون مفعلاً بشكل افتراضي)

---

### ✅ الخطوة 5: استخدام التطبيق

#### التسجيل:
1. اضغط "إنشاء حساب جديد"
2. أدخل بريد وكلمة مرور
3. ستتمكن من تسجيل الدخول

#### المميزات:
- **لوحة التحكم**: عرض الإحصائيات والرسوم البيانية
- **العملاء**: إضافة وتعديل وحذف العملاء
- **المشاريع**: إدارة المشاريع الخاصة بك
- **الفواتير**: تتبع الفواتير والحالات
- **عروض الأسعار**: إنشاء وإدارة عروض الأسعار

---

## 🚀 كيفية التشغيل

### Option 1: استخدام npm وReact

```bash
# تثبيت المتطلبات
npm install react react-dom @supabase/supabase-js recharts

# إذا كنت تستخدم Vite
npm create vite@latest my-app -- --template react
cd my-app
npm install @supabase/supabase-js recharts
```

ثم ضع الكود في `src/App.jsx` و ركب الـ credentials من Supabase.

### Option 2: استخدام Vercel / Netlify

1. أنشئ مشروع React جديد
2. ضع الملفات
3. ربط قاعدة البيانات بـ Supabase
4. Deploy

---

## 📦 المتطلبات

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "recharts": "^2.10.0"
  }
}
```

---

## 🔐 الأمان

✅ تم تفعيل RLS (Row Level Security) - كل مستخدم يرى بياناته فقط
✅ الفواتير والمشاريع مرتبطة بـ user_id
✅ السياسات الأمنية تمنع الوصول غير المصرح

---

## 🐛 حل المشاكل الشائعة

### المشكلة: "API Key is missing"
**الحل:** تأكد من نسخ الـ URL و Key بشكل صحيح من Supabase

### المشكلة: "Authentication error"
**الحل:** 
1. تحقق من تفعيل Email provider في Supabase
2. تأكد من صحة بيانات الدخول

### المشكلة: "Table doesn't exist"
**الحل:** قم بتشغيل SQL queries من الأعلى

### المشكلة: "Permission denied"
**الحل:** تأكد من RLS policies موجودة

---

## 📝 ملاحظات مهمة

- تأكد من استخدام **Tajawal font** من Google Fonts
- استخدم Font Awesome للـ icons
- Recharts للرسوم البيانية
- Supabase يوفر hosting مجاني للـ data

---

## 🎯 الميزات

✅ نظام مصادقة متقدم
✅ إدارة العملاء
✅ إدارة المشاريع
✅ تتبع الفواتير
✅ عروض الأسعار
✅ رسوم بيانية وإحصائيات
✅ واجهة عربية جميلة
✅ responsive design

---

## 💡 نصائح إضافية

### إضافة صور للعملاء:
```javascript
// أضف جدول جديد لـ avatars
CREATE TABLE avatars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  url TEXT
);
```

### إضافة تنبيهات للفواتير المتأخرة:
```javascript
// استخدم date functions من Supabase
.select('*')
.lt('due_date', new Date())
.eq('status', 'معلق')
```

### تصدير البيانات:
```javascript
// استخدم libraries مثل xlsx
import * as XLSX from 'xlsx';
```

---

**استمتع بالتطبيق! 🎉**

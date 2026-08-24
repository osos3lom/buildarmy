# BuildArmy

---

## العربية

### حول المشروع

**BuildArmy** هو تطبيق ويب وتطبيق محمول متقدم لتتبع اللياقة البدنية والتمارين الرياضية. يوفر المنصة للمستخدمين تخطيط وتنفيذ ومراقبة برامجهم التدريبية بكفاءة عالية.

### المميزات الرئيسية

- 📱 **واجهة مستخدم حديثة**: تصميم متجاوب يعمل على جميع الأجهزة
- 💪 **إدارة البرامج التدريبية**: إنشاء وتعديل برامج تمارين مخصصة
- 📊 **إحصائيات متقدمة**: تتبع التقدم من خلال الرسوم البيانية والخرائط الحرارية
- 🗺️ **خريطة الجسم**: تصور تفاعلي لمجموعات العضلات
- ⏱️ **مؤقت الراحة**: تطبيق ذكي لفترات الراحة بين التمارين
- 🌍 **دعم لغات متعددة**: واجهة مستخدم كاملة باللغة العربية والإنجليزية
- 📱 **تطبيق محمول**: دعم كامل لأجهزة iOS و Android عبر Capacitor
- 🔐 **نظام المصادقة**: تسجيل دخول آمن وإدارة حسابات المستخدمين
- 🎨 **مظاهر ديناميكية**: دعم المظهر الفاتح والداكن
- 💾 **التخزين المحلي**: حفظ البيانات محليًا على الجهاز

### المتطلبات

- Node.js 16 أو أحدث
- npm 8 أو أحدث

### التثبيت والإعداد

1. **استنساخ المستودع**
```bash
git clone https://github.com/osaalam/buildarmy.git
cd buildarmy
```

2. **تثبيت الاعتماديات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.development .env.local
```
قم بتعديل `.env.local` بإضافة بيانات الاتصال الخاصة بك.

### تشغيل المشروع

**تطوير محلي:**
```bash
npm run dev
```
سيكون التطبيق متاحًا على `http://localhost:5173`

**البناء للإنتاج:**
```bash
npm run build
```

**المعاينة:**
```bash
npm run preview
```

### الاختبار

**تشغيل الاختبارات:**
```bash
npm run test
```

**الاختبارات بوضع المراقبة:**
```bash
npm run test:watch
```

### البنية المعمارية

```
src/
├── components/        # المكونات المعاد استخدامها
│   ├── BodyMap.tsx       # خريطة الجسم التفاعلية
│   ├── Heatmap.tsx       # الخريطة الحرارية للبيانات
│   ├── LineChart.tsx     # رسوم بيانية خطية
│   ├── RestTimer.tsx     # مؤقت الراحة
│   └── ...
├── views/             # صفحات المنطق
│   ├── Login.tsx         # تسجيل الدخول
│   ├── Home.tsx          # الصفحة الرئيسية
│   ├── Workout.tsx       # شاشة التمرين
│   ├── Stats.tsx         # الإحصائيات
│   └── ...
├── store/             # إدارة الحالة (Zustand)
│   └── useStore.ts      # المتجر الرئيسي
├── lib/               # المكتبات والأدوات
│   ├── api.ts           # طلبات API
│   ├── i18n.ts          # إدارة اللغات
│   └── ...
├── styles/            # الأنماط العامة
└── App.tsx            # مكون التطبيق الرئيسي
```

### التكنولوجيا المستخدمة

| التكنولوجيا | الإصدار | الاستخدام |
|-----------|---------|----------|
| React | 19.2+ | مكتبة واجهة المستخدم |
| TypeScript | 5.8+ | لغة البرمجة |
| Vite | 8.1+ | أداة البناء |
| Tailwind CSS | 3.4+ | تصميم واجهات المستخدم |
| Zustand | 5.0+ | إدارة الحالة |
| React Router | 7.18+ | التوجيه |
| Capacitor | 7.6+ | تطبيقات محمول |
| Vitest | 4.1+ | اختبار الوحدات |

### المساهمة

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'feat: add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### نمط الالتزام

نتبع معايير [Conventional Commits](https://www.conventionalcommits.org/ar/):

```
<type>: <description>
```

الأنواع المدعومة:
- `feat`: إضافة ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديثات التوثيق
- `style`: تنسيق الكود
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة اختبارات
- `perf`: تحسينات الأداء
- `ci`: تغييرات CI/CD

### السياسات الأمنية

- 🔒 لا تقم بحفظ المفاتيح السرية في الكود
- 🔐 استخدم متغيرات البيئة للبيانات الحساسة
- ✅ تحقق من مدخلات المستخدم قبل المعالجة
- 🛡️ استخدم HTTPS في الإنتاج

### الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

### الاتصال والدعم

- 📧 البريد الإلكتروني: osama.aalam@gmail.com
- 🐙 GitHub Issues: [ابدأ مشكلة جديدة](https://github.com/osaalam/buildarmy/issues)

---

## English

### About the Project

**BuildArmy** is an advanced web and mobile application for fitness tracking and workout management. The platform empowers users to plan, execute, and monitor their training programs efficiently.

### Key Features

- 📱 **Modern UI**: Responsive design that works on all devices
- 💪 **Workout Programs**: Create and customize personalized training routines
- 📊 **Advanced Analytics**: Track progress through charts and heatmaps
- 🗺️ **Body Map**: Interactive visualization of muscle groups
- ⏱️ **Rest Timer**: Smart rest period management between exercises
- 🌍 **Multi-language Support**: Full-featured Arabic and English interfaces
- 📱 **Mobile App**: Complete support for iOS and Android via Capacitor
- 🔐 **Authentication**: Secure login and user account management
- 🎨 **Dynamic Themes**: Light and dark mode support
- 💾 **Local Storage**: Data persistence on device

### Requirements

- Node.js 16 or higher
- npm 8 or higher

### Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/osaalam/buildarmy.git
cd buildarmy
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
```bash
cp .env.development .env.local
```
Edit `.env.local` with your connection details.

### Running the Project

**Local Development:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

**Production Build:**
```bash
npm run build
```

**Preview Build:**
```bash
npm run preview
```

### Testing

**Run Tests:**
```bash
npm run test
```

**Watch Mode:**
```bash
npm run test:watch
```

### Project Architecture

```
src/
├── components/        # Reusable components
│   ├── BodyMap.tsx       # Interactive body map
│   ├── Heatmap.tsx       # Heatmap visualization
│   ├── LineChart.tsx     # Line charts
│   ├── RestTimer.tsx     # Rest timer
│   └── ...
├── views/             # Page components
│   ├── Login.tsx         # Login screen
│   ├── Home.tsx          # Home page
│   ├── Workout.tsx       # Workout screen
│   ├── Stats.tsx         # Statistics
│   └── ...
├── store/             # State management (Zustand)
│   └── useStore.ts      # Main store
├── lib/               # Libraries & utilities
│   ├── api.ts           # API requests
│   ├── i18n.ts          # Language management
│   └── ...
├── styles/            # Global styles
└── App.tsx            # Main app component
```

### Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2+ | UI library |
| TypeScript | 5.8+ | Programming language |
| Vite | 8.1+ | Build tool |
| Tailwind CSS | 3.4+ | UI styling |
| Zustand | 5.0+ | State management |
| React Router | 7.18+ | Routing |
| Capacitor | 7.6+ | Mobile apps |
| Vitest | 4.1+ | Unit testing |

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>
```

Supported types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation updates
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Security Policy

- 🔒 Never commit secrets to the codebase
- 🔐 Use environment variables for sensitive data
- ✅ Validate user input before processing
- 🛡️ Use HTTPS in production

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact & Support

- 📧 Email: osama.aalam@gmail.com
- 🐙 GitHub Issues: [Create a new issue](https://github.com/osaalam/buildarmy/issues)

---

**Made with ❤️ by BuildArmy Team**

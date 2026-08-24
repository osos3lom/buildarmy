<div align="center">

# 🏋️‍♂️ BuildArmy

**A modern, powerful, and privacy-focused fitness tracking & workout management platform.**

[![React](https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7.6+-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[**Live Demo**](https://osaalam.github.io/buildarmy/) • [**Report Bug**](https://github.com/osaalam/buildarmy/issues) • [**Request Feature**](https://github.com/osaalam/buildarmy/issues)

</div>

---

## 📖 Overview

**BuildArmy** is an all-in-one workout logger, fitness planner, and analytics tracker built with cutting-edge web and mobile technologies. Designed to deliver an intuitive experience across mobile devices, tablets, and desktop browsers, BuildArmy helps athletes track sets, visualize muscle fatigue with interactive 2D anatomical models, analyze training consistency with GitHub-style heatmaps, and tailor routines to their exact needs.

---

## 📸 App Showcase

<div align="center">

| 🏋️‍♂️ Live Workout Tracker | 📚 1300+ Exercise Library | 📈 Analytics & Heatmap |
| :---: | :---: | :---: |
| <img src="./public/screenshots/Screenshot%202026-08-24%20192145.png" width="260" alt="Active Workout Logger" /> | <img src="./public/screenshots/Screenshot%202026-08-24%20192104.png" width="260" alt="Exercise Library" /> | <img src="./public/screenshots/Screenshot%202026-08-24%20192129.png" width="260" alt="Analytics and Muscle Balance" /> |

| 🗺️ Routine Muscle Mapping | 📅 Schedule & Calendar | 🎯 1RM Calculator & Guide |
| :---: | :---: | :---: |
| <img src="./public/screenshots/Screenshot%202026-08-24%20192207.png" width="260" alt="Target Muscle Map" /> | <img src="./public/screenshots/Screenshot%202026-08-24%20192223.png" width="260" alt="Calendar and Dashboard" /> | <img src="./public/screenshots/Screenshot%202026-08-24%20192321.png" width="260" alt="Exercise Details and 1RM" /> |

</div>

<div align="center">

| ⚙️ Deep Customization & Theming |
| :---: |
| <img src="./public/screenshots/Screenshot%202026-08-24%20192346.png" width="300" alt="Settings & Themes" /> |

</div>

---

## ✨ Key Features

### ⚡ Smart Active Workout Tracking
- **Real-Time Logging**: Track weights, reps, RPE (Rate of Perceived Exertion), and RIR (Reps in Reserve) seamlessly.
- **Superset Support**: Chain exercises directly into supersets with one tap.
- **Warm-Up & Drop Sets**: Mark specific sets as warm-up or working sets with automated rest periods.
- **Integrated Animated Demos**: High-definition animated motion guides for proper lifting execution and form.
- **Floating Rest Timer**: Audio-enabled smart countdown timer between sets with background wake-lock support.

### 📚 Massive Exercise Library (1,300+ Exercises)
- Extensive database categorized by muscle groups (Chest, Back, Quads, Shoulders, Arms, Core) and equipment (Barbell, Dumbbell, Cables, Bodyweight, Machines).
- **Custom Exercise Builder**: Add your own custom movements and routines with specialized target muscle tagging.
- Instant search and multi-tag filtering.

### 🗺️ Interactive Anatomical Body Map
- **Visual Muscle Balance**: Interactive 2D vector body map showing muscular strain, targeted zones, and recovery states.
- **Gender Toggle**: Customizable male and female body models.
- **Recovery & Fatigue Insights**: Visual indicators highlight overworked and ready-to-train muscle groups.

### 📊 In-Depth Analytics & Progression
- **12-Month Training Heatmap**: GitHub-style visual consistency calendar tracking your training frequency.
- **1RM (One Rep Max) Estimator**: Dynamic Epley equation calculations directly in exercise modals.
- **Body Weight Tracker**: Trend logs and chart progression over time.

### 🎨 Highly Customizable & Offline-First
- **Bilingual Support (AR / EN)**: Full native Right-to-Left (RTL) Arabic and Left-to-Right (LTR) English interfaces.
- **Themes & Accent Colors**: Dynamic dark/light mode with customizable brand accent highlights.
- **Privacy First & Passkeys**: Guest mode with local storage persistence and secure Passkey (WebAuthn) account syncing.
- **Cross-Platform Mobile**: Packaged for iOS and Android via Capacitor with native notifications and haptics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) + PostCSS + CSS Variables |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) (Offline-First Storage) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Mobile Runtime** | [Capacitor 7](https://capacitorjs.com/) (App, Filesystem, Notifications, Share) |
| **Unit Testing** | [Vitest](https://vitest.dev/) + [Happy-DOM](https://github.com/capricorn86/happy-dom) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### 1. Clone the Repository
```bash
git clone https://github.com/osaalam/buildarmy.git
cd buildarmy
```

### 2. Install Dependencies
```bash
npm run install
```

### 3. Environment Configuration
```bash
cp .env.development .env.local
```
*(Optional) Configure any custom backend endpoints or API keys inside `.env.local`.*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📱 Mobile Development (Capacitor)

BuildArmy supports native Android and iOS builds using Capacitor.

```bash
# 1. Build web assets
npm run build

# 2. Sync web assets with native projects
npx cap sync

# 3. Open in Android Studio or Xcode
npx cap open android
npx cap open ios
```

---

## 🧪 Testing & Quality Assurance

Run unit and integration test suites powered by Vitest:

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 📁 Project Structure

```
buildarmy/
├── public/                # Static assets, exercise media & screenshots
│   └── screenshots/       # High-res application preview screenshots
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── BodyMap.tsx    # Interactive 2D muscle anatomy visualization
│   │   ├── Heatmap.tsx    # Training activity heatmap grid
│   │   ├── LineChart.tsx  # Performance progression charts
│   │   ├── RestTimer.tsx  # Audio-visual rest countdown timer
│   │   └── TabBar.tsx     # Mobile bottom navigation bar
│   ├── views/             # Core application views / routes
│   │   ├── Home.tsx       # Calendar dashboard & active session prompt
│   │   ├── Library.tsx    # Exercise database & custom creator
│   │   ├── Workout.tsx    # Active workout logger & superset manager
│   │   ├── Plan.tsx       # Routine creator & muscle targeting
│   │   ├── Stats.tsx      # Analytics, muscle balance & recovery
│   │   ├── Settings.tsx   # Themes, units, language, and passkeys
│   │   └── Login.tsx      # Authentication & guest profile setup
│   ├── store/             # Zustand state stores (workouts, routines, settings)
│   ├── lib/               # Utility functions, i18n, math formulas, 1RM calculators
│   └── App.tsx            # Main router & theme provider
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add rest timer sound customization"
   ```
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more details.

---

<div align="center">

## 🌐 النسخة العربية (Arabic Summary)

**BuildArmy** هو تطبيق رياضي متكامل لتتبع التمارين وإدارة الخطط التدريبية وتحليل الأداء البدني.

### أبرز الميزات:
- 🏋️‍♂️ **مكتبة تمارين شاملة**: أكثر من 1300 تمرين مع رسوم توضيحية متحركة ودعم إضافة تمارينك الخاصة.
- ⚡ **مسجل تمارين تفاعلي**: تسجيل الأوزان والتكرارات ومعدل الجهد (RPE/RIR) مع دعم السوبر سيت ومجموعات الإحماء.
- 🗺️ **خريطة عضلية تفاعلية**: استعراض توازن العضلات ونقاط الجهد والاستشفاء لجسم الإنسان (ذكر / أنثى).
- 📊 **إحصائيات متقدمة**: خريطة نشاط سنوية (Heatmap)، حاسبة تكرار أقصى مقدر (1RM)، ومتابعة الوزن.
- 🎨 **تخصيص كامل**: مظهر ليلي/نهاري، ألوان تمييز ديناميكية، مؤقت راحة ذكي مع تنبيهات صوتية.
- 🌍 **دعم كامل للغة العربية**: واجهة مصممة أصلاً لدعم اللغة العربية وتناسق كامل (RTL).
- 📱 **تطبيق ويب ومحمول**: يدعم العمل بدون إنترنت، ويدعم منصات iOS و Android عبر Capacitor.

---

**Made with passion for fitness & engineering by Osama Aalam**

</div>

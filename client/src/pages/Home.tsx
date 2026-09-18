import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Flame,
  HeartHandshake,
  Home as HomeIcon,
  Info,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Lang = "fa" | "en";
type Screen = "today" | "tools" | "journal" | "path" | "settings";
type Modal = "info" | "urge" | "slip" | "checkin" | "journal" | "plan" | "contacts" | null;
type CheckinKind = "morning" | "night";

type AppData = {
  onboarded: boolean;
  startDate: string;
  urgeLogs: number[];
  completedMeetings: number;
  returnPoints: number;
  journal: { id: number; text: string; date: string }[];
  plan: { trigger: string; action: string } | null;
  checkins: { morning?: string; night?: string };
};

const defaultData: AppData = {
  onboarded: false,
  startDate: "2026-09-15",
  urgeLogs: [],
  completedMeetings: 12,
  returnPoints: 28,
  journal: [],
  plan: null,
  checkins: {},
};

const copy = {
  fa: {
    brand: "کامبک",
    englishBrand: "Comeback",
    tagline: "برگرد. فقط برای امروز.",
    today: "امروز",
    tools: "ابزارها",
    journal: "ژورنال",
    path: "مسیر من",
    settings: "تنظیمات",
    help: "راهنمای کوتاه",
    welcomeTitle: "قدم بعدی از همین‌جا شروع می‌شود.",
    welcomeBody: "کامبک جای پزشک، درمانگر، جلسه یا راهنما نیست. اینجا فقط قرار است کمک کند قدم بعدی را راحت‌تر برداری.",
    willingness: "برای شروع، باید خودت تمایل داشته باشی پاک بمانی و برایش قدم برداری.",
    start: "شروع کنیم",
    chooseLanguage: "زبان را انتخاب کن",
    cleanDays: "امروز چندمین روز پاکی توست؟",
    startDate: "تاریخ شروع",
    continue: "ادامه",
    clean: "روز پاکی",
    onlyToday: "اما فقط برای امروز پاک می‌مونی.",
    cleanNote: "پاکی قبلی‌ات پاک نشده؛ امروز فقط ادامه‌اش بده.",
    urge: "وسوسه دارم",
    slipped: "لغزش کردم",
    smallHelp: "این قسمت چیه؟ فقط وضعیت امروزت را ثبت می‌کنی. لازم نیست کامل باشی؛ فقط صادق باش.",
    morning: "چک‌این صبح",
    night: "چک‌این شب",
    meetings: "۹۰ روز، ۹۰ جلسه",
    meetingsNote: "هر جلسه، یک قدم واقعی به سمت برگشتن.",
    completed: "جلسه انجام شد",
    next: "جلسه بعدی",
    points: "نقاط بازگشت",
    pointsNote: "امتیاز برای اقدام‌های واقعی؛ نه برای کامل بودن.",
    milestone: "نقطهٔ بعدی",
    milestoneValue: "روز ۳۰",
    viewPath: "دیدن مسیر",
    yourDay: "روز تو",
    calm: "آرام و صادقانه پیش برو.",
    toolsTitle: "وقتی امروز سخت می‌شود",
    toolsSubtitle: "لازم نیست همه‌چیز را حل کنی. فقط اقدام بعدی را انتخاب کن.",
    pause90: "مکث ۹۰ ثانیه‌ای",
    pause90Note: "برای وقتی که وسوسه نزدیک است.",
    afterSlip: "بعد از لغزش",
    afterSlipNote: "با سرزنش شروع نمی‌کنیم؛ با برگشتن شروع می‌کنیم.",
    contacts: "تماس انسانی",
    contactsNote: "راهنما، همسر یا یک نفر امن.",
    ifThen: "برنامهٔ اگر... آنگاه...",
    ifThenNote: "از قبل تصمیم بگیر وقتی سخت شد چه می‌کنی.",
    urgeTitle: "الان وسوسه داری.",
    urgeBody: "لازم نیست باهاش بجنگی. فقط ۹۰ ثانیه با ما بمون.",
    urgeIntensity: "شدت وسوسه؟",
    urgeTrigger: "الان بیشتر کدام را نیاز داری؟",
    breathe: "نفس بکش",
    changePlace: "جایم را عوض کنم",
    callSomeone: "با کسی تماس بگیرم",
    breathGuide: "با ریتم آرام ۴–۲–۶ همراه شو",
    inhale: "دم",
    hold: "مکث",
    exhale: "بازدم",
    pause: "مکث",
    resume: "ادامه",
    restart: "از اول",
    breathComplete: "همین‌جا ماندی؛ این یک اقدام واقعی بود.",
    breathCompleteNote: "بدنت را مجبور نکن. فقط ببین حالا شدت وسوسه چقدر است.",
    stay: "بمانیم",
    afterSlipTitle: "باشه. حالا برگردیم.",
    afterSlipBody: "لغزش پایان مسیر نیست. اولین قدم را همین حالا بردار.",
    firstStep: "قدم اول",
    firstStepText: "از چیزی که در دسترس است فاصله بگیر و با یک آدم امن تماس بگیر.",
    callGuide: "تماس با راهنما",
    callPartner: "تماس با همسر",
    callFamily: "تماس با خانواده",
    emergency: "اگر در خطر فوری هستی، با خدمات اورژانسی تماس بگیر.",
    checkinTitle: "امروز با خودت چطوری؟",
    checkinMorning: "صبح امروز",
    checkinNight: "امشب",
    checkinPrompt: "یک کلمه یا چند خط بنویس؛ همین کافی است.",
    save: "ذخیره",
    saved: "ذخیره شد",
    journalTitle: "ژورنال من",
    journalEmpty: "هنوز چیزی ننوشته‌ای. یک خط برای خودت نگه دار.",
    newEntry: "یادداشت تازه",
    journalPlaceholder: "الان چه چیزی را می‌خواهی به یاد بسپاری؟",
    planTitle: "برنامه‌ات را از قبل بساز",
    ifLabel: "اگر...",
    thenLabel: "آنگاه...",
    ifPlaceholder: "اگر تنها شدم یا وسوسه بالا رفت...",
    thenPlaceholder: "آنگاه به ... زنگ می‌زنم و ...",
    savePlan: "ذخیرهٔ برنامه",
    planReady: "برنامه‌ات آماده است.",
    pathTitle: "مسیر برگشتن",
    pathSubtitle: "کامل بودن هدف نیست؛ ادامه دادن هست.",
    streak: "روز پاکی فعلی",
    recoveryCapital: "سرمایهٔ بهبودی",
    recoveryText: "هر انتخاب کوچک امن، این مسیر را محکم‌تر می‌کند.",
    settingsTitle: "حریم خصوصی و تنظیمات",
    privacyTitle: "داده‌هایت پیش خودت می‌ماند",
    privacyText: "در این نسخه، اطلاعات روی همین دستگاه ذخیره می‌شود و جایی ارسال نمی‌شود.",
    reminders: "یادآوری‌ها",
    remindersText: "برای چک‌این صبح و شب",
    on: "روشن",
    language: "زبان",
    reset: "پاک‌کردن اطلاعات این دستگاه",
    resetConfirm: "همهٔ داده‌های محلی پاک شد.",
    support: "کمک انسانی جایگزین ندارد",
    supportText: "کامبک ابزار کمکی است؛ در شرایط خطرناک از انسان‌ها و خدمات اورژانسی کمک بگیر.",
    close: "بستن",
    back: "برگشت",
    infoTitle: "یادآوری کوتاه",
    todayInfo: "اینجا فقط وضعیت امروزت را ثبت می‌کنی. لازم نیست کامل باشی؛ فقط صادق باش.",
    minute: "ثانیه",
    done: "انجام شد",
    noPressure: "بدون فشار، فقط یک قدم.",
    goodMorning: "صبح بخیر",
    goodNight: "شب بخیر",
  },
  en: {
    brand: "Comeback",
    englishBrand: "کامبک",
    tagline: "Return. Just for today.",
    today: "Today",
    tools: "Tools",
    journal: "Journal",
    path: "My path",
    settings: "Settings",
    help: "Quick guide",
    welcomeTitle: "Your next step starts here.",
    welcomeBody: "Comeback is not a replacement for a doctor, therapist, meeting, or sponsor. It is here to make the next step a little easier.",
    willingness: "To begin, you need your own willingness to stay clean and take steps toward it.",
    start: "Let’s begin",
    chooseLanguage: "Choose your language",
    cleanDays: "What day of recovery is today?",
    startDate: "Start date",
    continue: "Continue",
    clean: "days clean",
    onlyToday: "But you stay clean only for today.",
    cleanNote: "Your previous recovery is not erased; today, just continue it.",
    urge: "I have an urge",
    slipped: "I slipped",
    smallHelp: "What is this? You only record today’s state here. You don’t have to be perfect; just be honest.",
    morning: "Morning check-in",
    night: "Night check-in",
    meetings: "90 days, 90 meetings",
    meetingsNote: "Every meeting is one real step toward returning.",
    completed: "meetings done",
    next: "Next meeting",
    points: "Return points",
    pointsNote: "Points for real actions, not for perfection.",
    milestone: "Next milestone",
    milestoneValue: "Day 30",
    viewPath: "View my path",
    yourDay: "Your day",
    calm: "Move calmly and honestly.",
    toolsTitle: "When today feels hard",
    toolsSubtitle: "You don’t have to solve everything. Choose the next action.",
    pause90: "90-second pause",
    pause90Note: "For when an urge feels close.",
    afterSlip: "After a slip",
    afterSlipNote: "We don’t start with blame; we start with returning.",
    contacts: "Human support",
    contactsNote: "Sponsor, partner, or someone safe.",
    ifThen: "If… then… plan",
    ifThenNote: "Decide in advance what you’ll do when it gets hard.",
    urgeTitle: "You have an urge right now.",
    urgeBody: "You don’t have to fight it. Just stay with us for 90 seconds.",
    urgeIntensity: "How strong is it?",
    urgeTrigger: "What do you need most right now?",
    breathe: "Breathe",
    changePlace: "Change places",
    callSomeone: "Call someone",
    breathGuide: "Follow the gentle 4–2–6 rhythm",
    inhale: "Inhale",
    hold: "Hold",
    exhale: "Exhale",
    pause: "Pause",
    resume: "Resume",
    restart: "Start over",
    breathComplete: "You stayed; that was a real action.",
    breathCompleteNote: "Don’t force your body. Just notice how strong the urge feels now.",
    stay: "Stay with me",
    afterSlipTitle: "Okay. Let’s come back.",
    afterSlipBody: "A slip is not the end of the path. Take the first step now.",
    firstStep: "First step",
    firstStepText: "Move away from what is available and call someone safe.",
    callGuide: "Call sponsor",
    callPartner: "Call partner",
    callFamily: "Call family",
    emergency: "If you are in immediate danger, contact emergency services.",
    checkinTitle: "How are you with yourself today?",
    checkinMorning: "This morning",
    checkinNight: "Tonight",
    checkinPrompt: "Write one word or a few lines; that is enough.",
    save: "Save",
    saved: "Saved",
    journalTitle: "My journal",
    journalEmpty: "Nothing here yet. Keep one line for yourself.",
    newEntry: "New note",
    journalPlaceholder: "What do you want to remember right now?",
    planTitle: "Build your plan ahead of time",
    ifLabel: "If…",
    thenLabel: "Then…",
    ifPlaceholder: "If I feel alone or the urge rises…",
    thenPlaceholder: "Then I will call … and …",
    savePlan: "Save plan",
    planReady: "Your plan is ready.",
    pathTitle: "The return path",
    pathSubtitle: "Perfection is not the goal; continuing is.",
    streak: "Current recovery days",
    recoveryCapital: "Recovery capital",
    recoveryText: "Every small safe choice makes this path stronger.",
    settingsTitle: "Privacy & settings",
    privacyTitle: "Your data stays with you",
    privacyText: "In this version, information is saved on this device and is not sent anywhere.",
    reminders: "Reminders",
    remindersText: "For morning and night check-ins",
    on: "On",
    language: "Language",
    reset: "Clear data on this device",
    resetConfirm: "Local data cleared.",
    support: "Human help has no replacement",
    supportText: "Comeback is a support tool; in dangerous situations, reach people and emergency services.",
    close: "Close",
    back: "Back",
    infoTitle: "A short reminder",
    todayInfo: "This is only for recording today’s state. You don’t have to be perfect; just be honest.",
    minute: "seconds",
    done: "Done",
    noPressure: "No pressure, just one step.",
    goodMorning: "Good morning",
    goodNight: "Good night",
  },
} as const;

const navItems: { id: Screen; icon: typeof HomeIcon; label: keyof typeof copy.fa }[] = [
  { id: "today", icon: HomeIcon, label: "today" },
  { id: "tools", icon: Sparkles, label: "tools" },
  { id: "journal", icon: BookOpen, label: "journal" },
  { id: "path", icon: Target, label: "path" },
  { id: "settings", icon: MoreHorizontal, label: "settings" },
];

function getDayCount(startDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  return Math.max(1, Math.floor((today.getTime() - start.getTime()) / 86400000) + 1);
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="Comeback">
      <img className={`brand-image ${compact ? "brand-image--compact" : ""}`} src="/manus-storage/comeback-logo-trimmed_261d6845.png" alt="Comeback Recovery" />
    </div>
  );
}

function HelpButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button className="icon-button help-button" onClick={onClick} aria-label={label}><Info size={16} /></button>;
}

function AppShell({
  lang,
  screen,
  setScreen,
  children,
  onLanguage,
  onInfo,
}: {
  lang: Lang;
  screen: Screen;
  setScreen: (screen: Screen) => void;
  children: React.ReactNode;
  onLanguage: () => void;
  onInfo: () => void;
}) {
  const t = copy[lang];
  const isFa = lang === "fa";
  return (
    <div className={`app-shell ${isFa ? "rtl" : "ltr"}`} dir={isFa ? "rtl" : "ltr"}>
      <header className="topbar">
        <Logo />
        <div className="top-actions">
          <button className="language-switch" onClick={onLanguage} aria-label={t.language}>
            <span className={lang === "fa" ? "active" : ""}>فارسی</span><b>|</b><span className={lang === "en" ? "active" : ""}>English</span>
          </button>
          <button className="icon-button" onClick={onInfo} aria-label={t.help}><CircleHelp size={19} /></button>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} className={`nav-item ${screen === id ? "active" : ""}`} onClick={() => setScreen(id)}>
            <Icon size={19} strokeWidth={screen === id ? 2.3 : 1.8} />
            <span>{t[label]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

function Today({ lang, data, setModal, setScreen }: { lang: Lang; data: AppData; setModal: (m: Modal) => void; setScreen: (s: Screen) => void }) {
  const t = copy[lang];
  const days = getDayCount(data.startDate);
  const greeting = new Date().getHours() < 17 ? t.goodMorning : t.goodNight;
  return (
    <div className="page page-today">
      <div className="welcome-row"><div><span className="eyebrow">{greeting}</span><h1>{t.yourDay}</h1><p>{t.calm}</p></div><div className="today-date"><CalendarDays size={16} /> {new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { month: "short", day: "numeric" }).format(new Date())}</div></div>
      <section className="hero-card">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-card-top"><span className="soft-pill"><Leaf size={14} /> {t.clean}</span><HelpButton onClick={() => setModal("info")} label={t.help} /></div>
        <div className="day-number">{days}</div>
        <div className="day-caption">{t.onlyToday}</div>
        <div className="hero-divider" />
        <p>{t.cleanNote}</p>
        <div className="hero-actions"><button className="primary-button orange" onClick={() => setModal("urge")}><Zap size={18} />{t.urge}</button><button className="secondary-button light" onClick={() => setModal("slip")}><RotateCcw size={17} />{t.slipped}</button></div>
      </section>
      <div className="checkin-strip"><button onClick={() => setModal("checkin")}><span className="strip-icon morning-icon"><Sun size={17} /></span><span><strong>{t.morning}</strong><small>{data.checkins.morning ? t.saved : t.noPressure}</small></span><ChevronLeft size={17} /></button><button onClick={() => setModal("checkin")}><span className="strip-icon night-icon"><Moon size={17} /></span><span><strong>{t.night}</strong><small>{data.checkins.night ? t.saved : t.noPressure}</small></span><ChevronLeft size={17} /></button></div>
      <div className="stats-grid"><div className="stat-card"><div className="stat-icon green"><CalendarDays size={18} /></div><span>{t.meetings}</span><strong>{data.completedMeetings}<small> / 90</small></strong><div className="progress"><i style={{ width: `${Math.round((data.completedMeetings / 90) * 100)}%` }} /></div><button onClick={() => setScreen("path")}>{t.viewPath} <ChevronLeft size={14} /></button></div><div className="stat-card"><div className="stat-icon orange-icon"><Target size={18} /></div><span>{t.points}</span><strong>{data.returnPoints}</strong><p>{t.pointsNote}</p><button onClick={() => setScreen("path")}>{t.viewPath} <ChevronLeft size={14} /></button></div></div>
      <section className="quote-card"><div className="quote-mark">“</div><p>{lang === "fa" ? "کامبک دربارهٔ هرگز زمین‌نخوردن نیست؛ دربارهٔ کوتاه‌تر کردن فاصلهٔ بین زمین خوردن و برگشتنه." : "Comeback isn’t about never falling. It’s about shortening the distance between the fall and the return."}</p><span>— Comeback</span></section>
    </div>
  );
}

function Tools({ lang, setModal }: { lang: Lang; setModal: (m: Modal) => void }) {
  const t = copy[lang];
  return <div className="page"><SectionHeading eyebrow={t.tools} title={t.toolsTitle} subtitle={t.toolsSubtitle} /><div className="tool-list"><button className="tool-card urgent" onClick={() => setModal("urge")}><span className="tool-icon"><Timer size={21} /></span><span><strong>{t.pause90}</strong><small>{t.pause90Note}</small></span><ArrowLeft size={18} /></button><button className="tool-card recovery" onClick={() => setModal("slip")}><span className="tool-icon"><RotateCcw size={21} /></span><span><strong>{t.afterSlip}</strong><small>{t.afterSlipNote}</small></span><ArrowLeft size={18} /></button><button className="tool-card calm" onClick={() => setModal("contacts")}><span className="tool-icon"><HeartHandshake size={21} /></span><span><strong>{t.contacts}</strong><small>{t.contactsNote}</small></span><ArrowLeft size={18} /></button><button className="tool-card plan" onClick={() => setModal("plan")}><span className="tool-icon"><ShieldCheck size={21} /></span><span><strong>{t.ifThen}</strong><small>{t.ifThenNote}</small></span><ArrowLeft size={18} /></button></div><div className="tool-note"><LockKeyhole size={17} /><span>{t.privacyText}</span></div></div>;
}

function Journal({ lang, data, setModal }: { lang: Lang; data: AppData; setModal: (m: Modal) => void }) {
  const t = copy[lang];
  return <div className="page"><SectionHeading eyebrow={t.journal} title={t.journalTitle} subtitle={t.journalEmpty} action={<button className="round-add" onClick={() => setModal("journal")}><Plus size={20} /></button>} />{data.journal.length === 0 ? <div className="empty-state"><div className="empty-illustration"><BookOpen size={29} /></div><h3>{t.journalEmpty}</h3><button className="primary-button dark" onClick={() => setModal("journal")}><Plus size={17} />{t.newEntry}</button></div> : <div className="journal-list">{[...data.journal].reverse().map(entry => <article className="journal-entry" key={entry.id}><span>{entry.date}</span><p>{entry.text}</p></article>)}<button className="outline-button full" onClick={() => setModal("journal")}><Plus size={17} />{t.newEntry}</button></div>}</div>;
}

function Path({ lang, data }: { lang: Lang; data: AppData }) {
  const t = copy[lang];
  const days = getDayCount(data.startDate);
  const rings = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return <div className="page"><SectionHeading eyebrow={t.path} title={t.pathTitle} subtitle={t.pathSubtitle} /><div className="path-summary"><div className="large-stat"><span>{t.streak}</span><strong>{days}<small>{t.clean}</small></strong><div className="mini-dots">{rings.map((r) => <i key={r} className={r <= Math.min(9, Math.ceil(days / 4)) ? "filled" : ""} />)}</div></div><div className="capital-stat"><span>{t.recoveryCapital}</span><strong>{data.returnPoints}<small> pts</small></strong><p>{t.recoveryText}</p></div></div><div className="path-card"><div className="path-card-head"><div><span className="eyebrow">{t.meetings}</span><h3>{data.completedMeetings} / 90</h3></div><div className="ring-progress"><span>{Math.round((data.completedMeetings / 90) * 100)}%</span></div></div><div className="session-track">{Array.from({ length: 18 }, (_, i) => <button key={i} className={i < Math.min(18, data.completedMeetings) ? "done" : i === Math.min(17, data.completedMeetings) ? "next-session" : ""} title={`${t.next} ${i + 1}`}>{i < Math.min(18, data.completedMeetings) ? <Check size={13} /> : i + 1}</button>)}</div><p>{t.meetingsNote}</p></div><div className="milestone-card"><span className="milestone-line" /><div><span className="eyebrow">{t.milestone}</span><h3>{t.milestoneValue}</h3><p>{lang === "fa" ? "یک نقطهٔ آرام برای دیدن مسیر طی‌شده." : "A quiet point to see how far you’ve come."}</p></div><Sparkles size={22} /></div></div>;
}

function Settings({ lang, data, setLang, setData }: { lang: Lang; data: AppData; setLang: (l: Lang) => void; setData: (d: AppData) => void }) {
  const t = copy[lang];
  const clear = () => { localStorage.removeItem("comeback-data"); setData({ ...defaultData, onboarded: true }); toast.success(t.resetConfirm); };
  return <div className="page"><SectionHeading eyebrow={t.settings} title={t.settingsTitle} subtitle={t.privacyText} /><section className="settings-card privacy-card"><div className="setting-icon"><LockKeyhole size={20} /></div><div><h3>{t.privacyTitle}</h3><p>{t.privacyText}</p></div><ShieldCheck size={22} className="verified" /></section><div className="settings-list"><div className="setting-row"><span className="row-icon"><Bell size={18} /></span><div><strong>{t.reminders}</strong><small>{t.remindersText}</small></div><span className="toggle on"><i />{t.on}</span></div><div className="setting-row"><span className="row-icon"><MessageCircle size={18} /></span><div><strong>{t.language}</strong><small>فارسی / English</small></div><button className="mini-language" onClick={() => setLang(lang === "fa" ? "en" : "fa")}>{lang === "fa" ? "English" : "فارسی"}</button></div><button className="setting-row danger-row" onClick={clear}><span className="row-icon"><Trash2 size={18} /></span><div><strong>{t.reset}</strong><small>{t.privacyText}</small></div></button></div><section className="support-card"><div className="support-icon"><Phone size={19} /></div><div><h3>{t.support}</h3><p>{t.supportText}</p></div></section></div>;
}

function ModalShell({ title, onClose, children, className = "" }: { title: string; onClose: () => void; children: React.ReactNode; className?: string }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className={`modal-sheet ${className}`} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{children}</section></div>;
}

function UrgeModal({ lang, onClose, onAddPoints }: { lang: Lang; onClose: () => void; onAddPoints: (intensity: number) => void }) {
  const t = copy[lang];
  const [intensity, setIntensity] = useState(5);
  const [seconds, setSeconds] = useState(90);
  const [selected, setSelected] = useState("breathe");
  const [running, setRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseRemaining, setPhaseRemaining] = useState(4);
  const phases = [
    { key: "inhale", label: t.inhale, duration: 4 },
    { key: "hold", label: t.hold, duration: 2 },
    { key: "exhale", label: t.exhale, duration: 6 },
  ];
  const phase = phases[phaseIndex];
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => {
      setSeconds(value => Math.max(0, value - 1));
      setPhaseRemaining(value => {
        if (value <= 1) {
          setPhaseIndex(index => (index + 1) % phases.length);
          return phases[(phaseIndex + 1) % phases.length].duration;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds, phaseIndex]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);
  const restart = () => { setSeconds(90); setPhaseIndex(0); setPhaseRemaining(4); setRunning(true); };
  const finish = () => { onAddPoints(intensity); toast.success(t.breathComplete); onClose(); };
  return <ModalShell title={t.pause90} onClose={onClose} className="modal-urge"><div className="breathing-intro"><span className="soft-pill"><Leaf size={14} /> {t.breathGuide}</span><h3>{seconds > 0 ? t.urgeTitle : t.breathComplete}</h3><p>{seconds > 0 ? t.urgeBody : t.breathCompleteNote}</p></div><div className={`breathing-visual ${phase.key} ${running ? "is-running" : "is-paused"}`} aria-live="polite"><div className="breathing-rings"><span /><span /><span /></div><div className="breathing-core"><strong>{seconds}</strong><small>{t.minute}</small></div></div><div className="breathing-status"><span>{phase.label}</span><strong>{phaseRemaining}</strong></div><div className="breathing-controls"><button className="control-button" onClick={() => setRunning(value => !value)}>{running ? <><span className="pause-bars" />{t.pause}</> : <><PlayIcon />{t.resume}</>}</button><button className="control-button subtle" onClick={restart}><RotateCcw size={15} />{t.restart}</button></div><div className="field-block compact-field"><label>{t.urgeIntensity}<strong>{intensity}</strong></label><input type="range" min="0" max="10" value={intensity} onChange={e => setIntensity(Number(e.target.value))} /><div className="range-labels"><span>0</span><span>10</span></div></div><div className="choice-block"><label>{t.urgeTrigger}</label><div className="choice-grid">{[["breathe", t.breathe, Sun], ["change", t.changePlace, ArrowRight], ["call", t.callSomeone, Phone]].map(([key, label, Icon]: any) => <button key={key} className={selected === key ? "selected" : ""} onClick={() => { setSelected(key); if (key === "breathe") setRunning(true); if (key === "call") toast(t.callSomeone); }}><Icon size={17} />{label}</button>)}</div></div><button className="primary-button dark full" onClick={finish}><Check size={17} />{seconds === 0 ? t.done : t.stay}</button></ModalShell>;
}

function PlayIcon() { return <span className="play-triangle" aria-hidden="true" />; }

function SlipModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = copy[lang];
  return <ModalShell title={t.afterSlip} onClose={onClose} className="modal-slip"><div className="slip-hero"><div className="return-icon"><RotateCcw size={25} /></div><h3>{t.afterSlipTitle}</h3><p>{t.afterSlipBody}</p></div><div className="first-step-card"><span className="eyebrow">{t.firstStep}</span><p>{t.firstStepText}</p></div><div className="contact-buttons"><a href="tel:" onClick={() => toast(t.callGuide)}><Phone size={16} />{t.callGuide}</a><a href="tel:" onClick={() => toast(t.callPartner)}><Phone size={16} />{t.callPartner}</a><a href="tel:" onClick={() => toast(t.callFamily)}><Phone size={16} />{t.callFamily}</a></div><p className="emergency-note"><ShieldCheck size={15} />{t.emergency}</p></ModalShell>;
}

function CheckinModal({ lang, data, onClose, onSave }: { lang: Lang; data: AppData; onClose: () => void; onSave: (kind: CheckinKind, text: string) => void }) {
  const t = copy[lang];
  const [kind, setKind] = useState<CheckinKind>(new Date().getHours() < 17 ? "morning" : "night");
  const [text, setText] = useState(data.checkins[kind] || "");
  return <ModalShell title={t.checkinTitle} onClose={onClose}><div className="segmented"><button className={kind === "morning" ? "active" : ""} onClick={() => { setKind("morning"); setText(data.checkins.morning || ""); }}><Sun size={16} />{t.checkinMorning}</button><button className={kind === "night" ? "active" : ""} onClick={() => { setKind("night"); setText(data.checkins.night || ""); }}><Moon size={16} />{t.checkinNight}</button></div><p className="modal-copy">{t.checkinPrompt}</p><textarea className="text-area" value={text} onChange={e => setText(e.target.value)} placeholder={lang === "fa" ? "مثلاً: امروز توانستم قبل از واکنش مکث کنم..." : "For example: Today I paused before reacting…"} rows={5} /><button className="primary-button orange full" onClick={() => { onSave(kind, text); onClose(); }}><Check size={17} />{t.save}</button></ModalShell>;
}

function JournalModal({ lang, onClose, onSave }: { lang: Lang; onClose: () => void; onSave: (text: string) => void }) {
  const t = copy[lang]; const [text, setText] = useState("");
  return <ModalShell title={t.newEntry} onClose={onClose}><p className="modal-copy">{t.checkinPrompt}</p><textarea className="text-area" value={text} onChange={e => setText(e.target.value)} placeholder={t.journalPlaceholder} rows={6} autoFocus /><button className="primary-button dark full" disabled={!text.trim()} onClick={() => { onSave(text.trim()); onClose(); }}><BookOpen size={17} />{t.save}</button></ModalShell>;
}

function PlanModal({ lang, data, onClose, onSave }: { lang: Lang; data: AppData; onClose: () => void; onSave: (plan: { trigger: string; action: string }) => void }) {
  const t = copy[lang]; const [trigger, setTrigger] = useState(data.plan?.trigger || ""); const [action, setAction] = useState(data.plan?.action || "");
  return <ModalShell title={t.planTitle} onClose={onClose}><div className="plan-fields"><label><span>{t.ifLabel}</span><textarea value={trigger} onChange={e => setTrigger(e.target.value)} placeholder={t.ifPlaceholder} rows={3} /></label><div className="plan-arrow"><ArrowDown /></div><label><span>{t.thenLabel}</span><textarea value={action} onChange={e => setAction(e.target.value)} placeholder={t.thenPlaceholder} rows={3} /></label></div><button className="primary-button green full" disabled={!trigger.trim() || !action.trim()} onClick={() => { onSave({ trigger: trigger.trim(), action: action.trim() }); onClose(); }}><ShieldCheck size={17} />{t.savePlan}</button></ModalShell>;
}

function ContactsModal({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = copy[lang];
  return <ModalShell title={t.contacts} onClose={onClose}><div className="contact-hero"><HeartHandshake size={27} /><h3>{t.contacts}</h3><p>{t.contactsNote}</p></div><div className="contact-list"><a href="tel:" onClick={() => toast(t.callGuide)}><span><UserRound size={17} /></span><b>{t.callGuide}</b><ChevronLeft size={17} /></a><a href="tel:" onClick={() => toast(t.callPartner)}><span><HeartHandshake size={17} /></span><b>{t.callPartner}</b><ChevronLeft size={17} /></a><a href="tel:" onClick={() => toast(t.callFamily)}><span><Phone size={17} /></span><b>{t.callFamily}</b><ChevronLeft size={17} /></a></div><p className="emergency-note"><ShieldCheck size={15} />{t.emergency}</p></ModalShell>;
}

function Welcome({ lang, setLang, onComplete }: { lang: Lang; setLang: (l: Lang) => void; onComplete: (startDate: string) => void }) {
  const t = copy[lang];
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("2026-09-15");
  const isFa = lang === "fa";
  return (
    <div className={`welcome-screen ${isFa ? "rtl" : "ltr"}`} dir={isFa ? "rtl" : "ltr"}>
      <div className="welcome-glow glow-a" />
      <div className="welcome-glow glow-b" />
      <header className="welcome-header">
        <Logo />
        <button className="language-switch welcome-language" onClick={() => setLang(isFa ? "en" : "fa")}>
          <span className={isFa ? "active" : ""}>فارسی</span><b>|</b><span className={!isFa ? "active" : ""}>English</span>
        </button>
      </header>
      <div className="welcome-content">
        <div className="welcome-symbol"><img className="welcome-logo-image" src="/manus-storage/comeback-logo-trimmed_261d6845.png" alt="Comeback Recovery" /></div>
        {step === 0 ? (
          <div className="welcome-copy">
            <span className="eyebrow">{t.englishBrand}</span>
            <h1>{t.welcomeTitle}</h1>
            <p>{t.welcomeBody}</p>
            <p className="willingness">{t.willingness}</p>
            <button className="primary-button dark welcome-cta" onClick={() => setStep(1)}>{t.start}<ArrowLeft size={17} /></button>
          </div>
        ) : (
          <div className="welcome-copy">
            <span className="eyebrow">{t.chooseLanguage}</span>
            <h1>{t.cleanDays}</h1>
            <p>{t.cleanNote}</p>
            <label className="date-field"><CalendarDays size={18} /><span>{t.startDate}</span><input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
            <button className="primary-button orange welcome-cta" onClick={() => onComplete(date)}>{t.continue}<ArrowLeft size={17} /></button>
            <button className="text-button" onClick={() => setStep(0)}><ArrowRight size={16} />{t.back}</button>
          </div>
        )}
      </div>
      <footer className="welcome-footer"><LockKeyhole size={14} />{t.privacyText}</footer>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("comeback-lang") as Lang) || "fa");
  const [data, setData] = useState<AppData>(() => { try { return { ...defaultData, ...(JSON.parse(localStorage.getItem("comeback-data") || "null") || {}) }; } catch { return defaultData; } });
  const [screen, setScreen] = useState<Screen>("today");
  const [modal, setModal] = useState<Modal>(null);
  const t = copy[lang];
  useEffect(() => { localStorage.setItem("comeback-lang", lang); document.documentElement.lang = lang; document.documentElement.dir = lang === "fa" ? "rtl" : "ltr"; }, [lang]);
  useEffect(() => { localStorage.setItem("comeback-data", JSON.stringify(data)); }, [data]);
  const updateData = (patch: Partial<AppData>) => setData(prev => ({ ...prev, ...patch }));
  if (!data.onboarded) return <Welcome lang={lang} setLang={setLang} onComplete={startDate => updateData({ onboarded: true, startDate })} />;
  return (
    <AppShell lang={lang} screen={screen} setScreen={setScreen} onLanguage={() => setLang(lang === "fa" ? "en" : "fa")} onInfo={() => setModal("info")}>
      {screen === "today" && <Today lang={lang} data={data} setModal={setModal} setScreen={setScreen} />}
      {screen === "tools" && <Tools lang={lang} setModal={setModal} />}
      {screen === "journal" && <Journal lang={lang} data={data} setModal={setModal} />}
      {screen === "path" && <Path lang={lang} data={data} />}
      {screen === "settings" && <Settings lang={lang} data={data} setLang={setLang} setData={setData} />}
      {modal === "info" && <ModalShell title={t.infoTitle} onClose={() => setModal(null)}><div className="info-modal"><div className="info-big"><Info size={26} /></div><p>{t.todayInfo}</p><button className="primary-button dark full" onClick={() => setModal(null)}>{t.close}</button></div></ModalShell>}
      {modal === "urge" && <UrgeModal lang={lang} onClose={() => setModal(null)} onAddPoints={intensity => updateData({ returnPoints: data.returnPoints + Math.max(1, 11 - intensity), urgeLogs: [...data.urgeLogs, intensity] })} />}
      {modal === "slip" && <SlipModal lang={lang} onClose={() => setModal(null)} />}
      {modal === "checkin" && <CheckinModal lang={lang} data={data} onClose={() => setModal(null)} onSave={(kind, text) => { updateData({ checkins: { ...data.checkins, [kind]: text } }); toast.success(t.saved); }} />}
      {modal === "journal" && <JournalModal lang={lang} onClose={() => setModal(null)} onSave={text => { updateData({ journal: [...data.journal, { id: Date.now(), text, date: new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", { dateStyle: "medium" }).format(new Date()) }] }); toast.success(t.saved); }} />}
      {modal === "plan" && <PlanModal lang={lang} data={data} onClose={() => setModal(null)} onSave={plan => { updateData({ plan }); toast.success(t.planReady); }} />}
      {modal === "contacts" && <ContactsModal lang={lang} onClose={() => setModal(null)} />}
    </AppShell>
  );
}

function ArrowDown() { return <span className="arrow-down"><ChevronRight size={16} /></span>; }

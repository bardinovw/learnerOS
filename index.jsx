import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  createContext,
  useContext,
} from "react";
import {
  LayoutDashboard,
  Timer as TimerIcon,
  BookOpen,
  Plus,
  Trash2,
  GripVertical,
  Play,
  Square,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Wand2,
  Edit2,
  Check,
  Paperclip,
  ListChecks,
  ExternalLink,
  FileText,
  AlignLeft,
  Save,
  UploadCloud,
  Calendar as CalendarIcon,
  Clock,
  Palette,
  ChevronLeft,
  ChevronRight,
  History,
  TrendingUp,
  Target,
  BarChart2,
  BrainCircuit,
  Activity,
  PieChart,
  Link2,
  FolderOpen,
  FolderPlus,
  AlertTriangle,
  Settings,
} from "lucide-react";

// ==========================================
// --- UTILS: TIME & CONSTANTS ---
// ==========================================
export const HOURS_ARRAY = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, "0") + ":00",
}));

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const START_HOUR = 0;
export const END_HOUR = 23;

export function timeToMins(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

export function minsToTime(mins) {
  const safeMins = Math.max(0, isNaN(mins) ? 0 : mins);
  const h = Math.floor(safeMins / 60);
  const m = Math.floor(safeMins % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function toDateKey(dateObj) {
  if (!dateObj || isNaN(dateObj)) return "";
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
}

// ==========================================
// --- INITIAL DATA SEEDS ---
// ==========================================
const INITIAL_ROADMAP = [
  {
    id: "1",
    title: "HTML & CSS",
    description: "Basic markup and structure",
    completed: true,
    links: [],
    notes: "",
    subSteps: [],
    files: [],
    image: null,
  },
  {
    id: "3",
    title: "Git / GitHub",
    description: "Version control basics",
    completed: false,
    links: [],
    notes: "",
    subSteps: [],
    files: [],
    image: null,
  },
  {
    id: "4",
    title: "JavaScript",
    description: "Core logic, DOM manipulation, Promises",
    completed: false,
    links: [],
    notes: "",
    subSteps: [],
    files: [],
    image: null,
  },
  {
    id: "5",
    title: "React 101",
    description: "Components, State, Hooks",
    completed: false,
    links: [],
    notes: "",
    subSteps: [],
    files: [],
    image: null,
  },
];

const PARSED_DOC_STATE = {
  title:
    "Комплексный план шахматной подготовки: Стратегия достижения рейтинга 2000 Эло за 6 месяцев",
  sections: [
    {
      id: "mod_1",
      type: "module",
      title: "Модуль 1: Открытые дебюты",
      description: "Первый месяц посвящен открытым началам.",
      weeks: [
        {
          id: "w1",
          week: 1,
          opening: "Итальянская партия",
          games: "Стейниц - фон Барделебен",
          middlegame: "Захват центра",
          endgame: "Правило квадрата",
          completed: false,
          notes: "",
        },
        {
          id: "w2",
          week: 2,
          opening: "Гамбит Эванса",
          games: "Андерсен - Дюфрен",
          middlegame: "Инициатива",
          endgame: "Оппозиция",
          completed: false,
          notes: "",
        },
      ],
    },
  ],
};

const DEFAULT_SCHEDULE = [
  ...["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((day, i) => ({
    id: `work-${i}`,
    title: "Work",
    day,
    start: "07:00",
    end: "16:00",
    color: "#2c3552",
  })),
  ...["Monday", "Wednesday", "Friday"].map((day, i) => ({
    id: `box-${i}`,
    title: "Boxing Training",
    day,
    start: "20:00",
    end: "22:00",
    color: "#452424",
  })),
  ...["Tuesday", "Thursday", "Saturday"].map((day, i) => ({
    id: `math-${i}`,
    title: "Math Study",
    day,
    start: "19:00",
    end: "20:30",
    color: "#243b2d",
  })),
  ...DAYS_OF_WEEK.map((day, i) => ({
    id: `read-${i}`,
    title: "Daily Reading (Books)",
    day,
    start: "06:20",
    end: "07:00",
    color: "#a3a3a3",
  })),
  ...["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((day, i) => ({
    id: `se-${i}`,
    title: "Software Engineering Study",
    day,
    start: "17:00",
    end: "18:30",
    color: "#60a5fa",
  })),
  ...["Saturday", "Sunday"].map((day, i) => ({
    id: `se-int-${i}`,
    title: "Weekend Intensive Software Engineering",
    day,
    start: "10:00",
    end: "14:00",
    color: "#22c55e",
  })),
];

// ==========================================
// --- ERROR BOUNDARY ---
// ==========================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-[#1a1a1a] rounded-xl border border-[#ef4444]/50 flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle size={48} className="text-[#ef4444]" />
          <div>
            <h3 className="text-xl font-bold text-[#e6e6e6]">
              Component Failed to Load
            </h3>
            <p className="text-[#a3a3a3] text-sm mt-2">
              {this.state.error?.message ||
                "Data schema conflict or rendering error."}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-[#1f1f1f] text-[#e6e6e6] rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// --- ADVANCED LOCAL STORAGE HOOK ---
// ==========================================
function useLocalStorage(key, initialValue, legacyKey = null) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);

      if (legacyKey) {
        const legacyItem = window.localStorage.getItem(legacyKey);
        if (legacyItem) {
          const parsed = JSON.parse(legacyItem);
          window.localStorage.setItem(key, JSON.stringify(parsed));
          return parsed;
        }
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error initializing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// ==========================================
// --- UNIFIED GLOBAL STATE SYSTEM (STORE) ---
// ==========================================
const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider.");
  return context;
};

function AppProvider({ children }) {
  // Slices
  const [learningPlans, setLearningPlans] = useLocalStorage(
    "learneros_learning_plans",
    null,
    "learning-plans-v2",
  );
  const [chessDoc, setChessDoc] = useLocalStorage(
    "learneros_chess_data",
    PARSED_DOC_STATE,
    "chess-doc-state",
  );
  const [calendarRules, setCalendarRules] = useLocalStorage(
    "learneros_calendar_events",
    DEFAULT_SCHEDULE,
    "schedule-events",
  );
  const [events, setEvents] = useLocalStorage(
    "learneros_unified_events",
    [],
    "unified-events-log",
  );
  const [journeys, setJourneys] = useLocalStorage(
    "learneros_mastery_journeys",
    [{ id: "journey-default", title: "General Mastery", target_hours: 10000 }],
  );

  const [isMigratedV3, setIsMigratedV3] = useLocalStorage(
    "system-migrated-v4",
    false,
  );

  // Migration Hook
  useEffect(() => {
    if (!isMigratedV3) {
      let plansToSet = learningPlans;

      if (!plansToSet) {
        let legacyTopics = INITIAL_ROADMAP;
        try {
          const stored = window.localStorage.getItem("learning-topics");
          if (stored) legacyTopics = JSON.parse(stored);
        } catch (e) {}

        plansToSet = [
          {
            id: "plan-default-1",
            title: "Main Roadmap",
            created_at: new Date().toISOString(),
            image: null,
            sections: [
              {
                id: "sec-general-1",
                title: "General Topics",
                topics: Array.isArray(legacyTopics) ? legacyTopics : [],
              },
            ],
          },
        ];
        setLearningPlans(plansToSet);
      }

      let migratedEvents = Array.isArray(events) ? [...events] : [];

      if (!migratedEvents.some((e) => e.id?.startsWith("legacy-fs-"))) {
        try {
          const legacySessions = JSON.parse(
            window.localStorage.getItem("focus-sessions") || "[]",
          );
          if (Array.isArray(legacySessions)) {
            legacySessions.forEach((fs) => {
              migratedEvents.push({
                id: `legacy-fs-${fs.id || Date.now()}`,
                type: "focus_session",
                title: "Legacy Deep Work",
                start_time: new Date(
                  new Date(fs.date).getTime() - (fs.duration || 0) * 1000,
                ).toISOString(),
                end_time: fs.date || new Date().toISOString(),
                duration_minutes: Math.round((fs.duration || 0) / 60),
                related_module: "timer",
                status: "completed",
                metadata: { journeyId: "journey-default" }, // Map legacy to default journey
              });
            });
          }
        } catch (e) {}
      }

      setEvents(migratedEvents);
      setIsMigratedV3(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logEvent = (evtParams) => {
    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: evtParams.type || "system_event",
      title: evtParams.title || "Untitled",
      start_time: evtParams.start_time || new Date().toISOString(),
      end_time: evtParams.end_time || new Date().toISOString(),
      duration_minutes: Number(evtParams.duration_minutes) || 0,
      related_module: evtParams.related_module || "system",
      status: evtParams.status || "completed",
      metadata: evtParams.metadata || {},
    };
    setEvents((prev) => [...(Array.isArray(prev) ? prev : []), newEvent]);
  };

  const removeEvent = (id) => {
    setEvents((prev) =>
      (Array.isArray(prev) ? prev : []).filter((e) => e.id !== id),
    );
  };

  const value = {
    entities: {
      learningPlans: Array.isArray(learningPlans) ? learningPlans : [],
      chessDoc:
        chessDoc && typeof chessDoc === "object" ? chessDoc : PARSED_DOC_STATE,
      calendarRules: Array.isArray(calendarRules) ? calendarRules : [],
      journeys:
        Array.isArray(journeys) && journeys.length > 0
          ? journeys
          : [
              {
                id: "journey-default",
                title: "General Mastery",
                target_hours: 10000,
              },
            ],
    },
    events: Array.isArray(events) ? events : [],
    actions: {
      setLearningPlans,
      setChessDoc,
      setCalendarRules,
      setJourneys,
      logEvent,
      removeEvent,
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ==========================================
// --- MAIN APPLICATION SHELL ---
// ==========================================
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState("plan");

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#e6e6e6] font-sans overflow-hidden selection:bg-[#8b9cff]/30">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto">
          <ErrorBoundary>
            {currentTab === "plan" && <LearningPlan />}
            {currentTab === "timer" && <FocusTimer />}
            {currentTab === "chess" && <ChessPlan />}
            {currentTab === "calendar" && <ScheduleCalendar />}
            {currentTab === "analytics" && <AnalyticsDashboard />}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: "plan", label: "Learning Plans", icon: FolderOpen },
    { id: "timer", label: "Mastery Timer", icon: TimerIcon },
    { id: "chess", label: "Chess Study", icon: BookOpen },
    { id: "calendar", label: "Schedule", icon: CalendarIcon },
    { id: "analytics", label: "Central Analytics", icon: BrainCircuit },
  ];

  return (
    <div className="w-16 md:w-64 shrink-0 bg-[#121212] border-r border-[#2a2a2a] flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      <div className="p-4 md:p-6 flex justify-center md:justify-start">
        <h1 className="text-xl font-bold tracking-tight text-[#e6e6e6] flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#8b9cff] flex items-center justify-center text-[#0d0d0d] shadow-sm shrink-0">
            <BookOpen size={20} className="font-bold" />
          </div>
          <span className="hidden md:block">LearnerOS</span>
        </h1>
      </div>
      <nav className="flex-1 px-2 md:px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive
                  ? "bg-[#8b9cff]/10 text-[#8b9cff] border-[#8b9cff]/30 font-medium"
                  : "bg-transparent text-[#a3a3a3] border-transparent hover:bg-[#1f1f1f] hover:text-[#e6e6e6]"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden md:block whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 md:p-6 border-t border-[#2a2a2a] text-[10px] md:text-xs text-[#737373] font-mono uppercase tracking-widest text-center md:text-left">
        <span className="hidden md:block">v4.0.0 Journeys</span>
        <span className="md:hidden">v4.0</span>
      </div>
    </div>
  );
}

// ==========================================
// --- MODULE: LEARNING PLAN ---
// ==========================================
function LearningPlan() {
  const { entities, actions, events } = useAppContext();
  const plans = entities.learningPlans;

  const [activePlanId, setActivePlanId] = useState(plans[0]?.id || null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    if (plans.length > 0 && !plans.find((p) => p.id === activePlanId)) {
      setActivePlanId(plans[0].id);
    }
  }, [plans, activePlanId]);

  const activePlan = plans.find((p) => p.id === activePlanId);

  const addNewPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      title: "New Roadmap",
      created_at: new Date().toISOString(),
      image: null,
      sections: [{ id: `sec-${Date.now()}`, title: "Chapter 1", topics: [] }],
    };
    actions.setLearningPlans([...plans, newPlan]);
    setActivePlanId(newPlan.id);
    setEditingPlanId(newPlan.id);
  };

  const deletePlan = (id) => {
    if (
      window.confirm("Delete this entire learning plan and all its sections?")
    ) {
      actions.setLearningPlans(plans.filter((p) => p.id !== id));
    }
  };

  const updatePlan = (id, updates) => {
    actions.setLearningPlans(
      plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const addSection = () => {
    if (!activePlan) return;
    const newSection = {
      id: `sec-${Date.now()}`,
      title: "New Chapter",
      topics: [],
    };
    const updatedSections = Array.isArray(activePlan.sections)
      ? [...activePlan.sections, newSection]
      : [newSection];
    updatePlan(activePlan.id, { sections: updatedSections });
    setEditingSectionId(newSection.id);
  };

  const deleteSection = (secId) => {
    if (window.confirm("Delete this chapter and ALL topics inside it?")) {
      updatePlan(activePlan.id, {
        sections: (activePlan.sections || []).filter((s) => s.id !== secId),
      });
    }
  };

  const updateSection = (secId, title) => {
    updatePlan(activePlan.id, {
      sections: (activePlan.sections || []).map((s) =>
        s.id === secId ? { ...s, title } : s,
      ),
    });
  };

  const addTopicToSection = (secId) => {
    const newTopic = {
      id: `top-${Date.now()}`,
      title: "New Node",
      description: "Topic description...",
      completed: false,
      links: [],
      notes: "",
      subSteps: [],
      files: [],
      image: null,
    };
    const updatedSections = (activePlan.sections || []).map((s) => {
      if (s.id === secId)
        return { ...s, topics: [...(s.topics || []), newTopic] };
      return s;
    });
    updatePlan(activePlan.id, { sections: updatedSections });
    setEditingTopicId(newTopic.id);
  };

  const updateTopic = (topicId, updates) => {
    const updatedSections = (activePlan.sections || []).map((s) => ({
      ...s,
      topics: (s.topics || []).map((t) =>
        t.id === topicId ? { ...t, ...updates } : t,
      ),
    }));
    updatePlan(activePlan.id, { sections: updatedSections });
  };

  const deleteTopic = (topicId) => {
    if (window.confirm("Are you sure you want to remove this topic?")) {
      const updatedSections = (activePlan.sections || []).map((s) => ({
        ...s,
        topics: (s.topics || []).filter((t) => t.id !== topicId),
      }));
      updatePlan(activePlan.id, { sections: updatedSections });
      if (selectedTopicId === topicId) setSelectedTopicId(null);
    }
  };

  const toggleTopicComplete = (topic) => {
    updateTopic(topic.id, { completed: !topic.completed });
    if (!topic.completed) {
      actions.logEvent({
        type: "learning_topic",
        title: `Completed: ${topic.title}`,
        duration_minutes: 0,
        related_module: "learning_plan",
        metadata: { planId: activePlan.id, topicId: topic.id },
      });
    }
  };

  const handleDragStart = (e, sectionId, topicIndex) => {
    dragItem.current = { sectionId, topicIndex };
    setTimeout(() => {
      if (e.target) e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnter = (e, sectionId, topicIndex) => {
    e.preventDefault();
    dragOverItem.current = { sectionId, topicIndex };
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    if (!dragItem.current || !dragOverItem.current) return;

    const { sectionId: fromSecId, topicIndex: fromIdx } = dragItem.current;
    const { sectionId: toSecId, topicIndex: toIdx } = dragOverItem.current;

    let newSections = JSON.parse(JSON.stringify(activePlan.sections || []));
    const fromSec = newSections.find((s) => s.id === fromSecId);
    const toSec = newSections.find((s) => s.id === toSecId);

    if (fromSec && toSec) {
      const [draggedTopic] = fromSec.topics.splice(fromIdx, 1);
      if (toIdx >= toSec.topics.length) toSec.topics.push(draggedTopic);
      else toSec.topics.splice(toIdx, 0, draggedTopic);
      updatePlan(activePlan.id, { sections: newSections });
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in">
        <FolderOpen size={64} className="text-[#333]" />
        <h2 className="text-2xl font-bold text-[#e6e6e6]">
          No Learning Plans Found
        </h2>
        <button
          onClick={addNewPlan}
          className="bg-[#8b9cff] text-[#0d0d0d] px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#a3b1ff]"
        >
          <FolderPlus size={20} /> Create First Plan
        </button>
      </div>
    );
  }

  if (!activePlan) return null;

  const allTopics = (activePlan.sections || []).flatMap((s) => s.topics || []);
  const totalTopics = allTopics.length;
  const completedTopics = allTopics.filter((t) => t.completed).length;
  const overallProgress =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const selectedTopic = allTopics.find((t) => t.id === selectedTopicId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Plan Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setActivePlanId(plan.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors border ${
              activePlanId === plan.id
                ? "bg-[#1a1a1a] text-[#8b9cff] border-[#8b9cff]/30"
                : "bg-transparent text-[#737373] border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-[#e6e6e6]"
            }`}
          >
            {plan.title}
          </button>
        ))}
        <button
          onClick={addNewPlan}
          className="px-3 py-2 rounded-lg border border-dashed border-[#2a2a2a] text-[#737373] hover:border-[#8b9cff]/50 hover:text-[#8b9cff] transition-colors shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Plan Overview Card */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] relative overflow-hidden shadow-sm flex flex-col md:flex-row gap-6">
        <div
          className="absolute top-0 left-0 h-1 bg-[#8b9cff] transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            {editingPlanId === activePlan.id ? (
              <div className="flex w-full items-center gap-2">
                <input
                  value={activePlan.title}
                  onChange={(e) =>
                    updatePlan(activePlan.id, { title: e.target.value })
                  }
                  className="bg-[#121212] border border-[#2a2a2a] text-2xl font-bold text-[#e6e6e6] px-3 py-1 rounded w-full focus:outline-none focus:border-[#8b9cff]"
                  autoFocus
                  onBlur={() => setEditingPlanId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingPlanId(null)}
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-[#e6e6e6] group flex items-center gap-3">
                {activePlan.title}
                <button
                  onClick={() => setEditingPlanId(activePlan.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#737373] hover:text-[#8b9cff]"
                >
                  <Edit2 size={18} />
                </button>
              </h2>
            )}
            <button
              onClick={() => deletePlan(activePlan.id)}
              className="text-[#737373] hover:text-[#ef4444] p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <div>
              <div className="text-4xl font-bold text-[#e6e6e6] tracking-tight">
                {overallProgress}%
              </div>
              <div className="text-[#737373] font-medium uppercase tracking-widest text-[10px] mt-1">
                Total Completion
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#e6e6e6] tracking-tight">
                {completedTopics}{" "}
                <span className="text-xl text-[#737373]">/ {totalTopics}</span>
              </div>
              <div className="text-[#737373] font-medium uppercase tracking-widest text-[10px] mt-1">
                Nodes Finished
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              {activePlan.image ? (
                <div className="relative group rounded-lg overflow-hidden h-16 border border-[#2a2a2a]">
                  <img
                    src={activePlan.image}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-80 grayscale"
                  />
                  <button
                    onClick={() => updatePlan(activePlan.id, { image: null })}
                    className="absolute top-1 right-1 bg-[#0d0d0d]/80 p-1.5 rounded text-[#e6e6e6] opacity-0 group-hover:opacity-100 hover:bg-[#ef4444]"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-[#2a2a2a] hover:border-[#8b9cff]/50 rounded-lg h-16 flex items-center justify-center text-[#737373] hover:text-[#8b9cff] cursor-pointer text-xs font-medium bg-[#121212]">
                  <ImageIcon size={16} className="mr-2" /> Upload Banner
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        const r = new FileReader();
                        r.onloadend = () =>
                          updatePlan(activePlan.id, { image: r.result });
                        r.readAsDataURL(f);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters (Sections) */}
      <div className="space-y-12">
        {(activePlan.sections || []).map((section, sIdx) => {
          const secTopics = section.topics || [];
          const secTotal = secTopics.length;
          const secCompleted = secTopics.filter((t) => t.completed).length;
          const secProgress =
            secTotal > 0 ? (secCompleted / secTotal) * 100 : 0;

          return (
            <div key={section.id} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#737373] font-mono text-sm shrink-0">
                  {sIdx + 1}
                </div>
                <div className="flex-1">
                  {editingSectionId === section.id ? (
                    <input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, e.target.value)
                      }
                      onBlur={() => setEditingSectionId(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingSectionId(null)
                      }
                      autoFocus
                      className="bg-transparent border-b border-[#8b9cff] text-[#e6e6e6] text-xl font-bold px-1 py-0.5 focus:outline-none w-full max-w-sm"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-[#e6e6e6] flex items-center gap-3 group">
                      {section.title}
                      <button
                        onClick={() => setEditingSectionId(section.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#737373] hover:text-[#8b9cff]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#737373] hover:text-[#ef4444] ml-auto md:ml-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </h3>
                  )}
                  {secTotal > 0 && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-1 w-32 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8b9cff] transition-all"
                          style={{ width: `${secProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest">
                        {secCompleted}/{secTotal} Nodes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[15px] md:before:ml-[23px] before:-translate-x-px before:h-full before:w-px before:bg-[#2a2a2a]/50">
                {secTopics.map((topic, tIdx) => {
                  const focusTime = events
                    .filter(
                      (e) =>
                        e.type === "focus_session" &&
                        e.metadata?.linkId === topic.id,
                    )
                    .reduce(
                      (sum, e) => sum + (Number(e.duration_minutes) || 0),
                      0,
                    );

                  return (
                    <div
                      key={topic.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, section.id, tIdx)}
                      onDragEnter={(e) => handleDragEnter(e, section.id, tIdx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      className="relative flex items-center gap-4 group pl-10"
                    >
                      <div
                        className={`absolute left-0 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-[3px] border-[#0d0d0d] ${topic.completed ? "bg-[#8b9cff] text-[#0d0d0d]" : "bg-[#1a1a1a] text-[#737373]"} z-10 transition-colors duration-300`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopicComplete(topic);
                          }}
                          className="focus:outline-none"
                        >
                          {topic.completed ? (
                            <CheckCircle2 size={16} className="md:w-6 md:h-6" />
                          ) : (
                            <Circle
                              className="hover:text-[#a3a3a3] transition-colors md:w-6 md:h-6"
                              size={16}
                            />
                          )}
                        </button>
                      </div>

                      <div
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`flex-1 bg-[#1a1a1a] p-4 md:p-5 rounded-xl border transition-all duration-200 cursor-pointer ${topic.completed ? "border-[#2a2a2a] opacity-70" : "border-[#2a2a2a] hover:border-[#8b9cff]/40 hover:shadow-lg"}`}
                      >
                        {editingTopicId === topic.id ? (
                          <div
                            className="space-y-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={topic.title}
                              onChange={(e) =>
                                updateTopic(topic.id, { title: e.target.value })
                              }
                              className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 text-[#e6e6e6] focus:border-[#8b9cff] focus:outline-none"
                              autoFocus
                            />
                            <textarea
                              value={topic.description}
                              onChange={(e) =>
                                updateTopic(topic.id, {
                                  description: e.target.value,
                                })
                              }
                              className="w-full bg-[#121212] border border-[#2a2a2a] rounded px-3 py-2 text-[#e6e6e6] text-sm h-20 resize-none focus:outline-none focus:border-[#8b9cff]"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingTopicId(null)}
                                className="px-4 py-1.5 bg-[#8b9cff] text-[#0d0d0d] rounded font-medium"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <h4
                                className={`text-base md:text-lg font-semibold ${topic.completed ? "text-[#737373] line-through" : "text-[#e6e6e6]"}`}
                              >
                                {topic.title}
                              </h4>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 shrink-0">
                                <button className="text-[#737373] hover:text-[#a3a3a3] cursor-grab">
                                  <GripVertical size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTopicId(topic.id);
                                  }}
                                  className="text-[#737373] hover:text-[#8b9cff]"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTopic(topic.id);
                                  }}
                                  className="text-[#737373] hover:text-[#ef4444]"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <p className="text-[#a3a3a3] text-sm line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4 text-[10px] md:text-xs text-[#737373] font-medium uppercase tracking-wider">
                              {focusTime > 0 && (
                                <span className="flex items-center gap-1.5 text-[#8b9cff] bg-[#8b9cff]/10 px-2 py-0.5 rounded border border-[#8b9cff]/20">
                                  <Clock size={14} /> {focusTime}m Focused
                                </span>
                              )}
                              {topic.subSteps?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <ListChecks size={14} />{" "}
                                  {
                                    topic.subSteps.filter((s) => s.completed)
                                      .length
                                  }
                                  /{topic.subSteps.length}
                                </span>
                              )}
                              {topic.links?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <LinkIcon size={14} /> {topic.links.length}
                                </span>
                              )}
                              {topic.files?.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Paperclip size={14} /> {topic.files.length}
                                </span>
                              )}
                              {topic.notes && (
                                <span className="flex items-center gap-1.5">
                                  <AlignLeft size={14} /> Notes
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div
                  className="pl-10 py-2 relative"
                  onDragEnter={(e) =>
                    handleDragEnter(e, section.id, secTopics.length)
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDragEnd}
                >
                  <button
                    onClick={() => addTopicToSection(section.id)}
                    className="text-[#737373] hover:text-[#8b9cff] text-sm font-medium flex items-center gap-2 py-2 px-4 border border-dashed border-[#2a2a2a] hover:border-[#8b9cff]/50 rounded-lg w-full justify-center md:w-auto md:justify-start"
                  >
                    <Plus size={16} /> Append Node to Chapter
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-8 border-t border-[#2a2a2a] flex justify-center">
          <button
            onClick={addSection}
            className="bg-[#1a1a1a] text-[#a3a3a3] border border-[#2a2a2a] px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[#1f1f1f] hover:text-[#e6e6e6] transition-all"
          >
            <Plus size={20} /> Add New Chapter
          </button>
        </div>
      </div>

      {selectedTopic && (
        <TopicDetailModal
          topic={selectedTopic}
          onClose={() => setSelectedTopicId(null)}
          onUpdate={updateTopic}
        />
      )}
    </div>
  );
}

function TopicDetailModal({ topic, onClose, onUpdate }) {
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newStep, setNewStep] = useState("");
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  const subSteps = topic.subSteps || [];
  const links = topic.links || [];
  const files = topic.files || [];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdate(topic.id, { image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        type: file.type,
      };
      onUpdate(topic.id, { files: [...files, newFile] });
    }
  };

  const addSubStep = (e) => {
    e.preventDefault();
    if (!newStep.trim()) return;
    onUpdate(topic.id, {
      subSteps: [
        ...subSteps,
        { id: Date.now().toString(), title: newStep, completed: false },
      ],
    });
    setNewStep("");
  };

  const toggleSubStep = (stepId) => {
    const updatedSteps = subSteps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s,
    );
    onUpdate(topic.id, { subSteps: updatedSteps });
  };

  const removeSubStep = (stepId) => {
    onUpdate(topic.id, { subSteps: subSteps.filter((s) => s.id !== stepId) });
  };

  const addLink = (e) => {
    e.preventDefault();
    if (!newLinkUrl.trim()) return;
    const linkObj = {
      id: Date.now().toString(),
      title: newLinkTitle.trim() || newLinkUrl,
      url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
    };
    onUpdate(topic.id, { links: [...links, linkObj] });
    setNewLinkUrl("");
    setNewLinkTitle("");
  };

  const removeLink = (linkId) => {
    onUpdate(topic.id, { links: links.filter((l) => l.id !== linkId) });
  };
  const removeFile = (fileId) => {
    onUpdate(topic.id, { files: files.filter((f) => f.id !== fileId) });
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in sm:p-6">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-start bg-[#121212]">
          <div className="flex-1 mr-4">
            <input
              value={topic.title}
              onChange={(e) => onUpdate(topic.id, { title: e.target.value })}
              className="w-full bg-transparent text-2xl md:text-3xl font-bold text-[#e6e6e6] focus:outline-none focus:border-b border-[#8b9cff] border-b border-transparent transition-all duration-200 mb-2"
              placeholder="Topic Title"
            />
            <input
              value={topic.description}
              onChange={(e) =>
                onUpdate(topic.id, { description: e.target.value })
              }
              className="w-full bg-transparent text-[#a3a3a3] font-medium focus:outline-none focus:border-b border-[#8b9cff] border-b border-transparent transition-all duration-200"
              placeholder="Short description..."
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#737373] hover:text-[#e6e6e6] hover:bg-[#1f1f1f] rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="group relative">
                {topic.image ? (
                  <div className="relative rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#121212] shadow-sm">
                    <img
                      src={topic.image}
                      alt="Banner"
                      className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity grayscale"
                    />
                    <button
                      onClick={() => onUpdate(topic.id, { image: null })}
                      className="absolute top-3 right-3 bg-[#0d0d0d]/80 p-2 rounded-lg text-[#e6e6e6] opacity-0 group-hover:opacity-100 hover:bg-[#ef4444]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#2a2a2a] hover:border-[#8b9cff]/50 rounded-lg h-24 flex flex-col items-center justify-center text-[#737373] hover:text-[#8b9cff] cursor-pointer transition-colors duration-200 bg-[#121212]">
                    <div className="flex items-center gap-2 font-medium">
                      <ImageIcon size={20} /> <span>Add Topic Banner</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#e6e6e6] flex items-center gap-2 uppercase tracking-wide">
                  <AlignLeft size={18} className="text-[#8b9cff]" /> Study Notes
                </h3>
                <div
                  className={`rounded-lg border transition-all duration-200 ${isNotesFocused ? "border-[#8b9cff] ring-1 ring-[#8b9cff]/30" : "border-[#2a2a2a]"}`}
                >
                  <textarea
                    value={topic.notes || ""}
                    onChange={(e) =>
                      onUpdate(topic.id, { notes: e.target.value })
                    }
                    onFocus={() => setIsNotesFocused(true)}
                    onBlur={() => setIsNotesFocused(false)}
                    className="w-full bg-[#121212] rounded-lg p-4 text-[#e6e6e6] leading-relaxed focus:outline-none min-h-[150px] resize-y custom-scrollbar"
                    placeholder="Write detailed notes..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#e6e6e6] flex items-center gap-2 uppercase tracking-wide">
                  <ListChecks size={18} className="text-[#8b9cff]" /> Action
                  Items
                </h3>
                {subSteps.length > 0 && (
                  <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] transition-all duration-500"
                      style={{
                        width: `${(subSteps.filter((s) => s.completed).length / subSteps.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {subSteps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleSubStep(step.id)}>
                          {step.completed ? (
                            <CheckCircle2
                              size={18}
                              className="text-[#22c55e]"
                            />
                          ) : (
                            <Circle size={18} className="text-[#737373]" />
                          )}
                        </button>
                        <span
                          className={`text-sm font-medium ${step.completed ? "text-[#737373] line-through" : "text-[#e6e6e6]"}`}
                        >
                          {step.title}
                        </span>
                      </div>
                      <button
                        onClick={() => removeSubStep(step.id)}
                        className="text-[#737373] hover:text-[#ef4444] opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <form
                    onSubmit={addSubStep}
                    className="flex items-center gap-2 mt-2"
                  >
                    <input
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-1 bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff]"
                    />
                    <button
                      type="submit"
                      disabled={!newStep.trim()}
                      className="p-2.5 bg-[#1f1f1f] text-[#e6e6e6] rounded-lg hover:bg-[#2a2a2a] disabled:opacity-50"
                    >
                      <Plus size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#e6e6e6] flex items-center gap-2 uppercase tracking-wide">
                  <LinkIcon size={18} className="text-[#8b9cff]" /> Resources
                </h3>
                <div className="space-y-2">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#2a2a2a] group hover:border-[#3a3a3a]"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-[#a3a3a3] hover:text-[#8b9cff] truncate"
                      >
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">{link.title}</span>
                      </a>
                      <button
                        onClick={() => removeLink(link.id)}
                        className="text-[#737373] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 ml-2 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <form
                    onSubmit={addLink}
                    className="space-y-2 mt-3 pt-3 border-t border-[#2a2a2a]"
                  >
                    <input
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="Resource Title"
                      className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#e6e6e6] focus:border-[#8b9cff] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-[#121212] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#e6e6e6] focus:border-[#8b9cff] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newLinkUrl.trim()}
                        className="p-2 bg-[#1f1f1f] text-[#e6e6e6] rounded-lg hover:bg-[#2a2a2a] disabled:opacity-50"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#e6e6e6] flex items-center gap-2 uppercase tracking-wide">
                  <Paperclip size={18} className="text-[#8b9cff]" /> Attachments
                </h3>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#2a2a2a] group hover:border-[#3a3a3a]"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText
                          size={16}
                          className="text-[#737373] shrink-0"
                        />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-[#a3a3a3] truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-[#737373] font-mono">
                            {file.size}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-[#737373] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 ml-2 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-[#2a2a2a] rounded-lg font-medium text-sm text-[#737373] hover:text-[#8b9cff] cursor-pointer bg-[#121212]">
                    <Plus size={16} /> Add File Mock
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-[#2a2a2a] bg-[#121212] flex justify-between items-center">
          <span className="text-xs text-[#737373] font-medium uppercase tracking-wider flex items-center gap-1">
            <Save size={12} /> Auto-saved
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#8b9cff] text-[#0d0d0d] rounded-lg font-medium hover:bg-[#a3b1ff]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- MODULE: FOCUS TIMER ---
// ==========================================
function FocusTimer() {
  const { entities, actions, events } = useAppContext();

  const [isRunning, setIsRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Custom Topic & Multi-Journey additions
  const [customTopic, setCustomTopic] = useState("");
  const journeys =
    Array.isArray(entities.journeys) && entities.journeys.length > 0
      ? entities.journeys
      : [
          {
            id: "journey-default",
            title: "General Mastery",
            target_hours: 10000,
          },
        ];
  const [activeJourneyId, setActiveJourneyId] = useLocalStorage(
    "active-journey",
    journeys[0].id,
  );
  const [isManagingJourneys, setIsManagingJourneys] = useState(false);

  const activeJourney =
    journeys.find((j) => j.id === activeJourneyId) || journeys[0];
  const [selectedLinkId, setSelectedLinkId] = useState("");

  const activeLinks = useMemo(() => {
    const list = [
      { id: "", title: "Unstructured Deep Work", module: "general" },
    ];

    if (Array.isArray(entities.learningPlans)) {
      entities.learningPlans.forEach((plan) => {
        if (Array.isArray(plan.sections)) {
          plan.sections.forEach((sec) => {
            if (Array.isArray(sec.topics)) {
              sec.topics
                .filter((t) => !t.completed)
                .forEach((t) =>
                  list.push({
                    id: t.id,
                    title: `${plan.title}: ${t.title}`,
                    module: "learning_plan",
                  }),
                );
            }
          });
        }
      });
    }

    if (entities.chessDoc && Array.isArray(entities.chessDoc.sections)) {
      entities.chessDoc.sections.forEach((s) => {
        if (s.type === "module" && Array.isArray(s.weeks)) {
          s.weeks
            .filter((w) => !w.completed)
            .forEach((w) =>
              list.push({
                id: w.id,
                title: `Chess: ${w.opening}`,
                module: "chess_study",
              }),
            );
        }
      });
    }
    return list;
  }, [entities]);

  // Aggregate ONLY for the active journey
  const safeEvents = Array.isArray(events) ? events : [];
  const journeyEvents = safeEvents.filter(
    (e) =>
      e.type === "focus_session" &&
      (e.metadata?.journeyId === activeJourney.id ||
        (!e.metadata?.journeyId && activeJourney.id === "journey-default")),
  );

  const totalJourneySeconds = journeyEvents.reduce(
    (sum, e) => sum + (Number(e.duration_minutes) || 0) * 60,
    0,
  );

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    } else if (!isRunning && sessionSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, sessionSeconds]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setShowConfirmModal(true);
    } else {
      setIsRunning(true);
    }
  };

  const saveSession = () => {
    if (sessionSeconds > 0) {
      const link = activeLinks.find((l) => l.id === selectedLinkId);
      const finalTitle = customTopic.trim()
        ? customTopic.trim()
        : link && link.id
          ? link.title
          : "Deep Work";

      actions.logEvent({
        type: "focus_session",
        title: finalTitle,
        start_time: new Date(Date.now() - sessionSeconds * 1000).toISOString(),
        end_time: new Date().toISOString(),
        duration_minutes: Math.round(sessionSeconds / 60),
        related_module: link && link.id ? link.module : "timer",
        status: "completed",
        metadata: {
          linkId: link?.id || null,
          journeyId: activeJourney.id,
          customTopic: customTopic.trim(),
        },
      });
    }
    setSessionSeconds(0);
    setCustomTopic("");
    setShowConfirmModal(false);
  };

  const discardSession = () => {
    setSessionSeconds(0);
    setShowConfirmModal(false);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const targetSeconds = (Number(activeJourney.target_hours) || 10000) * 3600;
  const remainingSeconds = Math.max(0, targetSeconds - totalJourneySeconds);
  const progressPercent = (totalJourneySeconds / targetSeconds) * 100;

  const recentSessions = journeyEvents
    .sort((a, b) => new Date(b.end_time) - new Date(a.end_time))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-[#e6e6e6] mb-2">
          Mastery Timer
        </h2>
        <p className="text-[#a3a3a3] leading-relaxed">
          Execute deliberate practice across your personalized 10,000 hour
          journeys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center border border-[#2a2a2a] relative overflow-hidden shadow-sm">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full bg-[#8b9cff]/5 blur-3xl transition-opacity duration-1000 ${isRunning ? "opacity-100" : "opacity-0"}`}
          />

          <div className="z-10 w-full max-w-sm mb-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <select
                value={activeJourneyId}
                onChange={(e) => setActiveJourneyId(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#121212] border border-[#2a2a2a] text-[#e6e6e6] text-sm font-semibold rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-[#8b9cff] transition-colors disabled:opacity-50"
              >
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    Journey: {j.title}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsManagingJourneys(true)}
                disabled={isRunning}
                className="p-2 bg-[#1f1f1f] text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                title="Manage Journeys"
              >
                <Settings size={18} />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="What are you studying right now?"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#121212] border border-[#2a2a2a] text-[#e6e6e6] text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-[#8b9cff] transition-colors disabled:opacity-50 placeholder:text-[#555]"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Link2 size={16} className="text-[#737373]" />
              </div>
              <select
                value={selectedLinkId}
                onChange={(e) => setSelectedLinkId(e.target.value)}
                disabled={isRunning}
                className="w-full bg-[#121212] border border-[#2a2a2a] text-[#e6e6e6] text-sm rounded-lg pl-10 pr-4 py-3 appearance-none focus:outline-none focus:border-[#8b9cff] transition-colors disabled:opacity-50"
              >
                {activeLinks.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-center z-10 mb-8">
            <h3 className="text-[#737373] font-medium mb-4 uppercase tracking-widest text-sm">
              Focus Time
            </h3>
            <div className="font-mono text-8xl md:text-9xl font-light text-[#e6e6e6] tabular-nums tracking-tighter drop-shadow-sm">
              {formatTime(sessionSeconds)}
            </div>
          </div>

          <div className="z-10 flex gap-4">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-3 px-10 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
                isRunning
                  ? "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30 hover:bg-[#ef4444]/20"
                  : "bg-[#8b9cff] text-[#0d0d0d] border-transparent hover:bg-[#a3b1ff] shadow-[0_4px_20px_rgba(139,156,255,0.25)]"
              }`}
            >
              {isRunning ? (
                <Square size={24} />
              ) : (
                <Play size={24} className="ml-1" />
              )}
              {isRunning ? "Stop Session" : "Start Deep Work"}
            </button>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] flex-1 shadow-sm">
            <h3 className="text-lg font-semibold text-[#e6e6e6] mb-6 uppercase tracking-wide">
              Progress: {activeJourney.title}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-[#a3a3a3]">Total Accumulated</span>
                  <span className="text-[#8b9cff] font-mono">
                    {formatTime(totalJourneySeconds)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-[#a3a3a3]">Remaining</span>
                  <span className="text-[#e6e6e6] font-mono">
                    {formatTime(remainingSeconds)}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8b9cff] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(0.1, progressPercent)}%` }}
                />
              </div>
              <p className="text-right text-xs text-[#737373] font-mono font-medium tracking-widest uppercase">
                Target: {activeJourney.target_hours}h
              </p>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] flex-1 flex flex-col shadow-sm">
            <h3 className="text-lg font-semibold text-[#e6e6e6] mb-4 uppercase tracking-wide">
              Recent Sessions
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {recentSessions.length === 0 ? (
                <p className="text-[#737373] text-sm font-medium uppercase tracking-widest text-center mt-4">
                  No events logged
                </p>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col p-3 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#e6e6e6] font-medium text-xs truncate max-w-[150px]">
                        {session.title}
                      </span>
                      <span className="text-[#8b9cff] font-mono text-xs">
                        +{session.duration_minutes}m
                      </span>
                    </div>
                    <span className="text-[#737373] text-[10px] uppercase tracking-wider">
                      {new Date(session.end_time).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in z-[100]">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[#e6e6e6] mb-2">
              Save Focus Session?
            </h3>
            <p className="text-[#a3a3a3] mb-6 font-medium leading-relaxed">
              You've executed{" "}
              <strong className="text-[#e6e6e6] font-mono">
                {formatTime(sessionSeconds)}
              </strong>{" "}
              of work towards your{" "}
              <span className="text-[#8b9cff] font-semibold">
                {activeJourney.title}
              </span>{" "}
              journey.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={discardSession}
                className="px-4 py-2 rounded-lg text-[#a3a3a3] font-medium hover:text-[#e6e6e6] hover:bg-[#1f1f1f] transition-colors duration-200"
              >
                Discard
              </button>
              <button
                onClick={saveSession}
                className="px-6 py-2 rounded-lg bg-[#8b9cff] text-[#0d0d0d] font-medium hover:bg-[#a3b1ff] transition-all duration-200 shadow-sm"
              >
                Commit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {isManagingJourneys && (
        <JourneyManagerModal
          journeys={journeys}
          onSave={(updated) => {
            actions.setJourneys(updated);
            setIsManagingJourneys(false);
          }}
          onClose={() => setIsManagingJourneys(false)}
        />
      )}
    </div>
  );
}

function JourneyManagerModal({ journeys, onSave, onClose }) {
  const [localJourneys, setLocalJourneys] = useState([...journeys]);

  const handleAdd = () => {
    setLocalJourneys([
      ...localJourneys,
      {
        id: `journey-${Date.now()}`,
        title: "New Mastery Goal",
        target_hours: 10000,
      },
    ]);
  };

  const handleUpdate = (id, field, value) => {
    setLocalJourneys(
      localJourneys.map((j) => (j.id === id ? { ...j, [field]: value } : j)),
    );
  };

  const handleDelete = (id) => {
    if (localJourneys.length <= 1) {
      alert("You must have at least one mastery journey.");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to delete this journey? Associated logs will remain in unified events but will fallback to the default journey view if unmatched.",
      )
    ) {
      setLocalJourneys(localJourneys.filter((j) => j.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in z-[100]">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-5 border-b border-[#2a2a2a] flex justify-between items-center bg-[#121212]">
          <h3 className="text-lg font-semibold text-[#e6e6e6]">
            Manage Mastery Journeys
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#1f1f1f] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 custom-scrollbar">
          {localJourneys.map((j) => (
            <div
              key={j.id}
              className="bg-[#121212] p-4 rounded-lg border border-[#2a2a2a] flex flex-col gap-3 relative group"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold mb-1 block">
                    Journey Title
                  </label>
                  <input
                    type="text"
                    value={j.title}
                    onChange={(e) =>
                      handleUpdate(j.id, "title", e.target.value)
                    }
                    className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff]"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[10px] uppercase tracking-wider text-[#737373] font-semibold mb-1 block">
                    Goal (Hours)
                  </label>
                  <input
                    type="number"
                    value={j.target_hours}
                    onChange={(e) =>
                      handleUpdate(j.id, "target_hours", Number(e.target.value))
                    }
                    className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff]"
                  />
                </div>
              </div>
              <button
                onClick={() => handleDelete(j.id)}
                className="absolute top-2 right-2 p-2 text-[#737373] hover:text-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAdd}
            className="w-full py-3 border border-dashed border-[#2a2a2a] text-[#a3a3a3] hover:text-[#8b9cff] hover:border-[#8b9cff]/50 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
          >
            <Plus size={18} /> Add Journey
          </button>
        </div>

        <div className="p-4 border-t border-[#2a2a2a] bg-[#121212] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#e6e6e6] rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localJourneys)}
            className="px-6 py-2 bg-[#8b9cff] text-[#0d0d0d] font-medium hover:bg-[#a3b1ff] rounded-lg transition-colors"
          >
            Save Journeys
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// --- MODULE: CHESS STUDY PLAN ---
// ==========================================
function ChessPlan() {
  const { entities, actions } = useAppContext();
  const docState = entities.chessDoc;

  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        actions.setChessDoc(PARSED_DOC_STATE);
        setEditingId(null);
        setIsUploading(false);
      }, 1500);
    }
  };

  const updateSection = (id, newContentObj) => {
    actions.setChessDoc({
      ...docState,
      sections: (docState.sections || []).map((sec) =>
        sec.id === id ? { ...sec, ...newContentObj } : sec,
      ),
    });
  };

  const updateWeek = (sectionId, weekId, newWeekData) => {
    actions.setChessDoc({
      ...docState,
      sections: (docState.sections || []).map((sec) => {
        if (sec.id === sectionId && sec.type === "module") {
          return {
            ...sec,
            weeks: (sec.weeks || []).map((w) =>
              w.id === weekId ? { ...w, ...newWeekData } : w,
            ),
          };
        }
        return sec;
      }),
    });

    if (newWeekData.completed !== undefined && newWeekData.completed) {
      actions.logEvent({
        type: "chess_topic",
        title: `Completed Chess Module Section`,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration_minutes: 0,
        related_module: "chess_study",
        status: "completed",
        metadata: { weekId },
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#e6e6e6] mb-2 flex items-center gap-3">
            <span className="text-2xl grayscale opacity-80">♟️</span>{" "}
            {(docState.title || "Chess Study").split(":")[0]}
          </h2>
          <p className="text-[#a3a3a3] font-medium max-w-2xl leading-relaxed">
            {(docState.title || "").split(":")[1]?.trim() ||
              "Curriculum Explorer"}
          </p>
        </div>

        <label
          className={`cursor-pointer bg-[#1f1f1f] text-[#e6e6e6] border border-[#2a2a2a] px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:border-[#8b9cff]/50 hover:text-[#8b9cff] transition-all duration-200 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <Wand2 size={18} className="animate-spin" />
          ) : (
            <UploadCloud size={18} />
          )}
          {isUploading ? "Parsing..." : "Upload Plan"}
          <input
            type="file"
            accept=".docx,.pdf,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <div className="space-y-6">
        {(docState.sections || []).map((section) => (
          <div key={section.id} className="relative group">
            {editingId !== section.id && (
              <button
                onClick={() => setEditingId(section.id)}
                className="absolute top-4 right-4 p-2 bg-[#121212] text-[#737373] hover:text-[#8b9cff] border border-[#2a2a2a] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-sm"
              >
                <Edit2 size={16} />
              </button>
            )}

            {section.type === "text" && (
              <TextSectionEditor
                section={section}
                isEditing={editingId === section.id}
                onSave={() => setEditingId(null)}
                onUpdate={(data) => updateSection(section.id, data)}
              />
            )}

            {section.type === "module" && (
              <ModuleSectionEditor
                section={section}
                isEditing={editingId === section.id}
                onSave={() => setEditingId(null)}
                onUpdate={(data) => updateSection(section.id, data)}
                onUpdateWeek={(weekId, data) =>
                  updateWeek(section.id, weekId, data)
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TextSectionEditor({ section, isEditing, onSave, onUpdate }) {
  if (isEditing) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#8b9cff]/50 shadow-xl transition-all duration-200">
        <input
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full bg-transparent text-xl font-bold text-[#e6e6e6] mb-4 border-b border-[#2a2a2a] focus:border-[#8b9cff] outline-none pb-2 transition-colors duration-200"
          placeholder="Section Title"
        />
        <textarea
          value={section.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full bg-[#121212] rounded-lg p-4 text-[#e6e6e6] font-medium leading-relaxed min-h-[150px] outline-none border border-[#2a2a2a] focus:border-[#8b9cff] resize-y transition-all duration-200"
          placeholder="Section Content..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#8b9cff] text-[#0d0d0d] font-medium rounded-lg hover:bg-[#a3b1ff] shadow-sm"
          >
            <Save size={16} /> Done Editing
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#121212] rounded-2xl p-6 border border-[#2a2a2a] shadow-sm">
      <h3 className="text-xl font-bold text-[#e6e6e6] mb-4 flex items-center gap-2 uppercase tracking-wide">
        <FileText size={20} className="text-[#8b9cff]" /> {section.title}
      </h3>
      <div className="text-[#a3a3a3] font-medium leading-relaxed space-y-4 whitespace-pre-wrap text-sm md:text-base">
        {section.content}
      </div>
    </div>
  );
}

function ModuleSectionEditor({
  section,
  isEditing,
  onSave,
  onUpdate,
  onUpdateWeek,
}) {
  const { events } = useAppContext();
  const safeEvents = Array.isArray(events) ? events : [];
  const [expanded, setExpanded] = useState(true);

  const completedCount = (section.weeks || []).filter(
    (w) => w.completed,
  ).length;
  const progressPercent =
    (section.weeks || []).length > 0
      ? (completedCount / section.weeks.length) * 100
      : 0;

  if (isEditing) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#8b9cff]/50 shadow-xl transition-all duration-200">
        <input
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full bg-transparent text-xl font-bold text-[#e6e6e6] mb-4 border-b border-[#2a2a2a] focus:border-[#8b9cff] outline-none pb-2 transition-colors duration-200"
          placeholder="Module Title"
        />
        <textarea
          value={section.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="w-full bg-[#121212] rounded-lg p-4 text-[#e6e6e6] font-medium leading-relaxed min-h-[80px] outline-none border border-[#2a2a2a] focus:border-[#8b9cff] resize-y mb-6 transition-all duration-200"
          placeholder="Module Description..."
        />

        <h4 className="text-[#e6e6e6] font-semibold mb-4 uppercase tracking-wide text-sm">
          Edit Curriculum Weeks:
        </h4>
        <div className="space-y-4">
          {(section.weeks || []).map((week) => (
            <div
              key={week.id}
              className="bg-[#121212] rounded-lg p-4 border border-[#2a2a2a]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#737373] font-semibold uppercase tracking-wider mb-1 block">
                    Week Opening/Topic
                  </label>
                  <input
                    value={week.opening}
                    onChange={(e) =>
                      onUpdateWeek(week.id, { opening: e.target.value })
                    }
                    className="w-full bg-[#0d0d0d] text-[#e6e6e6] font-medium rounded-lg px-3 py-2 text-sm border border-[#2a2a2a] focus:border-[#8b9cff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#737373] font-semibold uppercase tracking-wider mb-1 block">
                    Historic Games
                  </label>
                  <textarea
                    value={week.games}
                    onChange={(e) =>
                      onUpdateWeek(week.id, { games: e.target.value })
                    }
                    className="w-full bg-[#0d0d0d] text-[#a3a3a3] font-medium rounded-lg px-3 py-2 text-sm border border-[#2a2a2a] focus:border-[#8b9cff] focus:outline-none h-16 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#737373] font-semibold uppercase tracking-wider mb-1 block">
                    Middlegame Focus
                  </label>
                  <input
                    value={week.middlegame}
                    onChange={(e) =>
                      onUpdateWeek(week.id, { middlegame: e.target.value })
                    }
                    className="w-full bg-[#0d0d0d] text-[#a3a3a3] font-medium rounded-lg px-3 py-2 text-sm border border-[#2a2a2a] focus:border-[#8b9cff] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#737373] font-semibold uppercase tracking-wider mb-1 block">
                    Endgame Focus
                  </label>
                  <input
                    value={week.endgame}
                    onChange={(e) =>
                      onUpdateWeek(week.id, { endgame: e.target.value })
                    }
                    className="w-full bg-[#0d0d0d] text-[#a3a3a3] font-medium rounded-lg px-3 py-2 text-sm border border-[#2a2a2a] focus:border-[#8b9cff] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#8b9cff] text-[#0d0d0d] font-medium rounded-lg hover:bg-[#a3b1ff] shadow-sm"
          >
            <Save size={16} /> Save Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 cursor-pointer hover:bg-[#1f1f1f] transition-colors duration-200"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-[#e6e6e6] flex-1 pr-4 tracking-wide">
            {section.title}
          </h3>
          {expanded ? (
            <ChevronUp className="text-[#737373]" />
          ) : (
            <ChevronDown className="text-[#737373]" />
          )}
        </div>
        <p className="text-[#a3a3a3] text-sm leading-relaxed font-medium">
          {section.description}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8b9cff] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold font-mono text-[#737373] tracking-widest">
            {completedCount}/{(section.weeks || []).length}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#2a2a2a] p-6 bg-[#121212]">
          <div className="space-y-4">
            {(section.weeks || []).map((week) => {
              const focusTime = safeEvents
                .filter(
                  (e) =>
                    e.type === "focus_session" &&
                    e.metadata?.linkId === week.id,
                )
                .reduce((sum, e) => sum + (Number(e.duration_minutes) || 0), 0);

              return (
                <div
                  key={week.id}
                  className={`rounded-xl border transition-colors duration-300 p-4 ${week.completed ? "bg-[#1a1a1a] border-[#22c55e]/30 shadow-sm" : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]"}`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateWeek(week.id, { completed: !week.completed });
                      }}
                      className={`mt-1 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${week.completed ? "bg-[#22c55e] border-[#22c55e] text-[#0d0d0d]" : "border-[#404040] text-transparent hover:border-[#8b9cff]"}`}
                    >
                      <Check size={14} className="font-bold" />
                    </button>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-4">
                        <div className="text-xs font-semibold font-mono text-[#8b9cff] mb-1 tracking-widest">
                          WEEK {week.week}
                        </div>
                        <div
                          className={`font-semibold text-lg ${week.completed ? "text-[#737373]" : "text-[#e6e6e6]"}`}
                        >
                          {week.opening}
                        </div>
                        {focusTime > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1 text-[#8b9cff] bg-[#8b9cff]/10 px-2 py-0.5 rounded border border-[#8b9cff]/20 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={10} /> {focusTime}m Focused
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-3">
                        <div className="text-xs text-[#737373] font-semibold uppercase mb-1 tracking-wider flex items-center gap-1">
                          <BookOpen size={12} /> Model Games
                        </div>
                        <div className="text-sm text-[#a3a3a3] font-medium whitespace-pre-wrap leading-relaxed">
                          {week.games}
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col gap-2 justify-center">
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#8b9cff]/10 text-[#8b9cff] border border-[#8b9cff]/20">
                            Middle
                          </span>
                          <span className="text-xs text-[#a3a3a3] font-medium leading-relaxed">
                            {week.middlegame}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
                            End
                          </span>
                          <span className="text-xs text-[#a3a3a3] font-medium leading-relaxed">
                            {week.endgame}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pl-10">
                    <textarea
                      value={week.notes || ""}
                      onChange={(e) =>
                        onUpdateWeek(week.id, { notes: e.target.value })
                      }
                      placeholder="Add personal study notes, PGN links, or reflections for this week..."
                      className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-sm font-medium text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff] resize-y min-h-[60px] transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// --- MODULE: SCHEDULE CALENDAR ---
// ==========================================
function ScheduleCalendar() {
  const { entities, actions, events } = useAppContext();
  const scheduleRules = Array.isArray(entities.calendarRules)
    ? entities.calendarRules
    : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const [editingEvent, setEditingEvent] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const gridRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek + weekOffset * 7);

  const weekDates = DAYS_OF_WEEK.map((day, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const handleDragStart = (e, eventId) => {
    e.dataTransfer.setData("text/plain", eventId);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      if (e.target) e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetDay) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    const draggedRule = scheduleRules.find((ev) => ev.id === eventId);
    if (!draggedRule) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = Math.max(0, e.clientY - rect.top);

    let newStartMins = Math.round((START_HOUR * 60 + y) / 15) * 15;
    if (newStartMins < START_HOUR * 60) newStartMins = START_HOUR * 60;

    const duration =
      timeToMins(draggedRule.end) - timeToMins(draggedRule.start);
    let newEndMins = newStartMins + duration;

    if (newEndMins > END_HOUR * 60 + 59) {
      newEndMins = END_HOUR * 60 + 59;
      newStartMins = Math.max(START_HOUR * 60, newEndMins - duration);
    }

    const updatedRule = {
      ...draggedRule,
      day: targetDay,
      start: minsToTime(newStartMins),
      end: minsToTime(newEndMins),
    };
    actions.setCalendarRules(
      scheduleRules.map((ev) => (ev.id === eventId ? updatedRule : ev)),
    );
  };

  const deleteEvent = (id) => {
    actions.setCalendarRules(scheduleRules.filter((e) => e.id !== id));
    setEditingEvent(null);
  };

  const saveEvent = (eventData) => {
    if (eventData.id) {
      actions.setCalendarRules(
        scheduleRules.map((e) => (e.id === eventData.id ? eventData : e)),
      );
    } else {
      actions.setCalendarRules([
        ...scheduleRules,
        { ...eventData, id: `evt-${Date.now()}` },
      ]);
    }
    setEditingEvent(null);
  };

  const toggleCompletion = (e, rule, dateKey) => {
    e.stopPropagation();
    const existingEvent = safeEvents.find(
      (ev) =>
        ev.type === "calendar_task" &&
        ev.metadata?.ruleId === rule.id &&
        ev.metadata?.dateKey === dateKey,
    );

    if (existingEvent) {
      actions.removeEvent(existingEvent.id);
    } else {
      actions.logEvent({
        type: "calendar_task",
        title: rule.title,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration_minutes: Math.max(
          1,
          timeToMins(rule.end) - timeToMins(rule.start),
        ),
        related_module: "calendar",
        status: "completed",
        metadata: { ruleId: rule.id, dateKey, color: rule.color },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#e6e6e6] mb-2 flex items-center gap-3">
            <CalendarIcon size={28} className="text-[#8b9cff]" /> Schedule
            Topology
          </h2>
          <div className="flex items-center gap-3">
            <p className="text-[#a3a3a3] leading-relaxed hidden md:block">
              Plan structures push data sequentially into Global Event state.
            </p>
            <div className="flex items-center gap-3 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2a2a2a] shadow-sm ml-0 xl:ml-4">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-1 hover:bg-[#2a2a2a] rounded text-[#a3a3a3] hover:text-[#e6e6e6] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-[#e6e6e6] w-36 text-center">
                {weekDates[0].toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {weekDates[6].toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-1 hover:bg-[#2a2a2a] rounded text-[#a3a3a3] hover:text-[#e6e6e6] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              {weekOffset !== 0 && (
                <button
                  onClick={() => setWeekOffset(0)}
                  className="text-xs text-[#8b9cff] hover:text-[#a3b1ff] font-medium ml-1"
                >
                  Today
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(true)}
            className="bg-[#1a1a1a] text-[#e6e6e6] border border-[#2a2a2a] px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#2a2a2a] transition-all"
          >
            <History size={18} className="text-[#a3a3a3]" /> Events
          </button>
          <button
            onClick={() =>
              setEditingEvent({
                title: "New Activity",
                day: "Monday",
                start: "09:00",
                end: "10:00",
                color: "#2c3552",
              })
            }
            className="bg-[#8b9cff] text-[#0d0d0d] px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#a3b1ff] transition-all shadow-[0_4px_14px_rgba(139,156,255,0.15)]"
          >
            <Plus size={20} /> Add Block
          </button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden flex flex-col h-[75vh] shadow-lg relative min-h-[400px]">
        <div className="flex border-b border-[#2a2a2a] bg-[#121212]">
          <div className="w-16 shrink-0 border-r border-[#2a2a2a] flex items-center justify-center text-xs text-[#a3a3a3] font-mono z-10">
            Time
          </div>
          <div className="flex-1 grid grid-cols-7">
            {DAYS_OF_WEEK.map((day, i) => {
              const dateObj = weekDates[i];
              const dateKey = toDateKey(dateObj);
              const isToday = toDateKey(new Date()) === dateKey;

              const dayRules = scheduleRules.filter((e) => e.day === day);
              const completedCount = dayRules.filter((r) =>
                safeEvents.some(
                  (ev) =>
                    ev.type === "calendar_task" &&
                    ev.metadata?.ruleId === r.id &&
                    ev.metadata?.dateKey === dateKey,
                ),
              ).length;
              const allDone =
                dayRules.length > 0 && completedCount === dayRules.length;

              return (
                <div
                  key={day}
                  className={`py-3 text-center border-r border-[#2a2a2a] last:border-0 flex flex-col items-center justify-center gap-1 ${isToday ? "bg-[#8b9cff]/5" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm font-medium ${isToday ? "text-[#8b9cff]" : "text-[#e6e6e6]"}`}
                    >
                      <span className="hidden md:inline">{day}</span>
                      <span className="md:hidden">{day.substring(0, 3)}</span>
                    </span>
                    <span
                      className={`text-xs ${isToday ? "text-[#8b9cff]/80" : "text-[#737373]"}`}
                    >
                      {dateObj.getDate()}
                    </span>
                  </div>
                  <div className="h-1 w-12 bg-[#1f1f1f] rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${allDone ? "bg-[#22c55e]" : "bg-[#8b9cff]"}`}
                      style={{
                        width:
                          dayRules.length > 0
                            ? `${(completedCount / dayRules.length) * 100}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto custom-scrollbar relative"
          ref={gridRef}
        >
          <div className="flex">
            <div className="w-16 shrink-0 border-r border-[#2a2a2a] bg-[#121212] relative z-10">
              {HOURS_ARRAY.map((hourObj) => (
                <div
                  key={hourObj.value}
                  className="h-[60px] border-b border-transparent relative"
                >
                  <span className="absolute -top-2.5 left-0 w-full text-center text-[10px] text-[#737373] font-mono">
                    {hourObj.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-7 relative">
              <div className="absolute inset-0 pointer-events-none">
                {HOURS_ARRAY.map((hourObj) => (
                  <div
                    key={`line-${hourObj.value}`}
                    className="h-[60px] border-b border-[#2a2a2a]/60 w-full"
                  />
                ))}
              </div>

              {DAYS_OF_WEEK.map((day, i) => {
                const dateKey = toDateKey(weekDates[i]);
                const dayRules = scheduleRules.filter((e) => e.day === day);

                return (
                  <div
                    key={`col-${day}`}
                    className="relative border-r border-[#2a2a2a]/60 last:border-0 hover:bg-[#1f1f1f]/50 transition-colors duration-200 h-[1440px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day)}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = Math.max(0, e.clientY - rect.top);
                        let startMins =
                          Math.round((START_HOUR * 60 + y) / 15) * 15;
                        setEditingEvent({
                          title: "New Activity",
                          day,
                          start: minsToTime(startMins),
                          end: minsToTime(
                            Math.min(END_HOUR * 60 + 59, startMins + 60),
                          ),
                          color: "#2c3552",
                        });
                      }
                    }}
                  >
                    {dayRules.map((rule) => {
                      const startMins = timeToMins(rule.start);
                      const endMins = timeToMins(rule.end);
                      const safeStart = Math.max(
                        START_HOUR * 60,
                        Math.min(END_HOUR * 60 + 59, startMins),
                      );
                      const safeEnd = Math.max(
                        START_HOUR * 60,
                        Math.min(END_HOUR * 60 + 59, endMins),
                      );

                      const topOffset = safeStart;
                      const height = Math.max(15, safeEnd - safeStart);

                      const isCompleted = safeEvents.some(
                        (ev) =>
                          ev.type === "calendar_task" &&
                          ev.metadata?.ruleId === rule.id &&
                          ev.metadata?.dateKey === dateKey,
                      );

                      return (
                        <div
                          key={rule.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, rule.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setEditingEvent(rule)}
                          className={`absolute left-1 right-1 rounded-md p-1.5 md:p-2 cursor-pointer group overflow-hidden transition-all duration-300 hover:z-20 hover:brightness-110 shadow-sm border border-white/5 flex flex-col ${isCompleted ? "opacity-50 grayscale" : "opacity-95"}`}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                            backgroundColor: rule.color,
                          }}
                          title={`${rule.title}\n${rule.start} - ${rule.end}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div
                              className={`text-[10px] md:text-xs font-medium leading-tight truncate ${isCompleted ? "text-[#e6e6e6]/70 line-through" : "text-[#e6e6e6] drop-shadow-md"}`}
                            >
                              {rule.title}
                            </div>
                            <button
                              onClick={(e) =>
                                toggleCompletion(e, rule, dateKey)
                              }
                              className={`shrink-0 flex items-center justify-center rounded-full transition-all duration-200 z-30 ${isCompleted ? "text-[#22c55e] bg-black/40" : "text-white/30 hover:text-white hover:bg-black/20 opacity-0 group-hover:opacity-100"}`}
                            >
                              {isCompleted ? (
                                <CheckCircle2
                                  size={14}
                                  className="fill-[#22c55e]/20"
                                />
                              ) : (
                                <Circle size={14} />
                              )}
                            </button>
                          </div>

                          {height >= 35 && (
                            <div className="text-[9px] md:text-[10px] text-[#e6e6e6]/70 font-mono mt-0.5 truncate drop-shadow-sm">
                              {rule.start} - {rule.end}
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-white/50 cursor-grab active:cursor-grabbing transition-opacity">
                            <GripVertical size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {editingEvent && (
        <EventEditorModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={saveEvent}
          onDelete={() => deleteEvent(editingEvent.id)}
        />
      )}

      {showHistory && (
        <HistoryModal
          events={safeEvents}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

function HistoryModal({ events, onClose }) {
  const safeEvents = Array.isArray(events) ? events : [];
  const calEvents = safeEvents
    .filter((e) => e.type === "calendar_task")
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

  const grouped = {};
  calEvents.forEach((e) => {
    const dateObj = new Date(e.start_time);
    if (isNaN(dateObj)) return;
    const dateKey = dateObj.toLocaleDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(e);
  });

  const sortedDateKeys = Object.keys(grouped);

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-center bg-[#121212]">
          <div>
            <h3 className="text-xl font-bold text-[#e6e6e6] flex items-center gap-2">
              <History className="text-[#8b9cff]" /> Unified Event Log
            </h3>
            <p className="text-[#a3a3a3] text-sm mt-1">
              Global audit of your schedule completions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#1f1f1f] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#121212]">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] flex flex-col items-center justify-center">
              <Target size={24} className="text-[#22c55e] mb-2" />
              <span className="text-3xl font-bold text-[#e6e6e6]">
                {calEvents.length}
              </span>
              <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold mt-1">
                Total Schedule Blocks Finished
              </span>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] flex flex-col items-center justify-center">
              <TrendingUp size={24} className="text-[#8b9cff] mb-2" />
              <span className="text-3xl font-bold text-[#e6e6e6]">
                {sortedDateKeys.length}
              </span>
              <span className="text-xs text-[#737373] uppercase tracking-wider font-semibold mt-1">
                Active Execution Days
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {sortedDateKeys.length === 0 ? (
              <div className="text-center py-10 text-[#737373] border-2 border-dashed border-[#2a2a2a] rounded-xl">
                No events recorded in central store.
              </div>
            ) : (
              sortedDateKeys.map((dateKey) => (
                <div key={dateKey} className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#8b9cff] uppercase tracking-wider border-b border-[#2a2a2a] pb-2">
                    {dateKey}
                  </h4>
                  <div className="grid gap-2">
                    {grouped[dateKey].map((ev) => {
                      const timeString = new Date(
                        ev.start_time,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: ev.metadata?.color || "#444",
                              }}
                            />
                            <span className="text-[#e6e6e6] font-medium">
                              {ev.title}
                            </span>
                          </div>
                          <div className="text-xs text-[#737373] flex items-center gap-1 font-mono">
                            <Check size={12} className="text-[#22c55e]" />{" "}
                            Commited at {timeString}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventEditorModal({ event, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({ ...event });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeToMins(formData.start) >= timeToMins(formData.end)) {
      alert("End time must be after start time.");
      return;
    }
    onSave(formData);
  };

  const PRESET_COLORS = [
    "#2c3552",
    "#452424",
    "#243b2d",
    "#42321c",
    "#3c2445",
    "#243b45",
    "#a3a3a3",
    "#60a5fa",
    "#22c55e",
  ];

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <div className="p-5 border-b border-[#2a2a2a] flex justify-between items-center bg-[#121212]">
          <h3 className="text-lg font-semibold text-[#e6e6e6]">
            {event.id ? "Edit Block" : "New Time Block"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#a3a3a3] hover:text-[#e6e6e6] hover:bg-[#1f1f1f] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-[#a3a3a3] uppercase mb-1.5 block">
              Activity Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              autoFocus
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff] focus:ring-1 focus:ring-[#8b9cff]/50 transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#a3a3a3] uppercase mb-1.5 block">
              Day of Week
            </label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff] focus:ring-1 focus:ring-[#8b9cff]/50 transition-all duration-200"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#a3a3a3] uppercase mb-1.5 flex items-center gap-1.5">
                <Clock size={14} /> Start Time
              </label>
              <input
                type="time"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
                min="00:00"
                max="23:00"
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff] focus:ring-1 focus:ring-[#8b9cff]/50 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a3a3a3] uppercase mb-1.5 block">
                End Time
              </label>
              <input
                type="time"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
                min="00:00"
                max="23:59"
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-[#e6e6e6] focus:outline-none focus:border-[#8b9cff] focus:ring-1 focus:ring-[#8b9cff]/50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#a3a3a3] uppercase mb-1.5 flex items-center gap-1.5">
              <Palette size={14} /> Shade
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all duration-200 border ${formData.color === color ? "scale-110 border-[#e6e6e6] ring-2 ring-[#e6e6e6]/20 ring-offset-2 ring-offset-[#1a1a1a]" : "border-transparent hover:scale-110 shadow-sm"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-8 h-8 rounded cursor-pointer border border-[#2a2a2a] p-0 ml-2 bg-[#121212]"
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#2a2a2a] flex justify-between items-center">
            {event.id ? (
              <button
                type="button"
                onClick={onDelete}
                className="text-[#a3a3a3] hover:text-[#ef4444] text-sm font-medium transition-colors duration-200 flex items-center gap-1.5"
              >
                <Trash2 size={16} /> Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#e6e6e6] rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#8b9cff] text-[#0d0d0d] hover:bg-[#a3b1ff] rounded-lg font-medium transition-all duration-200 shadow-[0_4px_14px_rgba(139,156,255,0.15)] hover:shadow-[0_6px_20px_rgba(139,156,255,0.25)]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// --- MODULE: CENTRAL ANALYTICS ---
// ==========================================
function AnalyticsDashboard() {
  const { entities, events } = useAppContext();

  const metrics = useMemo(() => {
    const safeLearningPlans = Array.isArray(entities.learningPlans)
      ? entities.learningPlans
      : [];
    const allTopics = safeLearningPlans.flatMap((plan) =>
      Array.isArray(plan?.sections)
        ? plan.sections.flatMap((sec) =>
            Array.isArray(sec?.topics) ? sec.topics : [],
          )
        : [],
    );
    const totalTopics = allTopics.length;
    const completedTopics = allTopics.filter((t) => t.completed).length;
    const learningProgress =
      totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    const safeEvents = Array.isArray(events) ? events : [];
    const focusEvents = safeEvents.filter((e) => e.type === "focus_session");
    const totalFocusMinutes = focusEvents.reduce(
      (sum, e) => sum + (Number(e.duration_minutes) || 0),
      0,
    );
    const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

    const avgSessionDuration =
      focusEvents.length > 0 ? totalFocusMinutes / focusEvents.length : 0;
    const droppedSessions = focusEvents.filter(
      (e) => (Number(e.duration_minutes) || 0) < 5,
    ).length;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return toDateKey(d);
    }).reverse();

    const focusByDay = last7Days.map((dateKey) => {
      const mins = focusEvents
        .filter((s) => s.end_time && s.end_time.startsWith(dateKey))
        .reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0);
      return { date: dateKey, minutes: mins };
    });
    const maxFocusMins = Math.max(...focusByDay.map((d) => d.minutes), 60);

    let totalChessWeeks = 0;
    let completedChessWeeks = 0;
    if (entities.chessDoc && Array.isArray(entities.chessDoc.sections)) {
      entities.chessDoc.sections.forEach((sec) => {
        if (sec.type === "module" && Array.isArray(sec.weeks)) {
          totalChessWeeks += sec.weeks.length;
          completedChessWeeks += sec.weeks.filter((w) => w.completed).length;
        }
      });
    }
    const chessProgress =
      totalChessWeeks > 0 ? (completedChessWeeks / totalChessWeeks) * 100 : 0;

    const categoryBalance = { Work: 0, Study: 0, Health: 0, Other: 0 };
    const calendarRules = Array.isArray(entities.calendarRules)
      ? entities.calendarRules
      : [];
    calendarRules.forEach((rule) => {
      const durationHours =
        (timeToMins(rule.end) - timeToMins(rule.start)) / 60;
      const title = (rule.title || "").toLowerCase();
      if (
        title.includes("work") ||
        title.includes("job") ||
        title.includes("meeting")
      )
        categoryBalance.Work += durationHours;
      else if (
        title.includes("study") ||
        title.includes("read") ||
        title.includes("learn") ||
        title.includes("engineering") ||
        title.includes("math")
      )
        categoryBalance.Study += durationHours;
      else if (
        title.includes("box") ||
        title.includes("train") ||
        title.includes("gym") ||
        title.includes("run")
      )
        categoryBalance.Health += durationHours;
      else categoryBalance.Other += durationHours;
    });

    const totalScheduledHours = Object.values(categoryBalance).reduce(
      (a, b) => a + b,
      0,
    );
    const balancePercents = {
      Work:
        totalScheduledHours > 0
          ? (categoryBalance.Work / totalScheduledHours) * 100
          : 0,
      Study:
        totalScheduledHours > 0
          ? (categoryBalance.Study / totalScheduledHours) * 100
          : 0,
      Health:
        totalScheduledHours > 0
          ? (categoryBalance.Health / totalScheduledHours) * 100
          : 0,
    };

    const insights = [];
    if (learningProgress < 20)
      insights.push({
        type: "info",
        text: "Your core skill roadmap is just beginning. Stay consistent with 40m blocks.",
      });

    const todayFocus = focusByDay[6]?.minutes || 0;
    if (todayFocus > 360)
      insights.push({
        type: "warning",
        text: `You've logged ${Math.round(todayFocus / 60)} hours of deep work today. High burnout risk. Ensure mandatory rest.`,
      });

    if (droppedSessions > 5)
      insights.push({
        type: "warning",
        text: "High rate of short (<5 min) focus sessions detected recently. Minimize context switching.",
      });
    if (balancePercents.Health < 10)
      insights.push({
        type: "warning",
        text: "Your schedule lacks physical activity blocks. Cardiovascular exercise boosts neuroplasticity.",
      });
    else
      insights.push({
        type: "success",
        text: "Optimal core balance detected between Work, Study, and Physical execution.",
      });

    if (avgSessionDuration >= 45)
      insights.push({
        type: "success",
        text: "Deep work capacity is excellent (averaging >45 mins per uninterrupted session).",
      });

    return {
      learningProgress,
      completedTopics,
      totalTopics,
      totalFocusHours,
      avgSessionMins: Math.round(avgSessionDuration),
      droppedSessions,
      focusByDay,
      maxFocusMins,
      chessProgress,
      completedChessWeeks,
      totalChessWeeks,
      balancePercents,
      insights,
    };
  }, [entities, events]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#e6e6e6] mb-2 flex items-center gap-3">
            <BrainCircuit size={28} className="text-[#8b9cff]" /> Central
            Analytics
          </h2>
          <p className="text-[#a3a3a3] leading-relaxed">
            Systemic computation of all integrated module activity and events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#a3a3a3] font-semibold text-sm uppercase tracking-wide">
              Deep Focus
            </span>
            <TimerIcon size={18} className="text-[#8b9cff]" />
          </div>
          <div className="text-3xl font-bold text-[#e6e6e6] mt-2">
            {metrics.totalFocusHours}{" "}
            <span className="text-lg text-[#737373]">hrs</span>
          </div>
          <div className="text-xs text-[#737373] mt-2 font-medium">
            Avg {metrics.avgSessionMins}m per session
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#a3a3a3] font-semibold text-sm uppercase tracking-wide">
              Global Roadmap
            </span>
            <LayoutDashboard size={18} className="text-[#22c55e]" />
          </div>
          <div className="text-3xl font-bold text-[#e6e6e6] mt-2">
            {metrics.completedTopics}{" "}
            <span className="text-lg text-[#737373]">
              / {metrics.totalTopics}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#22c55e]"
              style={{ width: `${metrics.learningProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#a3a3a3] font-semibold text-sm uppercase tracking-wide">
              Chess Study
            </span>
            <BookOpen size={18} className="text-[#f59e0b]" />
          </div>
          <div className="text-3xl font-bold text-[#e6e6e6] mt-2">
            {metrics.completedChessWeeks}{" "}
            <span className="text-lg text-[#737373]">
              / {metrics.totalChessWeeks}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#f59e0b]"
              style={{ width: `${metrics.chessProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#a3a3a3] font-semibold text-sm uppercase tracking-wide">
              Consistency
            </span>
            <Activity size={18} className="text-[#ef4444]" />
          </div>
          <div className="text-3xl font-bold text-[#e6e6e6] mt-2">
            {metrics.focusByDay.filter((d) => d.minutes > 0).length}{" "}
            <span className="text-lg text-[#737373]">/ 7 days</span>
          </div>
          <div className="text-xs text-[#737373] mt-2 font-medium">
            Active in the last week
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-semibold text-[#e6e6e6] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp size={18} className="text-[#8b9cff]" /> Event Flow (Last
            7 Days)
          </h3>

          <div className="flex-1 flex items-end gap-2 sm:gap-4 h-48 mt-4 pt-4 border-t border-[#2a2a2a] relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-[#2a2a2a]/50 w-full flex justify-start -mt-2">
                <span className="text-[10px] text-[#737373] ml-1">
                  {metrics.maxFocusMins}m
                </span>
              </div>
              <div className="border-t border-[#2a2a2a]/50 w-full" />
              <div className="border-t border-[#2a2a2a] w-full flex justify-start translate-y-1">
                <span className="text-[10px] text-[#737373] ml-1">0m</span>
              </div>
            </div>

            {metrics.focusByDay.map((dayData, i) => {
              const heightPct =
                metrics.maxFocusMins > 0
                  ? (dayData.minutes / metrics.maxFocusMins) * 100
                  : 0;
              const dayLabel = new Date(dayData.date).toLocaleDateString(
                undefined,
                { weekday: "short" },
              );
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end items-center group relative z-10 h-full"
                >
                  <div className="absolute -top-8 bg-[#121212] text-[#e6e6e6] text-xs px-2 py-1 rounded border border-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {dayData.minutes} mins focus
                  </div>
                  <div
                    className="w-full max-w-[40px] bg-[#8b9cff]/80 hover:bg-[#8b9cff] rounded-t-sm transition-all duration-500 min-h-[4px]"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-[#a3a3a3] mt-2">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-[#e6e6e6] mb-6 flex items-center gap-2 uppercase tracking-wide">
            <PieChart size={18} className="text-[#8b9cff]" /> Strategy Balance
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div
              className="w-32 h-32 rounded-full relative shadow-sm"
              style={{
                background: `conic-gradient(
                  #8b9cff 0% ${metrics.balancePercents.Work}%, 
                  #22c55e ${metrics.balancePercents.Work}% ${metrics.balancePercents.Work + metrics.balancePercents.Study}%, 
                  #ef4444 ${metrics.balancePercents.Work + metrics.balancePercents.Study}% 100%
                )`,
              }}
            >
              <div className="absolute inset-2 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <CalendarIcon className="text-[#737373] opacity-50" size={24} />
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#e6e6e6]">
                  <div className="w-3 h-3 rounded-sm bg-[#8b9cff]" /> Work/Core
                </div>
                <span className="text-[#a3a3a3] font-mono">
                  {metrics.balancePercents.Work.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#e6e6e6]">
                  <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />{" "}
                  Study/Learning
                </div>
                <span className="text-[#a3a3a3] font-mono">
                  {metrics.balancePercents.Study.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[#e6e6e6]">
                  <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />{" "}
                  Health/Training
                </div>
                <span className="text-[#a3a3a3] font-mono">
                  {metrics.balancePercents.Health.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#8b9cff]/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#8b9cff]" />

        <h3 className="text-lg font-semibold text-[#e6e6e6] mb-6 flex items-center gap-2 uppercase tracking-wide">
          <Wand2 size={20} className="text-[#8b9cff]" /> AI System
          Recommendations
        </h3>

        <div className="space-y-4">
          {metrics.insights.map((insight, idx) => {
            let colorClass = "text-[#8b9cff]";
            let bgClass = "bg-[#8b9cff]/10";
            let borderClass = "border-[#8b9cff]/20";

            if (insight.type === "warning") {
              colorClass = "text-[#f59e0b]";
              bgClass = "bg-[#f59e0b]/10";
              borderClass = "border-[#f59e0b]/20";
            } else if (insight.type === "success") {
              colorClass = "text-[#22c55e]";
              bgClass = "bg-[#22c55e]/10";
              borderClass = "border-[#22c55e]/20";
            }

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${bgClass} ${borderClass} flex items-start gap-3 transition-colors hover:brightness-110`}
              >
                <div className={`mt-0.5 ${colorClass}`}>
                  {insight.type === "warning" ? (
                    <TrendingUp size={18} className="rotate-180" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                </div>
                <p className="text-[#e6e6e6] text-sm leading-relaxed">
                  {insight.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Global CSS for scrollbar and animations
const style = document.createElement("style");
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #2a2a2a; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #3a3a3a; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: fadeIn 0.4s ease-out forwards; }
`;
document.head.appendChild(style);

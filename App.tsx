import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, Clock, Search, RefreshCw, 
  ExternalLink, FileText, Check, Moon, Sun, 
  Sparkles, Smartphone, ChevronRight, CheckCircle2,
  Newspaper, ListFilter, Bookmark, BellRing, BellOff, Volume2
} from 'lucide-react';

// Pure vector SVG icon component for guaranteed high-res display
const AppLogoIcon = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="128" fill="url(#bg-grad)"/>
    {/* Shield */}
    <path d="M256 100L140 150V250C140 330 256 400 256 400C256 400 372 330 372 250V150L256 100Z" fill="url(#shield-grad)" stroke="#F59E0B" strokeWidth="12" strokeLinejoin="round"/>
    {/* Letter M */}
    <path d="M200 320V200L256 260L312 200V320" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Bell Indicator */}
    <circle cx="372" cy="140" r="48" fill="#EF4444"/>
    <path d="M372 120V124M372 156C363.163 156 356 148.837 356 140C356 131.163 363.163 124 372 124C380.837 124 388 131.163 388 140C388 148.837 380.837 156 372 156Z" stroke="white" strokeWidth="8"/>
    <defs>
      <linearGradient id="bg-grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0F172A"/>
        <stop offset="1" stopColor="#1E293B"/>
      </linearGradient>
      <linearGradient id="shield-grad" x1="140" y1="100" x2="372" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E3A8A"/>
        <stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
  </svg>
);

// Database Circolari (Reali da manzonilatina.edu.it)
const INITIAL_CIRCULARS = [
  {
    id: "circ-85-2026",
    number: "Circolare n. 85",
    title: "Spettacolo teatrale \"Memorie di un pazzo\" – Richiesta Adesioni",
    url: "https://manzonilatina.edu.it/circolare/spettacolo-teatrale-memorie-di-un-pazzo-richiesta-adesioni/",
    date: "23 Ott 2026",
    category: "Attività",
    isUrgent: false,
    tags: ["Teatro", "Adesioni", "Docenti"],
    read: false,
    summary: "Richiesta adesione e indicazioni organizzative per la partecipazione allo spettacolo teatrale."
  },
  {
    id: "circ-84-2026",
    number: "Circolare n. 84",
    title: "Colloqui con le famiglie in orario antimeridiano – Indicazioni per i Docenti",
    url: "https://manzonilatina.edu.it/circolare/colloqui-con-le-famiglie-in-orario-a-m-docenti/",
    date: "23 Ott 2026",
    category: "Docenti",
    isUrgent: false,
    tags: ["Colloqui", "Famiglie"],
    read: false,
    summary: "Indicazioni relative ai colloqui individuali con le famiglie in orario antimeridiano."
  },
  {
    id: "circ-83-2026",
    number: "Circolare n. 83",
    title: "ESONERI IRC Entrate posticipate e Uscite anticipate 3",
    url: "https://manzonilatina.edu.it/circolare/esoneri-irc-entrate-posticipate-e-uscite-anticipate-3/",
    date: "23 Ott 2026",
    category: "Orario",
    isUrgent: true,
    tags: ["Orario", "IRC", "Studenti"],
    read: false,
    summary: "Disposizioni ed elenchi ufficiali degli orari autorizzati per gli esoneri IRC."
  }
];

// Database Novità & Avvisi UFFICIALI (con link diretti aggiornati)
const INITIAL_NEWS = [
  {
    id: "news-usb-2026",
    title: "USB Scuola: Assemblea online 6 ottobre ore 17.30",
    url: "https://manzonilatina.edu.it/2026/10/05/usb-scuola-assemblea-online-6-ottobre-ore-17-30/",
    date: "05 Ott 2026",
    category: "Albo Sindacale",
    isUrgent: true,
    tags: ["USB", "Assemblea", "Docenti"],
    read: false,
    summary: "L'adesione all'assemblea deve pervenire con comunicazione diretta in vicepresidenza entro le ore 15.00 del 05/10/2026."
  },
  {
    id: "news-flc-2026",
    title: "Assemblea sindacale FLC CGIL dalle ore 15 alle ore 17",
    url: "https://manzonilatina.edu.it/2026/09/25/assemblea-sindacale-flc-cgil-dalle-ore-15-alle-ore-17/",
    date: "25 Sett 2026",
    category: "Albo Sindacale",
    isUrgent: false,
    tags: ["FLC CGIL", "Sindacato"],
    read: false,
    summary: "L'adesione all'assemblea deve pervenire entro le ore 9 del 28/09/2026 in vicepresidenza."
  },
  {
    id: "news-esami-2026",
    title: "Esami Integrativi – Candidati e discipline da sostenere",
    url: "https://manzonilatina.edu.it/2026/08/25/esami-integrativi-candidati-e-discipline-da-sostenere/",
    date: "25 Ago 2026",
    category: "Notizie",
    isUrgent: false,
    tags: ["Esami", "Studenti", "Didattica"],
    read: false,
    summary: "Esami Integrativi - Candidati e discipline da sostenere per l'anno scolastico in corso."
  },
  {
    id: "news-torelli-2026",
    title: "In memoria del Professor Piero Torelli: il cordoglio del Liceo Manzoni",
    url: "https://manzonilatina.edu.it/2026/09/28/in-memoria-del-professor-piero-torelli-il-cordoglio-del-liceo-manzoni/",
    date: "28 Sett 2026",
    category: "NEWS",
    isUrgent: true,
    tags: ["Lutto", "Istituto"],
    read: true,
    summary: "Con grande tristezza salutiamo il professor Piero Torelli, docente appassionato. A Rosa, Samuele e Gioele giunga l'abbraccio di tutta la comunità scolastica."
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('circulars'); // 'circulars' | 'news'
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('all'); // 'all' | 'NEWS' | 'Notizie' | 'Albo sindacale' | 'Eventi' | 'Rassegna Stampa'
  
  const [circulars, setCirculars] = useState(() => {
    const saved = localStorage.getItem('manzoni_circulars_v3');
    return saved ? JSON.parse(saved) : INITIAL_CIRCULARS;
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('manzoni_news_v3');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'unread', 'urgent'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheck, setLastCheck] = useState('Oggi ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  const [darkMode, setDarkMode] = useState(true);

  // PUSH NOTIFICATION STATE
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState('');

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setPushEnabled(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('manzoni_circulars_v3', JSON.stringify(circulars));
  }, [circulars]);

  useEffect(() => {
    localStorage.setItem('manzoni_news_v3', JSON.stringify(news));
  }, [news]);

  // Request Push Notification Permission
  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert("Il tuo browser non supporta le notifiche push web.");
      return;
    }

    if (pushEnabled) {
      setPushEnabled(false);
      setPushStatusMsg("Notifiche disattivate per questa sessione.");
      setTimeout(() => setPushStatusMsg(''), 3000);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        setPushStatusMsg("✅ Notifiche attivate con successo!");
        
        new Notification("Manzoni Alert Latina", {
          body: "Notifiche attive! Riceverai un avviso ad ogni nuova circolare o notizia.",
          icon: "https://manzonilatina.edu.it/wp-content/uploads/2020/09/logo-manzoni.png"
        });

      } else {
        setPushStatusMsg("⚠️ Permesso notifiche negato nelle impostazioni del browser.");
      }
    } catch (err) {
      console.error(err);
      setPushStatusMsg("Errore durante l'attivazione notifiche.");
    }
    setTimeout(() => setPushStatusMsg(''), 4000);
  };

  const currentList = activeSection === 'circulars' ? circulars : news;
  const setCurrentList = activeSection === 'circulars' ? setCirculars : setNews;

  const filteredItems = useMemo(() => {
    return currentList.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.number && item.number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesFilter = filterMode === 'all' || 
        (filterMode === 'urgent' && item.isUrgent) ||
        (filterMode === 'unread' && !item.read);

      const matchesCategory = activeSection === 'circulars' || selectedNewsCategory === 'all' || item.category === selectedNewsCategory;

      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [currentList, searchQuery, filterMode, activeSection, selectedNewsCategory]);

  const unreadCircularsCount = useMemo(() => circulars.filter(c => !c.read).length, [circulars]);
  const unreadNewsCount = useMemo(() => news.filter(n => !n.read).length, [news]);
  const currentUnreadCount = activeSection === 'circulars' ? unreadCircularsCount : unreadNewsCount;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastCheck(`Oggi ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
      setIsRefreshing(false);
    }, 600);
  };

  const handleSimulateNew = () => {
    const nowStr = "Oggi";
    if (activeSection === 'circulars') {
      const num = Math.floor(Math.random() * 50) + 86;
      const newItem = {
        id: `circ-${num}-2026`,
        number: `Circolare n. ${num}`,
        title: `Nuova disposizione orario ed attività didattiche`,
        url: "https://manzonilatina.edu.it/circolare/orario-definitivo-dal-giorno-28-9-2026-studenti/",
        date: nowStr,
        category: "Urgente",
        isUrgent: true,
        tags: ["Nuova", "Importante"],
        read: false,
        summary: "Nuovo avviso ufficiale pubblicato nella sezione Circolari dell'Istituto."
      };
      setCirculars(prev => [newItem, ...prev]);

      if (pushEnabled && Notification.permission === 'granted') {
        new Notification(`⚠️ URGENTE: ${newItem.number}`, {
          body: newItem.title,
          icon: "https://manzonilatina.edu.it/wp-content/uploads/2020/09/logo-manzoni.png"
        });
      }
    } else {
      const categories = ['NEWS', 'Notizie', 'Albo sindacale', 'Eventi', 'Rassegna Stampa'];
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      const newItem = {
        id: `news-sim-${Date.now()}`,
        title: `Nuova comunicazione: ${randomCat}`,
        url: "https://manzonilatina.edu.it/2026/09/28/in-memoria-del-professor-piero-torelli-il-cordoglio-del-liceo-manzoni/",
        date: nowStr,
        category: randomCat,
        isUrgent: true,
        tags: [randomCat, "LiceoManzoni"],
        read: false,
        summary: `Nuovo aggiornamento ufficiale pubblicato nella sezione ${randomCat} del Liceo.`
      };
      setNews(prev => [newItem, ...prev]);

      if (pushEnabled && Notification.permission === 'granted') {
        new Notification(`📌 [${randomCat}] Manzoni Latina`, {
          body: newItem.title,
          icon: "https://manzonilatina.edu.it/wp-content/uploads/2020/09/logo-manzoni.png"
        });
      }
    }
  };

  const toggleReadStatus = (id) => {
    setCurrentList(prev => prev.map(item => item.id === id ? { ...item, read: !item.read } : item));
  };

  const markAllAsRead = () => {
    setCurrentList(prev => prev.map(item => ({ ...item, read: true })));
  };

  return (
    <div className={`min-h-screen font-[-apple-system,BlinkMacSystemFont,"SF_Pro_Display","SF_Pro_Text","Segoe_UI",Roboto,sans-serif] antialiased transition-colors duration-500 select-none pb-24 ${
      darkMode ? 'bg-[#000000] text-white' : 'bg-[#f4f4f7] text-slate-900'
    }`}>

      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-25 transition-colors duration-700 ${
          darkMode ? 'bg-blue-600' : 'bg-blue-400'
        }`} />
        <div className={`absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-20 transition-colors duration-700 ${
          darkMode ? 'bg-indigo-600' : 'bg-indigo-300'
        }`} />
      </div>

      {/* HEADER */}
      <header className={`sticky top-0 z-50 backdrop-blur-3xl border-b transition-colors duration-300 ${
        darkMode ? 'bg-black/60 border-white/10' : 'bg-white/60 border-slate-200/60'
      }`}>
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AppLogoIcon className="w-10 h-10 drop-shadow-md" />
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-lg font-black tracking-tight leading-none bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                  Manzoni Alert
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Liceo Manzoni Latina</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${
                darkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all active:scale-90 ${
                darkMode ? 'bg-white/10 border-white/10 text-amber-300' : 'bg-white/80 border-slate-200 text-slate-700'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-md mx-auto px-4 pt-4 space-y-4">

        {/* PUSH NOTIFICATIONS BANNER TOGGLE */}
        <div className={`p-3.5 rounded-2xl backdrop-blur-2xl border flex items-center justify-between shadow-lg transition-all ${
          pushEnabled 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
            : 'bg-blue-950/40 border-blue-500/30 text-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${pushEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {pushEnabled ? <BellRing className="w-5 h-5 animate-bounce" /> : <BellOff className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">
                {pushEnabled ? 'Notifiche Attive' : 'Attiva Notifiche'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {pushEnabled ? 'Avvisi istantanei attivi sul tuo dispositivo' : 'Ricevi un avviso immediato per ogni nuova circolare o notizia'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleNotifications}
            className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all shadow-md active:scale-95 ${
              pushEnabled 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-black' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {pushEnabled ? 'Attive ✓' : 'Attiva'}
          </button>
        </div>

        {pushStatusMsg && (
          <div className="text-xs text-center font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl">
            {pushStatusMsg}
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeSection === 'circulars' ? "Cerca circolare..." : "Cerca avviso o notizia..."}
            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl backdrop-blur-xl border transition-all duration-200 focus:outline-none ${
              darkMode 
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/80' 
                : 'bg-white/80 border-slate-200 text-slate-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />
        </div>

        {/* FILTER TOGGLES */}
        <div className={`p-1 rounded-2xl backdrop-blur-xl border flex items-center justify-between text-xs font-bold ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-200/60 border-slate-300/40'
        }`}>
          {[
            { id: 'all', label: 'Tutti' },
            { id: 'unread', label: `Non letti (${currentUnreadCount})` },
            { id: 'urgent', label: 'Urgenti ⚠️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`flex-1 py-2 rounded-xl transition-all duration-300 text-center ${
                filterMode === tab.id
                  ? darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-blue-600 shadow-md font-extrabold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NOVITÀ & AVVISI SUB-CATEGORY FILTERS (FILTER BY TIPOLOGIA) */}
        {activeSection === 'news' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'Tutte le tipologie' },
              { id: 'Albo sindacale', label: 'Albo sindacale' },
              { id: 'Eventi', label: 'Eventi' },
              { id: 'NEWS', label: 'NEWS' },
              { id: 'Notizie', label: 'Notizie' },
              { id: 'Rassegna Stampa', label: 'Rassegna Stampa' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedNewsCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  selectedNewsCategory === cat.id
                    ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                    : darkMode
                      ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* STATUS BAR */}
        <div className="flex items-center justify-between px-1 text-[11px] text-gray-400 font-semibold">
          <span className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sync: {lastCheck}</span>
          </span>
          {currentUnreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Segna letti</span>
            </button>
          )}
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className={`p-10 text-center rounded-3xl backdrop-blur-xl border ${
              darkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white/80 border-slate-200 text-slate-500'
            }`}>
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-bold text-sm">Nessuna voce trovata</p>
              <p className="text-xs text-gray-500 mt-1">Prova a cambiare filtro o termine di ricerca.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-3xl backdrop-blur-2xl border transition-all duration-300 relative overflow-hidden ${
                  darkMode 
                    ? item.read 
                      ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]' 
                      : 'bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-blue-500/40 shadow-xl ring-1 ring-blue-500/20' 
                    : item.read 
                      ? 'bg-white/70 border-slate-200' 
                      : 'bg-white border-blue-300 shadow-md'
                }`}
              >
                {!item.read && (
                  <div className={`absolute top-0 left-0 bottom-0 w-1 ${
                    item.isUrgent ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    {item.number && (
                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                        item.isUrgent 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                          : darkMode ? 'bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.number}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{item.date}</span>
                </div>

                <h3 className={`text-sm font-bold tracking-tight leading-snug mb-2 ${
                  item.read ? 'text-gray-400' : darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h3>

                {item.summary && (
                  <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                    {item.summary}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                  <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-semibold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleReadStatus(item.id)}
                      className="text-[11px] text-gray-400 hover:text-blue-400 font-semibold"
                    >
                      {item.read ? 'Segna non letto' : 'Letto'}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (!item.read) toggleReadStatus(item.id);
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-xl border border-blue-500/20"
                    >
                      <span>{activeSection === 'circulars' ? 'Apri circolare' : 'Apri notizia'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* SIMULATE & RESET BUTTONS */}
        <div className="pt-2 flex items-center justify-between text-xs text-gray-400 font-medium">
          <button 
            onClick={handleSimulateNew}
            className="flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simula Nuova {activeSection === 'circulars' ? 'Circolare' : 'Notizia'} + Push</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('manzoni_circulars_v3');
              localStorage.removeItem('manzoni_news_v3');
              setCirculars(INITIAL_CIRCULARS);
              setNews(INITIAL_NEWS);
              setSelectedNewsCategory('all');
            }}
            className="hover:underline text-gray-500"
          >
            Ripristina Dati
          </button>
        </div>

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-3xl border-t transition-colors duration-300 ${
        darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-md mx-auto px-6 py-2 flex items-center justify-around">
          
          <button
            onClick={() => { setActiveSection('circulars'); setFilterMode('all'); }}
            className={`flex flex-col items-center space-y-1 transition-all ${
              activeSection === 'circulars' ? 'text-blue-400 scale-105' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <FileText className="w-6 h-6 stroke-[2]" />
              {unreadCircularsCount > 0 && (
                <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white font-black text-[10px] rounded-full border border-black animate-pulse">
                  {unreadCircularsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold">Circolari</span>
          </button>

          <button
            onClick={() => { setActiveSection('news'); setFilterMode('all'); }}
            className={`flex flex-col items-center space-y-1 transition-all ${
              activeSection === 'news' ? 'text-blue-400 scale-105' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <div className="relative">
              <Newspaper className="w-6 h-6 stroke-[2]" />
              {unreadNewsCount > 0 && (
                <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white font-black text-[10px] rounded-full border border-black animate-pulse">
                  {unreadNewsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold">Novità e Avvisi</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
import { useState } from "react";

const COLORS = {
  datos: { grad: "from-violet-600 to-indigo-700", light: "bg-violet-50", badge: "bg-violet-100 text-violet-700", btn: "bg-violet-600 hover:bg-violet-700", border: "border-violet-200", dot: "bg-violet-500", text: "text-violet-600" },
  admin: { grad: "from-emerald-600 to-teal-700", light: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-600" },
};

const DB = {
  careers: [
    { id: "datos", name: "Ciencia de Datos", icon: "📊", desc: "Estadística · Machine Learning · Python", color: "datos" },
    { id: "admin", name: "Lic. en Administración", icon: "📋", desc: "Marketing · Finanzas · Gestión", color: "admin" },
  ],
  subjects: {
    datos: [{ id: "ml", name: "Machine Learning", icon: "🤖", semanas: 6, progreso: 50 },
             { id: "stat", name: "Estadística Aplicada", icon: "📈", semanas: 6, progreso: 33 }],
    admin: [{ id: "mkt", name: "Marketing Digital", icon: "📣", semanas: 4, progreso: 75 }],
  },
  weeks: {
    ml: [
      { id: "ml-w1", n: 1, title: "Introducción al ML", status: "completed", materiales: 3 },
      { id: "ml-w2", n: 2, title: "Regresión Lineal", status: "completed", materiales: 4 },
      { id: "ml-w3", n: 3, title: "Clasificación", status: "in_progress", materiales: 3 },
      { id: "ml-w4", n: 4, title: "Árboles de Decisión", status: "pending", materiales: 0 },
      { id: "ml-w5", n: 5, title: "Redes Neuronales", status: "pending", materiales: 0 },
      { id: "ml-w6", n: 6, title: "Evaluación de Modelos", status: "pending", materiales: 0 },
    ],
    stat: [
      { id: "st-w1", n: 1, title: "Probabilidad", status: "completed", materiales: 3 },
      { id: "st-w2", n: 2, title: "Inferencia Estadística", status: "in_progress", materiales: 1 },
      { id: "st-w3", n: 3, title: "Tests de Hipótesis", status: "pending", materiales: 0 },
    ],
    mkt: [
      { id: "mk-w1", n: 1, title: "Fundamentos", status: "completed", materiales: 4 },
      { id: "mk-w2", n: 2, title: "SEO y SEM", status: "completed", materiales: 3 },
      { id: "mk-w3", n: 3, title: "Redes Sociales", status: "completed", materiales: 2 },
      { id: "mk-w4", n: 4, title: "Métricas y Analytics", status: "in_progress", materiales: 1 },
    ],
  },
  evaluaciones: {
    ml: {
      parcial1: { fecha: "15/08" }, parcial2: { fecha: "20/09" },
      recuperatorio: { fecha: "" }, final: { fecha: "" },
      tps: [{ id: "tp1", titulo: "TP: Regresión Lineal", fecha: "28/07", tema: "Regresión Lineal y Clasificación" }],
    },
  },
  modelExam: [
    { id: 1, pregunta: "¿Cuál de los siguientes algoritmos es un método de clasificación supervisada?", opciones: ["K-Means", "PCA", "Random Forest", "DBSCAN"], correcta: 2 },
    { id: 2, pregunta: "En una regresión logística, la función de activación utilizada es:", opciones: ["ReLU", "Sigmoide", "Tanh", "Softmax"], correcta: 1 },
    { id: 3, pregunta: "El overfitting ocurre cuando el modelo:", opciones: ["Tiene alta varianza y bajo sesgo", "Tiene bajo sesgo y baja varianza", "No aprende los datos de entrenamiento", "Generaliza perfectamente"], correcta: 0 },
    { id: 4, pregunta: "¿Qué métrica es más útil cuando las clases están desbalanceadas?", opciones: ["Accuracy", "F1-Score", "MSE", "R²"], correcta: 1 },
  ],
  weekMaterials: {
    "ml-w3": [
      { id: "m1", type: "pdf", title: "Introducción a la Clasificación.pdf", detail: "18 páginas" },
      { id: "m2", type: "guide", title: "Guía de Lectura - Semana 3", detail: "4 páginas" },
      { id: "m3", type: "youtube", title: "Clasificación con Scikit-learn", detail: "24:10 min" },
    ],
  },
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];

function DatePicker({ value, onChange, onClose, accentCol }) {
  const now = new Date();
  const initMonth = value ? parseInt(value.split("/")[1]) - 1 : now.getMonth();
  const initDay = value ? parseInt(value.split("/")[0]) : null;
  const [month, setMonth] = useState(initMonth);
  const [day, setDay] = useState(initDay);
  const days = DAYS_IN_MONTH[month];
  const firstDay = new Date(2025, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const confirm = () => { if (day) { onChange(`${String(day).padStart(2,"0")}/${String(month+1).padStart(2,"0")}`); onClose(); } };
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { setMonth(m => (m+11)%12); setDay(null); }} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold">‹</button>
        <span className="text-sm font-semibold text-gray-700">{MONTHS[month]}</span>
        <button onClick={() => { setMonth(m => (m+1)%12); setDay(null); }} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {["Lu","Ma","Mi","Ju","Vi","Sá","Do"].map(d => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {Array.from({ length: offset }).map((_, i) => <div key={"e"+i} />)}
        {Array.from({ length: days }, (_, i) => i + 1).map(d => (
          <button key={d} onClick={() => setDay(d)} className={`aspect-square rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${day === d ? `${accentCol.btn} text-white` : "hover:bg-gray-100 text-gray-700"}`}>{d}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2 text-sm">Cancelar</button>
        <button onClick={confirm} disabled={!day} className={`flex-1 ${day ? `${accentCol.btn} text-white` : "bg-gray-100 text-gray-400"} rounded-xl py-2 text-sm font-semibold transition-colors`}>
          {day ? `Confirmar ${String(day).padStart(2,"0")}/${String(month+1).padStart(2,"0")}` : "Elegí un día"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { completed: ["Completada", "bg-green-100 text-green-700"], in_progress: ["En curso", "bg-amber-100 text-amber-700"], pending: ["Pendiente", "bg-gray-100 text-gray-400"] };
  const [label, cls] = map[status] || ["–", ""];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

function MatIcon({ type }) {
  return <span className="text-lg">{type === "pdf" ? "📄" : type === "guide" ? "📋" : type === "youtube" ? "▶️" : type === "article" ? "🔗" : "📎"}</span>;
}

function Card({ children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}>
      {children}
    </div>
  );
}

function BackBtn({ label, onClick }) {
  return <button onClick={onClick} className="text-white/70 text-sm mb-4 flex items-center gap-1">← {label}</button>;
}

function HomeScreen({ onNav }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1"><span className="text-2xl">🧠</span><span className="text-white text-xl font-bold">DataMind</span></div>
        <p className="text-slate-400 text-sm">Tu plataforma de estudio inteligente</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[["3", "Materias activas"], ["6", "Semanas OK"], ["14", "Sesiones IA"]].map(([v, l]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-white text-xl font-bold">{v}</div>
              <div className="text-slate-400 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 -mt-4">
        <Card className="p-3 mb-4 flex items-center gap-2">
          <span>📅</span>
          <div className="flex-1"><div className="text-xs text-gray-500">Próximo examen</div><div className="text-sm font-semibold text-gray-800">Parcial ML — en 12 días</div></div>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Urgente</span>
        </Card>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Mis Carreras</h2>
        <div className="space-y-3 mb-5">
          {DB.careers.map(c => {
            const col = COLORS[c.color];
            return (
              <button key={c.id} onClick={() => onNav("career", { careerId: c.id })} className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`bg-gradient-to-r ${col.grad} px-4 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div><div className="text-white font-bold text-base">{c.name}</div><div className="text-white/70 text-xs">{DB.subjects[c.id].length} materias</div></div>
                  </div>
                  <span className="text-white/80">›</span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-500">{c.desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${col.dot}`} style={{ width: c.id === "datos" ? "42%" : "75%" }} />
                    </div>
                    <span className="text-xs text-gray-400">{c.id === "datos" ? "42%" : "75%"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          {[["👨‍🏫", "Profesor IA", "Última: ML Semana 3", () => onNav("professor", { careerId: "datos", subjectId: "ml", weekId: "ml-w3" })],
            ["📅", "Plan de Estudio", "3 sesiones esta semana", () => onNav("calendar")],
            ["📊", "Mi Progreso", "Ver estadísticas", () => {}],
            ["⚙️", "Configuración", "Horarios y preferencias", () => {}]].map(([icon, label, sub, action]) => (
            <Card key={label} className="p-3" onClick={action}>
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-sm font-semibold text-gray-800">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareerScreen({ careerId, onNav, onBack }) {
  const career = DB.careers.find(c => c.id === careerId);
  const subjects = DB.subjects[careerId];
  const col = COLORS[career.color];
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <BackBtn label="Inicio" onClick={onBack} />
        <div className="flex items-center gap-3">
          <span className="text-4xl">{career.icon}</span>
          <div><h1 className="text-white text-xl font-bold">{career.name}</h1><p className="text-white/70 text-sm">{subjects.length} materias activas</p></div>
        </div>
      </div>
      <div className="px-4 mt-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Materias</h2>
        <div className="space-y-3">
          {subjects.map(s => (
            <Card key={s.id} className="p-4" onClick={() => onNav("subject", { careerId, subjectId: s.id })}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-xl">{s.icon}</span><span className="font-semibold text-gray-800">{s.name}</span></div>
                <span className="text-gray-400">›</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${col.dot}`} style={{ width: `${s.progreso}%` }} />
                </div>
                <span className="text-xs text-gray-400">{s.progreso}%</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{Math.round(s.semanas * s.progreso / 100)}/{s.semanas} semanas</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectScreen({ careerId, subjectId, onNav, onBack }) {
  const career = DB.careers.find(c => c.id === careerId);
  const subject = DB.subjects[careerId].find(s => s.id === subjectId);
  const weeks = DB.weeks[subjectId] || [];
  const col = COLORS[career.color];
  const ev = DB.evaluaciones[subjectId] || {};
  const [tab, setTab] = useState("semanas");
  const [editEv, setEditEv] = useState(null);
  const [evalDates, setEvalDates] = useState({ parcial1: ev.parcial1?.fecha || "", parcial2: ev.parcial2?.fecha || "", recuperatorio: ev.recuperatorio?.fecha || "", final: ev.final?.fecha || "" });
  const [tps, setTps] = useState(ev.tps || []);
  const [showAddTp, setShowAddTp] = useState(false);
  const [newTp, setNewTp] = useState({ titulo: "", fecha: "", tema: "" });
  const [editTpDate, setEditTpDate] = useState(false);
  const tabs = [["semanas", "📚 Semanas"], ["evaluaciones", "📝 Evaluaciones"], ["modelos", "🗂 Parciales Modelo"]];
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-4`}>
        <BackBtn label={career.name} onClick={onBack} />
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{subject.icon}</span>
          <div><h1 className="text-white text-xl font-bold">{subject.name}</h1><p className="text-white/70 text-sm">{weeks.length} semanas</p></div>
        </div>
        <button onClick={() => onNav("materialGeneral", { careerId, subjectId })} className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:bg-white/25 transition-colors">
          <span className="text-2xl">📂</span>
          <div className="flex-1"><div className="text-white font-semibold text-sm">Material general de la materia</div><div className="text-white/60 text-xs">Bibliografía, programa, apuntes generales</div></div>
          <span className="text-white/60">›</span>
        </button>
      </div>
      <div className="flex bg-white border-b border-gray-100 px-2 sticky top-0 z-10">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab === id ? `${col.text} border-b-2 ${col.border}` : "text-gray-400"}`}>{label}</button>
        ))}
      </div>
      <div className="px-4 mt-4">
        {tab === "semanas" && (
          <div className="space-y-2">
            {weeks.map(w => (
              <Card key={w.id} className="px-4 py-3 flex items-center gap-3" onClick={() => onNav("week", { careerId, subjectId, weekId: w.id })}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${w.status === "completed" ? "bg-green-100 text-green-600" : w.status === "in_progress" ? `${col.light} ${col.text}` : "bg-gray-100 text-gray-400"}`}>
                  {w.status === "completed" ? "✓" : w.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{w.title}</div>
                  <div className="text-xs text-gray-400">{w.materiales > 0 ? `${w.materiales} materiales` : "Sin material aún"}</div>
                </div>
                <StatusBadge status={w.status} />
              </Card>
            ))}
          </div>
        )}
        {tab === "evaluaciones" && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Parciales</h3>
            {[["parcial1","Parcial 1","📝"],["parcial2","Parcial 2","📝"],["recuperatorio","Recuperatorio","🔄"],["final","Final","🏁"]].map(([key, label, icon]) => (
              <Card key={key} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{label}</div>
                      {evalDates[key] ? <div className="text-xs text-gray-500">📅 {evalDates[key]}</div> : <div className="text-xs text-gray-400">Sin fecha asignada</div>}
                    </div>
                  </div>
                  <button onClick={() => setEditEv(editEv === key ? null : key)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${col.badge}`}>
                    {editEv === key ? "Cerrar" : evalDates[key] ? "Editar" : "Agregar fecha"}
                  </button>
                </div>
                {editEv === key && <DatePicker value={evalDates[key]} onChange={v => setEvalDates(d => ({ ...d, [key]: v }))} onClose={() => setEditEv(null)} accentCol={col} />}
              </Card>
            ))}
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">TPs y Orales</h3>
            {tps.map((tp, i) => (
              <Card key={tp.id} className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">📁</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{tp.titulo}</div>
                      <div className="text-xs text-gray-500">📅 {tp.fecha}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Tema: {tp.tema}</div>
                    </div>
                  </div>
                  <button onClick={() => setTps(t => t.filter((_, j) => j !== i))} className="text-xs text-red-400 px-2 py-1">✕</button>
                </div>
              </Card>
            ))}
            {showAddTp ? (
              <Card className="px-4 py-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Nuevo TP / Oral</h4>
                <div className="space-y-2">
                  {[["Título (ej: TP 1 / Oral)","titulo"],["Tema específico","tema"]].map(([ph, field]) => (
                    <input key={field} type="text" placeholder={ph} value={newTp[field]} onChange={e => setNewTp(n => ({ ...n, [field]: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400" />
                  ))}
                  <div>
                    <button onClick={() => setEditTpDate(!editTpDate)} className={`w-full border rounded-lg px-3 py-2 text-sm text-left ${newTp.fecha ? "border-gray-200 text-gray-700" : "border-dashed border-gray-300 text-gray-400"}`}>
                      {newTp.fecha ? `📅 Fecha: ${newTp.fecha}` : "📅 Seleccionar fecha"}
                    </button>
                    {editTpDate && <DatePicker value={newTp.fecha} onChange={v => { setNewTp(n => ({ ...n, fecha: v })); setEditTpDate(false); }} onClose={() => setEditTpDate(false)} accentCol={col} />}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setShowAddTp(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-sm">Cancelar</button>
                    <button onClick={() => { setTps(t => [...t, { ...newTp, id: Date.now() }]); setNewTp({ titulo: "", fecha: "", tema: "" }); setShowAddTp(false); }} className={`flex-1 ${col.btn} text-white rounded-lg py-2 text-sm font-medium`}>Agregar</button>
                  </div>
                </div>
              </Card>
            ) : (
              <button onClick={() => setShowAddTp(true)} className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors">+ Agregar TP u Oral</button>
            )}
          </div>
        )}
        {tab === "modelos" && (
          <div className="space-y-3">
            <div className={`${col.light} ${col.border} border rounded-2xl p-3 text-xs text-gray-600 flex gap-2`}>
              <span>💡</span><span>Subí parciales de años anteriores. 3-4 días antes de tu examen, la IA te hará un simulacro de múltiple opción con esas preguntas y te dará un análisis final.</span>
            </div>
            <Card className="px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div className="flex-1"><div className="text-sm font-semibold text-gray-800">Parcial Modelo 2023</div><div className="text-xs text-gray-400">4 preguntas · Múltiple opción</div></div>
              <span className={`text-xs ${col.badge} px-2 py-1 rounded-lg font-medium`}>Ver</span>
            </Card>
            <button onClick={() => onNav("simulacro", { careerId, subjectId })} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold text-sm flex items-center justify-center gap-2`}>🎯 Iniciar Simulacro de Examen</button>
            <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors">+ Subir parcial modelo (PDF)</button>
          </div>
        )}
      </div>
    </div>
  );
}

function WeekScreen({ careerId, subjectId, weekId, onNav, onBack }) {
  const career = DB.careers.find(c => c.id === careerId);
  const subject = DB.subjects[careerId].find(s => s.id === subjectId);
  const week = DB.weeks[subjectId]?.find(w => w.id === weekId);
  const col = COLORS[career.color];
  const mats = DB.weekMaterials[weekId] || [];
  const [showUrl, setShowUrl] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const addTypes = [
    { id: "guide", icon: "📋", label: "Guía de lectura", sub: "PDF de la guía semanal" },
    { id: "youtube", icon: "▶️", label: "Video YouTube", sub: "Pegá la URL del video" },
    { id: "article", icon: "🔗", label: "Artículo / Link", sub: "Link de lectura o recurso" },
    { id: "pdf", icon: "📄", label: "PDF / Apunte", sub: "Material en PDF" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <BackBtn label={subject?.name} onClick={onBack} />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wide font-medium">Semana {week?.n}</div>
            <h1 className="text-white text-xl font-bold mt-0.5">{week?.title}</h1>
          </div>
          {week && <StatusBadge status={week.status} />}
        </div>
      </div>
      <div className="px-4 mt-4">
        {mats.length > 0 && (
          <div className={`${col.light} ${col.border} border rounded-2xl p-4 mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span>✨</span><span className="text-sm font-semibold text-gray-700">Mini resumen semanal</span>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-400 border">IA</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">Esta semana cubrís <strong>clasificación en ML</strong>: tipos (binaria/multiclase), algoritmos principales como KNN, Regresión Logística y Árboles de Decisión, con práctica en Scikit-learn.</p>
          </div>
        )}
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agregar material</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {addTypes.map(t => (
            <div key={t.id}>
              <button onClick={() => setShowUrl(showUrl === t.id ? null : t.id)} className={`w-full border-2 rounded-xl p-3 text-left transition-colors ${showUrl === t.id ? `border-violet-400 ${col.light}` : "border-dashed border-gray-200 hover:border-violet-300 bg-white"}`}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </button>
              {showUrl === t.id && (
                <div className="mt-1 flex gap-1">
                  {(t.id === "youtube" || t.id === "article") ? (
                    <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder={t.id === "youtube" ? "https://youtube.com/..." : "https://..."} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400" />
                  ) : (
                    <div className="flex-1 border border-dashed border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-400 text-center">Tocá para elegir archivo</div>
                  )}
                  <button onClick={() => { setShowUrl(null); setUrlInput(""); }} className={`${col.btn} text-white px-3 rounded-lg text-xs font-medium`}>+</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {mats.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Material cargado</h2>
            <div className="space-y-2 mb-4">
              {mats.map(m => (
                <Card key={m.id} className="px-4 py-3 flex items-center gap-3">
                  <MatIcon type={m.type} />
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-800 truncate">{m.title}</div><div className="text-xs text-gray-400">{m.detail}</div></div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Listo</span>
                </Card>
              ))}
            </div>
            <button onClick={() => onNav("professor", { careerId, subjectId, weekId })} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 mb-2`}>👨‍🏫 Ir al Profesor IA</button>
          </>
        )}
      </div>
    </div>
  );
}

function SimulacroScreen({ careerId, subjectId, onBack }) {
  const career = DB.careers.find(c => c.id === careerId);
  const col = COLORS[career.color];
  const preguntas = DB.modelExam;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const p = preguntas[current];
  const total = preguntas.length;
  const correct = Object.entries(answers).filter(([i, a]) => preguntas[+i].correcta === a).length;
  const confirm = () => { setAnswers(a => ({ ...a, [current]: selected })); setConfirmed(true); };
  const next = () => { if (current < total - 1) { setCurrent(c => c + 1); setSelected(null); setConfirmed(false); } else setFinished(true); };
  if (finished) {
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
          <BackBtn label="Volver" onClick={onBack} />
          <h1 className="text-white text-xl font-bold">🎯 Resultado del Simulacro</h1>
        </div>
        <div className="px-4 mt-4 space-y-4">
          <Card className="p-5 text-center">
            <div className={`text-5xl font-bold ${pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-500" : "text-red-500"}`}>{pct}%</div>
            <div className="text-gray-500 text-sm mt-1">{correct} de {total} correctas</div>
            <div className={`mt-3 text-sm font-medium ${pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600"}`}>
              {pct >= 70 ? "¡Muy bien! Estás listo para el parcial 💪" : pct >= 50 ? "Vas por buen camino, reforzá algunos temas 📚" : "Necesitás repasar más antes del examen ⚠️"}
            </div>
          </Card>
          <Card className="p-4"><h3 className="text-sm font-bold text-green-700 mb-2">✅ Temas donde anduviste bien</h3>{["Clasificación supervisada","Función Sigmoide"].map(t => <div key={t} className="text-xs text-gray-600 py-1 border-b border-gray-50 last:border-0">· {t}</div>)}</Card>
          <Card className="p-4"><h3 className="text-sm font-bold text-red-600 mb-2">⚠️ Temas para reforzar</h3>{["Overfitting y Bias-Variance","Métricas desbalanceadas"].map(t => <div key={t} className="text-xs text-gray-600 py-1 border-b border-gray-50 last:border-0">· {t}</div>)}</Card>
          <div className={`${col.light} ${col.border} border rounded-2xl p-4`}>
            <div className="text-sm font-semibold text-gray-700 mb-1">💡 Recomendación</div>
            <p className="text-xs text-gray-600 leading-relaxed">Dedicá las próximas 2 sesiones a repasar <strong>Overfitting</strong> y <strong>métricas desbalanceadas</strong>. Revisá la Semana 3 y el video de Scikit-learn.</p>
          </div>
          <button onClick={onBack} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold`}>Volver a la materia</button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <BackBtn label="Volver" onClick={onBack} />
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white text-lg font-bold">🎯 Simulacro</h1>
          <span className="text-white/70 text-sm">{current + 1}/{total}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </div>
      <div className="px-4 mt-4">
        <Card className="p-4 mb-4">
          <div className="text-xs text-gray-400 mb-2 font-medium">Pregunta {current + 1}</div>
          <p className="text-sm font-semibold text-gray-800 leading-relaxed">{p.pregunta}</p>
        </Card>
        <div className="space-y-2 mb-4">
          {p.opciones.map((op, i) => {
            let cls = "border-2 border-gray-200 bg-white text-gray-700";
            if (confirmed) { if (i === p.correcta) cls = "border-2 border-green-400 bg-green-50 text-green-800"; else if (i === selected && i !== p.correcta) cls = "border-2 border-red-300 bg-red-50 text-red-700"; else cls = "border-2 border-gray-100 bg-gray-50 text-gray-400"; }
            else if (selected === i) cls = `border-2 ${col.border} ${col.light} ${col.text} font-semibold`;
            return (
              <button key={i} disabled={confirmed} onClick={() => setSelected(i)} className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-colors ${cls}`}>
                <span className="font-bold mr-2">{["A","B","C","D"][i]}.</span>{op}
                {confirmed && i === p.correcta && <span className="ml-2 text-green-600 font-bold">✓</span>}
                {confirmed && i === selected && i !== p.correcta && <span className="ml-2 text-red-500 font-bold">✗</span>}
              </button>
            );
          })}
        </div>
        {!confirmed ? (
          <button disabled={selected === null} onClick={confirm} className={`w-full py-4 rounded-2xl font-semibold text-base transition-colors ${selected !== null ? `${col.btn} text-white` : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Confirmar respuesta</button>
        ) : (
          <div className="space-y-2">
            <div className={`rounded-xl px-4 py-3 text-sm ${answers[current] === p.correcta ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {answers[current] === p.correcta ? "✅ ¡Correcto!" : `❌ La respuesta correcta era: ${p.opciones[p.correcta]}`}
            </div>
            <button onClick={next} className={`w-full ${col.btn} text-white py-4 rounded-2xl font-semibold`}>{current < total - 1 ? "Siguiente →" : "Ver resultado final"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfessorScreen({ careerId, subjectId, weekId, onBack }) {
  const career = DB.careers.find(c => c.id === careerId);
  const subject = DB.subjects[careerId]?.find(s => s.id === subjectId);
  const week = DB.weeks[subjectId]?.find(w => w.id === weekId);
  const col = COLORS[career.color];
  const [mode, setMode] = useState("material");
  const [style, setStyle] = useState("clase");
  const [msgs, setMsgs] = useState([{ role: "assistant", content: `¡Hola! Soy tu Profesor IA para ${subject?.name}, Semana ${week?.n}. ¿Por dónde querés arrancar?` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = () => {
    if (!input.trim()) return;
    const txt = input;
    setMsgs(m => [...m, { role: "user", content: txt }]);
    setInput("");
    setLoading(true);
    setTimeout(() => { setMsgs(m => [...m, { role: "assistant", content: "Basándome en tu material de la semana, te explico... (En la versión completa aquí responde Claude con tus PDFs y videos 🤖)", sources: ["Tu PDF · pág. 3", "Video YouTube · min. 8:40"] }]); setLoading(false); }, 1200);
  };
  return (
    <div className="flex flex-col h-screen">
      <div className={`bg-gradient-to-r ${col.grad} px-4 pt-5 pb-3 flex-shrink-0`}>
        <BackBtn label={week?.title || "Volver"} onClick={onBack} />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">👨‍🏫</div>
          <div><div className="text-white font-bold text-sm">Profesor IA</div><div className="text-white/60 text-xs">{subject?.name} · Semana {week?.n}</div></div>
        </div>
        <div className="flex gap-2 mb-2 flex-wrap">
          {[["material","📚 Mi material"],["extended","🌐 Conocimiento extendido"]].map(([id, label]) => (
            <button key={id} onClick={() => setMode(id)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${mode === id ? "bg-white text-gray-800" : "bg-white/20 text-white"}`}>{label}</button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[["clase","🎓 Clase"],["concepto","🔍 Concepto"],["socratico","🧩 Socrático"],["examen","📝 Para examen"]].map(([id, label]) => (
            <button key={id} onClick={() => setStyle(id)} className={`text-xs px-2.5 py-1 rounded-full transition-colors ${style === id ? "bg-white/30 text-white font-semibold" : "text-white/60"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {msgs.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && <div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">👨‍🏫</div>}
            <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? `${col.btn} text-white rounded-br-sm` : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>
              {msg.content}
              {msg.sources && <div className="mt-2 pt-2 border-t border-gray-100 space-y-0.5">{msg.sources.map((s, j) => <div key={j} className="text-xs text-gray-400 flex items-center gap-1"><span>📌</span>{s}</div>)}</div>}
            </div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2">👨‍🏫</div><div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3 flex gap-1">{[0,1,2].map(i => <div key={i} className={`w-2 h-2 ${col.dot} rounded-full animate-bounce`} style={{ animationDelay: `${i*0.15}s` }} />)}</div></div>}
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Preguntale al Profesor IA..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400" />
          <button onClick={send} className={`${col.btn} text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>➤</button>
        </div>
      </div>
    </div>
  );
}

function CalendarScreen({ onBack }) {
  const days = ["L","M","M","J","V","S","D"];
  const sessions = [
    { day: 0, time: "19:00", subject: "Machine Learning", type: "estudio", color: "bg-violet-100 text-violet-700" },
    { day: 1, time: "20:00", subject: "Estadística", type: "repaso", color: "bg-indigo-100 text-indigo-700" },
    { day: 3, time: "19:30", subject: "Machine Learning", type: "ejercicios", color: "bg-violet-100 text-violet-700" },
    { day: 4, time: "20:00", subject: "Marketing Digital", type: "estudio", color: "bg-emerald-100 text-emerald-700" },
    { day: 6, time: "10:00", subject: "Repaso general", type: "repaso", color: "bg-amber-100 text-amber-700" },
  ];
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 px-4 pt-6 pb-8">
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Inicio</button>
        <h1 className="text-white text-xl font-bold">📅 Plan de Estudio</h1>
        <p className="text-white/60 text-sm mt-1">Semana del 14 al 20 de julio</p>
      </div>
      <div className="px-4 mt-4">
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-7 gap-1 mb-2">{days.map((d,i) => <div key={i} className="text-center text-xs text-gray-400 font-medium">{d}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">{Array.from({length:7},(_,i) => <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${sessions.some(s=>s.day===i)?"bg-violet-600 text-white":"bg-gray-50 text-gray-600"}`}>{14+i}</div>)}</div>
        </Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sesiones</h2>
          <button className="text-xs bg-slate-700 text-white px-3 py-1.5 rounded-lg font-medium">+ Generar plan</button>
        </div>
        <div className="space-y-2 mb-6">
          {sessions.map((s,i) => (
            <Card key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="text-center flex-shrink-0 w-8"><div className="text-xs text-gray-400">{days[s.day]}</div><div className="text-sm font-bold text-gray-700">{14+s.day}</div></div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="flex-1"><div className="text-sm font-semibold text-gray-800">{s.subject}</div><div className="text-xs text-gray-400">{s.time} hs</div></div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.type}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState({});
  const onNav = (to, p = {}) => { setScreen(to); setParams(p); window.scrollTo(0,0); };
  const back = () => {
    const map = { career:["home",{}], subject:["career",{careerId:params.careerId}], week:["subject",params], professor:["week",params], simulacro:["subject",params], materialGeneral:["subject",params], calendar:["home",{}] };
    const [s, p] = map[screen] || ["home",{}];
    onNav(s, p);
  };
  const screens = {
    home: <HomeScreen onNav={onNav} />,
    career: <CareerScreen {...params} onNav={onNav} onBack={back} />,
    subject: <SubjectScreen {...params} onNav={onNav} onBack={back} />,
    week: <WeekScreen {...params} onNav={onNav} onBack={back} />,
    professor: <ProfessorScreen {...params} onBack={back} />,
    simulacro: <SimulacroScreen {...params} onBack={back} />,
    calendar: <CalendarScreen onBack={back} />,
    materialGeneral: <WeekScreen {...params} weekId={null} onNav={onNav} onBack={back} />,
  };
  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen shadow-2xl">
      {screens[screen] || <HomeScreen onNav={onNav} />}
      {!["professor","simulacro"].includes(screen) && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex z-20">
          {[["🏠","Inicio","home"],["📅","Plan","calendar"],["📊","Progreso","home"]].map(([icon,label,s]) => (
            <button key={label} onClick={() => onNav(s)} className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${screen===s&&label==="Inicio"?"text-violet-600":screen==="calendar"&&label==="Plan"?"text-violet-600":"text-gray-400"}`}>
              <span className="text-lg">{icon}</span><span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState } from "react";

const COLORS = {
  datos: { grad: "from-violet-600 to-indigo-700", light: "bg-violet-50", badge: "bg-violet-100 text-violet-700", btn: "bg-violet-600 hover:bg-violet-700", border: "border-violet-200", dot: "bg-violet-500", text: "text-violet-600" },
  admin: { grad: "from-emerald-600 to-teal-700", light: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", text: "text-emerald-600" },
};

const CAREERS = [
  { id: "datos", name: "Ciencia de Datos", icon: "📊", desc: "Estadística · Machine Learning · Python", color: "datos" },
  { id: "admin", name: "Lic. en Administración", icon: "📋", desc: "Marketing · Finanzas · Gestión", color: "admin" },
];

const SUBJECT_ICONS = ["📚","🔬","📐","💻","📊","📈","🧮","🧪","📝","🎯","🌐","⚙️","🧠","📡","💡"];

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
        <button onClick={confirm} disabled={!day} className={`flex-1 ${day ? `${accentCol.btn} text-white` : "bg-gray-100 text-gray-400"} rounded-xl py-2 text-sm font-semibold`}>
          {day ? `Confirmar ${String(day).padStart(2,"0")}/${String(month+1).padStart(2,"0")}` : "Elegí un día"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { completed: ["Completada","bg-green-100 text-green-700"], in_progress: ["En curso","bg-amber-100 text-amber-700"], pending: ["Pendiente","bg-gray-100 text-gray-400"] };
  const [label, cls] = map[status] || ["–",""];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

function Card({ children, className="", onClick }) {
  return <div onClick={onClick} className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${onClick?"cursor-pointer hover:shadow-md transition-shadow":""} ${className}`}>{children}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-sm p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────
function HomeScreen({ onNav, subjects }) {
  const totalMaterias = Object.values(subjects).flat().length;
  const totalSemanas = Object.values(subjects).flat().reduce((acc, s) => acc + (s.weeks?.filter(w=>w.status==="completed").length||0), 0);
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-4 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1"><span className="text-2xl">🧠</span><span className="text-white text-xl font-bold">DataMind</span></div>
        <p className="text-slate-400 text-sm">Tu plataforma de estudio inteligente</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[[String(totalMaterias),"Materias"],[String(totalSemanas),"Semanas OK"],["0","Sesiones IA"]].map(([v,l]) => (
            <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-white text-xl font-bold">{v}</div>
              <div className="text-slate-400 text-xs mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 -mt-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 mt-5">Mis Carreras</h2>
        <div className="space-y-3 mb-5">
          {CAREERS.map(c => {
            const col = COLORS[c.color];
            const mats = subjects[c.id] || [];
            return (
              <button key={c.id} onClick={() => onNav("career", { careerId: c.id })} className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className={`bg-gradient-to-r ${col.grad} px-4 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div><div className="text-white font-bold text-base">{c.name}</div><div className="text-white/70 text-xs">{mats.length} {mats.length===1?"materia":"materias"}</div></div>
                  </div>
                  <span className="text-white/80">›</span>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-500">{mats.length > 0 ? mats.map(m=>m.name).join(" · ") : "Sin materias todavía"}</p>
                </div>
              </button>
            );
          })}
        </div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3">
          {[["📅","Plan de Estudio","Próximas sesiones",()=>onNav("calendar")],["📊","Mi Progreso","Ver estadísticas",()=>{}]].map(([icon,label,sub,action]) => (
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

// ─── CAREER ──────────────────────────────────────────────────
function CareerScreen({ careerId, onNav, onBack, subjects, onAddSubject, onDeleteSubject }) {
  const career = CAREERS.find(c => c.id === careerId);
  const col = COLORS[career.color];
  const mats = subjects[careerId] || [];
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📚");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddSubject(careerId, { id: Date.now().toString(), name: newName.trim(), icon: newIcon, weeks: [] });
    setNewName(""); setNewIcon("📚"); setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Inicio</button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{career.icon}</span>
            <div><h1 className="text-white text-xl font-bold">{career.name}</h1><p className="text-white/70 text-sm">{mats.length} {mats.length===1?"materia":"materias"}</p></div>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-white/20 border border-white/30 text-white text-sm px-3 py-1.5 rounded-xl font-medium">+ Nueva</button>
        </div>
      </div>

      <div className="px-4 mt-5">
        {mats.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 text-sm mb-4">Todavía no hay materias en esta carrera</p>
            <button onClick={() => setShowModal(true)} className={`${col.btn} text-white px-6 py-3 rounded-xl font-semibold text-sm`}>+ Agregar primera materia</button>
          </div>
        ) : (
          <div className="space-y-3">
            {mats.map(s => {
              const completadas = s.weeks?.filter(w=>w.status==="completed").length || 0;
              const total = s.weeks?.length || 0;
              const pct = total > 0 ? Math.round((completadas/total)*100) : 0;
              return (
                <div key={s.id} className="relative">
                  <Card className="p-4" onClick={() => onNav("subject", { careerId, subjectId: s.id })}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><span className="text-xl">{s.icon}</span><span className="font-semibold text-gray-800">{s.name}</span></div>
                      <span className="text-gray-400">›</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${col.dot}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{completadas}/{total} semanas completadas</div>
                  </Card>
                  <button onClick={() => { if(confirm(`¿Borrar "${s.name}"?`)) onDeleteSubject(careerId, s.id); }}
                    className="absolute top-3 right-10 text-xs text-red-400 px-2 py-1 hover:bg-red-50 rounded-lg">🗑</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Nueva materia" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Nombre de la materia</label>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()}
                placeholder="ej: Estadística Aplicada"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-medium">Ícono</label>
              <div className="grid grid-cols-8 gap-1">
                {SUBJECT_ICONS.map(ic => (
                  <button key={ic} onClick={() => setNewIcon(ic)} className={`text-xl p-1.5 rounded-lg ${newIcon===ic?"bg-violet-100 ring-2 ring-violet-400":"hover:bg-gray-100"}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm">Cancelar</button>
              <button onClick={handleAdd} disabled={!newName.trim()} className={`flex-1 ${newName.trim()?`${col.btn} text-white`:"bg-gray-100 text-gray-400"} rounded-xl py-3 text-sm font-semibold`}>Agregar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SUBJECT ─────────────────────────────────────────────────
function SubjectScreen({ careerId, subjectId, onNav, onBack, subjects, onAddWeek, onDeleteWeek, onUpdateWeekStatus }) {
  const career = CAREERS.find(c => c.id === careerId);
  const subject = (subjects[careerId]||[]).find(s => s.id === subjectId);
  const col = COLORS[career.color];
  const weeks = subject?.weeks || [];
  const [tab, setTab] = useState("semanas");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editEv, setEditEv] = useState(null);
  const [evalDates, setEvalDates] = useState({ parcial1:"", parcial2:"", recuperatorio:"", final:"" });
  const [tps, setTps] = useState([]);
  const [showAddTp, setShowAddTp] = useState(false);
  const [newTp, setNewTp] = useState({ titulo:"", fecha:"", tema:"" });
  const [editTpDate, setEditTpDate] = useState(false);

  if (!subject) return null;

  const handleAddWeek = () => {
    if (!newTitle.trim()) return;
    onAddWeek(careerId, subjectId, { id: Date.now().toString(), n: weeks.length+1, title: newTitle.trim(), status: "pending", materiales: 0 });
    setNewTitle(""); setShowModal(false);
  };

  const tabs = [["semanas","📚 Semanas"],["evaluaciones","📝 Evaluaciones"],["modelos","🗂 Parciales Modelo"]];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-4`}>
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← {career.name}</button>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div><h1 className="text-white text-xl font-bold">{subject.name}</h1><p className="text-white/70 text-sm">{weeks.length} semanas</p></div>
          </div>
          {tab==="semanas" && <button onClick={() => setShowModal(true)} className="bg-white/20 border border-white/30 text-white text-sm px-3 py-1.5 rounded-xl font-medium">+ Semana</button>}
        </div>
        <button onClick={() => onNav("materialGeneral",{careerId,subjectId})} className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:bg-white/25 transition-colors">
          <span className="text-2xl">📂</span>
          <div className="flex-1"><div className="text-white font-semibold text-sm">Material general de la materia</div><div className="text-white/60 text-xs">Bibliografía, programa, apuntes generales</div></div>
          <span className="text-white/60">›</span>
        </button>
      </div>

      <div className="flex bg-white border-b border-gray-100 px-2 sticky top-0 z-10">
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 py-3 text-xs font-semibold transition-colors ${tab===id?`${col.text} border-b-2 ${col.border}`:"text-gray-400"}`}>{label}</button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab==="semanas" && (
          <>
            {weeks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-500 text-sm mb-4">Todavía no hay semanas cargadas</p>
                <button onClick={() => setShowModal(true)} className={`${col.btn} text-white px-6 py-3 rounded-xl font-semibold text-sm`}>+ Agregar primera semana</button>
              </div>
            ) : (
              <div className="space-y-2">
                {weeks.map(w => (
                  <div key={w.id} className="relative">
                    <Card className="px-4 py-3 flex items-center gap-3" onClick={() => onNav("week",{careerId,subjectId,weekId:w.id})}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${w.status==="completed"?"bg-green-100 text-green-600":w.status==="in_progress"?`${col.light} ${col.text}`:"bg-gray-100 text-gray-400"}`}>
                        {w.status==="completed"?"✓":w.n}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">{w.title}</div>
                        <div className="text-xs text-gray-400">{w.materiales>0?`${w.materiales} materiales`:"Sin material aún"}</div>
                      </div>
                      <StatusBadge status={w.status} />
                    </Card>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <select value={w.status} onChange={e=>onUpdateWeekStatus(careerId,subjectId,w.id,e.target.value)}
                        onClick={e=>e.stopPropagation()}
                        className="text-xs border border-gray-200 rounded-lg px-1 py-0.5 bg-white text-gray-500 outline-none">
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En curso</option>
                        <option value="completed">Completada</option>
                      </select>
                      <button onClick={e=>{e.stopPropagation();if(confirm(`¿Borrar semana "${w.title}"?`))onDeleteWeek(careerId,subjectId,w.id);}}
                        className="text-xs text-red-400 px-1.5 py-0.5 hover:bg-red-50 rounded-lg">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab==="evaluaciones" && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Parciales</h3>
            {[["parcial1","Parcial 1","📝"],["parcial2","Parcial 2","📝"],["recuperatorio","Recuperatorio","🔄"],["final","Final","🏁"]].map(([key,label,icon]) => (
              <Card key={key} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{label}</div>
                      {evalDates[key]?<div className="text-xs text-gray-500">📅 {evalDates[key]}</div>:<div className="text-xs text-gray-400">Sin fecha asignada</div>}
                    </div>
                  </div>
                  <button onClick={()=>setEditEv(editEv===key?null:key)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${col.badge}`}>
                    {editEv===key?"Cerrar":evalDates[key]?"Editar":"Agregar fecha"}
                  </button>
                </div>
                {editEv===key && <DatePicker value={evalDates[key]} onChange={v=>setEvalDates(d=>({...d,[key]:v}))} onClose={()=>setEditEv(null)} accentCol={col} />}
              </Card>
            ))}

            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">TPs y Orales</h3>
            {tps.map((tp,i) => (
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
                  <button onClick={()=>setTps(t=>t.filter((_,j)=>j!==i))} className="text-xs text-red-400 px-2 py-1">✕</button>
                </div>
              </Card>
            ))}
            {showAddTp ? (
              <Card className="px-4 py-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Nuevo TP / Oral</h4>
                <div className="space-y-2">
                  {[["Título (ej: TP 1 / Oral)","titulo"],["Tema específico","tema"]].map(([ph,field]) => (
                    <input key={field} type="text" placeholder={ph} value={newTp[field]} onChange={e=>setNewTp(n=>({...n,[field]:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400" />
                  ))}
                  <div>
                    <button onClick={()=>setEditTpDate(!editTpDate)} className={`w-full border rounded-lg px-3 py-2 text-sm text-left ${newTp.fecha?"border-gray-200 text-gray-700":"border-dashed border-gray-300 text-gray-400"}`}>
                      {newTp.fecha?`📅 Fecha: ${newTp.fecha}`:"📅 Seleccionar fecha"}
                    </button>
                    {editTpDate && <DatePicker value={newTp.fecha} onChange={v=>{setNewTp(n=>({...n,fecha:v}));setEditTpDate(false);}} onClose={()=>setEditTpDate(false)} accentCol={col} />}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={()=>setShowAddTp(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-sm">Cancelar</button>
                    <button onClick={()=>{setTps(t=>[...t,{...newTp,id:Date.now()}]);setNewTp({titulo:"",fecha:"",tema:""});setShowAddTp(false);}} className={`flex-1 ${col.btn} text-white rounded-lg py-2 text-sm font-medium`}>Agregar</button>
                  </div>
                </div>
              </Card>
            ) : (
              <button onClick={()=>setShowAddTp(true)} className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors">+ Agregar TP u Oral</button>
            )}
          </div>
        )}

        {tab==="modelos" && (
          <div className="space-y-3">
            <div className={`${col.light} ${col.border} border rounded-2xl p-3 text-xs text-gray-600 flex gap-2`}>
              <span>💡</span><span>Subí parciales de años anteriores. 3-4 días antes del examen la IA te hará un simulacro.</span>
            </div>
            <button onClick={()=>onNav("simulacro",{careerId,subjectId})} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold text-sm flex items-center justify-center gap-2`}>🎯 Iniciar Simulacro de Examen</button>
            <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors">+ Subir parcial modelo (PDF)</button>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Nueva semana" onClose={()=>setShowModal(false)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Título de la semana</label>
              <input autoFocus value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddWeek()}
                placeholder={`ej: Semana ${weeks.length+1} - Introducción`}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm">Cancelar</button>
              <button onClick={handleAddWeek} disabled={!newTitle.trim()} className={`flex-1 ${newTitle.trim()?`${col.btn} text-white`:"bg-gray-100 text-gray-400"} rounded-xl py-3 text-sm font-semibold`}>Agregar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── WEEK ────────────────────────────────────────────────────
function WeekScreen({ careerId, subjectId, weekId, onNav, onBack, subjects }) {
  const career = CAREERS.find(c => c.id === careerId);
  const subject = (subjects[careerId]||[]).find(s => s.id === subjectId);
  const week = subject?.weeks?.find(w => w.id === weekId);
  const col = COLORS[career.color];
  const [showUrl, setShowUrl] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [materials, setMaterials] = useState([]);

  const addTypes = [
    { id:"guide", icon:"📋", label:"Guía de lectura", sub:"PDF de la guía semanal" },
    { id:"youtube", icon:"▶️", label:"Video YouTube", sub:"Pegá la URL del video" },
    { id:"article", icon:"🔗", label:"Artículo / Link", sub:"Link de lectura o recurso" },
    { id:"pdf", icon:"📄", label:"PDF / Apunte", sub:"Material en PDF" },
  ];

  const addMaterial = (type) => {
    if ((type==="youtube"||type==="article") && !urlInput.trim()) return;
    setMaterials(m => [...m, { id: Date.now().toString(), type, title: type==="youtube"?"Video YouTube":type==="article"?urlInput:type==="guide"?"Guía de lectura":"PDF subido", detail: type==="youtube"?"YouTube":urlInput||"Archivo" }]);
    setShowUrl(null); setUrlInput("");
  };

  if (!week) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← {subject?.name}</button>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wide font-medium">Semana {week.n}</div>
            <h1 className="text-white text-xl font-bold mt-0.5">{week.title}</h1>
          </div>
          <StatusBadge status={week.status} />
        </div>
      </div>
      <div className="px-4 mt-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agregar material</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {addTypes.map(t => (
            <div key={t.id}>
              <button onClick={()=>setShowUrl(showUrl===t.id?null:t.id)} className={`w-full border-2 rounded-xl p-3 text-left transition-colors ${showUrl===t.id?`border-violet-400 ${col.light}`:"border-dashed border-gray-200 hover:border-violet-300 bg-white"}`}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </button>
              {showUrl===t.id && (
                <div className="mt-1 flex gap-1">
                  {(t.id==="youtube"||t.id==="article") ? (
                    <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder={t.id==="youtube"?"https://youtube.com/...":"https://..."} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400" />
                  ) : (
                    <div className="flex-1 border border-dashed border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-400 text-center">Tocá para elegir archivo</div>
                  )}
                  <button onClick={()=>addMaterial(t.id)} className={`${col.btn} text-white px-3 rounded-lg text-xs font-medium`}>+</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {materials.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Material cargado</h2>
            <div className="space-y-2 mb-4">
              {materials.map(m => (
                <Card key={m.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">{m.type==="pdf"?"📄":m.type==="guide"?"📋":m.type==="youtube"?"▶️":"🔗"}</span>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-800 truncate">{m.title}</div><div className="text-xs text-gray-400">{m.detail}</div></div>
                  <button onClick={()=>setMaterials(ms=>ms.filter(x=>x.id!==m.id))} className="text-xs text-red-400 px-2">✕</button>
                </Card>
              ))}
            </div>
            <button onClick={()=>onNav("professor",{careerId,subjectId,weekId})} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 mb-2`}>👨‍🏫 Ir al Profesor IA</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── SIMULACRO ───────────────────────────────────────────────
function SimulacroScreen({ careerId, onBack }) {
  const career = CAREERS.find(c => c.id === careerId);
  const col = COLORS[career.color];
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className={`bg-gradient-to-br ${col.grad} px-4 pt-6 pb-8`}>
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Volver</button>
        <h1 className="text-white text-xl font-bold">🎯 Simulacro de Examen</h1>
        <p className="text-white/70 text-sm mt-1">Subí un parcial modelo para empezar</p>
      </div>
      <div className="px-4 mt-6 text-center">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-gray-500 text-sm mb-4">Todavía no hay parciales modelo cargados</p>
        <button className={`${col.btn} text-white px-6 py-3 rounded-xl font-semibold text-sm`}>+ Subir parcial modelo</button>
      </div>
    </div>
  );
}

// ─── PROFESSOR ───────────────────────────────────────────────
function ProfessorScreen({ careerId, subjectId, weekId, onBack, subjects }) {
  const career = CAREERS.find(c => c.id === careerId);
  const subject = (subjects[careerId]||[]).find(s => s.id === subjectId);
  const week = subject?.weeks?.find(w => w.id === weekId);
  const col = COLORS[career.color];
  const [mode, setMode] = useState("material");
  const [style, setStyle] = useState("clase");
  const [msgs, setMsgs] = useState([{ role:"assistant", content:`¡Hola! Soy tu Profesor IA para ${subject?.name}, Semana ${week?.n}: ${week?.title}. ¿Por dónde querés arrancar?` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = () => {
    if (!input.trim()) return;
    const txt = input; setMsgs(m=>[...m,{role:"user",content:txt}]); setInput(""); setLoading(true);
    setTimeout(()=>{setMsgs(m=>[...m,{role:"assistant",content:"Basándome en tu material de la semana, te explico... (En la versión completa aquí responde Claude con tus PDFs y videos 🤖)",sources:["Tu PDF · pág. 3"]}]);setLoading(false);},1200);
  };
  return (
    <div className="flex flex-col h-screen">
      <div className={`bg-gradient-to-r ${col.grad} px-4 pt-5 pb-3 flex-shrink-0`}>
        <button onClick={onBack} className="text-white/70 text-sm mb-3 flex items-center gap-1">← {week?.title||"Volver"}</button>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">👨‍🏫</div>
          <div><div className="text-white font-bold text-sm">Profesor IA</div><div className="text-white/60 text-xs">{subject?.name} · Semana {week?.n}</div></div>
        </div>
        <div className="flex gap-2 mb-2 flex-wrap">
          {[["material","📚 Mi material"],["extended","🌐 Conocimiento extendido"]].map(([id,label])=>(
            <button key={id} onClick={()=>setMode(id)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${mode===id?"bg-white text-gray-800":"bg-white/20 text-white"}`}>{label}</button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[["clase","🎓 Clase"],["concepto","🔍 Concepto"],["socratico","🧩 Socrático"],["examen","📝 Para examen"]].map(([id,label])=>(
            <button key={id} onClick={()=>setStyle(id)} className={`text-xs px-2.5 py-1 rounded-full transition-colors ${style===id?"bg-white/30 text-white font-semibold":"text-white/60"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {msgs.map((msg,i)=>(
          <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
            {msg.role==="assistant"&&<div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">👨‍🏫</div>}
            <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==="user"?`${col.btn} text-white rounded-br-sm`:"bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>
              {msg.content}
              {msg.sources&&<div className="mt-2 pt-2 border-t border-gray-100 space-y-0.5">{msg.sources.map((s,j)=><div key={j} className="text-xs text-gray-400 flex items-center gap-1"><span>📌</span>{s}</div>)}</div>}
            </div>
          </div>
        ))}
        {loading&&<div className="flex justify-start"><div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2">👨‍🏫</div><div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3 flex gap-1">{[0,1,2].map(i=><div key={i} className={`w-2 h-2 ${col.dot} rounded-full animate-bounce`} style={{animationDelay:`${i*0.15}s`}}/>)}</div></div>}
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Preguntale al Profesor IA..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"/>
          <button onClick={send} className={`${col.btn} text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState({});
  const [subjects, setSubjects] = useState({ datos:[], admin:[] });

  const onNav = (to, p={}) => { setScreen(to); setParams(p); window.scrollTo(0,0); };
  const back = () => {
    const map = { career:["home",{}], subject:["career",{careerId:params.careerId}], week:["subject",params], professor:["week",params], simulacro:["subject",params], materialGeneral:["subject",params], calendar:["home",{}] };
    const [s,p] = map[screen]||["home",{}]; onNav(s,p);
  };

  const onAddSubject = (careerId, subject) => setSubjects(prev => ({ ...prev, [careerId]: [...(prev[careerId]||[]), subject] }));
  const onDeleteSubject = (careerId, subjectId) => setSubjects(prev => ({ ...prev, [careerId]: prev[careerId].filter(s=>s.id!==subjectId) }));
  const onAddWeek = (careerId, subjectId, week) => setSubjects(prev => ({ ...prev, [careerId]: prev[careerId].map(s => s.id===subjectId ? {...s, weeks:[...(s.weeks||[]),week]} : s) }));
  const onDeleteWeek = (careerId, subjectId, weekId) => setSubjects(prev => ({ ...prev, [careerId]: prev[careerId].map(s => s.id===subjectId ? {...s, weeks:s.weeks.filter(w=>w.id!==weekId)} : s) }));
  const onUpdateWeekStatus = (careerId, subjectId, weekId, status) => setSubjects(prev => ({ ...prev, [careerId]: prev[careerId].map(s => s.id===subjectId ? {...s, weeks:s.weeks.map(w=>w.id===weekId?{...w,status}:w)} : s) }));

  const commonProps = { subjects, onNav, onBack: back };

  const screens = {
    home: <HomeScreen {...commonProps} />,
    career: <CareerScreen {...commonProps} {...params} onAddSubject={onAddSubject} onDeleteSubject={onDeleteSubject} />,
    subject: <SubjectScreen {...commonProps} {...params} onAddWeek={onAddWeek} onDeleteWeek={onDeleteWeek} onUpdateWeekStatus={onUpdateWeekStatus} />,
    week: <WeekScreen {...commonProps} {...params} />,
    professor: <ProfessorScreen {...commonProps} {...params} />,
    simulacro: <SimulacroScreen {...commonProps} {...params} onBack={back} />,
    materialGeneral: <WeekScreen {...commonProps} {...params} weekId={null} />,
    calendar: <div className="p-8 text-center text-gray-500">Calendario próximamente</div>,
  };

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen shadow-2xl">
      {screens[screen]||<HomeScreen {...commonProps} />}
      {!["professor","simulacro"].includes(screen) && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex z-20">
          {[["🏠","Inicio","home"],["📅","Plan","calendar"],["📊","Progreso","home"]].map(([icon,label,s])=>(
            <button key={label} onClick={()=>onNav(s)} className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${screen===s&&label==="Inicio"?"text-violet-600":screen==="calendar"&&label==="Plan"?"text-violet-600":"text-gray-400"}`}>
              <span className="text-lg">{icon}</span><span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
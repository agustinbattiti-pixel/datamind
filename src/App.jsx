import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── FERIADOS ARGENTINA 2025 ──────────────────────────────────
const FERIADOS_AR = [
  { date: "2025-01-01", name: "Año Nuevo" },
  { date: "2025-03-03", name: "Carnaval" },
  { date: "2025-03-04", name: "Carnaval" },
  { date: "2025-03-24", name: "Día de la Memoria" },
  { date: "2025-04-02", name: "Malvinas" },
  { date: "2025-04-18", name: "Viernes Santo" },
  { date: "2025-05-01", name: "Día del Trabajador" },
  { date: "2025-05-25", name: "Revolución de Mayo" },
  { date: "2025-06-20", name: "Día de la Bandera" },
  { date: "2025-07-09", name: "Independencia" },
  { date: "2025-08-17", name: "San Martín" },
  { date: "2025-10-12", name: "Diversidad Cultural" },
  { date: "2025-11-20", name: "Soberanía Nacional" },
  { date: "2025-12-08", name: "Inmaculada Concepción" },
  { date: "2025-12-25", name: "Navidad" },
];

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_IN_MONTH = (y,m) => new Date(y, m+1, 0).getDate();
const CAREER_COLORS = [
  { id:"violet", grad:"from-violet-600 to-indigo-700", dot:"bg-violet-500", btn:"bg-violet-600 hover:bg-violet-700", light:"bg-violet-50", badge:"bg-violet-100 text-violet-700", border:"border-violet-200", text:"text-violet-600" },
  { id:"emerald", grad:"from-emerald-600 to-teal-700", dot:"bg-emerald-500", btn:"bg-emerald-600 hover:bg-emerald-700", light:"bg-emerald-50", badge:"bg-emerald-100 text-emerald-700", border:"border-emerald-200", text:"text-emerald-600" },
  { id:"blue", grad:"from-blue-600 to-cyan-700", dot:"bg-blue-500", btn:"bg-blue-600 hover:bg-blue-700", light:"bg-blue-50", badge:"bg-blue-100 text-blue-700", border:"border-blue-200", text:"text-blue-600" },
  { id:"rose", grad:"from-rose-600 to-pink-700", dot:"bg-rose-500", btn:"bg-rose-600 hover:bg-rose-700", light:"bg-rose-50", badge:"bg-rose-100 text-rose-700", border:"border-rose-200", text:"text-rose-600" },
  { id:"amber", grad:"from-amber-500 to-orange-600", dot:"bg-amber-500", btn:"bg-amber-500 hover:bg-amber-600", light:"bg-amber-50", badge:"bg-amber-100 text-amber-700", border:"border-amber-200", text:"text-amber-600" },
];
const CAREER_ICONS = ["📊","📋","💻","🔬","📐","🎨","🌐","⚙️","🧠","📈","🎓","📚"];
const SUBJECT_ICONS = ["📚","🔬","📐","💻","📊","📈","🧮","🧪","📝","🎯","🌐","⚙️","🧠","📡","💡"];

function getCol(colorId) { return CAREER_COLORS.find(c=>c.id===colorId)||CAREER_COLORS[0]; }

// ─── SMALL COMPONENTS ─────────────────────────────────────────
function StatusBadge({ status }) {
  const map = { completed:["Completada","bg-green-100 text-green-700"], in_progress:["En curso","bg-amber-100 text-amber-700"], pending:["Pendiente","bg-gray-100 text-gray-400"] };
  const [label,cls] = map[status]||["–",""];
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>;
}

function Card({ children, className="", onClick }) {
  return <div onClick={onClick} className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${onClick?"cursor-pointer hover:shadow-md transition-shadow":""} ${className}`}>{children}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DatePicker({ value, onChange, onClose }) {
  const now = new Date();
  const initMonth = value ? parseInt(value.split("/")[1])-1 : now.getMonth();
  const initDay = value ? parseInt(value.split("/")[0]) : null;
  const [month, setMonth] = useState(initMonth);
  const [year] = useState(now.getFullYear());
  const [day, setDay] = useState(initDay);
  const days = DAYS_IN_MONTH(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay===0?6:firstDay-1;
  const confirm = () => { if(day){onChange(`${String(day).padStart(2,"0")}/${String(month+1).padStart(2,"0")}`);onClose();} };
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <button onClick={()=>{setMonth(m=>(m+11)%12);setDay(null);}} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold">‹</button>
        <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
        <button onClick={()=>{setMonth(m=>(m+1)%12);setDay(null);}} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">{["Lu","Ma","Mi","Ju","Vi","Sá","Do"].map(d=><div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {Array.from({length:offset}).map((_,i)=><div key={"e"+i}/>)}
        {Array.from({length:days},(_,i)=>i+1).map(d=>(
          <button key={d} onClick={()=>setDay(d)} className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center ${day===d?"bg-violet-600 text-white":"hover:bg-gray-100 text-gray-700"}`}>{d}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2 text-sm">Cancelar</button>
        <button onClick={confirm} disabled={!day} className={`flex-1 ${day?"bg-violet-600 text-white":"bg-gray-100 text-gray-400"} rounded-xl py-2 text-sm font-semibold`}>
          {day?`Confirmar ${String(day).padStart(2,"0")}/${String(month+1).padStart(2,"0")}`:"Elegí un día"}
        </button>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode==="login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError("Email o contraseña incorrectos");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setSuccess("¡Cuenta creada! Revisá tu email para confirmar.");
      }
    } catch(e) { setError("Error inesperado"); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧠</div>
          <h1 className="text-2xl font-bold text-gray-800">DataMind</h1>
          <p className="text-gray-500 text-sm mt-1">Tu plataforma de estudio inteligente</p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {[["login","Iniciar sesión"],["register","Registrarse"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode===m?"bg-white shadow text-gray-800":"text-gray-500"}`}>{l}</button>
          ))}
        </div>

        <div className="space-y-3 mb-4">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
          <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-xl mb-3">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-xs px-4 py-2 rounded-xl mb-3">{success}</div>}

        <button onClick={handleSubmit} disabled={loading||!email||!password}
          className={`w-full py-3 rounded-xl font-semibold text-sm mb-3 ${!loading&&email&&password?"bg-violet-600 hover:bg-violet-700 text-white":"bg-gray-100 text-gray-400"}`}>
          {loading?"Cargando...":(mode==="login"?"Iniciar sesión":"Crear cuenta")}
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">o</span><div className="flex-1 h-px bg-gray-200"/>
        </div>

        <button onClick={handleGoogle} className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
          <span>🌐</span> Continuar con Google
        </button>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────
function HomeScreen({ onNav, careers, user, displayName }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><span className="text-2xl">🧠</span><span className="text-white text-xl font-bold">DataMind</span></div>
            <div className="text-white/60 text-xs">👤 {displayName}</div>
          </div>
          <p className="text-slate-400 text-sm">Hola {displayName?.split(" ")[0]}, ¿qué estudiamos hoy?</p>
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-sm">
            {[[String(careers.length),"Carreras"],[String(careers.reduce((a,c)=>a+(c.subjects?.length||0),0)),"Materias"],["0","Sesiones IA"]].map(([v,l])=>(
              <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-white text-xl font-bold">{v}</div>
                <div className="text-slate-400 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3 mt-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mis Carreras</h2>
          <button onClick={()=>onNav("newCareer")} className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg font-medium">+ Nueva carrera</button>
        </div>

        {careers.length===0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">🎓</div>
            <p className="text-gray-500 text-sm mb-4">Todavía no tenés carreras cargadas</p>
            <button onClick={()=>onNav("newCareer")} className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold text-sm">+ Agregar primera carrera</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {careers.map(c => {
              const col = getCol(c.color);
              return (
                <button key={c.id} onClick={()=>onNav("career",{careerId:c.id})} className="text-left bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`bg-gradient-to-r ${col.grad} px-5 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{c.icon}</span>
                      <div><div className="text-white font-bold text-base">{c.name}</div><div className="text-white/70 text-xs">{c.subjects?.length||0} materias</div></div>
                    </div>
                    <span className="text-white/80 text-xl">›</span>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-xs text-gray-500">{c.description||"Sin descripción"}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[["📅","Calendario","Ver eventos y feriados",()=>onNav("calendar")],["📊","Mi Progreso","Ver estadísticas",()=>{}],["👨‍🏫","Profesor IA","Iniciar sesión",()=>{}],["⚙️","Configuración","Preferencias",()=>{}]].map(([icon,label,sub,action])=>(
            <Card key={label} className="p-4" onClick={action}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-sm font-semibold text-gray-800">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── NEW CAREER ───────────────────────────────────────────────
function NewCareerScreen({ onBack, onSave }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎓");
  const [color, setColor] = useState("violet");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("careers").insert({ user_id:user.id, name:name.trim(), icon, color, description:description.trim() }).select().single();
    if (!error && data) onSave(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 pt-6 pb-8">
        <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Inicio</button>
        <h1 className="text-white text-xl font-bold">Nueva Carrera</h1>
      </div>
      <div className="px-6 mt-6 max-w-lg mx-auto space-y-4">
        <Card className="p-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Nombre</label>
          <input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="ej: Ciencia de Datos"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"/>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Descripción (opcional)</label>
          <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="ej: Estadística, ML, Python"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"/>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Ícono</label>
          <div className="grid grid-cols-8 gap-2">
            {CAREER_ICONS.map(ic=>(
              <button key={ic} onClick={()=>setIcon(ic)} className={`text-2xl p-2 rounded-xl ${icon===ic?"ring-2 ring-violet-400 bg-violet-50":"hover:bg-gray-100"}`}>{ic}</button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Color</label>
          <div className="flex gap-3 flex-wrap">
            {CAREER_COLORS.map(c=>(
              <button key={c.id} onClick={()=>setColor(c.id)} className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.grad} ${color===c.id?"ring-2 ring-offset-2 ring-gray-400":""}`}/>
            ))}
          </div>
        </Card>

        {/* Preview */}
        <div className={`bg-gradient-to-r ${getCol(color).grad} rounded-2xl px-5 py-4 flex items-center gap-3`}>
          <span className="text-3xl">{icon}</span>
          <div><div className="text-white font-bold">{name||"Nombre de la carrera"}</div><div className="text-white/70 text-xs">{description||"Descripción"}</div></div>
        </div>

        <button onClick={handleSave} disabled={!name.trim()||loading}
          className={`w-full py-4 rounded-2xl font-semibold text-base ${name.trim()&&!loading?"bg-violet-600 hover:bg-violet-700 text-white":"bg-gray-100 text-gray-400"}`}>
          {loading?"Guardando...":"Crear carrera"}
        </button>
      </div>
    </div>
  );
}

// ─── CAREER ───────────────────────────────────────────────────
function CareerScreen({ careerId, onNav, onBack, careers, onAddSubject, onDeleteSubject }) {
  const career = careers.find(c=>c.id===careerId);
  if (!career) return null;
  const col = getCol(career.color);
  const subjects = career.subjects||[];
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("📚");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    const { data:{user} } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("subjects").insert({ user_id:user.id, career_id:careerId, name:newName.trim(), icon:newIcon }).select().single();
    if (!error && data) { onAddSubject(careerId, {...data, weeks:[]}); setNewName(""); setNewIcon("📚"); setShowModal(false); }
    setLoading(false);
  };

  const handleDelete = async (subjectId, name) => {
    if (!confirm(`¿Borrar "${name}"?`)) return;
    await supabase.from("subjects").delete().eq("id",subjectId);
    onDeleteSubject(careerId, subjectId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className={`bg-gradient-to-br ${col.grad} px-6 pt-6 pb-10`}>
        <div className="max-w-5xl mx-auto">
          <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Inicio</button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{career.icon}</span>
              <div><h1 className="text-white text-xl font-bold">{career.name}</h1><p className="text-white/70 text-sm">{subjects.length} materias</p></div>
            </div>
            <button onClick={()=>setShowModal(true)} className="bg-white/20 border border-white/30 text-white text-sm px-4 py-2 rounded-xl font-medium">+ Materia</button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 max-w-5xl mx-auto">
        {subjects.length===0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-2">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-500 text-sm mb-4">Todavía no hay materias</p>
            <button onClick={()=>setShowModal(true)} className={`${col.btn} text-white px-6 py-3 rounded-xl font-semibold text-sm`}>+ Agregar materia</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
            {subjects.map(s=>{
              const completadas = s.weeks?.filter(w=>w.status==="completed").length||0;
              const total = s.weeks?.length||0;
              const pct = total>0?Math.round((completadas/total)*100):0;
              return (
                <div key={s.id} className="relative group">
                  <Card className="p-4" onClick={()=>onNav("subject",{careerId,subjectId:s.id})}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><span className="text-xl">{s.icon}</span><span className="font-semibold text-gray-800">{s.name}</span></div>
                      <span className="text-gray-400">›</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${col.dot}`} style={{width:`${pct}%`}}/></div>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{completadas}/{total} semanas</div>
                  </Card>
                  <button onClick={()=>handleDelete(s.id,s.name)} className="absolute top-3 right-10 text-xs text-red-400 px-2 py-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-opacity">🗑</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Nueva materia" onClose={()=>setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">Nombre</label>
              <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="ej: Estadística Aplicada"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"/>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block font-medium">Ícono</label>
              <div className="grid grid-cols-8 gap-1">
                {SUBJECT_ICONS.map(ic=>(
                  <button key={ic} onClick={()=>setNewIcon(ic)} className={`text-xl p-1.5 rounded-lg ${newIcon===ic?"bg-violet-100 ring-2 ring-violet-400":"hover:bg-gray-100"}`}>{ic}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm">Cancelar</button>
              <button onClick={handleAdd} disabled={!newName.trim()||loading} className={`flex-1 ${newName.trim()&&!loading?`${col.btn} text-white`:"bg-gray-100 text-gray-400"} rounded-xl py-3 text-sm font-semibold`}>{loading?"Guardando...":"Agregar"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SUBJECT ──────────────────────────────────────────────────
function SubjectScreen({ careerId, subjectId, onNav, onBack, careers, onAddWeek, onDeleteWeek, onUpdateWeekStatus, onAddEval }) {
  const career = careers.find(c=>c.id===careerId);
  const subject = career?.subjects?.find(s=>s.id===subjectId);
  if (!career||!subject) return null;
  const col = getCol(career.color);
  const weeks = subject.weeks||[];
  const [tab, setTab] = useState("semanas");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editEv, setEditEv] = useState(null);
  const [evalDates, setEvalDates] = useState({parcial1:"",parcial2:"",recuperatorio:"",final:""});
  const [tps, setTps] = useState([]);
  const [showAddTp, setShowAddTp] = useState(false);
  const [newTp, setNewTp] = useState({titulo:"",fecha:"",tema:""});
  const [editTpDate, setEditTpDate] = useState(false);

  const handleAddWeek = async () => {
    if (!newTitle.trim()) return;
    setLoading(true);
    const { data:{user} } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("weeks").insert({ user_id:user.id, subject_id:subjectId, number:weeks.length+1, title:newTitle.trim(), status:"pending" }).select().single();
    if (!error && data) { onAddWeek(careerId,subjectId,{...data,n:data.number,materiales:0}); setNewTitle(""); setShowModal(false); }
    setLoading(false);
  };

  const handleDeleteWeek = async (weekId, title) => {
    if (!confirm(`¿Borrar semana "${title}"?`)) return;
    await supabase.from("weeks").delete().eq("id",weekId);
    onDeleteWeek(careerId,subjectId,weekId);
  };

  const handleStatusChange = async (weekId, status) => {
    await supabase.from("weeks").update({status}).eq("id",weekId);
    onUpdateWeekStatus(careerId,subjectId,weekId,status);
  };

  const saveEvalDate = async (key, date) => {
    setEvalDates(d=>({...d,[key]:date}));
    const { data:{user} } = await supabase.auth.getUser();
    const typeMap = {parcial1:"Parcial 1",parcial2:"Parcial 2",recuperatorio:"Recuperatorio",final:"Final"};
    const [day,month] = date.split("/");
    const fullDate = `2025-${month}-${day}`;
    await supabase.from("evaluations").insert({ user_id:user.id, subject_id:subjectId, type:key, title:typeMap[key], date:fullDate });
    setEditEv(null);
  };

  const handleAddTp = async () => {
    if (!newTp.titulo.trim()) return;
    const { data:{user} } = await supabase.auth.getUser();
    const [day,month] = (newTp.fecha||"01/01").split("/");
    await supabase.from("evaluations").insert({ user_id:user.id, subject_id:subjectId, type:"tp", title:newTp.titulo, date:`2025-${month}-${day}`, topic:newTp.tema });
    setTps(t=>[...t,{...newTp,id:Date.now()}]);
    setNewTp({titulo:"",fecha:"",tema:""}); setShowAddTp(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className={`bg-gradient-to-br ${col.grad} px-6 pt-6 pb-4`}>
        <div className="max-w-5xl mx-auto">
          <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← {career.name}</button>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{subject.icon}</span>
              <div><h1 className="text-white text-xl font-bold">{subject.name}</h1><p className="text-white/70 text-sm">{weeks.length} semanas</p></div>
            </div>
            {tab==="semanas"&&<button onClick={()=>setShowModal(true)} className="bg-white/20 border border-white/30 text-white text-sm px-3 py-1.5 rounded-xl font-medium">+ Semana</button>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex bg-white border-b border-gray-100 px-6 sticky top-0 z-10">
          {[["semanas","📚 Semanas"],["evaluaciones","📝 Evaluaciones"],["modelos","🗂 Parciales"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} className={`py-3 px-2 text-xs font-semibold mr-4 transition-colors ${tab===id?`${col.text} border-b-2 ${col.border}`:"text-gray-400"}`}>{label}</button>
          ))}
        </div>

        <div className="px-6 mt-4">
          {tab==="semanas" && (
            <>
              {weeks.length===0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                  <div className="text-4xl mb-3">📅</div>
                  <p className="text-gray-500 text-sm mb-4">Todavía no hay semanas cargadas</p>
                  <button onClick={()=>setShowModal(true)} className={`${col.btn} text-white px-6 py-3 rounded-xl font-semibold text-sm`}>+ Agregar primera semana</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {weeks.map(w=>(
                    <div key={w.id} className="relative group">
                      <Card className="px-4 py-3 flex items-center gap-3" onClick={()=>onNav("week",{careerId,subjectId,weekId:w.id})}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${w.status==="completed"?"bg-green-100 text-green-600":w.status==="in_progress"?`${col.light} ${col.text}`:"bg-gray-100 text-gray-400"}`}>
                          {w.status==="completed"?"✓":w.n||w.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">{w.title}</div>
                          <div className="text-xs text-gray-400">{w.materiales>0?`${w.materiales} materiales`:"Sin material aún"}</div>
                        </div>
                        <StatusBadge status={w.status}/>
                      </Card>
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select value={w.status} onChange={e=>handleStatusChange(w.id,e.target.value)} onClick={e=>e.stopPropagation()}
                          className="text-xs border border-gray-200 rounded-lg px-1 py-0.5 bg-white text-gray-500 outline-none">
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En curso</option>
                          <option value="completed">Completada</option>
                        </select>
                        <button onClick={e=>{e.stopPropagation();handleDeleteWeek(w.id,w.title);}} className="text-xs text-red-400 px-1.5 hover:bg-red-50 rounded-lg">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab==="evaluaciones" && (
            <div className="space-y-3 max-w-lg">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Parciales</h3>
              {[["parcial1","Parcial 1","📝"],["parcial2","Parcial 2","📝"],["recuperatorio","Recuperatorio","🔄"],["final","Final","🏁"]].map(([key,label,icon])=>(
                <Card key={key} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{label}</div>
                        {evalDates[key]?<div className="text-xs text-gray-500">📅 {evalDates[key]}</div>:<div className="text-xs text-gray-400">Sin fecha</div>}
                      </div>
                    </div>
                    <button onClick={()=>setEditEv(editEv===key?null:key)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${col.badge}`}>
                      {editEv===key?"Cerrar":evalDates[key]?"Editar":"Agregar fecha"}
                    </button>
                  </div>
                  {editEv===key && <DatePicker value={evalDates[key]} onChange={v=>saveEvalDate(key,v)} onClose={()=>setEditEv(null)}/>}
                </Card>
              ))}
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">TPs y Orales</h3>
              {tps.map((tp,i)=>(
                <Card key={tp.id} className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📁</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{tp.titulo}</div>
                        <div className="text-xs text-gray-500">📅 {tp.fecha}</div>
                        <div className="text-xs text-gray-400">Tema: {tp.tema}</div>
                      </div>
                    </div>
                    <button onClick={()=>setTps(t=>t.filter((_,j)=>j!==i))} className="text-xs text-red-400 px-2 py-1">✕</button>
                  </div>
                </Card>
              ))}
              {showAddTp?(
                <Card className="px-4 py-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Nuevo TP / Oral</h4>
                  <div className="space-y-2">
                    {[["Título","titulo"],["Tema específico","tema"]].map(([ph,field])=>(
                      <input key={field} type="text" placeholder={ph} value={newTp[field]} onChange={e=>setNewTp(n=>({...n,[field]:e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"/>
                    ))}
                    <button onClick={()=>setEditTpDate(!editTpDate)} className={`w-full border rounded-lg px-3 py-2 text-sm text-left ${newTp.fecha?"border-gray-200 text-gray-700":"border-dashed border-gray-300 text-gray-400"}`}>
                      {newTp.fecha?`📅 ${newTp.fecha}`:"📅 Seleccionar fecha"}
                    </button>
                    {editTpDate&&<DatePicker value={newTp.fecha} onChange={v=>{setNewTp(n=>({...n,fecha:v}));setEditTpDate(false);}} onClose={()=>setEditTpDate(false)}/>}
                    <div className="flex gap-2 pt-1">
                      <button onClick={()=>setShowAddTp(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-sm">Cancelar</button>
                      <button onClick={handleAddTp} className={`flex-1 ${col.btn} text-white rounded-lg py-2 text-sm font-medium`}>Agregar</button>
                    </div>
                  </div>
                </Card>
              ):(
                <button onClick={()=>setShowAddTp(true)} className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500">+ Agregar TP u Oral</button>
              )}
            </div>
          )}

          {tab==="modelos" && (
            <div className="space-y-3 max-w-lg">
              <div className={`${col.light} ${col.border} border rounded-2xl p-3 text-xs text-gray-600 flex gap-2`}>
                <span>💡</span><span>Subí parciales de años anteriores. 3-4 días antes del examen la IA te hará un simulacro.</span>
              </div>
              <button onClick={()=>onNav("simulacro",{careerId,subjectId})} className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold text-sm flex items-center justify-center gap-2`}>🎯 Iniciar Simulacro</button>
              <button className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-3 text-sm text-gray-400 hover:border-violet-300 hover:text-violet-500">+ Subir parcial modelo (PDF)</button>
            </div>
          )}
        </div>
      </div>

      {showModal&&(
        <Modal title="Nueva semana" onClose={()=>setShowModal(false)}>
          <div className="space-y-3">
            <input autoFocus value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddWeek()}
              placeholder={`ej: Semana ${weeks.length+1} - Introducción`}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400"/>
            <div className="flex gap-2">
              <button onClick={()=>setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-3 text-sm">Cancelar</button>
              <button onClick={handleAddWeek} disabled={!newTitle.trim()||loading} className={`flex-1 ${newTitle.trim()&&!loading?`${col.btn} text-white`:"bg-gray-100 text-gray-400"} rounded-xl py-3 text-sm font-semibold`}>{loading?"Guardando...":"Agregar"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── WEEK ─────────────────────────────────────────────────────
function WeekScreen({ careerId, subjectId, weekId, onNav, onBack, careers }) {
  const career = careers.find(c=>c.id===careerId);
  const subject = career?.subjects?.find(s=>s.id===subjectId);
  const week = subject?.weeks?.find(w=>w.id===weekId);
  if (!career||!subject||!week) return null;
  const col = getCol(career.color);
  const [showUrl, setShowUrl] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    supabase.from("materials").select("*").eq("week_id",weekId).then(({data})=>{ if(data) setMaterials(data); });
  },[weekId]);

  const addMaterial = async (type) => {
    if ((type==="youtube"||type==="article")&&!urlInput.trim()) return;
    setLoading(true);
    const { data:{user} } = await supabase.auth.getUser();
    const title = type==="youtube"?"Video YouTube":type==="article"?urlInput:type==="guide"?"Guía de lectura":"PDF";
    const { data, error } = await supabase.from("materials").insert({ user_id:user.id, week_id:weekId, type, title, url:urlInput||null }).select().single();
    if (!error&&data) setMaterials(m=>[...m,data]);
    setShowUrl(null); setUrlInput(""); setLoading(false);
  };

  const deleteMaterial = async (id) => {
    await supabase.from("materials").delete().eq("id",id);
    setMaterials(m=>m.filter(x=>x.id!==id));
  };

  const addTypes = [
    {id:"guide",icon:"📋",label:"Guía de lectura",sub:"PDF de la guía semanal"},
    {id:"youtube",icon:"▶️",label:"Video YouTube",sub:"Pegá la URL del video"},
    {id:"article",icon:"🔗",label:"Artículo / Link",sub:"Link de lectura"},
    {id:"pdf",icon:"📄",label:"PDF / Apunte",sub:"Material en PDF"},
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className={`bg-gradient-to-br ${col.grad} px-6 pt-6 pb-8`}>
        <div className="max-w-5xl mx-auto">
          <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← {subject.name}</button>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide">Semana {week.n||week.number}</div>
              <h1 className="text-white text-xl font-bold mt-0.5">{week.title}</h1>
            </div>
            <StatusBadge status={week.status}/>
          </div>
        </div>
      </div>

      <div className="px-6 mt-4 max-w-5xl mx-auto">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Agregar material</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {addTypes.map(t=>(
            <div key={t.id}>
              <button onClick={()=>setShowUrl(showUrl===t.id?null:t.id)} className={`w-full border-2 rounded-xl p-3 text-left transition-colors ${showUrl===t.id?`border-violet-400 bg-violet-50`:"border-dashed border-gray-200 hover:border-violet-300 bg-white"}`}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-xs font-semibold text-gray-700">{t.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.sub}</div>
              </button>
              {showUrl===t.id&&(
                <div className="mt-1 flex gap-1">
                  {(t.id==="youtube"||t.id==="article")?(
                    <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder={t.id==="youtube"?"https://youtube.com/...":"https://..."} className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400"/>
                  ):(
                    <div className="flex-1 border border-dashed border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-400 text-center">Elegir archivo</div>
                  )}
                  <button onClick={()=>addMaterial(t.id)} disabled={loading} className={`${col.btn} text-white px-3 rounded-lg text-xs font-medium`}>+</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {materials.length>0&&(
          <>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Material cargado</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4">
              {materials.map(m=>(
                <Card key={m.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">{m.type==="pdf"?"📄":m.type==="guide"?"📋":m.type==="youtube"?"▶️":"🔗"}</span>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-800 truncate">{m.title}</div><div className="text-xs text-gray-400 truncate">{m.url||"Archivo"}</div></div>
                  <button onClick={()=>deleteMaterial(m.id)} className="text-xs text-red-400 px-2">✕</button>
                </Card>
              ))}
            </div>
            <button onClick={()=>onNav("professor",{careerId,subjectId,weekId})} className={`w-full lg:w-auto ${col.btn} text-white rounded-2xl py-4 px-8 font-semibold flex items-center justify-center gap-2`}>👨‍🏫 Ir al Profesor IA</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CALENDAR ─────────────────────────────────────────────────
function CalendarScreen({ onBack, careers }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const days = DAYS_IN_MONTH(year,month);
  const firstDay = new Date(year,month,1).getDay();
  const offset = firstDay===0?6:firstDay-1;

  const feriadosDelMes = FERIADOS_AR.filter(f=>{
    const d = new Date(f.date+"T12:00:00");
    return d.getMonth()===month && d.getFullYear()===year;
  });

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const feriado = FERIADOS_AR.find(f=>f.date===dateStr);
    return { feriado: feriado||null };
  };

  const isToday = (day) => {
    const t = new Date();
    return t.getDate()===day && t.getMonth()===month && t.getFullYear()===year;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 px-6 pt-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={onBack} className="text-white/70 text-sm mb-4 flex items-center gap-1">← Inicio</button>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-xl font-bold">📅 Calendario</h1>
            <div className="flex items-center gap-2">
              <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);}} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">‹</button>
              <span className="text-white font-semibold text-sm min-w-32 text-center">{MONTHS[month]} {year}</span>
              <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);}} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">›</button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-4 max-w-5xl mx-auto">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <Card className="p-4 mb-4">
              <div className="grid grid-cols-7 mb-2">
                {["Lu","Ma","Mi","Ju","Vi","Sá","Do"].map(d=><div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({length:offset}).map((_,i)=><div key={"e"+i}/>)}
                {Array.from({length:days},(_,i)=>i+1).map(d=>{
                  const {feriado} = getEventsForDay(d);
                  const today = isToday(d);
                  return (
                    <div key={d} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-colors
                      ${today?"bg-violet-600 text-white":feriado?"bg-red-50 text-red-600":"hover:bg-gray-50 text-gray-700"}`}>
                      <span className={`text-xs font-medium ${today?"text-white":""}`}>{d}</span>
                      {feriado&&!today&&<div className="w-1 h-1 bg-red-400 rounded-full mt-0.5"/>}
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3 text-xs text-gray-500 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-violet-600 rounded-full"/><span>Hoy</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"/><span>Feriado</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-full"/><span>Examen</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-400 rounded-full"/><span>TP/Oral</span></div>
            </div>
          </div>

          <div className="space-y-3">
            {feriadosDelMes.length>0&&(
              <Card className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🇦🇷 Feriados</h3>
                <div className="space-y-2">
                  {feriadosDelMes.map(f=>{
                    const d = new Date(f.date+"T12:00:00");
                    return (
                      <div key={f.date} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-xs font-bold text-red-600">{d.getDate()}</div>
                        <div className="text-sm text-gray-700">{f.name}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card className="p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">📝 Próximos eventos</h3>
              <div className="text-center py-6">
                <div className="text-2xl mb-2">🗓</div>
                <p className="text-xs text-gray-400">Cargá fechas de exámenes en cada materia para verlos acá</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFESSOR ────────────────────────────────────────────────
function ProfessorScreen({ careerId, subjectId, weekId, onBack, careers }) {
  const career = careers.find(c=>c.id===careerId);
  const subject = career?.subjects?.find(s=>s.id===subjectId);
  const week = subject?.weeks?.find(w=>w.id===weekId);
  if (!career||!subject||!week) return null;
  const col = getCol(career.color);
  const [mode, setMode] = useState("material");
  const [style, setStyle] = useState("clase");
  const [msgs, setMsgs] = useState([{role:"assistant",content:`¡Hola! Soy tu Profesor IA para ${subject.name}, Semana ${week.n||week.number}: ${week.title}. ¿Por dónde querés arrancar?`}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const txt = input; setMsgs(m=>[...m,{role:"user",content:txt}]); setInput(""); setLoading(true);
    setTimeout(()=>{setMsgs(m=>[...m,{role:"assistant",content:"Basándome en tu material de la semana, te explico... (En la versión completa aquí responde Claude con tus PDFs y videos 🤖)",sources:["Tu PDF · pág. 3"]}]);setLoading(false);},1200);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className={`bg-gradient-to-r ${col.grad} px-6 pt-5 pb-3 flex-shrink-0`}>
        <div className="max-w-3xl mx-auto">
          <button onClick={onBack} className="text-white/70 text-sm mb-3 flex items-center gap-1">← {week.title}</button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">👨‍🏫</div>
            <div><div className="text-white font-bold text-sm">Profesor IA</div><div className="text-white/60 text-xs">{subject.name} · Semana {week.n||week.number}</div></div>
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            {[["material","📚 Mi material"],["extended","🌐 Conocimiento extendido"]].map(([id,label])=>(
              <button key={id} onClick={()=>setMode(id)} className={`text-xs px-3 py-1.5 rounded-full font-medium ${mode===id?"bg-white text-gray-800":"bg-white/20 text-white"}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[["clase","🎓 Clase"],["concepto","🔍 Concepto"],["socratico","🧩 Socrático"],["examen","📝 Para examen"]].map(([id,label])=>(
              <button key={id} onClick={()=>setStyle(id)} className={`text-xs px-2.5 py-1 rounded-full ${style===id?"bg-white/30 text-white font-semibold":"text-white/60"}`}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {msgs.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
              {msg.role==="assistant"&&<div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">👨‍🏫</div>}
              <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==="user"?`${col.btn} text-white rounded-br-sm`:"bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>
                {msg.content}
                {msg.sources&&<div className="mt-2 pt-2 border-t border-gray-100">{msg.sources.map((s,j)=><div key={j} className="text-xs text-gray-400 flex items-center gap-1">📌 {s}</div>)}</div>}
              </div>
            </div>
          ))}
          {loading&&<div className="flex"><div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2">👨‍🏫</div><div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3 flex gap-1">{[0,1,2].map(i=><div key={i} className={`w-2 h-2 ${col.dot} rounded-full animate-bounce`} style={{animationDelay:`${i*0.15}s`}}/>)}</div></div>}
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Preguntale al Profesor IA..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"/>
          <button onClick={send} className={`${col.btn} text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState("home");
  const [params, setParams] = useState({});
  const [careers, setCareers] = useState([]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setUser(session?.user||null); setAuthLoading(false); });
    supabase.auth.onAuthStateChange((_,session)=>{ setUser(session?.user||null); });
  },[]);

  useEffect(()=>{
    if (!user) return;
    const loadProfile = async () => {
      let { data } = await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
      if (!data) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0];
        const { data:created } = await supabase.from("profiles").upsert({ id:user.id, email:user.email, full_name:fullName }).select().single();
        data = created;
      }
      setProfile(data);
    };
    loadProfile();
  },[user]);

  useEffect(()=>{
    if (!user) return;
    const loadData = async () => {
      const { data:careersData } = await supabase.from("careers").select("*").eq("user_id",user.id).order("created_at");
      if (!careersData) return;
      const enriched = await Promise.all(careersData.map(async c=>{
        const { data:subjects } = await supabase.from("subjects").select("*").eq("career_id",c.id).order("created_at");
        const enrichedSubjects = await Promise.all((subjects||[]).map(async s=>{
          const { data:weeks } = await supabase.from("weeks").select("*").eq("subject_id",s.id).order("number");
          return {...s, weeks:(weeks||[]).map(w=>({...w,n:w.number,materiales:0}))};
        }));
        return {...c, subjects:enrichedSubjects};
      }));
      setCareers(enriched);
    };
    loadData();
  },[user]);

  const onNav = (to,p={}) => { setScreen(to); setParams(p); window.scrollTo(0,0); };
  const back = () => {
    const map = { career:["home",{}], newCareer:["home",{}], subject:["career",{careerId:params.careerId}], week:["subject",params], professor:["week",params], simulacro:["subject",params], calendar:["home",{}] };
    const [s,p] = map[screen]||["home",{}]; onNav(s,p);
  };

  const onAddCareer = (career) => { setCareers(c=>[...c,{...career,subjects:[]}]); onNav("home"); };
  const onAddSubject = (careerId,subject) => setCareers(prev=>prev.map(c=>c.id===careerId?{...c,subjects:[...(c.subjects||[]),subject]}:c));
  const onDeleteSubject = (careerId,subjectId) => setCareers(prev=>prev.map(c=>c.id===careerId?{...c,subjects:c.subjects.filter(s=>s.id!==subjectId)}:c));
  const onAddWeek = (careerId,subjectId,week) => setCareers(prev=>prev.map(c=>c.id===careerId?{...c,subjects:c.subjects.map(s=>s.id===subjectId?{...s,weeks:[...(s.weeks||[]),week]}:s)}:c));
  const onDeleteWeek = (careerId,subjectId,weekId) => setCareers(prev=>prev.map(c=>c.id===careerId?{...c,subjects:c.subjects.map(s=>s.id===subjectId?{...s,weeks:s.weeks.filter(w=>w.id!==weekId)}:s)}:c));
  const onUpdateWeekStatus = (careerId,subjectId,weekId,status) => setCareers(prev=>prev.map(c=>c.id===careerId?{...c,subjects:c.subjects.map(s=>s.id===subjectId?{...s,weeks:s.weeks.map(w=>w.id===weekId?{...w,status}:w)}:s)}:c));

  const handleSignOut = async () => { await supabase.auth.signOut(); setUser(null); setCareers([]); setScreen("home"); };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><div className="text-white text-center"><div className="text-4xl mb-3">🧠</div><p className="text-slate-400">Cargando DataMind...</p></div></div>;
  if (!user) return <AuthScreen/>;

  const commonProps = { careers, onNav, onBack:back };
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0];

  const screens = {
    home: <HomeScreen {...commonProps} user={user} displayName={displayName}/>,
    newCareer: <NewCareerScreen onBack={back} onSave={onAddCareer}/>,
    career: <CareerScreen {...commonProps} {...params} onAddSubject={onAddSubject} onDeleteSubject={onDeleteSubject}/>,
    subject: <SubjectScreen {...commonProps} {...params} onAddWeek={onAddWeek} onDeleteWeek={onDeleteWeek} onUpdateWeekStatus={onUpdateWeekStatus}/>,
    week: <WeekScreen {...commonProps} {...params}/>,
    professor: <ProfessorScreen {...commonProps} {...params}/>,
    simulacro: <div className="p-8 text-center text-gray-500">Simulacro próximamente</div>,
    calendar: <CalendarScreen {...commonProps}/>,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar desktop */}
      <nav className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>onNav("home")}><span className="text-xl">🧠</span><span className="font-bold text-gray-800">DataMind</span></div>
        <div className="flex items-center gap-4">
          {[["🏠","Inicio","home"],["📅","Calendario","calendar"],["📊","Progreso","home"]].map(([icon,label,s])=>(
            <button key={label} onClick={()=>onNav(s)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${screen===s?"bg-violet-50 text-violet-600":"text-gray-500 hover:bg-gray-50"}`}>{icon} {label}</button>
          ))}
          <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2">Cerrar sesión</button>
        </div>
      </nav>

      {screens[screen]||<HomeScreen {...commonProps} user={user}/>}

      {/* Bottom nav mobile */}
      {!["professor","simulacro"].includes(screen)&&(
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-20">
          {[["🏠","Inicio","home"],["📅","Calendario","calendar"],["📊","Progreso","home"],["👤","Salir",null]].map(([icon,label,s])=>(
            <button key={label} onClick={()=>s?onNav(s):handleSignOut()} className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${screen===s?"text-violet-600":"text-gray-400"}`}>
              <span className="text-lg">{icon}</span><span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
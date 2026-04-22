import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ─── FERIADOS ARGENTINA ───────────────────────────────────────
const FERIADOS_AR = [
  // 2025
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
  // 2026
  { date: "2026-01-01", name: "Año Nuevo" },
  { date: "2026-02-16", name: "Carnaval" },
  { date: "2026-02-17", name: "Carnaval" },
  { date: "2026-03-24", name: "Día de la Memoria" },
  { date: "2026-04-02", name: "Malvinas" },
  { date: "2026-04-03", name: "Viernes Santo" },
  { date: "2026-05-01", name: "Día del Trabajador" },
  { date: "2026-05-25", name: "Revolución de Mayo" },
  { date: "2026-06-15", name: "Día de la Bandera" },
  { date: "2026-07-09", name: "Independencia" },
  { date: "2026-08-17", name: "San Martín" },
  { date: "2026-10-12", name: "Diversidad Cultural" },
  { date: "2026-11-23", name: "Soberanía Nacional" },
  { date: "2026-12-08", name: "Inmaculada Concepción" },
  { date: "2026-12-25", name: "Navidad" },
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

// ─── AUTH ─────────────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode==="login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError("Email o contraseña incorrectos");
      } else {
        if (!fullName.trim()) { setError("Ingresá tu nombre"); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ full_name: fullName.trim() } } });
        if (error) setError(error.message);
        else if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, email, full_name: fullName.trim() });
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
            <button key={m} onClick={()=>{setMode(m);setError("");}} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${mode===m?"bg-white shadow text-gray-800":"text-gray-500"}`}>{l}</button>
          ))}
        </div>
        <div className="space-y-3 mb-4">
          {mode==="register" && (
            <input type="text" placeholder="Nombre completo" value={fullName} onChange={e=>setFullName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
          )}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
          <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400" />
        </div>
        {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-xl mb-3">{error}</div>}
        <button onClick={handleSubmit} disabled={loading||!email||!password||(mode==="register"&&!fullName)}
          className={`w-full py-3 rounded-xl font-semibold text-sm mb-3 ${!loading&&email&&password&&(mode==="login"||fullName)?"bg-violet-600 hover:bg-violet-700 text-white":"bg-gray-100 text-gray-400"}`}>
          {loading?"Cargando...":(mode==="login"?"Iniciar sesión":"Crear cuenta")}
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-200"/><span className="text-xs text-gray-400">o</span><div className="flex-1 h-px bg-gray-200"/>
        </div>
        <button onClick={handleGoogle} className="w-full border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continuar con Google
        </button>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────
function HomeScreen({ onNav, careers, displayName }) {
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
            {careers.map(c=>{
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
                  <div className="px-5 py-3"><p className="text-xs text-gray-500">{c.description||"Sin descripción"}</p></div>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[["📅","Calendario","Ver eventos",()=>onNav("calendar")],["📊","Mi Progreso","Ver estadísticas",()=>{}],["👨‍🏫","Profesor IA","Iniciar sesión",()=>{}],["⚙️","Configuración","Preferencias",()=>{}]].map(([icon,label,sub,action])=>(
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
    const { data:{user} } = await supabase.auth.getUser();
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

// ─── TP CARD (editable) ───────────────────────────────────────
function TpCard({ tp, col, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editFecha, setEditFecha] = useState(false);
  const [form, setForm] = useState({ titulo:tp.titulo, fecha:tp.fecha, tema:tp.tema });

  const save = () => {
    if (!form.titulo.trim()) return;
    onUpdate(form);
    setEditing(false);
  };

  if (editing) {
    return (
      <Card className="px-4 py-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Editar TP / Oral</h4>
        <div className="space-y-2">
          <input type="text" placeholder="Título" value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"/>
          <input type="text" placeholder="Tema específico" value={form.tema} onChange={e=>setForm(f=>({...f,tema:e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"/>
          <button onClick={()=>setEditFecha(!editFecha)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-left text-gray-700">
            📅 {form.fecha||"Seleccionar fecha"}
          </button>
          {editFecha && <DatePicker value={form.fecha} onChange={v=>{setForm(f=>({...f,fecha:v}));setEditFecha(false);}} onClose={()=>setEditFecha(false)}/>}
          <div className="flex gap-2 pt-1">
            <button onClick={()=>{setEditing(false);setForm({titulo:tp.titulo,fecha:tp.fecha,tema:tp.tema});}} className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-sm">Cancelar</button>
            <button onClick={save} className={`flex-1 ${col.btn} text-white rounded-lg py-2 text-sm font-medium`}>Guardar</button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-4 py-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-lg">📁</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">{tp.titulo}</div>
            <div className="text-xs text-gray-500">📅 {tp.fecha}</div>
            {tp.tema && <div className="text-xs text-gray-400 truncate">Tema: {tp.tema}</div>}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={()=>setEditing(true)} className={`text-xs ${col.badge} px-2 py-1 rounded-lg font-medium`}>Editar</button>
          <button onClick={onDelete} className="text-xs text-red-400 px-2 py-1 hover:bg-red-50 rounded-lg">✕</button>
        </div>
      </div>
    </Card>
  );
}

// ─── SUBJECT ──────────────────────────────────────────────────
function SubjectScreen({ careerId, subjectId, onNav, onBack, careers, onAddWeek, onDeleteWeek, onUpdateWeekStatus }) {
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
  const [evalIds, setEvalIds] = useState({});
  const [tps, setTps] = useState([]);
  const [showAddTp, setShowAddTp] = useState(false);
  const [newTp, setNewTp] = useState({titulo:"",fecha:"",tema:""});
  const [editTpDate, setEditTpDate] = useState(false);

  useEffect(()=>{
    const load = async () => {
      const { data } = await supabase.from("evaluations").select("*").eq("subject_id",subjectId);
      if (!data) return;
      const dates = {parcial1:"",parcial2:"",recuperatorio:"",final:""};
      const ids = {};
      const tpList = [];
      data.forEach(ev => {
        if (ev.date) {
          const [y,m,d] = ev.date.split("-");
          const formatted = `${d}/${m}`;
          if (["parcial1","parcial2","recuperatorio","final"].includes(ev.type)) {
            dates[ev.type] = formatted;
            ids[ev.type] = ev.id;
          } else if (ev.type === "tp") {
            tpList.push({ id: ev.id, titulo: ev.title, fecha: formatted, tema: ev.topic||"" });
          }
        }
      });
      setEvalDates(dates); setEvalIds(ids); setTps(tpList);
    };
    load();
  },[subjectId]);

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
    const { data:{user} } = await supabase.auth.getUser();
    const typeMap = {parcial1:"Parcial 1",parcial2:"Parcial 2",recuperatorio:"Recuperatorio",final:"Final"};
    const [day,month] = date.split("/");
    const year = new Date().getFullYear();
    const fullDate = `${year}-${month}-${day}`;
    if (evalIds[key]) {
      await supabase.from("evaluations").update({ date:fullDate }).eq("id",evalIds[key]);
    } else {
      const { data } = await supabase.from("evaluations").insert({ user_id:user.id, subject_id:subjectId, type:key, title:typeMap[key], date:fullDate }).select().single();
      if (data) setEvalIds(ids=>({...ids,[key]:data.id}));
    }
    setEvalDates(d=>({...d,[key]:date}));
    setEditEv(null);
  };

  const handleAddTp = async () => {
    if (!newTp.titulo.trim()) return;
    const { data:{user} } = await supabase.auth.getUser();
    const [day,month] = (newTp.fecha||"01/01").split("/");
    const year = new Date().getFullYear();
    const { data } = await supabase.from("evaluations").insert({ user_id:user.id, subject_id:subjectId, type:"tp", title:newTp.titulo, date:`${year}-${month}-${day}`, topic:newTp.tema }).select().single();
    if (data) setTps(t=>[...t,{id:data.id,titulo:newTp.titulo,fecha:newTp.fecha,tema:newTp.tema}]);
    setNewTp({titulo:"",fecha:"",tema:""}); setShowAddTp(false);
  };

  const handleDeleteTp = async (id) => {
    await supabase.from("evaluations").delete().eq("id",id);
    setTps(t=>t.filter(x=>x.id!==id));
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
              {tps.map(tp=>(
                <TpCard key={tp.id} tp={tp} col={col} onDelete={()=>handleDeleteTp(tp.id)}
                  onUpdate={async (updated)=>{
                    const [day,month] = updated.fecha.split("/");
                    const year = new Date().getFullYear();
                    await supabase.from("evaluations").update({ title:updated.titulo, topic:updated.tema, date:`${year}-${month}-${day}` }).eq("id",tp.id);
                    setTps(ts=>ts.map(x=>x.id===tp.id?{...x,...updated}:x));
                  }}/>
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
              <button className={`w-full ${col.btn} text-white rounded-2xl py-4 font-semibold text-sm flex items-center justify-center gap-2`}>🎯 Iniciar Simulacro</button>
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
    {id:"article",icon:"🔗",label:"Artículo / Link",sub:"Link de lectura"},
    {id:"youtube",icon:"▶️",label:"Video YouTube",sub:"Pegá la URL"},
    {id:"guide",icon:"📋",label:"Guía de lectura",sub:"PDF de la guía"},
    {id:"pdf",icon:"📄",label:"Apuntes / PDF",sub:"Material en PDF"},
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
  const [evaluations, setEvaluations] = useState([]);
  const days = DAYS_IN_MONTH(year,month);
  const firstDay = new Date(year,month,1).getDay();
  const offset = firstDay===0?6:firstDay-1;

  useEffect(()=>{
    const loadEvals = async () => {
      const { data:{user} } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("evaluations").select("*, subjects(name, career_id, icon)").eq("user_id",user.id);
      if (data) {
        const enriched = data.map(ev=>{
          const subject = ev.subjects;
          const career = careers.find(c=>c.id===subject?.career_id);
          return { ...ev, subject_name:subject?.name, subject_icon:subject?.icon, career_color:career?.color||"violet", career_name:career?.name };
        });
        setEvaluations(enriched);
      }
    };
    loadEvals();
  },[careers]);

  const feriadosDelMes = FERIADOS_AR.filter(f=>{
    const [y,m] = f.date.split("-").map(Number);
    return (m-1)===month && y===year;
  });

  const evalsDelMes = evaluations.filter(ev=>{
    if (!ev.date) return false;
    const [y,m] = ev.date.split("-").map(Number);
    return (m-1)===month && y===year;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const getEventsForDay = (day) => {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const feriado = FERIADOS_AR.find(f=>f.date===dateStr);
    const examDay = evaluations.filter(ev=>ev.date===dateStr);
    const hasParcialOrFinal = examDay.some(ev=>["parcial1","parcial2","recuperatorio","final"].includes(ev.type));
    const hasTp = examDay.some(ev=>ev.type==="tp");
    return { feriado:feriado||null, hasParcialOrFinal, hasTp };
  };

  const isToday = (day) => {
    const t = new Date();
    return t.getDate()===day && t.getMonth()===month && t.getFullYear()===year;
  };

  const typeEmoji = (type) => ({parcial1:"📝",parcial2:"📝",recuperatorio:"🔄",final:"🏁",tp:"📁"}[type]||"📌");
  const typeLabel = (type) => ({parcial1:"Parcial 1",parcial2:"Parcial 2",recuperatorio:"Recuperatorio",final:"Final",tp:"TP / Oral"}[type]||type);

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
                  const {feriado, hasParcialOrFinal, hasTp} = getEventsForDay(d);
                  const today = isToday(d);
                  return (
                    <div key={d} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-colors
                      ${today?"bg-violet-600 text-white":feriado?"bg-red-50 text-red-600":hasParcialOrFinal?"bg-amber-50 text-amber-700":hasTp?"bg-blue-50 text-blue-700":"hover:bg-gray-50 text-gray-700"}`}>
                      <span className="text-xs font-medium">{d}</span>
                      <div className="flex gap-0.5 mt-0.5">
                        {feriado&&!today&&<div className="w-1 h-1 bg-red-400 rounded-full"/>}
                        {hasParcialOrFinal&&!today&&<div className="w-1 h-1 bg-amber-500 rounded-full"/>}
                        {hasTp&&!today&&<div className="w-1 h-1 bg-blue-500 rounded-full"/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex gap-3 text-xs text-gray-500 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-violet-600 rounded-full"/><span>Hoy</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"/><span>Feriado</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-100 border border-amber-400 rounded-full"/><span>Examen</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded-full"/><span>TP/Oral</span></div>
            </div>
          </div>

          <div className="space-y-3">
            {evalsDelMes.length>0 && (
              <Card className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">📝 Tus eventos del mes</h3>
                <div className="space-y-2">
                  {evalsDelMes.map(ev=>{
                    const [y,m,d] = ev.date.split("-");
                    const col = getCol(ev.career_color);
                    return (
                      <div key={ev.id} className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${col.light} rounded-lg flex items-center justify-center text-xs font-bold ${col.text}`}>{parseInt(d)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-700 truncate">{typeEmoji(ev.type)} {typeLabel(ev.type)} — {ev.subject_name}</div>
                          {ev.topic && <div className="text-xs text-gray-400 truncate">{ev.topic}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {feriadosDelMes.length>0&&(
              <Card className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">🇦🇷 Feriados</h3>
                <div className="space-y-2">
                  {feriadosDelMes.map(f=>{
                    const [y,m,d] = f.date.split("-");
                    return (
                      <div key={f.date} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-xs font-bold text-red-600">{parseInt(d)}</div>
                        <div className="text-sm text-gray-700">{f.name}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {evalsDelMes.length===0 && feriadosDelMes.length===0 && (
              <Card className="p-4">
                <div className="text-center py-6">
                  <div className="text-2xl mb-2">🗓</div>
                  <p className="text-xs text-gray-400">No hay eventos este mes</p>
                </div>
              </Card>
            )}
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
    setTimeout(()=>{setMsgs(m=>[...m,{role:"assistant",content:"(En la versión completa aquí responde Claude con tus PDFs y videos 🤖)"}]);setLoading(false);},1200);
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
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {msgs.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
              {msg.role==="assistant"&&<div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">👨‍🏫</div>}
              <div className={`max-w-lg rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==="user"?`${col.btn} text-white rounded-br-sm`:"bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>{msg.content}</div>
            </div>
          ))}
          {loading&&<div className="flex"><div className="w-7 h-7 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2">👨‍🏫</div><div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-3 flex gap-1">{[0,1,2].map(i=><div key={i} className={`w-2 h-2 ${col.dot} rounded-full animate-bounce`} style={{animationDelay:`${i*0.15}s`}}/>)}</div></div>}
        </div>
      </div>
      <div className="px-6 py-3 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Preguntale al Profesor IA..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"/>
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
    const map = { career:["home",{}], newCareer:["home",{}], subject:["career",{careerId:params.careerId}], week:["subject",params], professor:["week",params], calendar:["home",{}] };
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

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0];
  const commonProps = { careers, onNav, onBack:back };

  const screens = {
    home: <HomeScreen {...commonProps} displayName={displayName}/>,
    newCareer: <NewCareerScreen onBack={back} onSave={onAddCareer}/>,
    career: <CareerScreen {...commonProps} {...params} onAddSubject={onAddSubject} onDeleteSubject={onDeleteSubject}/>,
    subject: <SubjectScreen {...commonProps} {...params} onAddWeek={onAddWeek} onDeleteWeek={onDeleteWeek} onUpdateWeekStatus={onUpdateWeekStatus}/>,
    week: <WeekScreen {...commonProps} {...params}/>,
    professor: <ProfessorScreen {...commonProps} {...params}/>,
    calendar: <CalendarScreen {...commonProps}/>,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="hidden lg:flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>onNav("home")}><span className="text-xl">🧠</span><span className="font-bold text-gray-800">DataMind</span></div>
        <div className="flex items-center gap-4">
          {[["🏠","Inicio","home"],["📅","Calendario","calendar"],["📊","Progreso","home"]].map(([icon,label,s])=>(
            <button key={label} onClick={()=>onNav(s)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${screen===s?"bg-violet-50 text-violet-600":"text-gray-500 hover:bg-gray-50"}`}>{icon} {label}</button>
          ))}
          <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2">Cerrar sesión</button>
        </div>
      </nav>

      {screens[screen]||<HomeScreen {...commonProps} displayName={displayName}/>}

      {!["professor"].includes(screen)&&(
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
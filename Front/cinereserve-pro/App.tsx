import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, 
  Calendar, 
  LogOut, 
  Search, 
  Star, 
  Clock, 
  Plus, 
  Ticket,
  Menu,
  X,
  Sparkles,
  MapPin,
  Filter,
  Users,
  ChevronRight,
  Play,
  User as UserIcon,
  Settings,
  Mail,
  Shield,
  CreditCard,
  QrCode,
  CheckCircle,
  Scan,
  Maximize2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  User, 
  Movie, 
  Category, 
  Session, 
  UserRole,
  Reservation
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_MOVIES, 
  INITIAL_CATEGORIES,
  INITIAL_SESSIONS
} from './constants';
import { getMovieRecommendation } from './services/geminiService';
import { motion } from 'framer-motion';

// Extend Window interface for custom properties
declare global {
  interface Window {
    searchMovieId?: string;
    selectedCat?: string;
  }
}

// Constantes de Layout
const TOTAL_SEATS = 40; 
const API_URL = 'http://localhost:8080/api/v1/movies';

// --- Paginação ---
const PAGE_SIZE = 12;

// --- Utils ---
const parseDurationToMinutes = (duration: string | number): number => {
  if (typeof duration === 'number') {
    return duration;
  }
  if (typeof duration === 'string') {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      // hh:mm:ss
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 2) {
      // mm:ss or hh:mm
      if (parts[0] >= 2) {
        // Provavelmente hh:mm
        return parts[0] * 60 + parts[1];
      } else {
        // Provavelmente mm:ss
        return parts[0];
      }
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      return parts[0];
    }
  }
  return 120; // Default
};

const formatYoutubeUrl = (url: string): string => {
  if (!url) return '';
  return url.replace('watch?v=', 'embed/');
};

// --- Components ---

const Navbar = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="sticky top-2 z-50 flex justify-center pointer-events-none w-full">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 border border-white/10 shadow-2xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] backdrop-blur-2xl pointer-events-auto rounded-none md:rounded-3xl" style={{borderRadius:'1.5rem', boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-rose-500 font-black text-2xl tracking-tighter">
            <Film className="w-8 h-8" />
            <span>CINE<span className="text-white">CLICK</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-rose-400 font-semibold transition-colors text-white">Catálogo</Link>
            {user?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">Dashboard</Link>
            )}
            {user ? (
              <div className="relative flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-500 font-black text-lg hover:bg-rose-500 hover:text-white transition-all focus:outline-none"
                  onClick={() => setShowDropdown((v) => !v)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  title="Abrir menu do usuário"
                >
                  {user.name[0]}
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#1e293b] border border-white/10 rounded-2xl shadow-xl py-2 animate-in fade-in z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-rose-500/10" onClick={() => setShowDropdown(false)}>Meu Perfil</Link>
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"><LogOut className="w-4 h-4"/> Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-rose-900/40">
                <UserIcon className="w-5 h-5" /> Entrar
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-slate-400 hover:text-white focus:outline-none">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-4 border-t border-white/5 animate-in fade-in md:hidden flex flex-col">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/30 hover:bg-white/10 text-white border border-white/10">
            <X className="w-7 h-7" />
          </button>
          <Link to="/" className="block py-4 text-lg font-medium text-white border-b border-white/10" onClick={() => setIsOpen(false)}>Catálogo</Link>
          {user?.role === UserRole.ADMIN && (
            <Link to="/admin" className="block py-4 text-lg font-medium text-rose-400 border-b border-white/10" onClick={() => setIsOpen(false)}>Dashboard</Link>
          )}
          {user && (
            <Link to="/profile" className="block py-4 text-lg font-medium text-white border-b border-white/10" onClick={() => setIsOpen(false)}>Meu Perfil</Link>
          )}
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <button onClick={() => {onLogout(); setIsOpen(false);}} className="flex items-center gap-2 py-4 text-lg font-medium text-rose-500 w-full justify-center"><LogOut className="w-5 h-5"/> Sair</button>
            ) : (
              <Link to="/login" className="block py-4 text-lg font-medium text-rose-500 w-full text-center" onClick={() => setIsOpen(false)}><UserIcon className="w-5 h-5 inline"/> Entrar</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const VirtualTicket = ({ reservation, movie, session, onClose }: { reservation: Reservation, movie: Movie, session: Session, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 z-20 p-2 bg-black/40 hover:bg-white/10 rounded-full transition-colors border border-white/10">
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="relative h-56 md:h-64 w-full flex items-center justify-center">
          <img src={movie.posterUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-110" alt="backdrop" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
          <div className="relative z-10 flex items-end gap-4 w-full px-4 md:px-8">
            <div className="w-20 h-28 md:w-24 md:h-32 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden shrink-0 -translate-y-4 md:translate-y-0">
               <img src={movie.posterUrl} className="w-full h-full object-cover" alt="poster" />
            </div>
            <div className="pb-2 space-y-1 flex-1">
               <div className="text-[10px] text-rose-500 font-black uppercase tracking-widest leading-none">INGRESSO DIGITAL</div>
               <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-white line-clamp-2">{movie.title}</h3>
               {/* ...existing code... */}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10 bg-slate-900/40">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</div>
               <div className="font-bold text-white text-lg">{new Date(session.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'long'})}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Horário</div>
               <div className="font-bold text-rose-500 text-2xl">{session.time}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sala</div>
               <div className="font-bold uppercase tracking-tight text-white">{session.room}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Assento(s)</div>
               <div className="font-bold text-emerald-400 text-lg">{reservation.seats.join(', ')}</div>
            </div>
          </div>

          <div className="relative py-10 flex flex-col items-center justify-center space-y-6">
             <div className="absolute top-0 left-[-2rem] right-[-2rem] border-t-2 border-dashed border-white/5"></div>
             
             <div className="p-6 bg-white rounded-3xl shadow-[0_0_80px_rgba(255,255,255,0.08)] relative">
                <QRCodeCanvas 
                  value={reservation.id} 
                  size={180}
                  level={"H"}
                  includeMargin={false}
                />
                <div className="absolute inset-0 border-[10px] border-white rounded-3xl pointer-events-none"></div>
             </div>

             <div className="text-center space-y-1.5">
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">CÓDIGO DE ACESSO</div>
                <div className="text-base font-mono font-bold text-slate-400 bg-white/5 px-4 py-1 rounded-full uppercase">{reservation.id.toUpperCase()}</div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-rose-600/10 border-t border-white/5 flex items-center justify-center gap-3">
           <Shield className="w-5 h-5 text-rose-500" />
           <p className="text-[10px] font-black text-rose-200/60 uppercase tracking-widest">Acesso individual. Válido apenas para esta sessão.</p>
        </div>
      </div>
    </div>
  );
};

const SeatPicker = ({ onConfirm, reservedSeats = [] }: { onConfirm: (seats: string[]) => void, reservedSeats?: string[] }) => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];
  const [selected, setSelected] = useState<string[]>([]);
  
  const allReserved = useMemo(() => ['A1', 'A2', 'C4', 'E8', ...reservedSeats], [reservedSeats]);

  const toggleSeat = (id: string) => {
    if (allReserved.includes(id)) return;
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md h-3 bg-rose-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)] mb-14 relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">TELA</div>
        </div>
        
        <div className="grid grid-cols-8 gap-4">
          {rows.map(row => 
            cols.map(col => {
              const id = `${row}${col}`;
              const isReserved = allReserved.includes(id);
              const isSelected = selected.includes(id);
              
              return (
                <button
                  key={id}
                  onClick={() => toggleSeat(id)}
                  disabled={isReserved}
                  className={`w-9 h-9 rounded-t-xl transition-all border-2 ${
                    isReserved 
                      ? 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-30' 
                      : isSelected 
                        ? 'bg-rose-600 border-rose-400 scale-110 shadow-[0_0_15px_rgba(225,29,72,0.5)]' 
                        : 'bg-slate-700/40 border-white/5 hover:border-rose-500/50 hover:bg-slate-700'
                  }`}
                  title={id}
                />
              );
            })
          )}
        </div>
      </div>
      
      <div className="flex justify-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-700/40 border border-white/10 rounded-sm"></div> Livre</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-600 rounded-sm"></div> Seu</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 opacity-40 rounded-sm"></div> Ocupado</div>
      </div>

      <button
        onClick={() => onConfirm(selected)}
        disabled={selected.length === 0}
        className="w-full py-5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-rose-900/40 active:scale-95"
      >
        RESERVAR {selected.length} {selected.length === 1 ? 'LUGAR' : 'LUGARES'}
      </button>
    </div>
  );
};

// --- Pages ---

const ProfilePage = ({ user, onUpdateUser, reservations, movies, sessions }: { user: User | null, onUpdateUser: (updated: Partial<User>) => void, reservations: Reservation[], movies: Movie[], sessions: Session[] }) => {
  const [selectedTicket, setSelectedTicket] = useState<{res: Reservation, movie: Movie, sess: Session} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  if (!user) return <div className="p-40 text-center text-2xl font-black uppercase tracking-widest text-slate-700">ACESSO NEGADO</div>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const userReservations = useMemo(() => reservations.filter(r => r.userId === user.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [reservations, user.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-80 shrink-0 space-y-8">
          <div className="glass-panel p-10 rounded-[3rem] border border-white/10 text-center space-y-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-32 h-32 mx-auto rounded-full bg-rose-600 flex items-center justify-center text-5xl font-black shadow-2xl shadow-rose-900/40 text-white">
              {user.name[0]}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">{user.name}</h2>
              <p className="text-rose-500 text-xs font-bold tracking-widest uppercase">{user.role}</p>
            </div>
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-black text-white">{userReservations.length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Reservas</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-white">480</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Pontos</div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden">
             <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors border-b border-white/5">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <span className="font-bold text-sm text-slate-300">Métodos de Pagamento</span>
             </button>
             <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors border-b border-white/5">
                <Shield className="w-5 h-5 text-slate-500" />
                <span className="font-bold text-sm text-slate-300">Privacidade e Segurança</span>
             </button>
             <button className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors text-rose-500">
                <LogOut className="w-5 h-5" />
                <span className="font-bold text-sm">Excluir Conta</span>
             </button>
          </div>
        </div>

        <div className="flex-1 space-y-12">
          <section className="glass-panel p-10 md:p-12 rounded-[3.5rem] border border-white/10 space-y-10 relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-600/10 rounded-2xl border border-rose-600/20">
                  <UserIcon className="w-6 h-6 text-rose-500" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Dados Pessoais</h3>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 font-bold text-xs transition-all uppercase tracking-widest text-slate-300"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 flex items-center gap-2">
                   <UserIcon className="w-3 h-3" /> Nome Completo
                </label>
                <input 
                  disabled={!isEditing}
                  required
                  className={`w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white font-medium outline-none transition-all ${isEditing ? 'focus:border-rose-500 ring-rose-500/5 ring-8' : 'opacity-60'}`}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 flex items-center gap-2">
                   <Mail className="w-3 h-3" /> Email
                </label>
                <input 
                  disabled={!isEditing}
                  type="email"
                  required
                  className={`w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white font-medium outline-none transition-all ${isEditing ? 'focus:border-rose-500 ring-rose-500/5 ring-8' : 'opacity-60'}`}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              {isEditing && (
                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData({name: user.name, email: user.email}); }}
                    className="px-8 py-3 rounded-2xl text-slate-400 font-bold hover:text-white transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-900/40"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              )}
            </form>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-600/10 rounded-2xl border border-rose-600/20">
                <Ticket className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Seus Ingressos</h3>
            </div>
            
            <div className="space-y-6">
              {userReservations.length > 0 ? userReservations.map((res) => {
                const session = sessions.find(s => s.id === res.sessionId);
                const movie = movies.find(m => m.id === session?.movieId);
                if (!session || !movie) return null;

                return (
                  <div key={res.id} className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-rose-500/30 transition-all flex flex-col md:flex-row items-center gap-8 group animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform">
                        <img src={movie.posterUrl} className="w-full h-full object-cover" alt={movie.title} />
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <div className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em] leading-none">CineClick • Shopping Premium</div>
                        <h4 className="text-2xl font-black uppercase leading-tight text-white">{movie.title}</h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-rose-500" /> {new Date(session.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})}</span>
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-rose-500" /> {session.time}</span>
                          <span className="flex items-center gap-2 text-emerald-500"><MapPin className="w-4 h-4" /> Sala: {session.room} • Assentos: {res.seats.join(', ')}</span>
                        </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-center gap-4">
                        <div className={`px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${res.isScanned ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/5'}`}>
                          {res.isScanned ? 'UTILIZADO' : 'ATIVO'}
                        </div>
                        {!res.isScanned && (
                          <button 
                            onClick={() => setSelectedTicket({res, movie, sess: session})}
                            className="flex items-center gap-3 bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all shadow-xl shadow-rose-900/40 hover:-translate-y-1"
                          >
                            <QrCode className="w-5 h-5" /> VER TICKET
                          </button>
                        )}
                    </div>
                  </div>
                );
              }) : (
                <div className="p-20 glass-panel rounded-[4rem] text-center border-2 border-dashed border-white/5">
                  <div className="space-y-6">
                     <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center">
                        <Ticket className="w-10 h-10 text-slate-600" />
                     </div>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-lg text-white">Você ainda não possui ingressos.</p>
                     <Link to="/" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-rose-500 font-black text-xs hover:bg-white/10 transition-all uppercase tracking-tighter">
                        Explorar Catálogo <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {selectedTicket && (
        <VirtualTicket 
          reservation={selectedTicket.res}
          movie={selectedTicket.movie}
          session={selectedTicket.sess}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

const HomePage = ({
  movies,
  categories,
  reservations,
  loading,
  page,
  setPage,
  totalPages
}: {
  movies: Movie[],
  categories: Category[],
  reservations: Reservation[],
  loading: boolean,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  totalPages: number
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [search, setSearch] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
  const catalogRef = React.useRef<HTMLDivElement>(null);

  // Filtros de Sessão
  const [sessionMovieId, setSessionMovieId] = useState<string>('all');
  const [sessionDate, setSessionDate] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'full'>('all');

  const filteredMovies = useMemo(() => {
    let result = movies;
    if (selectedCat !== 'all') {
      result = result.filter(m => m.categoryIds.includes(selectedCat));
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(s) ||
        (m.cast && m.cast.toLowerCase().includes(s)) ||
        m.categoryIds.some(catId => categories.find(c => c.id === catId)?.name.toLowerCase().includes(s))
      );
    }
    return result;
  }, [selectedCat, movies, search, categories]);

  // Gerar sessões fictícias vinculadas aos filmes reais da API se eles existirem
  const dynamicSessions = useMemo(() => {
    if (movies.length === 0) return [];
    
    // Mapeamos as sessões iniciais para os IDs reais dos filmes carregados
    // Se houver menos filmes, repetimos ou ignoramos
    return INITIAL_SESSIONS.map((sess, idx) => {
        const targetMovie = movies[idx % movies.length];
        return { ...sess, movieId: targetMovie.id };
    });
  }, [movies]);

  const uniqueDates = useMemo(() => Array.from(new Set(dynamicSessions.map(s => s.date))).sort(), [dynamicSessions]);

  const getSessionStats = (sessionId: string) => {
    const realReservationsCount = reservations
      .filter(r => r.sessionId === sessionId)
      .reduce((acc, r) => acc + r.seats.length, 0);
    
    const mockBaseMap: Record<string, number> = {
      's1': 4, 's2': 36, 's3': 12, 's4': 40, 's5': 8, 's6': 2, 's7': 39
    };
    
    const mockOccupied = mockBaseMap[sessionId] || 0;
    const finalOccupied = Math.min(TOTAL_SEATS, mockOccupied + realReservationsCount);
    
    return {
      occupied: finalOccupied,
      total: TOTAL_SEATS,
      available: Math.max(0, TOTAL_SEATS - finalOccupied),
      isFull: finalOccupied >= TOTAL_SEATS
    };
  };

  const filteredSessions = useMemo(() => {
    return dynamicSessions.filter(s => {
      const stats = getSessionStats(s.id);
      const matchMovie = sessionMovieId === 'all' || s.movieId === sessionMovieId;
      const matchDate = sessionDate === 'all' || s.date === sessionDate;
      const matchAvailability = 
        availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && !stats.isFull) ||
        (availabilityFilter === 'full' && stats.isFull);

      return matchMovie && matchDate && matchAvailability;
    });
  }, [sessionMovieId, sessionDate, availabilityFilter, reservations, dynamicSessions]);

  const handleAiRecommendation = async () => {
    setLoadingAi(true);
    const tip = await getMovieRecommendation("animado e querendo algo épico");
    setAiTip(tip || '');
    setLoadingAi(false);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest animate-pulse">Carregando Experiência...</p>
        </div>
    );
  }

  return (
    <div className="space-y-20 pb-20">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 scale-105 animate-[pulse_8s_infinite]"
            alt="Cinema Backdrop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-[#1e293b]"></div>
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-4 w-full text-center space-y-8"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> Agora em exibição
          </div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
          >
            Reserve ingressos de cinema em segundos<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">CineClick</span>
          </motion.h1>
          <motion.p 
            className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          >
            Escolha seu filme, selecione seus assentos e garanta sua sessão com apenas alguns cliques. Simples, rápido e sem filas.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          >
            <a href="#catalogo" className="w-full sm:w-auto px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-lg transition-all shadow-2xl shadow-rose-900/40 hover:-translate-y-1 text-center">
              RESERVAR AGORA
            </a>
            <button 
              onClick={handleAiRecommendation}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all backdrop-blur-md"
            >
              <Sparkles className="w-5 h-5 text-amber-400" /> {loadingAi ? 'PROCESSANDO...' : 'RECOMENDAÇÃO IA'}
            </button>
          </motion.div>

          {aiTip && (
            <motion.div 
              className="max-w-xl mx-auto p-6 rounded-3xl glass-panel border border-indigo-500/30 text-indigo-100 italic animate-in fade-in slide-in-from-bottom-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
            >
              "{aiTip}"
            </motion.div>
          )}
        </motion.div>
        {/* Ícone de busca no header */}
        <div className="absolute top-10 right-10 z-30">
          <button onClick={() => setShowSearchModal(true)} className="p-4 rounded-full bg-white/10 border border-white/20 shadow-lg hover:bg-rose-600/20 transition-all">
            <Search className="w-7 h-7 text-white" />
          </button>
        </div>
        {/* Modal de busca */}
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0f172a] rounded-3xl p-8 max-w-lg w-full border border-white/10 shadow-2xl relative">
              <button onClick={() => setShowSearchModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-rose-600/20 border border-white/20">
                <X className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2"><Search className="w-6 h-6 text-rose-500" /> Buscar Filme</h2>
              <input
                className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-rose-500 transition-all text-white font-bold mb-4"
                placeholder="Pesquisar por filme, gênero ou ator..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
              <button onClick={() => { setShowSearchModal(false); if (catalogRef.current) catalogRef.current.scrollIntoView({ behavior: 'smooth' }); }} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-rose-900/40 mt-2">Buscar</button>
            </div>
          </div>
        )}
      </section>

      {/* Filtros de Sessão */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-rose-500">
               <Calendar className="w-8 h-8 animate-pulse" />
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Horários de <span className="text-rose-500">Sessão</span></h2>
            </div>
            <p className="text-slate-500 font-medium text-lg">Selecione uma sessão disponível para garantir seu lugar.</p>
          </div>
          
          <div className="flex flex-wrap gap-6 w-full lg:w-auto justify-end">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <label className="text-xs uppercase font-black text-slate-500 tracking-widest flex items-center gap-2"><Film className="w-4 h-4"/> Filme</label>
              <select 
                className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-rose-500/30 rounded-2xl px-5 py-4 outline-none focus:border-rose-500 transition-all text-white font-bold shadow-lg"
                value={sessionMovieId}
                onChange={e => setSessionMovieId(e.target.value)}
              >
                <option value="all">TODOS OS FILMES</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="space-y-2 flex-1 min-w-[180px]">
              <label className="text-xs uppercase font-black text-slate-500 tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4"/> Data</label>
              <select 
                className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-rose-500/30 rounded-2xl px-5 py-4 outline-none focus:border-rose-500 transition-all text-white font-bold shadow-lg"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
              >
                <option value="all">QUALQUER DATA</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{new Date(date).toLocaleDateString('pt-BR', {day:'2-digit', month:'long'}).toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 flex-1 min-w-[180px]">
              <label className="text-xs uppercase font-black text-slate-500 tracking-widest flex items-center gap-2"><Users className="w-4 h-4"/> Vagas</label>
              <select 
                className="w-full bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-rose-500/30 rounded-2xl px-5 py-4 outline-none focus:border-rose-500 transition-all text-white font-bold shadow-lg"
                value={availabilityFilter}
                onChange={e => setAvailabilityFilter(e.target.value as any)}
              >
                <option value="all">QUALQUER OCUPAÇÃO</option>
                <option value="available">SÓ COM VAGAS</option>
                <option value="full">ESGOTADAS</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => {
              const movie = movies.find(m => m.id === session.movieId);
              const stats = getSessionStats(session.id);
              const occupancyPercent = (stats.occupied / stats.total) * 100;

              return (
                <Link 
                  key={session.id} 
                  to={stats.isFull ? "#" : `/movie/${movie?.id}`} 
                  className={`group glass-panel rounded-[2.5rem] border border-white/10 shadow-2xl transition-all flex flex-col relative overflow-hidden h-[280px] ${stats.isFull ? 'grayscale-70 opacity-60 cursor-not-allowed' : 'hover:border-rose-500/40 hover:shadow-[0_20px_50px_-15px_rgba(225,29,72,0.15)] hover:-translate-y-1'}`}
                  style={{backdropFilter:'blur(8px)'}}
                  onClick={(e) => stats.isFull && e.preventDefault()}
                >
                  {/* Background Cover */}
                  <div className="absolute inset-0 z-0">
                    <img src={movie?.posterUrl} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0f172a]/40 to-[#0f172a]/80"></div>
                  </div>

                  <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="text-[10px] text-rose-500 font-black uppercase tracking-[0.2em] drop-shadow-md">{movie?.title}</div>
                        <div className="text-4xl font-black text-white drop-shadow-lg">{session.time}</div>
                      </div>
                      {!stats.isFull && (
                        <div className="p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                           <ChevronRight className="w-5 h-5 text-rose-500" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs text-slate-300 font-bold drop-shadow-sm">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 uppercase tracking-tighter backdrop-blur-sm"><MapPin className="w-3 h-3 text-rose-500" /> {session.room}</span>
                        <span className="text-emerald-400 font-black text-lg drop-shadow-md">R$ {session.price.toFixed(2)}</span>
                      </div>

                      <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest drop-shadow-md ${stats.isFull ? 'text-red-500' : (stats.available < 5 ? 'text-amber-500 animate-pulse' : 'text-slate-400')}`}>
                               {stats.isFull ? 'ESGOTADA' : (stats.available < 5 ? 'ÚLTIMAS VAGAS!' : 'LUGARES DISPONÍVEIS')}
                            </span>
                            <span className="text-xs font-bold text-white drop-shadow-md">{stats.available} <span className="text-slate-400 text-[10px] font-medium uppercase">LIVRES</span></span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
                            <div 
                               className={`h-full transition-all duration-700 ${stats.isFull ? 'bg-red-500' : (occupancyPercent > 80 ? 'bg-amber-500' : 'bg-rose-500')}`}
                               style={{ width: `${occupancyPercent}%` }}
                            />
                         </div>
                      </div>
                    </div>
                  </div>

                  {stats.isFull && (
                    <div className="absolute inset-0 bg-[#020617]/40 flex items-center justify-center backdrop-blur-[1px] z-20">
                       <div className="bg-red-600/90 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> ESGOTADO
                       </div>
                    </div>
                  )}
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-32 text-center space-y-6 glass-panel rounded-[3rem] border-2 border-dashed border-white/10 animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center">
                 <Filter className="w-12 h-12 text-slate-600" />
              </div>
              <div className="space-y-2">
                 <p className="text-slate-400 font-black text-2xl uppercase tracking-tighter text-white">Nenhuma sessão encontrada</p>
                 <p className="text-slate-600 font-medium">Tente ajustar os filtros de busca.</p>
              </div>
              <button 
                onClick={() => {setSessionMovieId('all'); setSessionDate('all'); setAvailabilityFilter('all');}}
                className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white px-8 py-3 rounded-2xl font-black text-xs transition-all uppercase tracking-widest border border-rose-500/20"
              >
                LIMPAR FILTROS
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Catálogo de Filmes */}
      <section id="catalogo" ref={catalogRef} className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white">Filmes em <span className="text-rose-500">Cartaz</span></h2>
            <div className="h-1.5 w-24 bg-rose-500 rounded-full"></div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setSelectedCat('all')}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-all border ${selectedCat === 'all' ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'}`}
            >
              TODOS
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-bold transition-all border ${selectedCat === cat.id ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'}`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMovies.map(movie => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="group relative flex flex-col bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(225,29,72,0.15)]">
              <div className="aspect-[3/4.5] overflow-hidden relative">
                <img src={movie.posterUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={movie.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl px-3 py-1.5 rounded-2xl text-[10px] font-black text-yellow-400 border border-yellow-500/40">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {movie.rating}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black tracking-[0.2em] uppercase">
                  {movie.categoryIds.map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean).join(', ')}
                </div>
                <h3 className="font-black text-2xl leading-tight group-hover:text-rose-400 transition-colors uppercase truncate text-white">{movie.title}</h3>
                <div className="flex items-center gap-4 text-slate-500 text-sm font-bold">
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-rose-500/70" /> {movie.duration}m</div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <div className="flex items-center gap-1.5"><Ticket className="w-4 h-4 text-rose-500/70" /> 2D / IMAX</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Paginação */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`px-6 py-2 rounded-xl font-bold border ${page === 1 ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'}`}>Anterior</button>
          <span className="text-white font-bold">Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`px-6 py-2 rounded-xl font-bold border ${page === totalPages ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'}`}>Próxima</button>
        </div>
      </section>
    </div>
  );
};

const MovieDetailsPage = ({ movies, onAddReservation, user, reservations }: { movies: Movie[], onAddReservation: (res: Reservation) => void, user: User | null, reservations: Reservation[] }) => {
  const { id } = useLocation().pathname.split('/').slice(-1)[0] ? { id: useLocation().pathname.split('/').slice(-1)[0] } : { id: '' };
  const movie = movies.find(m => m.id === id);
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const navigate = useNavigate();

  const sessions = useMemo(() => INITIAL_SESSIONS.filter(s => s.movieId === id), [id]);

  const currentReservedSeats = useMemo(() => {
    if (!selectedSession) return [];
    
    const mockBaseMap: Record<string, string[]> = {
      's2': Array.from({length: 36}, (_, i) => `A${i+1}`),
      's4': Array.from({length: 40}, (_, i) => { 
        const row = String.fromCharCode(65 + Math.floor(i / 8));
        const col = (i % 8) + 1;
        return `${row}${col}`;
      }),
      's7': Array.from({length: 39}, (_, i) => { 
        const row = String.fromCharCode(65 + Math.floor(i / 8));
        const col = (i % 8) + 1;
        return `${row}${col}`;
      })
    };

    const mockReserved = mockBaseMap[selectedSession.id] || [];
    const realReserved = reservations
      .filter(r => r.sessionId === selectedSession.id)
      .flatMap(r => r.seats);

    return Array.from(new Set([...mockReserved, ...realReserved]));
  }, [selectedSession, reservations]);

  if (!movie) return <div className="p-40 text-center text-2xl font-black uppercase tracking-widest text-slate-700">Filme não encontrado</div>;

  const handleBooking = async (seats: string[]) => {
    if (!user) {
      alert("Você precisa estar logado para realizar uma reserva.");
      navigate('/login');
      return;
    }
    if (!selectedSession) {
      alert("Por favor, selecione uma sessão antes de escolher os assentos.");
      return;
    }

    setIsReserving(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newRes: Reservation = {
      id: `TKT-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      userId: user.id,
      sessionId: selectedSession.id,
      seats: seats,
      totalPrice: seats.length * selectedSession.price,
      createdAt: new Date().toISOString(),
      isScanned: false
    };

    onAddReservation(newRes);
    setIsReserving(false);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="relative h-[65vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent z-10"></div>
        <img src={movie.posterUrl} className="w-full h-full object-cover opacity-20 blur-2xl scale-125" alt="backdrop" />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row gap-12 items-end w-full">
              <div className="w-56 md:w-80 shrink-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-white/5 rounded-[2.5rem] overflow-hidden rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <img src={movie.posterUrl} className="w-full" alt="poster" />
              </div>
              <div className="space-y-8 flex-1 pb-4">
                <div className="inline-block bg-rose-600 text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">ESTREIA DA SEMANA</div>
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase drop-shadow-2xl">{movie.title}</h1>
                <div className="flex flex-wrap gap-6 text-slate-300 font-bold uppercase tracking-widest text-xs">
                  <span className="flex items-center gap-2 text-white"><Star className="w-5 h-5 fill-rose-600 text-rose-600" /> {movie.rating} / 5</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2"></span>
                  <span className="flex items-center gap-2 text-white"><Clock className="w-5 h-5 text-rose-500" /> {movie.duration} MINUTOS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2"></span>
                  <span className="text-rose-400 font-black">IMAX • DOLBY ATMOS</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-l-8 border-rose-600 pl-6 text-white text-white">O Filme</h2>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">{movie.description}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-base">
              {movie.director && (
                <div><span className="font-bold text-slate-400">Diretor:</span> {movie.director}</div>
              )}
              {movie.cast && (
                <div><span className="font-bold text-slate-400">Elenco:</span> {movie.cast}</div>
              )}
              {movie.countryOfOrigin && (
                <div><span className="font-bold text-slate-400">País:</span> {movie.countryOfOrigin}</div>
              )}
              {movie.distribuitor && (
                <div><span className="font-bold text-slate-400">Distribuidora:</span> {movie.distribuitor}</div>
              )}
            </div>
          </section>

          {movie.trailerUrl && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-600/10 rounded-2xl border border-rose-600/30">
                  <Play className="w-6 h-6 text-rose-500 fill-rose-500" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Trailer Oficial</h2>
              </div>
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
                <iframe 
                  src={movie.trailerUrl} 
                  title={`${movie.title} Trailer`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          <section className="space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-l-8 border-rose-600 pl-6 text-white">Horários Disponíveis</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {sessions.length > 0 ? sessions.map(session => {
                const mockBaseMap: Record<string, number> = { 's1': 4, 's2': 36, 's3': 12, 's4': 40, 's5': 8, 's6': 2, 's7': 39 };
                const realCount = reservations.filter(r => r.sessionId === session.id).reduce((acc, r) => acc + r.seats.length, 0);
                const isFull = (mockBaseMap[session.id] || 0) + realCount >= TOTAL_SEATS;

                return (
                  <button 
                    key={session.id}
                    disabled={isFull}
                    onClick={() => {setSelectedSession(session); setShowSeatPicker(true);}}
                    className={`relative p-8 rounded-[2rem] flex flex-col items-center gap-4 group border transition-all h-[200px] justify-center overflow-hidden ${isFull ? 'opacity-40 cursor-not-allowed border-dashed border-slate-700' : (selectedSession?.id === session.id ? 'border-rose-500 scale-95 shadow-[0_0_30px_rgba(244,63,94,0.3)]' : 'border-white/5 hover:border-rose-500/50')}`}
                  >
                    {/* Background Movie Cover */}
                    <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                        <img src={movie.posterUrl} className="w-full h-full object-cover" alt="" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${selectedSession?.id === session.id ? 'from-rose-900/90 via-rose-900/70 to-rose-900/50' : 'from-[#020617]/90 via-[#020617]/70 to-[#020617]/50'}`}></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                      {!isFull && (
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-rose-500/20 rounded-bl-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Ticket className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {isFull && (
                         <div className="absolute -top-4 -right-4 p-6 text-red-500">
                            <AlertTriangle className="w-5 h-5" />
                         </div>
                      )}
                      <span className={`text-sm font-black uppercase tracking-widest drop-shadow-md ${selectedSession?.id === session.id ? 'text-rose-100' : 'text-slate-300'}`}>{new Date(session.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'short'})}</span>
                      <span className={`text-5xl font-black drop-shadow-xl ${selectedSession?.id === session.id ? 'text-white' : 'text-white group-hover:text-rose-400 transition-colors'}`}>{session.time}</span>
                      <div className={`text-[10px] font-black bg-slate-900 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest backdrop-blur-sm ${selectedSession?.id === session.id ? 'text-rose-100 bg-rose-700' : 'text-slate-300'}`}>{isFull ? 'ESGOTADA' : session.room}</div>
                    </div>
                  </button>
                );
              }) : (
                <div className="col-span-full p-12 glass-panel rounded-[2rem] text-center text-slate-500 font-bold uppercase tracking-widest border border-dashed border-white/10">
                  Nenhuma sessão futura encontrada para este filme.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            {showSeatPicker && selectedSession ? (
              <div className="glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                {isReserving && (
                  <div className="absolute inset-0 z-50 bg-[#020617]/80 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
                    <p className="text-white font-black uppercase tracking-widest text-sm text-white">Gerando seu Ticket...</p>
                  </div>
                )}
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Assentos</h3>
                  <button onClick={() => setShowSeatPicker(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <SeatPicker onConfirm={handleBooking} reservedSeats={currentReservedSeats} />
              </div>
            ) : (
               <div className="glass-panel p-10 rounded-[3rem] border border-white/10 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-5 p-6 bg-rose-600/5 rounded-[2rem] border border-rose-500/20">
                      <div className="p-4 bg-rose-600 rounded-2xl shadow-lg shadow-rose-900/40">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</div>
                        <div className="font-black text-lg uppercase tracking-tight text-white">Vendas Abertas</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 p-6 bg-slate-900/50 rounded-[2rem] border border-white/5">
                      <div className="p-4 bg-slate-800 rounded-2xl">
                        <MapPin className="w-8 h-8 text-rose-500" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Localização</div>
                        <div className="font-black text-lg uppercase tracking-tight text-white">Shopping Premium</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-rose-600/10 rounded-[2rem] border border-rose-500/20">
                    <p className="text-sm text-rose-200/70 font-bold italic text-center">
                      "Dica: Filtre por sessões disponíveis na página inicial para agilizar sua reserva."
                    </p>
                  </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ movies, setMovies, categories, reservations, onScanReservation }: { movies: Movie[], setMovies: React.Dispatch<React.SetStateAction<Movie[]>>, categories: Category[], reservations: Reservation[], onScanReservation: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'movies' | 'sessions' | 'users' | 'scanner'>('movies');
  const [isAdding, setIsAdding] = useState(false);
  const [scanId, setScanId] = useState('');
  const [scanResult, setScanResult] = useState<{success: boolean, message: string} | null>(null);
  
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    categoryId: '1',
    duration: 120,
    posterUrl: '',
    trailerUrl: ''
  });

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const movie: Movie = {
      ...newMovie,
      id: Math.random().toString(36).substring(2, 11),
      rating: 4.5,
      posterUrl: newMovie.posterUrl || `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop`
    };
    setMovies(prev => [...prev, movie]);
    setIsAdding(false);
    setNewMovie({ title: '', description: '', categoryId: '1', duration: 120, posterUrl: '', trailerUrl: '' });
  };

  const deleteMovie = (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  };

  const handleMockScan = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = scanId.trim().toUpperCase();
    const res = reservations.find(r => r.id.toUpperCase() === cleanId);
    
    if (!res) {
      setScanResult({success: false, message: "Ticket inválido ou não encontrado."});
    } else if (res.isScanned) {
      setScanResult({success: false, message: "Ticket duplicado! Já foi utilizado."});
    } else {
      onScanReservation(res.id);
      setScanResult({success: true, message: "Ticket Validado! Entrada Autorizada."});
    }
    setScanId('');
    setTimeout(() => setScanResult(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white">Dashboard <span className="text-rose-500">Admin</span></h1>
          <p className="text-slate-500 font-bold">Gestão completa e validação de ingressos em tempo real.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-2xl shadow-rose-900/40"
        >
          <Plus className="w-6 h-6" /> NOVO FILME
        </button>
      </div>

      <div className="flex gap-8 border-b border-white/5 overflow-x-auto no-scrollbar">
        {(['movies', 'sessions', 'users', 'scanner'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-6 font-black uppercase tracking-widest text-sm border-b-4 transition-all whitespace-nowrap ${activeTab === tab ? 'border-rose-600 text-rose-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            {tab === 'movies' ? 'FILMES' : tab === 'sessions' ? 'SESSÕES' : tab === 'scanner' ? 'SCANNER TICKET' : 'USUÁRIOS'}
          </button>
        ))}
      </div>

      {isAdding && (activeTab === 'movies') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl">
          <form onSubmit={handleAddMovie} className="w-full max-w-2xl glass-panel p-12 rounded-[3rem] space-y-8 shadow-2xl border-white/10 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button type="button" onClick={() => setIsAdding(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full"><X/></button>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Adicionar Conteúdo</h2>
            <div className="space-y-5">
              <input required className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-white focus:border-rose-500 outline-none font-medium" placeholder="Título" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} />
              <textarea required className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-white focus:border-rose-500 outline-none min-h-[120px]" placeholder="Sinopse" value={newMovie.description} onChange={e => setNewMovie({...newMovie, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-5">
                <select className="bg-slate-900 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none" value={newMovie.categoryId} onChange={e => setNewMovie({...newMovie, categoryId: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                </select>
                <input type="number" className="bg-slate-900 border border-white/5 rounded-2xl p-5 text-white outline-none" placeholder="Duração (min)" value={newMovie.duration} onChange={e => setNewMovie({...newMovie, duration: parseInt(e.target.value)})}/>
              </div>
              <input className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-white focus:border-rose-500 outline-none" placeholder="URL Poster" value={newMovie.posterUrl} onChange={e => setNewMovie({...newMovie, posterUrl: e.target.value})} />
              <input className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-white focus:border-rose-500 outline-none" placeholder="URL do Trailer (YouTube Embed)" value={newMovie.trailerUrl} onChange={e => setNewMovie({...newMovie, trailerUrl: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-rose-600 py-6 rounded-2xl font-black text-xl text-white hover:bg-rose-500 transition-all shadow-2xl shadow-rose-900/40">SALVAR NOVO FILME</button>
          </form>
        </div>
      )}

      {activeTab === 'movies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map(m => (
            <div key={m.id} className="flex gap-6 p-6 glass-panel border border-white/5 rounded-[2.5rem] group relative hover:border-rose-500/30 transition-all">
              <div className="w-28 h-40 rounded-2xl overflow-hidden shrink-0 shadow-xl">
                <img src={m.posterUrl} className="w-full h-full object-cover" alt={m.title} />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-black text-xl uppercase leading-tight truncate text-white">{m.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.description}</p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest">{m.categoryIds.map(catId => categories.find(c => c.id === catId)?.name).filter(Boolean).join(', ')}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <span className="text-[10px] text-slate-400 font-black uppercase">{m.duration} MIN</span>
                </div>
              </div>
              <button 
                onClick={() => deleteMovie(m.id)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg shadow-rose-900/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scanner' && (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
           <div className="glass-panel p-12 rounded-[3.5rem] border border-white/10 space-y-8 text-center">
              <div className="w-24 h-24 bg-rose-600/10 rounded-3xl mx-auto flex items-center justify-center border border-rose-500/30">
                 <Scan className="w-10 h-10 text-rose-500" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Validar Ingresso</h2>
                 <p className="text-slate-500 text-sm font-medium">Insira o código alfanumérico do ticket digital.</p>
              </div>

              <form onSubmit={handleMockScan} className="space-y-4">
                 <input 
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 text-center text-2xl font-mono text-white focus:border-rose-500 outline-none uppercase tracking-[0.2em] shadow-inner" 
                    placeholder="EX: TKT-123X-456"
                    value={scanId}
                    onChange={e => setScanId(e.target.value)}
                 />
                 <button className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-500 py-5 rounded-2xl font-black text-white transition-all shadow-2xl shadow-rose-900/20 uppercase tracking-[0.1em]">
                    <Maximize2 className="w-5 h-5" /> VALIDAR INGRESSO
                 </button>
              </form>

              {scanResult && (
                 <div className={`p-6 rounded-[2rem] border animate-in zoom-in-95 duration-300 ${scanResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                    <div className="flex items-center justify-center gap-3">
                       {scanResult.success ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                       <span className="font-black uppercase tracking-widest text-sm">{scanResult.message}</span>
                    </div>
                 </div>
              )}
           </div>

           <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-500 border-b border-white/5 pb-4 text-white">Últimas Validações</h3>
              <div className="space-y-4">
                 {reservations.filter(r => r.isScanned).slice(-4).reverse().map(res => (
                    <div key={res.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors text-white">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <span className="font-mono text-xs uppercase text-white font-bold">{res.id}</span>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acesso Autorizado</div>
                          </div>
                       </div>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{new Date(res.createdAt).toLocaleTimeString()}</span>
                    </div>
                 ))}
                 {reservations.filter(r => r.isScanned).length === 0 && <p className="text-center text-xs text-slate-600 italic py-6 text-slate-400">Nenhum ticket validado recentemente.</p>}
              </div>
           </div>
        </div>
      )}

      {activeTab !== 'movies' && activeTab !== 'scanner' && (
        <div className="p-32 text-center text-slate-600 border-2 border-dashed border-white/5 rounded-[3rem]">
           <div className="space-y-4">
              <Plus className="w-12 h-12 mx-auto text-slate-800" />
              <p className="font-black uppercase tracking-widest text-lg text-white">Módulo de {activeTab} em manutenção.</p>
           </div>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      onLogin(UserRole.ADMIN);
    } else {
      onLogin(UserRole.CLIENT);
    }
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md glass-panel p-12 md:p-16 rounded-[4rem] shadow-2xl space-y-10 border border-white/10 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-rose-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-rose-900/40 rotate-12">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Entrar</h2>
          <p className="text-slate-500 font-medium">Reserve ingressos de cinema em segundos</p>
          <p className="text-slate-400 text-sm mt-2">Escolha seu filme, selecione seus assentos e garanta sua sessão com apenas alguns cliques. Simples, rápido e sem filas.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Endereço de Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-white focus:border-rose-500 outline-none transition-all focus:ring-8 ring-rose-500/5 font-medium"
              placeholder="exemplo@cine.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Sua Senha</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-white focus:border-rose-500 outline-none transition-all focus:ring-8 ring-rose-500/5 font-medium"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-6 rounded-3xl font-black text-xl transition-all shadow-2xl shadow-rose-900/40 active:scale-95 uppercase tracking-tighter"
          >
            Acessar Conta
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 font-bold tracking-widest">
           DICA: USE <span className="text-rose-500">ADMIN</span> NO EMAIL PARA PERMISSÕES TOTAIS.
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- API Fetch ---
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = '';
        // Exemplo: selectedCat e search são do HomePage, mas aqui é App. Adapte conforme necessário.
        // Supondo que você passe selectedCat e search para App ou use um estado global/contexto.
        // Aqui, exemplo para category:
        if (window.selectedCat && window.selectedCat !== 'all') {
          url = `${API_URL}/search?category=${window.selectedCat}&page=${page}&limit=${PAGE_SIZE}`;
        } else if (window.searchMovieId) {
          url = `${API_URL}/search?id=${window.searchMovieId}`;
        } else {
          url = `${API_URL}?page=${page}&limit=${PAGE_SIZE}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        const mappedMovies: Movie[] = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          posterUrl: item.coverImageUrl,
          trailerUrl: formatYoutubeUrl(item.trailerVideoUrl),
          duration: parseDurationToMinutes(item.duration),
          rating: 4.8,
          categoryIds: item.categories?.map((c: any) => c.id) || [],
          cast: item.cast,
          countryOfOrigin: item.countryOfOrigin,
          director: item.director,
          distribuitor: item.distribuitor
        }));
        const uniqueCategories: Category[] = [];
        const catMap = new Map();
        data.data.forEach((m: any) => {
          m.categories?.forEach((c: any) => {
            if (!catMap.has(c.id)) {
              catMap.set(c.id, true);
              uniqueCategories.push({ id: c.id, name: c.name });
            }
          });
        });
        setMovies(mappedMovies);
        setCategories(uniqueCategories.length > 0 ? uniqueCategories : INITIAL_CATEGORIES);
        // Se não houver paginação na resposta, define para 1
        if (data.pagination) {
          setTotalPages(data.pagination.totalPage || 1);
          setPage(data.pagination.page || 1);
        } else {
          setTotalPages(1);
          setPage(1);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies(INITIAL_MOVIES);
        setCategories(INITIAL_CATEGORIES);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [page]);

  const handleLogin = (role: UserRole) => {
    const user = role === UserRole.ADMIN ? INITIAL_USERS[0] : INITIAL_USERS[1];
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated } as User);
    }
  };

  const handleAddReservation = (res: Reservation) => {
    setReservations(prev => [...prev, res]);
  };

  const handleScanReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, isScanned: true } : r));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0f172a] selection:bg-rose-500/30 selection:text-rose-100 text-slate-200">
        {/* Apenas o novo Navbar centralizado e estilizado */}
        <Navbar user={currentUser} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage movies={movies} categories={categories} reservations={reservations} loading={loading} page={page} setPage={setPage} totalPages={totalPages} />} />
            <Route path="/movie/:id" element={<MovieDetailsPage movies={movies} onAddReservation={handleAddReservation} user={currentUser} reservations={reservations} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/profile" element={<ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} reservations={reservations} movies={movies} sessions={INITIAL_SESSIONS} />} />
            <Route 
              path="/admin" 
              element={
                currentUser?.role === UserRole.ADMIN 
                  ? <AdminPanel movies={movies} setMovies={setMovies} categories={categories} reservations={reservations} onScanReservation={handleScanReservation} /> 
                  : <div className="p-40 text-center font-black uppercase tracking-[0.3em] text-rose-500">Acesso Restrito</div>
              } 
            />
            <Route path="*" element={<div className="p-40 text-center text-6xl font-black uppercase tracking-tighter text-white">404 - LOST</div>} />
          </Routes>
        </main>

        <footer className="border-t border-white/5 bg-[#020617] py-24 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-rose-500 font-black text-3xl tracking-tighter">
                <Film className="w-10 h-10" />
                <span>CINE<span className="text-white">RESERVE</span></span>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                Elevando o padrão das experiências cinematográficas desde 2024. O futuro do entretenimento começa aqui.
              </p>
            </div>
            
            <div className="space-y-8">
              <h4 className="font-black uppercase tracking-widest text-xs text-slate-400">Navegação</h4>
              <ul className="space-y-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                <li className="hover:text-rose-500 transition-colors"><Link to="/">Página Inicial</Link></li>
                <li className="hover:text-rose-500 transition-colors"><Link to="/">Todos os Filmes</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black uppercase tracking-widest text-xs text-slate-400">Ajuda e FAQ</h4>
              <ul className="space-y-4 font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                <li className="hover:text-rose-500 transition-colors"><Link to="/">Cancelamento</Link></li>
                <li className="hover:text-rose-500 transition-colors"><Link to="/">Acessibilidade</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black uppercase tracking-widest text-xs text-slate-400">Newsletter</h4>
              <p className="text-slate-500 text-xs font-medium text-white">Receba ofertas exclusivas.</p>
              <div className="flex flex-col gap-3">
                <input className="bg-slate-900 border border-white/5 rounded-2xl p-4 text-xs font-bold outline-none focus:border-rose-500 transition-all text-white" placeholder="DIGITE SEU EMAIL" />
                <button className="bg-rose-600 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 transition-all text-white">INSCREVER</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-24 pt-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">
            &copy; 2024 CINECLICK • POWERED BY GEMINI AI
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;

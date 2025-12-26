
import React, { useState, useEffect } from 'react';
import ChessGame from './components/ChessGame';
import { GameMode } from './types';
import { Users, Cpu, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#remote-')) {
        setMode(GameMode.REMOTE_PVP);
      } else {
        const savedMode = localStorage.getItem('chess_active_mode');
        if (savedMode && !hash) {
           setMode(savedMode as GameMode);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const selectMode = (m: GameMode) => {
    localStorage.setItem('chess_active_mode', m);
    if (m === GameMode.REMOTE_PVP) {
      const roomId = Math.random().toString(36).substring(7);
      // El creador siempre es Blanco (role=w)
      window.location.hash = `remote-${roomId}?role=w`;
    }
    setMode(m);
  };

  const Logo = () => (
    <img 
      src="https://www.ameliasoft.net/assets/img/abstract/LogoAmeliasoftSinFondo1.png" 
      alt="Ameliasoft Logo" 
      className="h-12 w-auto object-contain"
    />
  );

  if (mode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { 
            setMode(null); 
            window.location.hash = ''; 
            localStorage.removeItem('chess_active_mode');
            localStorage.removeItem('chess_save_data');
          }}>
            <Logo />
            <h1 className="text-3xl font-serif font-bold tracking-tight">Ajedrez</h1>
          </div>
          <button 
            onClick={() => { 
              setMode(null); 
              window.location.hash = ''; 
              localStorage.removeItem('chess_active_mode');
            }}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all text-sm font-bold border border-slate-700"
          >
            Volver
          </button>
        </header>

        <main className="w-full flex-1 flex flex-col items-center">
          <ChessGame mode={mode} />
        </main>
        
        <footer className="mt-12 pb-6 text-slate-500 text-sm font-medium">
          Créditos a Ameliasoft LLC
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl w-full text-center z-10">
        <div className="inline-block p-6 bg-white/5 rounded-full mb-8 backdrop-blur-md border border-white/10 shadow-2xl">
          <Logo />
        </div>
        <h1 className="text-8xl md:text-[10rem] font-serif mb-8 leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
          Ajedrez
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed">
          ¡Qué más, parce! Bienvenido al tablero de Ameliasoft LLC. 
          Un duelo serio, sin tanta vaina.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModeCard 
            icon={<Cpu className="w-10 h-10" />}
            title="Contra el Teso"
            description="Mídasele al motor de la casa. A ver si es tan berraco."
            onClick={() => selectMode(GameMode.VS_CPU)}
            color="indigo"
          />
          <ModeCard 
            icon={<Users className="w-10 h-10" />}
            title="Duelo con el veci"
            description="Pa' jugar aquí mismo con el vecino, cara a cara."
            onClick={() => selectMode(GameMode.LOCAL_PVP)}
            color="blue"
          />
          <ModeCard 
            icon={<Globe className="w-10 h-10" />}
            title="Partida con el llave"
            description="Mándele el link a su llave y juéguense una partida remota."
            onClick={() => selectMode(GameMode.REMOTE_PVP)}
            color="emerald"
          />
        </div>

        <footer className="mt-24 text-slate-500 text-lg">
          <p className="font-bold text-slate-400 tracking-widest uppercase text-sm">Créditos a Ameliasoft LLC</p>
        </footer>
      </div>
    </div>
  );
};

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: 'indigo' | 'blue' | 'emerald';
}

const ModeCard: React.FC<ModeCardProps> = ({ icon, title, description, onClick, color }) => {
  const colorMap = {
    indigo: 'hover:border-indigo-500/50 hover:bg-indigo-500/5 text-indigo-400',
    blue: 'hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400',
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400'
  };

  return (
    <button 
      onClick={onClick}
      className={`group p-10 bg-slate-900/60 border border-slate-800 rounded-[2.5rem] text-left transition-all duration-500 backdrop-blur-xl ${colorMap[color]} transform hover:-translate-y-3 hover:shadow-2xl`}
    >
      <div className="mb-6 transition-transform group-hover:scale-125 duration-500">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-100 mb-3">{title}</h3>
      <p className="text-slate-400 text-base leading-relaxed">{description}</p>
    </button>
  );
};

export default App;

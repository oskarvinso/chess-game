
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
      window.location.hash = `remote-${roomId}?role=w`;
    }
    setMode(m);
  };

  const Logo = () => (
    <img 
      src="https://www.ameliasoft.net/assets/img/abstract/LogoAmeliasoftSinFondo1.png" 
      alt="Ameliasoft Logo" 
      className="h-8 md:h-12 w-auto object-contain"
    />
  );

  if (mode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-2 md:p-8">
        <header className="w-full max-w-6xl flex justify-between items-center mb-4 md:mb-8 border-b border-slate-800 pb-2 md:pb-4">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => { 
            setMode(null); 
            window.location.hash = ''; 
            localStorage.removeItem('chess_active_mode');
            localStorage.removeItem('chess_save_data');
          }}>
            <Logo />
            <h1 className="text-xl md:text-3xl font-serif font-bold tracking-tight">Ajedrez</h1>
          </div>
          <button 
            onClick={() => { 
              setMode(null); 
              window.location.hash = ''; 
              localStorage.removeItem('chess_active_mode');
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full transition-all text-[10px] md:text-sm font-bold border border-slate-700"
          >
            Menú
          </button>
        </header>

        <main className="w-full flex-1 flex flex-col items-center overflow-x-hidden">
          <ChessGame mode={mode} />
        </main>
        
        <footer className="mt-8 md:mt-12 pb-4 text-slate-500 text-[10px] md:text-sm font-medium">
          Ameliasoft LLC
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
        <div className="inline-block p-4 md:p-6 bg-white/5 rounded-full mb-6 md:mb-8 backdrop-blur-md border border-white/10 shadow-2xl">
          <Logo />
        </div>
        <h1 className="text-6xl md:text-[10rem] font-serif mb-6 md:mb-8 leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
          Ajedrez
        </h1>
        <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
          ¡Qué más, parce! Duelo serio de Ameliasoft LLC.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <ModeCard 
            icon={<Cpu className="w-8 h-8 md:w-10 md:h-10" />}
            title="Contra el Teso"
            description="Mídasele al motor de la casa."
            onClick={() => selectMode(GameMode.VS_CPU)}
            color="indigo"
          />
          <ModeCard 
            icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
            title="Duelo al veci"
            description="Pa' jugar aquí mismo, cara a cara."
            onClick={() => selectMode(GameMode.LOCAL_PVP)}
            color="blue"
          />
          <ModeCard 
            icon={<Globe className="w-8 h-8 md:w-10 md:h-10" />}
            title="Con el llave"
            description="Mande el link y jueguen remoto."
            onClick={() => selectMode(GameMode.REMOTE_PVP)}
            color="emerald"
          />
        </div>
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
      className={`group p-6 md:p-10 bg-slate-900/60 border border-slate-800 rounded-3xl md:rounded-[2.5rem] text-left transition-all duration-500 backdrop-blur-xl ${colorMap[color]} transform hover:-translate-y-2`}
    >
      <div className="mb-4 md:mb-6 transition-transform group-hover:scale-110 duration-500">{icon}</div>
      <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm md:text-base leading-relaxed">{description}</p>
    </button>
  );
};

export default App;

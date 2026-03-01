import React from 'react';
import LayoutShell from '../LayoutShell';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <LayoutShell className="p-4 md:p-6 text-center bg-[#0a0a0c]">
      <div className="mb-8 md:mb-12 relative">
        <h1 className="text-6xl md:text-7xl font-bold glitch-text tracking-tighter mb-2">SwipeRisk</h1>
        <div className="text-red-600 font-bold mono text-xs md:text-sm animate-pulse tracking-[0.4em]">incident_response_terminal // os_v0.92</div>
      </div>
      <p className="max-w-xl text-slate-300 mb-8 md:mb-10 text-base md:text-lg px-4 leading-relaxed">
        <span className="font-bold">Tinder for AI Risk, Governance, and Compliance.</span>
        <br />
        <span className="text-[#B8962E] mono text-sm md:text-base">[NOTICE: Made for people who hate f*cking boring governance training]</span>
      </p>
      <p className="max-w-xl text-slate-300 mb-12 md:mb-16 text-base md:text-lg px-4">
        <span className="text-slate-300 font-bold block mb-2">Project Icarus</span>
        <span className="text-slate-400">The CEO integrated an unhinged AI into every department.</span><br className="hidden md:inline" /><span className="text-slate-300"> Move fast, break laws, and try to survive the final audit. <span className="cursor-blink text-slate-300">_</span></span>
      </p>
      <div className="w-full flex justify-center">
        <button
          onClick={onStart}
          data-testid="boot-system-button"
          className="px-6 py-3 md:px-12 md:py-4 text-base md:text-xl font-bold tracking-wide hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 min-h-[40px] md:min-h-[48px] bg-white text-black"
        >
          Boot system
        </button>
      </div>
      <div className="mt-8 md:mt-12 mono text-xs text-red-500 px-4 text-center">WARNING: PREVIOUS COMPLIANCE OFFICER CURRENTLY PENDING LITIGATION</div>
    </LayoutShell>
  );
};

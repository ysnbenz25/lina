import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ show, title, message }) => {
  if (!show) return null;

  return (
    <div
      id="app-toast-alert"
      className="fixed bottom-6 left-6 z-50 bg-[#101014] border border-[#d4af37]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 pointer-events-none"
    >
      <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div className="text-right">
        <h5 className="text-xs font-bold text-white font-serif">{title}</h5>
        <p className="text-[11px] text-neutral-300 mt-0.5">{message}</p>
      </div>
    </div>
  );
};

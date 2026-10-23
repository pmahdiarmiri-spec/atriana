import React from "react";
import { Terminal, Cpu, Database } from "lucide-react";

interface TerminalSection {
  title: string;
  item1: string;
  item2?: string;
  item3?: string;
}

interface TerminalMessages {
  liveBadge: string;
  userQueryTitle: string;
  userQuery: string;
  aiResponseTitle: string;
  aiResponseIntro: string;
  section1: TerminalSection;
  section2: TerminalSection;
  section3: TerminalSection;
}

interface PrmAiAssistantTerminalProps {
  messages: TerminalMessages;
}

export function PrmAiAssistantTerminal({ messages }: PrmAiAssistantTerminalProps) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--prm-accent-color)]/5 to-transparent pointer-events-none" />
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800/85">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">Atriana AI Core</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">{messages.liveBadge}</span>
        </div>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed text-slate-300 space-y-5 h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>{messages.userQueryTitle}</span>
          </div>
          <div className="pl-5 border-l border-slate-800 text-[var(--prm-secondary-color)]">
            {messages.userQuery}
          </div>
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Database className="w-3.5 h-3.5" />
            <span>{messages.aiResponseTitle}</span>
          </div>
          <div className="pl-5 border-l border-emerald-800/60 text-slate-300 space-y-3">
            <p className="text-emerald-400">{messages.aiResponseIntro}</p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">{messages.section1.title}:</span>
                <span className="text-slate-300 block pl-3 mt-0.5">{messages.section1.item1}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{messages.section2.title}:</span>
                <ul className="list-disc list-inside pl-3 space-y-0.5 mt-0.5 text-slate-300">
                  <li>{messages.section2.item1}</li>
                  <li>{messages.section2.item2}</li>
                  <li>{messages.section2.item3}</li>
                </ul>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">{messages.section3.title}:</span>
                <ul className="list-disc list-inside pl-3 space-y-0.5 mt-0.5 text-slate-300">
                  <li>{messages.section3.item1}</li>
                  <li>{messages.section3.item2}</li>
                  <li>{messages.section3.item3}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

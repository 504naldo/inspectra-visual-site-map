import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Award, Sparkles, BookOpen } from "lucide-react";

interface Step {
  title: string;
  desc: string;
  action: string;
}

interface DemoWalkthroughProps {
  onStepChange?: (stepIndex: number) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  setPage: (page: string) => void;
}

export default function DemoWalkthrough({ onStepChange, activeRole, setActiveRole, setPage }: DemoWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const steps: Step[] = [
    {
      title: "1. Select a Building",
      desc: "Begin by verifying the target facility. We are currently operating at 'Harbour View Apartments' on Vancouver's life-safety registry.",
      action: "Select 'Harbour View Apartments' in the header profile."
    },
    {
      title: "2. Open Visual Site Map",
      desc: "Switch to the 'Visual Site Map' in the main navigation. This displays interactive blueprint-style schematics for all 6 floors.",
      action: "Click 'Visual Site Map' in the main sidebar."
    },
    {
      title: "3. Run Automated Sweep",
      desc: "Simulate a technician's inspection sweep by clicking 'RUN SWEEP'. The system will ping untested nodes on the map and log telemetry results.",
      action: "Click 'RUN SWEEP' in the top header to start testing."
    },
    {
      title: "4. Log a Deficiency",
      desc: "When a node fails or reports a warning, click its pin on the map. In the action panel, click 'Mark Fail' or 'Deficiency' to trigger the NFPA compliance modal.",
      action: "Select a device, click 'Mark Fail', fill the details, and click 'Commit'."
    },
    {
      title: "5. Convert to Quote Item",
      desc: "Open the 'Quotes' section. Deficiencies logged with 'Auto-Generate Quote' enabled are instantly compiled into pricing items with mock labor and material estimates.",
      action: "Click 'Quotes' in the sidebar to review generated quotes."
    },
    {
      title: "6. Property Manager Portal",
      desc: "Switch your role to 'Property Manager'. See a clean, simplified compliance dashboard, approve repair quotes, and download client-ready PDF inspection reports.",
      action: "Toggle 'Property Manager' role in the header selector."
    },
    {
      title: "7. Emergency View (Gov Mode)",
      desc: "Switch to 'Government / Fire Department' role. The map dynamically filters out normal clutter, showing only fire access routes, shutoffs, risers, and emergency profiles.",
      action: "Toggle 'Government' role and view the purple-highlighted emergency assets."
    },
    {
      title: "8. Municipal Sharing Controls",
      desc: "Open 'Municipal Sharing'. Toggle exactly what emergency-response data is shared with municipal fire departments versus what private business records remain protected.",
      action: "Click 'Municipal Sharing' in the sidebar to customize privacy settings."
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      applyStepActions(next);
      if (onStepChange) onStepChange(next);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      applyStepActions(prev);
      if (onStepChange) onStepChange(prev);
    }
  };

  const applyStepActions = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        setPage("map");
        break;
      case 4:
        setPage("quotes");
        setActiveRole("fire_company");
        break;
      case 5:
        setPage("dashboard");
        setActiveRole("property_manager");
        break;
      case 6:
        setPage("map");
        setActiveRole("government");
        break;
      case 7:
        setPage("sharing");
        break;
      default:
        break;
    }
  };

  if (minimized) {
    return (
      <button 
        onClick={() => setMinimized(false)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-cyan-950/95 border border-cyan-500 text-cyan-400 font-mono text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-900 transition-all flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4 animate-pulse" />
        <span>OPEN_GUIDED_DEMO_WALKTHROUGH</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px] bg-slate-950/95 border border-cyan-500/40 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] font-mono text-xs text-cyan-400 flex flex-col gap-3 hud-corners">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>SaaS_DEMO_COCKPIT</span>
        </div>
        <button onClick={() => setMinimized(true)} className="text-slate-500 hover:text-cyan-400 text-[10px] uppercase font-bold">
          [HIDE]
        </button>
      </div>

      {/* Step Detail */}
      <div className="flex flex-col gap-1.5 min-h-[110px]">
        <h4 className="font-bold text-cyan-300 uppercase tracking-wide text-[11px]">{steps[currentStep].title}</h4>
        <p className="text-slate-400 text-[10px] leading-relaxed">{steps[currentStep].desc}</p>
        
        {/* Suggested Action Box */}
        <div className="mt-2 p-2 bg-cyan-950/30 border border-cyan-500/10 text-[9px] text-cyan-400/90 leading-normal">
          <strong className="text-cyan-400 font-bold">SUGGESTED_ACTION:</strong> {steps[currentStep].action}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-cyan-500/10 pt-2.5">
        <span className="text-[10px] text-slate-500 font-bold">
          STEP {currentStep + 1} OF {steps.length}
        </span>
        <div className="flex gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="h-7 w-7 rounded-none border border-cyan-500/10 hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext} 
            disabled={currentStep === steps.length - 1}
            className="h-7 w-7 rounded-none border border-cyan-500/10 hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

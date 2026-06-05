import React from "react";
import { SetupStep } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle2, Circle, ArrowRight, Layers, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface SetupWizardViewProps {
  steps: SetupStep[];
  onToggleStep?: (stepId: number) => void;
  activeRole: string;
}

export default function SetupWizardView({ steps, onToggleStep, activeRole }: SetupWizardViewProps) {
  
  const completedSteps = steps.filter((s) => s.status === "completed").length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  const handleToggle = (stepId: number) => {
    if (activeRole !== "fire_company") {
      toast.error("ACCESS DENIED", {
        description: "ONLY FIRE PROTECTION COMPANY TECHNICIANS CAN MODIFY BUILDING SETUP STEPS."
      });
      return;
    }
    if (onToggleStep) {
      onToggleStep(stepId);
    }
  };

  const handleSimulateIntegration = () => {
    toast.success("CAD SCHEMATIC CALIBRATION", {
      description: "SYNCHRONIZING CAD COORDINATES WITH MAP_CANVAS ENGINE..."
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/10 pb-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-500" />
            <span>BUILDING_ONBOARDING_SETUP_WIZARD</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase mt-1">Deploy, calibrate, and certify new digital blueprint mapping sites</p>
        </div>

        {/* Progress summary */}
        <div className="flex items-center gap-4 bg-slate-950/40 p-3 border border-cyan-500/10 min-w-[240px] font-mono text-xs">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold">
              <span>DEPLOYMENT_PROGRESS:</span>
              <span className="text-cyan-400">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-1 bg-slate-900 border border-cyan-500/10" />
          </div>
          <div className="text-right border-l border-cyan-500/10 pl-3">
            <span className="text-[9px] text-slate-500 uppercase">STEPS:</span>
            <p className="text-cyan-300 font-bold text-sm">{completedSteps} / {steps.length}</p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="p-4 bg-slate-900/30 border border-cyan-500/15 text-[10px] leading-relaxed text-slate-400 font-mono flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-400 uppercase">TECHNICIAN DEPLOYMENT ENGINE:</strong>
          <p className="mt-1">
            Follow this 10-step checklist to configure a building's digital blueprint system. 
            Once all steps are marked complete, the building's profile status changes to <strong className="text-emerald-400">COMPLIANT</strong>, and compliance sharing locks are activated.
          </p>
        </div>
      </div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {steps.map((step) => {
          const isDone = step.status === "completed";
          const isCurrent = step.status === "current";
          return (
            <div 
              key={step.id} 
              onClick={() => handleToggle(step.id)}
              className={`border p-4 flex gap-3 items-start transition-all cursor-pointer select-none hud-corners ${
                isDone 
                  ? "border-emerald-500/20 bg-emerald-950/5 hover:border-emerald-500/30" 
                  : isCurrent
                  ? "border-cyan-500/40 bg-cyan-950/10 hover:border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                  : "border-cyan-500/15 bg-slate-950/60 hover:border-cyan-500/25"
              }`}
            >
              {/* Checkbox Icon */}
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Circle className="w-5 h-5 text-cyan-400 animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-cyan-500/40" />
                )}
              </div>

              {/* Step details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-bold uppercase text-[10px] tracking-wider ${isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-400 font-bold' : 'text-cyan-500/60'}`}>
                    STEP_0{step.id} // {step.title.toUpperCase()}
                  </span>
                  {isDone ? (
                    <Badge className="bg-emerald-950/50 text-emerald-400 border-emerald-500/20 text-[8px] rounded-none px-1 h-4 font-bold">COMPLETED</Badge>
                  ) : isCurrent ? (
                    <Badge className="bg-cyan-950/50 text-cyan-400 border-cyan-500/20 text-[8px] rounded-none px-1 h-4 font-bold animate-pulse">ACTIVE</Badge>
                  ) : (
                    <Badge className="bg-slate-900 text-slate-500 border-slate-800 text-[8px] rounded-none px-1 h-4">PENDING</Badge>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed uppercase">{step.description}</p>
                
                {step.id === 4 && !isDone && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateIntegration();
                    }}
                    className="mt-2 h-7 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 rounded-none text-[9px] font-bold px-2.5"
                  >
                    CALIBRATE_CAD_ENGINE
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

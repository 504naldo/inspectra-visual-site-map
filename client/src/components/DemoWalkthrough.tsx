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
    // Scenario 1: Broken Smoke Detector
    {
      title: "1. Start Walkthrough",
      desc: "Welcome to the Inspectra SaaS Demo. We are currently acting as a Fire Protection Company technician at Harbour View Apartments.",
      action: "Ensure your role is set to 'Fire Company', then click Next."
    },
    {
      title: "2. Search for Device",
      desc: "We need to test a smoke detector that was reported faulty.",
      action: "Type 'SD-M-10' in the search bar on the left sidebar."
    },
    {
      title: "3. Open Device Details",
      desc: "The search filters the list. Click on the device to open its details panel.",
      action: "Click on 'SD-M-10' in the list to open the detail panel."
    },
    {
      title: "4. Mark as Failed",
      desc: "The device is physically broken and fails testing.",
      action: "Click the 'MARK_FAIL' button in the Device Details Panel."
    },
    {
      title: "5. Log Deficiency",
      desc: "The NFPA Deficiency Modal appears. We need to log the specifics.",
      action: "Select 'Critical' priority, select an NFPA code, upload a photo, check 'Auto-Generate Quote', and click 'COMMIT'."
    },
    {
      title: "6. Review Status",
      desc: "The device is now marked as FAILED in red, and the deficiency is logged.",
      action: "Notice the updated customer and internal notes, then click Next."
    },
    {
      title: "7. Switch Role: Property Manager",
      desc: "Now, let's see what the customer (Property Manager) sees.",
      action: "Change your role to 'Property Manager' using the top-right dropdown."
    },
    {
      title: "8. View Customer Dashboard",
      desc: "The customer dashboard shows high-level compliance metrics.",
      action: "Navigate to the 'Buildings' tab and observe the open deficiencies and quotes."
    },
    {
      title: "9. Open Quotes",
      desc: "The customer needs to review the quote we auto-generated for SD-M-10.",
      action: "Click on the 'Quotes' tab in the sidebar."
    },
    {
      title: "10. Approve Quote",
      desc: "The quote details the labor and material costs to replace the smoke detector.",
      action: "Click 'APPROVE_QUOTE' on quote Q-2026-1047."
    },
    {
      title: "11. Switch Role: Fire Company",
      desc: "Back to the technician view to see the approved quote.",
      action: "Change your role back to 'Fire Company'."
    },
    {
      title: "12. Verify Resolution",
      desc: "The quote is approved, meaning the work order is authorized.",
      action: "Notice the quote status is APPROVED. Click Next."
    },

    // Scenario 2: Leaking Sprinkler Supervisory Switch
    {
      title: "13. Navigate to Parkade",
      desc: "Next scenario: A leaking sprinkler valve in the basement.",
      action: "Go to the 'Visual Site Map' and select 'Parkade P1' from the floor dropdown."
    },
    {
      title: "14. Search for Sprinkler Valve",
      desc: "Find the specific supervisory switch.",
      action: "Type 'SUPV-D-01' in the search bar."
    },
    {
      title: "15. Open Device Details",
      desc: "Click the device to view its details.",
      action: "Click 'SUPV-D-01' in the list."
    },
    {
      title: "16. Log Warning Deficiency",
      desc: "The valve is leaking but hasn't failed completely yet.",
      action: "Click the 'DEFICIENCY' button (Warning, not Fail)."
    },
    {
      title: "17. Submit Deficiency",
      desc: "Log the leak details.",
      action: "Select 'Medium' priority, upload a photo, and click 'COMMIT'."
    },
    {
      title: "18. Switch Role: Government",
      desc: "Let's see how the Fire Department views this building.",
      action: "Change your role to 'Government / Fire Department'."
    },
    {
      title: "19. View Emergency Assets",
      desc: "The map filters out standard devices and only highlights critical emergency assets in high-contrast purple.",
      action: "Observe the Emergency View on the map."
    },
    {
      title: "20. Inspect FACP",
      desc: "The Fire Department needs to check the main Fire Alarm Control Panel.",
      action: "Click the 'FACP-M-01' node on the map."
    },
    {
      title: "21. Switch Role: Fire Company",
      desc: "Return to the technician view to finish the setup.",
      action: "Change your role back to 'Fire Company'."
    },
    {
      title: "22. Complete Setup Wizard",
      desc: "The building setup is almost complete.",
      action: "Go to the 'Setup Wizard' tab and click 'STEP_06' to complete the onboarding."
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
      case 0:
        setActiveRole("fire_company");
        break;
      case 1:
        setPage("map");
        break;
      case 6:
        setActiveRole("property_manager");
        break;
      case 7:
        setPage("buildings");
        break;
      case 8:
        setPage("quotes");
        break;
      case 10:
        setActiveRole("fire_company");
        break;
      case 12:
        setPage("map");
        break;
      case 17:
        setActiveRole("government");
        setPage("map");
        break;
      case 20:
        setActiveRole("fire_company");
        break;
      case 21:
        setPage("setup");
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
      <div className="flex flex-col gap-1.5 min-h-[120px]">
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

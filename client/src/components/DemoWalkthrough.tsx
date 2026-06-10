import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, CheckCircle2, Award, Sparkles, BookOpen } from "lucide-react";
import { Quote, Device } from "@/lib/mock-data";

interface Step {
  title: string;
  desc: string;
  action: string;
}

interface DemoWalkthroughProps {
  currentStep: number;
  onSetStep: (step: number) => void;
  completed: boolean;
  onSetCompleted: (completed: boolean) => void;
  activeRole: string;
  onSetRole: (role: string) => void;
  activePage: string;
  onSetPage: (page: string) => void;
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string | null) => void;
  activeFloor: string;
  onSetFloor: (floor: string) => void;
  quotes: Quote[];
}

export default function DemoWalkthrough({
  currentStep,
  onSetStep,
  completed,
  onSetCompleted,
  activeRole,
  onSetRole,
  activePage,
  onSetPage,
  devices,
  selectedDeviceId,
  onSelectDevice,
  activeFloor,
  onSetFloor,
  quotes
}: DemoWalkthroughProps) {
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
      desc: "This device is broken. Let's mark it as failed to trigger the compliance repair workflow.",
      action: "Click the 'MARK FAIL' button in the device detail panel."
    },
    {
      title: "5. Log Deficiency details",
      desc: "A compliance modal opens. Fill in the NFPA reference code, plain-language customer notes, recommended repair, and simulate a photo attachment.",
      action: "Click 'SUBMIT_DEFICIENCY' to log the issue."
    },
    {
      title: "6. Check Auto-Generated Items",
      desc: "Notice how the system logged the deficiency, split notes into internal technician and public customer fields, and automatically added a quote item.",
      action: "Click Next to transition to the Property Manager perspective."
    },
    {
      title: "7. Switch Role to Customer",
      desc: "Let's see what the building manager sees on their client portal.",
      action: "Change the 'Role' in the top-right header to 'Property Manager'."
    },
    {
      title: "8. View Customer Dashboard",
      desc: "The Property Manager console is clean and business-grade, showing 1 open critical deficiency and 1 outstanding repair quote.",
      action: "Click the 'Repair Quotes' icon ($) in the left sidebar navigation."
    },
    {
      title: "9. Review Quote Estimator",
      desc: "Review Quote Q-2026-1047. Notice how the labor and material costs were auto-estimated from our deficiency submission.",
      action: "Review the pricing breakdown, then click Next."
    },
    {
      title: "10. Authorize Repairs",
      desc: "The Property Manager can sign and authorize repairs instantly. Let's approve the quote.",
      action: "Click 'APPROVE_QUOTE' inside the quote card."
    },
    {
      title: "11. Switch back to Technician",
      desc: "The repairs are authorized! Let's switch back to our technician role to complete the inspection.",
      action: "Change the 'Role' in the top-right header back to 'Fire Company'."
    },
    {
      title: "12. View Resolved Status",
      desc: "Because the quote was approved, the device SD-M-10 is automatically resolved back to green/compliant status!",
      action: "Click Next to start Scenario 2."
    },

    // Scenario 2: Leaking Sprinkler Supervisory Switch
    {
      title: "13. Switch to Parkade Blueprint",
      desc: "Scenario 2: Let's inspect the dry system room in the basement parkade.",
      action: "Select 'Parkade P1' from the Floor Selector in the top header."
    },
    {
      title: "14. Search for Supervisory Switch",
      desc: "We need to check the OS&Y control valve supervisor switch.",
      action: "Type 'SUPV-D-01' in the search bar on the left sidebar."
    },
    {
      title: "15. Open Switch Details",
      desc: "Click on the supervisory switch to inspect its current parameters.",
      action: "Click on 'SUPV-D-01' in the sidebar list."
    },
    {
      title: "16. Log Minor Deficiency",
      desc: "The switch is operational but has a slow drip leak. Let's mark it as a minor deficiency (warning) instead of a complete failure.",
      action: "Click the 'DEFICIENCY' (Warning) button in the detail panel."
    },
    {
      title: "17. Submit Warning details",
      desc: "Fill in the warning details: Priority level 'Low', and recommended repair 'Tighten gland nut'.",
      action: "Click 'SUBMIT_DEFICIENCY' to register the warning."
    },
    {
      title: "18. Switch to Government Inspector",
      desc: "Let's see how the local Fire Department or Municipal Inspector views this building's data.",
      action: "Change the 'Role' in the top-right header to 'Government / FD'."
    },
    {
      title: "19. Government Emergency View",
      desc: "The Fire Department view is high-contrast, hiding minor devices (smoke detectors, lights) and highlighting critical emergency response assets (FACP, FDC, Lockbox, Risers) in glowing purple.",
      action: "Notice the glowing purple assets, then click Next."
    },
    {
      title: "20. Inspect Fire Alarm Panel",
      desc: "Government inspectors can click on the main Fire Alarm Panel to view real-time system status and emergency contacts.",
      action: "Click on the 'FACP-001' node in the Main Electrical Room area of the Main Floor (switch back to Main Floor first if needed)."
    },
    {
      title: "21. Return to Fire Company",
      desc: "Let's switch back to the Fire Company to review our onboarding checklist.",
      action: "Change the 'Role' in the top-right header back to 'Fire Company'."
    },
    {
      title: "22. Review Setup Progress",
      desc: "Let's check the onboarding checklist progress for this building to complete our demo.",
      action: "Click the 'Setup Wizard' icon (Settings) in the left sidebar."
    }
  ];

  const handleStart = () => {
    onSetStep(1);
    onSetCompleted(false);
    onSetRole("fire_company");
    onSetPage("map");
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const next = currentStep + 1;
      onSetStep(next);
      
      // Auto-drive state transitions to make the walkthrough seamless
      if (next === 7) {
        onSetRole("property_manager");
        onSetPage("buildings");
      } else if (next === 8) {
        onSetPage("buildings");
      } else if (next === 9) {
        onSetPage("quotes");
      } else if (next === 11) {
        onSetRole("fire_company");
        onSetPage("map");
      } else if (next === 12) {
        onSetPage("map");
      } else if (next === 13) {
        onSetFloor("Parkade P1");
      } else if (next === 18) {
        onSetRole("government");
        onSetPage("map");
      } else if (next === 20) {
        onSetFloor("Main Floor");
        onSelectDevice("FACP-001");
      } else if (next === 21) {
        onSetRole("fire_company");
        onSetPage("map");
      } else if (next === 22) {
        onSetPage("setup");
      }
    } else {
      onSetCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      onSetStep(prev);

      if (prev === 6) {
        onSetRole("fire_company");
        onSetPage("map");
      } else if (prev === 8) {
        onSetPage("buildings");
      } else if (prev === 10) {
        onSetRole("property_manager");
        onSetPage("quotes");
      } else if (prev === 12) {
        onSetFloor("Main Floor");
      } else if (prev === 17) {
        onSetRole("fire_company");
        onSetPage("map");
      } else if (prev === 21) {
        onSetRole("government");
        onSetPage("map");
      }
    }
  };

  const handleClose = () => {
    onSetStep(0);
    onSetCompleted(false);
  };

  if (currentStep === 0) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button 
          onClick={handleStart}
          className="rounded-none bg-cyan-950 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold px-4 py-6 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-bounce flex items-center gap-2"
        >
          <Play className="w-4 h-4 text-cyan-400" />
          <span>START_GUIDED_DEMO</span>
        </Button>
      </div>
    );
  }

  const activeStep = steps[currentStep - 1];

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-slate-950 border border-cyan-500 font-mono text-xs text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      {/* Title Bar */}
      <div className="border-b border-cyan-500/20 bg-slate-900/60 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-cyan-300">DEMO_GUIDE // STEP_{currentStep}_OF_{steps.length}</span>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-500 hover:text-cyan-400 font-bold w-9 h-9 flex items-center justify-center -mr-1.5"
        >
          [X]
        </button>
      </div>

      {/* Content Area */}
      {!minimized && (
        <div className="p-4 space-y-3.5">
          {completed ? (
            <div className="text-center py-6 space-y-4">
              <Award className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-400 uppercase">Demo Completed!</h4>
                <p className="text-slate-500 text-[10px] uppercase">You have successfully explored the Inspectra multi-role SaaS platform workflows.</p>
              </div>
              <Button 
                onClick={handleClose}
                className="rounded-none bg-emerald-950 border border-emerald-500 text-emerald-400 hover:bg-emerald-900 font-bold text-[11px] h-10 px-4"
              >
                CLOSE_WIDGET
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase">{activeStep.title}</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed uppercase">{activeStep.desc}</p>
              </div>

              <div className="border border-dashed border-cyan-500/20 bg-cyan-500/5 p-3 rounded-none">
                <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">REQUIRED_ACTION:</span>
                <p className="text-cyan-300 font-bold uppercase leading-relaxed text-[10px]">{activeStep.action}</p>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center pt-2 border-t border-cyan-500/10">
                <Button 
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 h-10 px-3 text-[11px]"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span>PREV</span>
                </Button>

                <Button 
                  onClick={handleNext}
                  className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold h-10 px-4 text-[11px] shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                >
                  <span>{currentStep === steps.length ? "COMPLETE" : "NEXT"}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

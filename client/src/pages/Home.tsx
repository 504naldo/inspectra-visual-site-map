import React, { useState, useEffect, useRef } from "react";
import { 
  MOCK_DEVICES, MOCK_REPORTS, MOCK_QUOTES, DEFAULT_MUNICIPAL_SHARING, MOCK_SETUP_STEPS,
  Device, DeviceStatus, FLOORS, Report, Quote, MunicipalSharingSettings, SetupStep,
  MOCK_BUILDINGS
} from "@/lib/mock-data";
import MapCanvas from "@/components/MapCanvas";
import DeviceDetailPanel from "@/components/DeviceDetailPanel";
import DeficiencyModal from "@/components/DeficiencyModal";
import DemoWalkthrough from "@/components/DemoWalkthrough";
import ReportsView from "@/components/ReportsView";
import QuotesView from "@/components/QuotesView";
import MunicipalSharingView from "@/components/MunicipalSharingView";
import BuildingsView from "@/components/BuildingsView";
import SetupWizardView from "@/components/SetupWizardView";
import DeficienciesView from "@/components/DeficienciesView";

// New Views
import CompanyAdminView from "@/components/CompanyAdminView";
import CustomersView from "@/components/CustomersView";
import TechniciansView from "@/components/TechniciansView";
import TemplatesView from "@/components/TemplatesView";
import DeviceLibraryView from "@/components/DeviceLibraryView";
import DeficiencyLanguageView from "@/components/DeficiencyLanguageView";
import ImportDevicesView from "@/components/ImportDevicesView";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Flame, Shield, Radio, Droplets, Waves, ShieldAlert, Compass, 
  ArrowRight, Key, Search, Play, Pause, RotateCcw, LayoutDashboard, 
  Map as MapIcon, FileText, DollarSign, ShieldCheck, Sun, Moon, 
  User, Building, ShieldAlert as GovIcon, PhoneCall, AlertTriangle, Settings, CheckCircle2,
  Users, Users2, Library, FileCode, Database, ClipboardList
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  // Global App States
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [sharingSettings, setSharingSettings] = useState<MunicipalSharingSettings>(DEFAULT_MUNICIPAL_SHARING);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>(MOCK_SETUP_STEPS);
  
  // Navigation & View State
  const [activePage, setActivePage] = useState<string>("map"); 
  // "buildings" | "map" | "deficiencies" | "reports" | "quotes" | "sharing" | "setup" | "company" | "customers" | "technicians" | "templates" | "library" | "deficiency-lang" | "import"
  const [activeFloor, setActiveFloor] = useState<string>("Main Floor");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  // Multi-Role & Theme States
  const [activeRole, setActiveRole] = useState<string>("fire_company"); // "fire_company" | "property_manager" | "government"
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Deficiency Modal State
  const [isDeficiencyModalOpen, setIsDeficiencyModalOpen] = useState(false);
  const [deficiencyModalIsFailure, setDeficiencyModalIsFailure] = useState(true);

  // Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYS_SIM // INITIATING SYSTEM COCKPIT...",
    "SECURE_LINK // CONNECTED TO HARBOUR VIEW APARTMENTS LIFE-SAFETY REGISTRY.",
    "READY // LIFE-SAFETY MAPPING ENGINE STABLE."
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev, `[${timestamp}] ${msg}`].slice(-50)); // keep last 50
  };

  // Walkthrough State
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0); // 0 means not started
  const [walkthroughCompleted, setWalkthroughStepCompleted] = useState<boolean>(false);

  // Effect to apply global theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme]);

  // Handle active simulation sweep
  useEffect(() => {
    if (isSimulating) {
      addLog("SYS_SIM // AUTOMATED TELEMETRY SWEEP INITIATED.");
      toast.success("SIMULATION SWEEP ACTIVE", {
        description: "Scanning and testing devices sequentially every 1.5 seconds."
      });

      simIntervalRef.current = setInterval(() => {
        setDevices(currentDevices => {
          // Find all untested devices
          const untested = currentDevices.filter(d => d.status === "not_tested");
          if (untested.length === 0) {
            setIsSimulating(false);
            addLog("SYS_SIM // SWEEP COMPLETED. ALL REGISTERED HARDWARE COMPLIANT OR LOGGED.");
            toast.success("SWEEP COMPLETED", { description: "All devices have been inspected." });
            return currentDevices;
          }

          // Pick a random device
          const randomIndex = Math.floor(Math.random() * untested.length);
          const targetDevice = untested[randomIndex];

          // Determine random inspection outcome
          // 80% pass, 10% fail, 5% deficiency, 5% no access
          const rand = Math.random();
          let finalStatus: DeviceStatus = "passed";
          let note = "";

          if (rand > 0.95) {
            finalStatus = "no_access";
            note = "No access - Door locked / tenant away.";
          } else if (rand > 0.90) {
            finalStatus = "deficiency";
            note = "Minor dust build-up / cover cracked.";
          } else if (rand > 0.80) {
            finalStatus = "failed";
            note = "Failed battery backup load test.";
          }

          // Log the sweep event
          const statusText = finalStatus.toUpperCase();
          addLog(`SYS_SWEEP // TESTED: ${targetDevice.label} [${targetDevice.type}] -> ${statusText}`);

          // Trigger sonner toast for critical failure/deficiencies
          if (finalStatus === "failed") {
            toast.error(`ALARM // DEFICIENCY DETECTED: ${targetDevice.label}`, {
              description: `${targetDevice.type} at ${targetDevice.floor} failed test.`
            });
          } else if (finalStatus === "deficiency") {
            toast.warning(`WARNING // MINOR ISSUE: ${targetDevice.label}`, {
              description: `${targetDevice.type} needs attention.`
            });
          } else if (finalStatus === "passed") {
            toast.success(`TEST_PASS // COMPLIANT: ${targetDevice.label}`);
          }

          // Return updated device array
          return currentDevices.map(d => {
            if (d.id === targetDevice.id) {
              return {
                ...d,
                status: finalStatus,
                lastTestedAt: new Date().toISOString(),
                lastTestedBy: "R. Daniels (Tech #401)",
                deficiencyNote: note,
                serviceHistory: [
                  {
                    date: new Date().toISOString().split('T')[0],
                    action: `Simulated Inspection: ${statusText}`,
                    technician: "R. Daniels (Tech #401)"
                  },
                  ...(d.serviceHistory || [])
                ]
              };
            }
            return d;
          });
        });
      }, 1500);
    } else {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        addLog("SYS_SIM // AUTOMATED TELEMETRY SWEEP SUSPENDED.");
      }
    }

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
    };
  }, [isSimulating]);

  // Update a single device status manually
  const handleUpdateDeviceStatus = (deviceId: string, status: DeviceStatus, note?: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const statusText = status.toUpperCase();
        addLog(`SYS_MANUAL // UPDATE: ${d.label} [${d.type}] -> ${statusText}`);
        
        return {
          ...d,
          status,
          lastTestedAt: new Date().toISOString(),
          lastTestedBy: "R. Daniels (Tech #401)",
          deficiencyNote: note || d.deficiencyNote,
          serviceHistory: [
            {
              date: new Date().toISOString().split('T')[0],
              action: `Manual Update: Marked ${statusText}`,
              technician: "R. Daniels (Tech #401)"
            },
            ...(d.serviceHistory || [])
          ]
        };
      }
      return d;
    }));
  };

  // Open deficiency modal
  const handleTriggerDeficiencyModal = (isFailure: boolean) => {
    setDeficiencyModalIsFailure(isFailure);
    setIsDeficiencyModalOpen(true);
  };

  // Submit deficiency from modal
  const handleAddDeficiency = (data: {
    priority: "low" | "medium" | "high" | "critical";
    description: string;
    nfpaCode: string;
    recommendedRepair: string;
    photoUrl?: string;
    autoGenerateQuote: boolean;
    autoGenerateReport: boolean;
  }) => {
    if (!selectedDeviceId) return;

    const targetDevice = devices.find(d => d.id === selectedDeviceId);
    if (!targetDevice) return;

    const status: DeviceStatus = deficiencyModalIsFailure ? "failed" : "deficiency";

    // Update devices array with detailed notes
    setDevices(prev => prev.map(d => {
      if (d.id === selectedDeviceId) {
        return {
          ...d,
          status,
          lastTestedAt: new Date().toISOString(),
          lastTestedBy: "R. Daniels (Tech #401)",
          deficiencyNote: data.description,
          customerNotes: `[NFPA COMPLIANCE DEFICIENCY] - ${data.description}. Recommended repair: ${data.recommendedRepair}. Standard: ${data.nfpaCode}.`,
          technicianNotes: `Internal Tech Note: Priority ${data.priority.toUpperCase()}. ${data.recommendedRepair}.`,
          photoUrl: data.photoUrl,
          deficiencyHistory: [
            {
              id: `DEF-${Date.now()}`,
              loggedAt: new Date().toISOString().split('T')[0],
              resolved: false,
              priority: data.priority,
              description: data.description,
              recommendedRepair: data.recommendedRepair
            },
            ...(d.deficiencyHistory || [])
          ]
        };
      }
      return d;
    }));

    addLog(`DEFICIENCY_LOGGED // DEVICE: ${targetDevice.label} // PRIORITY: ${data.priority.toUpperCase()} // NFPA: ${data.nfpaCode}`);

    // Optionally auto-generate Quote Item
    if (data.autoGenerateQuote) {
      const labourCost = data.priority === "critical" || data.priority === "high" ? 180 : 90;
      const materialCost = targetDevice.type === "Smoke Detector" ? 120 : 
                           targetDevice.type === "Sprinkler Riser" ? 450 : 75;

      const newQuoteItem = {
        id: `QI-${Date.now()}`,
        deviceId: targetDevice.id,
        deviceLabel: targetDevice.label,
        description: data.recommendedRepair,
        labourCost,
        materialCost,
        qty: 1
      };

      setQuotes(prev => prev.map(q => {
        if (q.id === "Q-2026-1047") { // Target active demo quote
          return {
            ...q,
            status: "Awaiting Approval",
            items: [...q.items, newQuoteItem]
          };
        }
        return q;
      }));

      addLog(`QUOTE_GEN // APPENDED REPAIR ESTIMATE TO Q-2026-1047.`);
    }

    // Optionally auto-generate Compliance Report
    if (data.autoGenerateReport) {
      setReports(prev => prev.map(r => {
        if (r.id === "RPT-2026-0614-HVA") {
          return {
            ...r,
            status: "Ready for Review"
          };
        }
        return r;
      }));
      addLog(`REPORT_GEN // RE-DRAFTED COMPLIANCE REPORT RPT-2026-0614-HVA.`);
    }

    toast.success("DEFICIENCY REGISTERED", {
      description: `Successfully logged ${status.toUpperCase()} on device ${targetDevice.label}.`
    });

    setIsDeficiencyModalOpen(false);
  };

  // PM Approve Quote
  const handleApproveQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        addLog(`QUOTE_APPROVED // CUSTOMER SIGN-OFF ON QUOTE: ${q.quoteNumber}`);
        toast.success("QUOTE APPROVED", {
          description: `Quote ${q.quoteNumber} has been signed and authorized for dispatch.`
        });

        // Auto-resolve devices associated with this quote
        const deviceIdsToResolve = q.items.map(item => item.deviceId);
        setDevices(currDevices => currDevices.map(d => {
          if (deviceIdsToResolve.includes(d.id)) {
            addLog(`RESOLVED // REPAIR DISPATCHED FOR DEVICE: ${d.label}`);
            return {
              ...d,
              status: "passed", // resolve back to pass
              deficiencyNote: undefined
            };
          }
          return d;
        }));

        return { ...q, status: "Approved" };
      }
      return q;
    }));
  };

  // Toggle Setup Step
  const handleToggleSetupStep = (stepId: number) => {
    setSetupSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const newStatus = s.status === "completed" ? "pending" : "completed";
        addLog(`SETUP_WIZARD // TOGGLED STEP ${s.id}: ${newStatus.toUpperCase()}`);
        return { ...s, status: newStatus as any };
      }
      return s;
    }));
  };

  // Reset simulation back to defaults
  const handleResetSimulation = () => {
    setDevices(MOCK_DEVICES);
    setReports(MOCK_REPORTS);
    setQuotes(MOCK_QUOTES);
    setSharingSettings(DEFAULT_MUNICIPAL_SHARING);
    setSetupSteps(MOCK_SETUP_STEPS);
    setSelectedDeviceId(null);
    setIsSimulating(false);
    addLog("SYS_RESET // ALL DEVICES AND TELEMETRY LOGS FLUSHED.");
    toast.info("DATA FLUSHED", { description: "Simulation data reset to default states." });
  };

  // Calculations for Dashboards
  const totalCount = devices.length;
  const passedCount = devices.filter(d => d.status === "passed").length;
  const failedCount = devices.filter(d => d.status === "failed").length;
  const warningCount = devices.filter(d => d.status === "deficiency").length;
  const untestedCount = devices.filter(d => d.status === "not_tested").length;
  const testedCount = totalCount - untestedCount;
  const compliancePercentage = totalCount > 0 ? Math.round(((passedCount) / totalCount) * 100) : 100;

  // Render the proper active page view
  const renderActivePageContent = () => {
    switch (activePage) {
      case "buildings":
        return (
          <BuildingsView 
            buildings={MOCK_BUILDINGS} 
            onSelectBuilding={(bldId) => {
              addLog(`BUILDING_SWITCHED // LOADED Blueprints for: ${bldId}`);
              setActivePage("map");
            }} 
            activeRole={activeRole}
          />
        );
      case "map":
        return (
          <div className="flex-1 flex min-h-0">
            {/* Sidebar List */}
            <div className="w-80 border-r border-cyan-500/20 bg-slate-950/80 p-4 flex flex-col h-full font-mono text-xs text-cyan-400 gap-4">
              {/* Search & Filters */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cyan-500/50" />
                  <Input 
                    placeholder="SEARCH_HARDWARE_TAG..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-900 border-cyan-500/20 text-cyan-400 placeholder:text-slate-600 rounded-none h-9 text-xs focus-visible:ring-cyan-500/50 uppercase animate-pulse"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-slate-900 border border-cyan-500/20 p-1.5 text-[10px] text-cyan-400 font-mono rounded-none uppercase focus:ring-cyan-500/30"
                  >
                    <option value="all">ALL_CATEGORIES</option>
                    <option value="Detection & Control">DETECTION</option>
                    <option value="Notification">NOTIFICATION</option>
                    <option value="Suppression">SUPPRESSION</option>
                    <option value="Egress & Lighting">EGRESS</option>
                    <option value="Access & Utilities">UTILITIES</option>
                  </select>

                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-cyan-500/20 p-1.5 text-[10px] text-cyan-400 font-mono rounded-none uppercase focus:ring-cyan-500/30"
                  >
                    <option value="all">ALL_STATUSES</option>
                    <option value="passed">PASSED</option>
                    <option value="failed">FAILED</option>
                    <option value="deficiency">DEFICIENCY</option>
                    <option value="not_tested">PENDING</option>
                  </select>
                </div>
              </div>

              {/* Devices List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {devices
                  .filter(d => {
                    const matchesSearch = d.label.toLowerCase().includes(searchQuery.toLowerCase()) || d.type.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCat = categoryFilter === "all" || d.category === categoryFilter;
                    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
                    const matchesFloor = d.floor === activeFloor;
                    
                    // Government Emergency Filter
                    if (activeRole === "government") {
                      const isEmergency = [
                        "Fire Alarm Panel", "Annunciator", "FDC", "Sprinkler Riser", 
                        "Lockbox", "Roof Access", "Electrical Shutoff", "GasShutoff", "Standpipe", "Smoke Control Panel"
                      ].includes(d.type);
                      return matchesSearch && matchesCat && matchesStatus && matchesFloor && isEmergency;
                    }

                    return matchesSearch && matchesCat && matchesStatus && matchesFloor;
                  })
                  .map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => setSelectedDeviceId(dev.id)}
                      className={`w-full p-2.5 border text-left flex items-center justify-between gap-3 transition-colors ${
                        selectedDeviceId === dev.id 
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                          : "bg-slate-900/30 border-cyan-500/10 hover:bg-cyan-500/5"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-bold uppercase tracking-wider block truncate">{dev.label}</span>
                        <span className="text-[9px] text-slate-500 uppercase block truncate">{dev.type}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-none">
                        <span className={`w-2 h-2 rounded-full ${
                          dev.status === "passed" ? "bg-emerald-500" :
                          dev.status === "failed" ? "bg-rose-500 animate-pulse" :
                          dev.status === "deficiency" ? "bg-amber-500" :
                          dev.status === "testing" ? "bg-cyan-500 animate-pulse" :
                          "bg-slate-700"
                        }`} />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Map Canvas Workspace */}
            <MapCanvas 
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={(id) => setSelectedDeviceId(id)}
              activeFloor={activeFloor}
              activeRole={activeRole}
              theme={theme}
            />

            {/* Device Detail Panel */}
            <DeviceDetailPanel 
              device={devices.find(d => d.id === selectedDeviceId) || null}
              onClose={() => setSelectedDeviceId(null)}
              onUpdateStatus={handleUpdateDeviceStatus}
              onTriggerDeficiencyModal={handleTriggerDeficiencyModal}
              activeRole={activeRole}
            />
          </div>
        );
      case "deficiencies":
        return (
          <DeficienciesView 
            devices={devices} 
            onSelectDevice={(id) => {
              setSelectedDeviceId(id);
              setActivePage("map");
            }}
            activeRole={activeRole}
          />
        );
      case "reports":
        return <ReportsView reports={reports} activeRole={activeRole} />;
      case "quotes":
        return <QuotesView quotes={quotes} onApproveQuote={handleApproveQuote} activeRole={activeRole} />;
      case "sharing":
        return <MunicipalSharingView settings={sharingSettings} onUpdateSettings={(updated) => setSharingSettings(updated)} />;
      case "setup":
        return <SetupWizardView steps={setupSteps} onToggleStep={handleToggleSetupStep} activeRole={activeRole} />;
      
      // NEW VIEW CASES
      case "company":
        return <CompanyAdminView />;
      case "customers":
        return (
          <CustomersView 
            onOpenCustomerPortal={(custName) => {
              addLog(`PORTAL_SIM // SIMULATING CUSTOMER ACCESS PORTAL: ${custName.toUpperCase()}`);
              setActiveRole("property_manager");
              setActivePage("buildings");
              toast.success("CUSTOMER PORTAL ACTIVE", {
                description: `Switched view role to Property Manager for Harbour View Property Management.`
              });
            }} 
          />
        );
      case "technicians":
        return <TechniciansView />;
      case "templates":
        return <TemplatesView />;
      case "library":
        return <DeviceLibraryView />;
      case "deficiency-lang":
        return <DeficiencyLanguageView />;
      case "import":
        return (
          <ImportDevicesView 
            onImportComplete={(importedCount) => {
              addLog(`IMPORT_SUCCESS // BULK REGISTERED ${importedCount} ASSETS INTO SYSTEM DATABASE.`);
            }} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-cyan-400 font-mono select-none selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Top Header Panel */}
      <header className="h-16 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between z-30 shrink-0">
        
        {/* Left: Branding & Portfolio Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-950 border border-cyan-500/40 rounded-none shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase leading-none">INSPECTRA_VISUAL</h1>
              <span className="text-[9px] text-slate-500 tracking-wider uppercase font-bold mt-1 block">LIFE-SAFETY_MAPPING_OS</span>
            </div>
          </div>

          {/* Building Portfolio Badge */}
          <div className="h-8 w-px bg-cyan-500/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 border border-cyan-500/10 px-3 py-1.5">
            <Building className="w-4 h-4 text-cyan-500" />
            <div className="text-left">
              <span className="text-[8px] text-slate-500 uppercase leading-none font-bold block">ACTIVE_BUILDING:</span>
              <span className="text-[10px] text-cyan-300 font-bold uppercase leading-none">HARBOUR VIEW APARTMENTS</span>
            </div>
          </div>
        </div>

        {/* Center-Right: Quick Counters */}
        <div className="hidden lg:flex items-center gap-4 text-[10px]">
          <div className="bg-slate-900/30 border border-cyan-500/10 px-3 py-1 text-center min-w-[80px]">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">DEVICES</span>
            <span className="text-cyan-300 font-bold text-sm">{totalCount}</span>
          </div>
          <div className="bg-slate-900/30 border border-cyan-500/10 px-3 py-1 text-center min-w-[80px]">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">TESTED</span>
            <span className="text-cyan-300 font-bold text-sm">{testedCount}</span>
          </div>
          <div className="bg-slate-900/30 border border-cyan-500/10 px-3 py-1 text-center min-w-[80px]">
            <span className="text-slate-500 text-[8px] uppercase font-bold block">COMPLIANCE</span>
            <span className={`font-bold text-sm ${compliancePercentage > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {compliancePercentage}%
            </span>
          </div>
        </div>

        {/* Right Side: Role Selector, Floor dropdown, Theme, Sweep */}
        <div className="flex items-center gap-3">
          
          {/* Floor selector (only visible on map view) */}
          {activePage === "map" && (
            <select 
              value={activeFloor} 
              onChange={(e) => setActiveFloor(e.target.value)}
              className="bg-slate-900 border border-cyan-500/30 px-3 py-1.5 text-xs text-cyan-400 font-mono rounded-none uppercase focus:ring-cyan-500/40"
            >
              {FLOORS.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
          )}

          {/* Role selector dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/50 border border-cyan-500/20 px-2 py-1.5">
            <User className="w-3.5 h-3.5 text-cyan-500" />
            <select 
              value={activeRole} 
              onChange={(e) => {
                setActiveRole(e.target.value);
                addLog(`ROLE_CHANGED // SWITCHED TO: ${e.target.value.toUpperCase()}`);
                toast.info("ROLE SWITCHED", { description: `Operating as ${e.target.value.replace("_", " ")}.` });
              }}
              className="bg-transparent border-none text-[10px] text-cyan-400 font-mono rounded-none uppercase focus:ring-0 focus-visible:ring-0 p-0"
            >
              <option value="fire_company">Fire Company</option>
              <option value="property_manager">Property Manager</option>
              <option value="government">Government / FD</option>
            </select>
          </div>

          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
            className="h-9 w-9 rounded-none border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Sweep Trigger (only visible on map view for fire_company) */}
          {activePage === "map" && activeRole === "fire_company" && (
            <Button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`h-9 rounded-none text-xs font-bold px-4 flex items-center gap-2 ${
                isSimulating 
                  ? "bg-rose-950/60 hover:bg-rose-900 border border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse" 
                  : "bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? "STOP_SWEEP" : "RUN_SWEEP"}</span>
            </Button>
          )}

          {/* Master Reset Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleResetSimulation}
            className="h-9 w-9 rounded-none border border-cyan-500/20 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"
            title="Reset Simulation Data"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Navigation Sidebar */}
        <aside className="w-16 border-r border-cyan-500/20 bg-slate-950/95 flex flex-col items-center py-4 gap-3 z-20 shrink-0 overflow-y-auto">
          
          {/* Standard Navigation */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("buildings")}
            className={`h-10 w-10 rounded-none border ${activePage === "buildings" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Buildings Portfolio"
          >
            <Building className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("map")}
            className={`h-10 w-10 rounded-none border ${activePage === "map" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Visual Site Map"
          >
            <MapIcon className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("deficiencies")}
            className={`h-10 w-10 rounded-none border ${activePage === "deficiencies" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Deficiencies Registry"
          >
            <AlertTriangle className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("reports")}
            className={`h-10 w-10 rounded-none border ${activePage === "reports" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Compliance Reports"
          >
            <FileText className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("quotes")}
            className={`h-10 w-10 rounded-none border ${activePage === "quotes" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Repair Quotes"
          >
            <DollarSign className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("sharing")}
            className={`h-10 w-10 rounded-none border ${activePage === "sharing" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Municipal Data Sharing"
          >
            <ShieldCheck className="w-5 h-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setActivePage("setup")}
            className={`h-10 w-10 rounded-none border ${activePage === "setup" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
            title="Setup/Onboarding Wizard"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* FIRE COMPANY SPECIFIC NAVIGATION SEPARATOR */}
          {activeRole === "fire_company" && (
            <>
              <div className="w-8 h-px bg-cyan-500/10 my-1" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("company")}
                className={`h-10 w-10 rounded-none border ${activePage === "company" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Company Profile & Team"
              >
                <Users2 className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("customers")}
                className={`h-10 w-10 rounded-none border ${activePage === "customers" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Client Management"
              >
                <Users className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("technicians")}
                className={`h-10 w-10 rounded-none border ${activePage === "technicians" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Technician Metrics"
              >
                <ClipboardList className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("templates")}
                className={`h-10 w-10 rounded-none border ${activePage === "templates" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Inspection Checklists"
              >
                <FileText className="w-5 h-5 text-cyan-500/80" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("library")}
                className={`h-10 w-10 rounded-none border ${activePage === "library" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Device Library"
              >
                <Library className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("deficiency-lang")}
                className={`h-10 w-10 rounded-none border ${activePage === "deficiency-lang" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="Deficiency Language Library"
              >
                <FileCode className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setActivePage("import")}
                className={`h-10 w-10 rounded-none border ${activePage === "import" ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300' : 'border-transparent text-slate-500 hover:text-cyan-400'}`}
                title="CSV Bulk Device Import"
              >
                <Database className="w-5 h-5" />
              </Button>
            </>
          )}
        </aside>

        {/* Dynamic View Workspace Content */}
        {renderActivePageContent()}
      </div>

      {/* Scrolling Command-Line Telemetry Feed Footer */}
      <footer className="h-16 border-t border-cyan-500/20 bg-slate-950/95 px-6 flex items-center gap-4 shrink-0 font-mono text-[10px] z-30">
        <span className="text-slate-500 font-bold uppercase shrink-0">TELEMETRY_LOGS //</span>
        <div className="flex-1 h-10 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {terminalLogs.map((log, i) => (
            <div key={i} className="text-cyan-500/80 leading-relaxed uppercase">{log}</div>
          ))}
        </div>
      </footer>

      {/* DEFICIENCY INPUT MODAL */}
      <DeficiencyModal 
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        isFailure={deficiencyModalIsFailure}
        onSubmit={handleAddDeficiency}
      />

      {/* INTERACTIVE WALKTHROUGH PANEL */}
      <DemoWalkthrough 
        currentStep={walkthroughStep}
        onSetStep={setWalkthroughStep}
        completed={walkthroughCompleted}
        onSetCompleted={setWalkthroughStepCompleted}
        activeRole={activeRole}
        onSetRole={setActiveRole}
        activePage={activePage}
        onSetPage={setActivePage}
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onSelectDevice={setSelectedDeviceId}
        activeFloor={activeFloor}
        onSetFloor={setActiveFloor}
        quotes={quotes}
      />
    </div>
  );
}

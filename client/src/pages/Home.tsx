import React, { useState, useEffect, useRef } from "react";
import { 
  MOCK_DEVICES, MOCK_REPORTS, MOCK_QUOTES, DEFAULT_MUNICIPAL_SHARING, MOCK_SETUP_STEPS,
  Device, DeviceStatus, FLOORS, Report, Quote, MunicipalSharingSettings, SetupStep
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Flame, Shield, Radio, Droplets, Waves, ShieldAlert, Compass, 
  ArrowRight, Key, Search, Play, Pause, RotateCcw, LayoutDashboard, 
  Map as MapIcon, FileText, DollarSign, ShieldCheck, Sun, Moon, 
  User, Building, ShieldAlert as GovIcon, PhoneCall, AlertTriangle, Settings, CheckCircle2
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
  const [activePage, setActivePage] = useState<string>("map"); // "buildings" | "map" | "deficiencies" | "reports" | "quotes" | "sharing" | "setup"
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
    "READY // SELECT AN ACTION OR COMMENCE SWEEP."
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Log to terminal helper
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  // Theme Syncing
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Automated Sweep Simulation Logic
  useEffect(() => {
    if (isSimulating) {
      addLog("SWEEP_SIM // STARTING LIFE-SAFETY HARDWARE SWEEP...");
      
      // Filter untested devices on the active floor
      const untestedOnFloor = devices.filter(d => d.floor === activeFloor && d.status === "not_tested");
      
      if (untestedOnFloor.length === 0) {
        addLog("SWEEP_SIM // NO UNTESTED DEVICES REMAINING ON THIS FLOOR.");
        setIsSimulating(false);
        toast.info("SWEEP COMPLETE", { description: "All devices on this floor have been inspected." });
        return;
      }

      let currentDeviceIndex = 0;

      simIntervalRef.current = setInterval(() => {
        if (currentDeviceIndex >= untestedOnFloor.length) {
          clearInterval(simIntervalRef.current!);
          setIsSimulating(false);
          addLog("SWEEP_SIM // FULL FLOOR SWEEP LOGGED SUCCESSFULLY.");
          toast.success("SWEEP COMPLETED", { description: "Inspection results synchronized." });
          return;
        }

        const targetDevice = untestedOnFloor[currentDeviceIndex];
        
        // Step 1: Mark as Testing
        setDevices(prev => prev.map(d => d.id === targetDevice.id ? { ...d, status: "testing" } : d));
        setSelectedDeviceId(targetDevice.id);
        addLog(`TESTING // PINGING NODE: ${targetDevice.label} (${targetDevice.type})`);

        // Step 2: Resolve with realistic outcome after 1s
        setTimeout(() => {
          // 85% pass, 10% fail, 5% deficiency
          const rand = Math.random();
          let finalStatus: DeviceStatus = "passed";
          let logMsg = `PASS // NODE: ${targetDevice.label} VERIFIED`;

          if (rand > 0.9) {
            finalStatus = "failed";
            logMsg = `CRITICAL_FAIL // NODE: ${targetDevice.label} FAILED COMPLIANCE OPERATIONAL STANDARDS`;
            toast.error("TEST FAILED", { description: `${targetDevice.label} failed operation test.` });
          } else if (rand > 0.85) {
            finalStatus = "deficiency";
            logMsg = `WARNING // NODE: ${targetDevice.label} LOGGED MINOR DEVIATION`;
            toast.warning("DEFICIENCY LOGGED", { description: `${targetDevice.label} has minor deviations.` });
          } else {
            toast.success("TEST PASSED", { description: `${targetDevice.label} verified.` });
          }

          setDevices(prev => prev.map(d => {
            if (d.id === targetDevice.id) {
              return { 
                ...d, 
                status: finalStatus,
                lastTestedAt: new Date().toISOString(),
                lastTestedBy: "Alex Mercer (Tech #401)"
              };
            }
            return d;
          }));

          addLog(logMsg);
        }, 800);

        currentDeviceIndex++;
      }, 1800);

    } else {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        addLog("SWEEP_SIM // SWEEP MANUALLY INTERRUPTED.");
      }
    }

    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [isSimulating, activeFloor]);

  // Update single device status
  const handleUpdateDeviceStatus = (deviceId: string, status: DeviceStatus) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { 
      ...d, 
      status,
      lastTestedAt: status === "not_tested" ? undefined : new Date().toISOString(),
      lastTestedBy: status === "not_tested" ? undefined : "Alex Mercer (Tech #401)"
    } : d));
    
    const target = devices.find(d => d.id === deviceId);
    if (target) {
      addLog(`OVERRIDE // MANUAL STATUS CHANGE ON NODE: ${target.label} -> ${status.toUpperCase()}`);
      toast.success("STATUS UPDATED", { description: `Node ${target.label} marked as ${status.replace("_", " ")}.` });
    }
  };

  // Trigger deficiency modal
  const handleTriggerDeficiencyModal = (isFailure: boolean) => {
    setDeficiencyModalIsFailure(isFailure);
    setIsDeficiencyModalOpen(true);
  };

  // Save Deficiency Log & Generate Quote/Report
  const handleSaveDeficiency = (deficiencyData: any) => {
    if (!selectedDeviceId) return;
    const target = devices.find(d => d.id === selectedDeviceId);
    if (!target) return;

    const finalStatus: DeviceStatus = deficiencyModalIsFailure ? "failed" : "deficiency";

    // Update Device State
    setDevices(prev => prev.map(d => {
      if (d.id === selectedDeviceId) {
        const newLog = {
          id: `DEF-${Math.floor(Math.random() * 10000)}`,
          loggedAt: new Date().toISOString(),
          resolved: false,
          ...deficiencyData
        };
        return {
          ...d,
          status: finalStatus,
          deficiencyNote: deficiencyData.description,
          deficiencyHistory: [...(d.deficiencyHistory || []), newLog],
          lastTestedAt: new Date().toISOString(),
          lastTestedBy: "Alex Mercer (Tech #401)"
        };
      }
      return d;
    }));

    // Auto-generate Quote Item if checked
    if (deficiencyData.addToQuote) {
      const newQuoteItem = {
        id: `QI-${Math.floor(Math.random() * 10000)}`,
        deviceId: target.id,
        deviceLabel: target.label,
        description: deficiencyData.recommendedRepair,
        labourCost: deficiencyModalIsFailure ? 120 : 60,
        materialCost: target.type === "Smoke Detector" ? 185 : target.type === "Emergency Light" ? 45 : 50,
        qty: 1
      };

      setQuotes(prev => prev.map(q => {
        if (q.id === "Q-2026-1047") {
          return {
            ...q,
            items: [...q.items, newQuoteItem]
          };
        }
        return q;
      }));

      addLog(`QUOTE_GEN // ADDED REPAIR SCOPE TO ACTIVE ESTIMATE Q-2026-1047`);
    }

    addLog(`DEFICIENCY_COMMITTED // COMPLIANCE EXPORT READY FOR REGISTRY.`);
    toast.success("DEFICIENCY COMMITTED", { description: "Deficiency successfully logged and exported." });
  };

  // Approve Quote Handler
  const handleApproveQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        // Find devices referenced in the quote and mark them as resolved/passed
        const deviceIdsInQuote = q.items.map(item => item.deviceId);
        setDevices(currDevices => currDevices.map(d => {
          if (deviceIdsInQuote.includes(d.id)) {
            return {
              ...d,
              status: "passed",
              customerNotes: "REPAIR APPROVED & VERIFIED AS RESOLVED.",
              technicianNotes: "HARDWARE REPLACED. VERIFIED PASSING TELEMETRY."
            };
          }
          return d;
        }));

        addLog(`QUOTE_APPROVED // QUOTE ${quoteId} APPROVED BY CUSTOMER. REPAIRS RESOLVED.`);
        return { ...q, status: "Approved" };
      }
      return q;
    }));
  };

  // Toggle Setup Steps
  const handleToggleSetupStep = (stepId: number) => {
    setSetupSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const nextStatus = s.status === "completed" ? "pending" : "completed";
        addLog(`SETUP_WIZARD // TOGGLED STEP_0${s.id} -> ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Reset Entire Sweep Simulation Data
  const handleResetSimulation = () => {
    setDevices(MOCK_DEVICES);
    setQuotes(MOCK_QUOTES);
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
            buildings={[{
              id: "HVA",
              name: "Harbour View Apartments",
              address: "1420 Harbour Front Way, Vancouver, BC",
              occupancyType: "Residential",
              floorsCount: 5,
              floors: ["Parkade P1", "Main Floor", "Level 2", "Level 3", "Roof"],
              status: "In Progress",
              lastInspectionDate: "2025-06-14",
              nextInspectionDue: "2026-06-14",
              totalDevices: totalCount,
              openDeficiencies: failedCount + warningCount,
              criticalDeficiencies: failedCount,
              setupProgress: 60,
              fireAlarmType: "2-Stage Addressable",
              lockboxLocation: "Main Lobby Vestibule",
              fdcLocation: "North-West Corner of Building",
              panelLocation: "Main Lobby",
              constructionType: "Concrete High-Rise",
              occupancyTypeDetail: "Multi-Family Residential",
              emergencyContacts: [
                { name: "John Doe", role: "Property Manager", phone: "604-555-0199", afterHours: false },
                { name: "Emergency Dispatch", role: "Fire Monitoring", phone: "604-555-0100", afterHours: true }
              ]
            }, {
              id: "PMB",
              name: "Pacific Medical Center",
              address: "750 West Broadway, Vancouver, BC",
              occupancyType: "Medical",
              floorsCount: 8,
              floors: ["B1 Parkade", "Main Floor", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Roof"],
              status: "Compliant",
              lastInspectionDate: "2026-04-10",
              nextInspectionDue: "2027-04-10",
              totalDevices: 142,
              openDeficiencies: 0,
              criticalDeficiencies: 0,
              setupProgress: 100,
              fireAlarmType: "2-Stage Addressable",
              lockboxLocation: "Main Lobby Vestibule",
              fdcLocation: "West Side near Main Driveway",
              panelLocation: "Main Lobby Desk",
              constructionType: "Concrete High-Rise",
              occupancyTypeDetail: "Medical Office Building",
              emergencyContacts: [
                { name: "Jane Smith", role: "Building Engineer", phone: "604-555-0211", afterHours: true }
              ]
            }, {
              id: "RCC",
              name: "Richmond Civic Center",
              address: "6911 No. 3 Road, Richmond, BC",
              occupancyType: "Municipal",
              floorsCount: 4,
              floors: ["Main Floor", "Level 2", "Level 3", "Level 4", "Roof"],
              status: "Critical Deficiencies",
              lastInspectionDate: "2025-11-20",
              nextInspectionDue: "2026-11-20",
              totalDevices: 95,
              openDeficiencies: 4,
              criticalDeficiencies: 2,
              setupProgress: 100,
              fireAlarmType: "Single-Stage Addressable",
              lockboxLocation: "Main Entrance Exterior",
              fdcLocation: "South Side near Hydrant",
              panelLocation: "Main Lobby Vestibule",
              constructionType: "Steel Frame & Concrete",
              occupancyTypeDetail: "Municipal Government Offices",
              emergencyContacts: [
                { name: "Duty Officer", role: "Security Dispatch", phone: "604-555-0399", afterHours: true }
              ]
            }, {
              id: "GBC",
              name: "Granville Business Center",
              address: "1055 Dunsmuir St, Vancouver, BC",
              occupancyType: "Commercial",
              floorsCount: 12,
              floors: ["P1 Parkade", "P2 Parkade", "Main Lobby", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10", "Level 11", "Level 12", "Roof"],
              status: "In Progress",
              lastInspectionDate: "2025-09-05",
              nextInspectionDue: "2026-09-05",
              totalDevices: 210,
              openDeficiencies: 2,
              criticalDeficiencies: 0,
              setupProgress: 80,
              fireAlarmType: "2-Stage Addressable",
              lockboxLocation: "South-West Main Entry",
              fdcLocation: "East Side near Loading Dock",
              panelLocation: "Security Control Room",
              constructionType: "Concrete High-Rise",
              occupancyTypeDetail: "Commercial Office Tower",
              emergencyContacts: [
                { name: "Building Security", role: "Command Center", phone: "604-555-0911", afterHours: true }
              ]
            }]} 
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
                        "Lockbox", "Roof Access", "Electrical Shutoff", "Gas Shutoff", "Standpipe", "Smoke Control Panel"
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
        <aside className="w-16 border-r border-cyan-500/20 bg-slate-950/95 flex flex-col items-center py-4 gap-4 z-20 shrink-0">
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
        </aside>

        {/* Dynamic View Workspace Content */}
        {renderActivePageContent()}
      </div>

      {/* Scrolling Command-Line Telemetry Feed Footer */}
      <footer className="h-16 border-t border-cyan-500/20 bg-slate-950/95 px-6 flex items-center gap-4 shrink-0 font-mono text-[10px] z-30">
        <span className="text-slate-500 font-bold uppercase shrink-0">TELEMETRY_LOGS //</span>
        <div className="flex-1 h-10 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20">
          {terminalLogs.map((log, i) => (
            <div key={i} className="text-cyan-500/80 leading-tight">
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </footer>

      {/* Deficiency Form Dialog Modal */}
      <DeficiencyModal 
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        onSave={handleSaveDeficiency}
        isFailureMode={deficiencyModalIsFailure}
        device={devices.find(d => d.id === selectedDeviceId) || null}
      />

      {/* Guided Interactive Demo Walkthrough Cockpit */}
      <DemoWalkthrough 
        activeRole={activeRole}
        setActiveRole={(role) => {
          setActiveRole(role);
          addLog(`ROLE_CHANGED // SWITCHED TO: ${role.toUpperCase()}`);
        }}
        setPage={(page) => setActivePage(page)}
      />
    </div>
  );
}

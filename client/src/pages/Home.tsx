import React, { useState, useEffect, useRef } from "react";
import { 
  MOCK_DEVICES, MOCK_REPORTS, MOCK_QUOTES, DEFAULT_MUNICIPAL_SHARING, SAMPLE_BUILDING,
  Device, DeviceStatus, FLOORS, Report, Quote, MunicipalSharingSettings
} from "@/lib/mock-data";
import MapCanvas from "@/components/MapCanvas";
import DeviceDetailPanel from "@/components/DeviceDetailPanel";
import DeficiencyModal from "@/components/DeficiencyModal";
import DemoWalkthrough from "@/components/DemoWalkthrough";
import ReportsView from "@/components/ReportsView";
import QuotesView from "@/components/QuotesView";
import MunicipalSharingView from "@/components/MunicipalSharingView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Flame, Shield, Radio, Droplets, Waves, ShieldAlert, Compass, 
  ArrowRight, Key, Search, Play, Pause, RotateCcw, LayoutDashboard, 
  Map as MapIcon, FileText, DollarSign, ShieldCheck, Sun, Moon, 
  User, Building, ShieldAlert as GovIcon, PhoneCall, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  // Global App States
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [sharingSettings, setSharingSettings] = useState<MunicipalSharingSettings>(DEFAULT_MUNICIPAL_SHARING);
  
  // Navigation & View State
  const [activePage, setActivePage] = useState<string>("map"); // "dashboard" | "map" | "reports" | "quotes" | "sharing"
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
  const [simIndex, setSimIndex] = useState(0);
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
          // 80% pass, 10% fail, 10% warning/deficiency
          const rand = Math.random();
          let finalStatus: DeviceStatus = "passed";
          let logMsg = `PASS // NODE: ${targetDevice.label} VERIFIED`;

          if (rand > 0.9) {
            finalStatus = "failed";
            logMsg = `CRITICAL_FAIL // NODE: ${targetDevice.label} FAILED COMPLIANCE OPERATIONAL STANDARDS`;
            toast.error("TEST FAILED", { description: `${targetDevice.label} failed operation test.` });
          } else if (rand > 0.8) {
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
        if (q.id === "QTE-2026-01") {
          return {
            ...q,
            items: [...q.items, newQuoteItem]
          };
        }
        return q;
      }));

      addLog(`QUOTE_GEN // ADDED REPAIR SCOPE TO ACTIVE ESTIMATE QT-2026-00491`);
    }

    addLog(`DEFICIENCY_COMMITTED // COMPLIANCE EXPORT READY FOR REGISTRY.`);
    toast.success("DEFICIENCY COMMITTED", { description: "Deficiency successfully logged and exported." });
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
      case "dashboard":
        return renderDashboardView();
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
                    className="pl-9 bg-slate-900 border-cyan-500/20 text-cyan-400 placeholder:text-slate-600 rounded-none h-9 text-xs focus-visible:ring-cyan-500/50 uppercase"
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
                          dev.status === "testing" ? "bg-cyan-500 animate-ping" :
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

            {/* Right Detail Panel */}
            {selectedDeviceId && (
              <DeviceDetailPanel 
                device={devices.find(d => d.id === selectedDeviceId) || null}
                onClose={() => setSelectedDeviceId(null)}
                onUpdateStatus={handleUpdateDeviceStatus}
                onTriggerDeficiencyModal={handleTriggerDeficiencyModal}
                activeRole={activeRole}
              />
            )}
          </div>
        );
      case "reports":
        return <ReportsView reports={reports} activeRole={activeRole} />;
      case "quotes":
        return <QuotesView quotes={quotes} activeRole={activeRole} />;
      case "sharing":
        return <MunicipalSharingView settings={sharingSettings} onUpdateSettings={(s) => setSharingSettings(s)} />;
      default:
        return null;
    }
  };

  // Dashboard View for Property Managers & Executives
  const renderDashboardView = () => {
    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40 font-mono text-xs text-cyan-400">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-cyan-500/15 bg-slate-950/60 p-4 flex flex-col gap-1.5 hud-corners">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Facility Compliance Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-emerald-400">{compliancePercentage}%</span>
              <span className="text-[10px] text-slate-500 uppercase">NFPA certified</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 border border-cyan-500/10 mt-1">
              <div className="bg-emerald-500 h-full shadow-[0_0_8px_#10b981]" style={{ width: `${compliancePercentage}%` }} />
            </div>
          </div>

          <div className="border border-cyan-500/15 bg-slate-950/60 p-4 flex flex-col gap-1.5 hud-corners">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Outstanding Deficiencies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-rose-500">{failedCount + warningCount}</span>
              <span className="text-[10px] text-slate-500 uppercase">critical fixes</span>
            </div>
            <span className="text-[9px] text-rose-400/80 mt-1 uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> REPAIRS REQUIRED FOR CERTIFICATION
            </span>
          </div>

          <div className="border border-cyan-500/15 bg-slate-950/60 p-4 flex flex-col gap-1.5 hud-corners">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Total Tested Nodes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-cyan-400">{testedCount}</span>
              <span className="text-[10px] text-slate-500">/ {totalCount} total</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 border border-cyan-500/10 mt-1">
              <div className="bg-cyan-500 h-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${(testedCount / totalCount) * 100}%` }} />
            </div>
          </div>

          <div className="border border-cyan-500/15 bg-slate-950/60 p-4 flex flex-col gap-1.5 hud-corners">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Municipal Registry Link</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-emerald-400 uppercase">ACTIVE_SHIELD</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-2.5 uppercase leading-relaxed">
              EMERGENCY DATA IS CONTINUOUSLY BROADCAST TO METRO FIRE SERVICES.
            </span>
          </div>
        </div>

        {/* Building Emergency Profile Block */}
        <div className="border border-cyan-500/15 bg-slate-950/60 p-5 flex flex-col gap-4 hud-corners">
          <h3 className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-2">
            <Building className="w-4 h-4 text-cyan-500" />
            <span>Facility Emergency Profile // {SAMPLE_BUILDING.name}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Facility Address</span>
                <p className="text-cyan-300 font-bold mt-0.5">{SAMPLE_BUILDING.address.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Construction Classification</span>
                <p className="text-cyan-300 mt-0.5">{SAMPLE_BUILDING.constructionType.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Occupancy Classification</span>
                <p className="text-cyan-300 mt-0.5">{SAMPLE_BUILDING.occupancyType.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Main Fire Alarm Control Panel</span>
                <p className="text-cyan-300 mt-0.5">{SAMPLE_BUILDING.fireAlarmType.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Lockbox Entry Coordinates</span>
                <p className="text-cyan-300 mt-0.5">{SAMPLE_BUILDING.lockboxLocation.toUpperCase()}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-bold">FDC Connection Outlet</span>
                <p className="text-cyan-300 mt-0.5">{SAMPLE_BUILDING.fdcLocation.toUpperCase()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" /> Emergency Contacts
              </span>
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {SAMPLE_BUILDING.emergencyContacts.map((contact, i) => (
                  <div key={i} className="bg-slate-900/40 p-2 border border-cyan-500/5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-cyan-300 text-[10px]">{contact.name.toUpperCase()}</p>
                      <span className="text-[8px] text-slate-500 uppercase">{contact.role}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold text-[10px]">{contact.phone}</p>
                      {contact.afterHours && (
                        <Badge className="bg-rose-950/20 text-rose-400 border-rose-500/10 text-[7px] scale-90 px-1 rounded-none py-0">24HR</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === "light" ? "bg-slate-50 text-slate-900" : "bg-[#02040a] text-cyan-400"
    }`}>
      {/* SaaS Platform Header */}
      <header className="h-16 border-b border-cyan-500/20 bg-slate-950/90 flex items-center justify-between px-6 backdrop-blur-md z-40 shrink-0 font-mono">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center relative shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0.5 border border-cyan-500/10" />
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-cyan-300 uppercase leading-none">INSPECTRA_VISUAL_MAP</h1>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block">Life-Safety Mapping SaaS Demo</span>
          </div>
        </div>

        {/* Dynamic Floor Selector (Only visible on Map View) */}
        {activePage === "map" && (
          <div className="hidden md:flex items-center gap-1.5">
            {FLOORS.map((floor) => (
              <Button
                key={floor}
                variant="ghost"
                onClick={() => setActiveFloor(floor)}
                className={`h-8 rounded-none text-[10px] font-bold uppercase tracking-wider px-3 border ${
                  activeFloor === floor 
                    ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                    : "border-cyan-500/10 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5"
                }`}
              >
                {floor}
              </Button>
            ))}
          </div>
        )}

        {/* Global Controls & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 rounded-none text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 border border-cyan-500/10"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Dynamic Sweep Trigger (Fire Company View only) */}
          {activeRole === "fire_company" && activePage === "map" && (
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`h-8 rounded-none text-[10px] font-bold px-4 border uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                isSimulating 
                  ? "bg-rose-950/40 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.2)]" 
                  : "bg-cyan-950/40 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              }`}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? "HALT_SWEEP" : "RUN_SWEEP"}</span>
            </Button>
          )}

          {/* Role Switching Control */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 border border-cyan-500/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveRole("fire_company");
                addLog("ROLE_SWAP // SWITCHED TO FIRE PROTECTION COMPANY CONSOLE.");
                toast.success("ROLE UPDATED", { description: "Switched to Fire Protection Company view." });
              }}
              className={`h-7 rounded-none text-[9px] font-bold px-2.5 uppercase flex items-center gap-1 ${
                activeRole === "fire_company" 
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" 
                  : "text-slate-500 hover:text-cyan-400"
              }`}
            >
              <User className="w-3 h-3" /> TECH
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveRole("property_manager");
                addLog("ROLE_SWAP // SWITCHED TO PROPERTY MANAGER DASHBOARD.");
                toast.success("ROLE UPDATED", { description: "Switched to Property Manager view." });
              }}
              className={`h-7 rounded-none text-[9px] font-bold px-2.5 uppercase flex items-center gap-1 ${
                activeRole === "property_manager" 
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" 
                  : "text-slate-500 hover:text-cyan-400"
              }`}
            >
              <Building className="w-3 h-3" /> MANAGER
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveRole("government");
                addLog("ROLE_SWAP // SWITCHED TO EMERGENCY RESPONDER / FIRE DEPT VIEW.");
                toast.success("ROLE UPDATED", { description: "Switched to Fire Department view." });
              }}
              className={`h-7 rounded-none text-[9px] font-bold px-2.5 uppercase flex items-center gap-1 ${
                activeRole === "government" 
                  ? "bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/40 shadow-[0_0_10px_rgba(217,70,239,0.15)]" 
                  : "text-slate-500 hover:text-cyan-400"
              }`}
            >
              <GovIcon className="w-3 h-3 text-fuchsia-400" /> FIRE_DEPT
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Vertical HUD Navigation */}
        <nav className="w-16 border-r border-cyan-500/20 bg-slate-950/90 flex flex-col items-center py-4 shrink-0 font-mono gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePage("dashboard")}
            className={`h-10 w-10 rounded-none border ${
              activePage === "dashboard" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-transparent text-slate-500 hover:text-cyan-400"
            }`}
            title="Dashboard Overview"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePage("map")}
            className={`h-10 w-10 rounded-none border ${
              activePage === "map" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-transparent text-slate-500 hover:text-cyan-400"
            }`}
            title="Visual Site Map"
          >
            <MapIcon className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePage("reports")}
            className={`h-10 w-10 rounded-none border ${
              activePage === "reports" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-transparent text-slate-500 hover:text-cyan-400"
            }`}
            title="Compliance Reports"
          >
            <FileText className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePage("quotes")}
            className={`h-10 w-10 rounded-none border ${
              activePage === "quotes" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-transparent text-slate-500 hover:text-cyan-400"
            }`}
            title="Deficiency Quotes"
          >
            <DollarSign className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePage("sharing")}
            className={`h-10 w-10 rounded-none border ${
              activePage === "sharing" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-transparent text-slate-500 hover:text-cyan-400"
            }`}
            title="Municipal Sharing"
          >
            <ShieldCheck className="w-5 h-5" />
          </Button>
        </nav>

        {/* Primary Page Panel View */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderActivePageContent()}

          {/* Bottom Telemetry Terminal Logger (Visible on Map View only) */}
          {activePage === "map" && (
            <div className="h-32 border-t border-cyan-500/20 bg-slate-950/95 p-3.5 font-mono text-[9px] text-cyan-500 flex flex-col gap-1.5 overflow-hidden shrink-0">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-500/60 animate-pulse" /> TELEMETRY_LOGGER_STREAM
              </span>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 select-text selection:bg-cyan-500/20">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed font-semibold">
                    {log}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guided Onboarding Walkthrough */}
      <DemoWalkthrough 
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        setPage={setActivePage}
      />

      {/* Deficiency Form Dialog */}
      <DeficiencyModal 
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        device={devices.find(d => d.id === selectedDeviceId) || null}
        isFailureMode={deficiencyModalIsFailure}
        onSave={handleSaveDeficiency}
      />
    </div>
  );
}

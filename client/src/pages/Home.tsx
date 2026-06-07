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
import SystemArchitectureView from "@/components/SystemArchitectureView";
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
  ArrowRight, Key, Search, Play, Pause, Square, RotateCcw, LayoutDashboard,
  Map as MapIcon, FileText, DollarSign, ShieldCheck, Sun, Moon, 
  User, Building, ShieldAlert as GovIcon, PhoneCall, AlertTriangle, Settings, CheckCircle2,
  Users, Users2, Library, FileCode, Database, ClipboardList, Cpu
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
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [activeFloor, setActiveFloor] = useState<string>("Main Floor");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Role fixed to fire_company for MVP — multi-role is a future feature
  const activeRole = "fire_company";

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminalLogRef = useRef<HTMLDivElement>(null);

  // Refs for auto-scrolling the device list sidebar to the selected device
  const deviceListItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  // Apply dark mode on mount (dark-only for MVP)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Auto-scroll terminal to latest log entry
  useEffect(() => {
    if (terminalLogRef.current) {
      terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Auto-scroll the device list sidebar to the selected device (e.g. when selected via the map canvas)
  useEffect(() => {
    if (selectedDeviceId && activePage === "map") {
      deviceListItemRefs.current[selectedDeviceId]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedDeviceId, activePage]);

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

  // Mark a logged deficiency as resolved; restore the device to "passed" once it has no other open deficiencies
  const handleResolveDeficiency = (deviceId: string, deficiencyId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id !== deviceId) return d;

      const updatedHistory = (d.deficiencyHistory || []).map(def =>
        def.id === deficiencyId
          ? { ...def, resolved: true, resolvedAt: new Date().toISOString().split('T')[0] }
          : def
      );
      const stillOpen = updatedHistory.some(def => !def.resolved);

      addLog(`DEFICIENCY_RESOLVED // DEVICE: ${d.label} // ID: ${deficiencyId}`);

      return {
        ...d,
        deficiencyHistory: updatedHistory,
        status: stillOpen ? d.status : "passed",
        deficiencyNote: stillOpen ? d.deficiencyNote : undefined
      };
    }));

    toast.success("DEFICIENCY RESOLVED", {
      description: "Deficiency marked resolved and the inspection record has been updated."
    });
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
      case "dashboard":
        return (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-xl font-bold text-cyan-300 uppercase tracking-wider">Harbour View Apartments</h2>
                <p className="text-slate-500 text-sm mt-1">123 Harbour View Drive, Vancouver, BC · Multi-Family Residential</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Devices", value: totalCount, color: "text-cyan-300" },
                  { label: "Tested", value: testedCount, color: "text-cyan-300" },
                  { label: "Passed", value: passedCount, color: "text-emerald-400" },
                  { label: "Open Issues", value: failedCount + warningCount, color: (failedCount + warningCount) > 0 ? "text-rose-400" : "text-emerald-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-900/60 border border-cyan-500/10 p-4">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</div>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/60 border border-cyan-500/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Inspection Progress</span>
                  <span className="text-xs text-slate-400">{testedCount} / {totalCount} devices tested</span>
                </div>
                <div className="h-2 bg-slate-800">
                  <div
                    className={`h-2 transition-all ${compliancePercentage > 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${totalCount > 0 ? (testedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActivePage("map")}
                  className="flex items-center gap-3 p-4 bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors text-left"
                >
                  <MapIcon className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-bold text-sm uppercase">Open Site Map</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">View floor plan and device pins</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-600" />
                </button>
                <button
                  onClick={() => setActivePage("deficiencies")}
                  className={`flex items-center gap-3 p-4 border text-left transition-colors ${
                    (failedCount + warningCount) > 0
                      ? "bg-rose-950/20 border-rose-500/20 text-rose-300 hover:bg-rose-500/10"
                      : "bg-slate-900/40 border-cyan-500/10 text-slate-400 hover:bg-cyan-500/5"
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${(failedCount + warningCount) > 0 ? "text-rose-400" : "text-slate-500"}`} />
                  <div>
                    <div className="font-bold text-sm uppercase">Deficiencies</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{failedCount + warningCount} open issues</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-600" />
                </button>
              </div>

              <div className="bg-slate-900/60 border border-cyan-500/10">
                <div className="px-4 py-3 border-b border-cyan-500/10">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Floor Status</span>
                </div>
                {FLOORS.map(floor => {
                  const floorDevices = devices.filter(d => d.floor === floor);
                  const floorTested = floorDevices.filter(d => d.status !== "not_tested").length;
                  const floorIssues = floorDevices.filter(d => d.status === "failed" || d.status === "deficiency").length;
                  return (
                    <button
                      key={floor}
                      onClick={() => { setActiveFloor(floor); setActivePage("map"); }}
                      className="w-full flex items-center gap-4 px-4 py-3 border-b border-cyan-500/5 last:border-0 hover:bg-cyan-500/5 transition-colors text-left"
                    >
                      <span className="text-xs font-bold uppercase text-cyan-300 w-32 shrink-0">{floor}</span>
                      <div className="flex-1 h-1.5 bg-slate-800">
                        <div
                          className="h-1.5 bg-cyan-500/60 transition-all"
                          style={{ width: `${floorDevices.length > 0 ? (floorTested / floorDevices.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 w-24 text-right shrink-0">{floorTested}/{floorDevices.length} tested</span>
                      {floorIssues > 0
                        ? <span className="text-[10px] font-bold text-rose-400 w-16 text-right shrink-0">{floorIssues} issues</span>
                        : floorTested === floorDevices.length && floorDevices.length > 0
                        ? <span className="text-[10px] font-bold text-emerald-400 w-16 text-right shrink-0">Clear</span>
                        : <span className="text-[10px] text-slate-600 w-16 text-right shrink-0">Pending</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "architecture":
        return <SystemArchitectureView />;
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
                    <option value="attention_required">ATTENTION_REQUIRED</option>
                    <option value="no_access">NO_ACCESS</option>
                    <option value="not_tested">PENDING</option>
                  </select>
                </div>
              </div>

              {/* Floor Progress Counter */}
              {(() => {
                const floorDevices = devices.filter(d => d.floor === activeFloor);
                const testedCount = floorDevices.filter(d => d.status !== "not_tested").length;
                return (
                  <div className="flex items-center justify-between border border-cyan-500/10 bg-slate-900/40 px-3 py-2">
                    <span className="font-bold uppercase tracking-wider text-cyan-300 truncate">{activeFloor}</span>
                    <span className="text-slate-500 shrink-0 ml-2">{testedCount} / {floorDevices.length} TESTED</span>
                  </div>
                );
              })()}

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
                      ref={(el) => { deviceListItemRefs.current[dev.id] = el; }}
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
                          dev.status === "attention_required" ? "bg-fuchsia-500 animate-pulse" :
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
              theme="dark"
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
            onResolveDeficiency={handleResolveDeficiency}
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
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-300 font-mono selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Header */}
      <header className="h-14 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md px-5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-950 border border-cyan-500/40">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm font-bold tracking-widest text-cyan-300 uppercase hidden sm:block">Inspectra</span>
        </div>

        <div className="flex items-center gap-2">
          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-xs font-bold text-cyan-300 uppercase">Harbour View Apartments</span>
          {activePage === "map" && (
            <>
              <span className="text-slate-600 mx-0.5">/</span>
              <select
                value={activeFloor}
                onChange={(e) => setActiveFloor(e.target.value)}
                className="bg-slate-900 border border-cyan-500/20 px-2 py-1 text-xs text-cyan-400 font-mono rounded-none focus:outline-none focus:border-cyan-500/60"
              >
                {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold">Compliance:</span>
            <span className={`text-sm font-bold ${compliancePercentage > 90 ? "text-emerald-400" : "text-amber-400"}`}>
              {compliancePercentage}%
            </span>
          </div>
          {(failedCount + warningCount) > 0 && (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-sm font-bold text-rose-400">{failedCount + warningCount}</span>
            </div>
          )}
          <div className="h-7 w-7 bg-slate-800 border border-slate-700 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex min-h-0">
        
        {/* Navigation Sidebar */}
        <aside className="w-52 border-r border-cyan-500/20 bg-slate-950/95 flex flex-col z-20 shrink-0 select-none">
          <nav className="flex-1 py-2">
            {([
              { page: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { page: "buildings", icon: Building, label: "Buildings" },
              { page: "map", icon: MapIcon, label: "Site Map" },
              { page: "deficiencies", icon: AlertTriangle, label: "Deficiencies" },
              { page: "reports", icon: FileText, label: "Reports" },
            ] as { page: string; icon: React.ElementType; label: string }[]).map(({ page, icon: Icon, label }) => {
              const badge =
                page === "deficiencies" && failedCount + warningCount > 0
                  ? failedCount + warningCount
                  : undefined;
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    activePage === page
                      ? "bg-cyan-500/10 text-cyan-300 border-r-2 border-cyan-500"
                      : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 border-r-2 border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{label}</span>
                  {badge !== undefined && (
                    <span className="ml-auto text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 font-bold">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="px-4 py-3 border-t border-cyan-500/10">
            <div className="text-[9px] text-slate-600 uppercase tracking-widest">v0.1 — MVP Preview</div>
          </div>
        </aside>

        {/* Page content */}
        {renderActivePageContent()}
      </div>

      {/* Deficiency Modal */}
      <DeficiencyModal
        isOpen={isDeficiencyModalOpen}
        onClose={() => setIsDeficiencyModalOpen(false)}
        isFailure={deficiencyModalIsFailure}
        onSubmit={handleAddDeficiency}
      />
    </div>
  );
}

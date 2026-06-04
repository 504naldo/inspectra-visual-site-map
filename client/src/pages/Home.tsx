import { useState, useMemo, useEffect, useRef } from "react";
import { Device, DeviceStatus, FLOORS, MOCK_DEVICES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Map as MapIcon, ListFilter, Activity, Play, Pause, ShieldAlert, Crosshair } from "lucide-react";
import { toast } from "sonner";
import MapCanvas from "@/components/MapCanvas";
import DeviceDetailPanel from "@/components/DeviceDetailPanel";

// Helper to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

interface ActivityLog {
  id: string;
  time: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export default function Home() {
  // State
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [selectedFloor, setSelectedFloor] = useState<string>(FLOORS[1]); // Default to Main Floor
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: "init-1", time: formatTime(new Date()), message: "SYS_INIT // SECURE_BOOT_COMPLETED. READY FOR TELEMETRY.", type: "info" }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [animatingDeviceId, setAnimatingDeviceId] = useState<string | null>(null);

  // References for simulation
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const devicesRef = useRef<Device[]>(MOCK_DEVICES);

  // Sync devices reference for simulation interval
  useEffect(() => {
    devicesRef.current = devices;
  }, [devices]);

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  // Selected device object
  const selectedDevice = useMemo(() => {
    return devices.find(d => d.id === selectedDeviceId) || null;
  }, [devices, selectedDeviceId]);

  // Derived state
  const currentFloorDevices = useMemo(() => {
    return devices.filter(d => d.floor === selectedFloor);
  }, [devices, selectedFloor]);

  const filteredDevices = useMemo(() => {
    return currentFloorDevices.filter(d => {
      const matchesSearch = d.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [currentFloorDevices, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = currentFloorDevices.length;
    const passed = currentFloorDevices.filter(d => d.status === "passed").length;
    const failed = currentFloorDevices.filter(d => d.status === "failed").length;
    const deficiency = currentFloorDevices.filter(d => d.status === "deficiency").length;
    const noAccess = currentFloorDevices.filter(d => d.status === "no_access").length;
    const notTested = currentFloorDevices.filter(d => d.status === "not_tested").length;
    const tested = total - notTested;
    
    return { total, tested, passed, failed, deficiency, noAccess, notTested };
  }, [currentFloorDevices]);

  // Handlers
  const addActivity = (message: string, type: ActivityLog["type"] = "info") => {
    setActivities(prev => [
      { id: Math.random().toString(36).substring(7), time: formatTime(new Date()), message: message.toUpperCase(), type },
      ...prev
    ].slice(0, 50)); // Keep last 50
  };

  const updateDeviceStatus = (id: string, newStatus: DeviceStatus, note?: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        return { 
          ...d, 
          status: newStatus, 
          lastTestedAt: new Date().toISOString(), 
          deficiencyNote: note || d.deficiencyNote 
        };
      }
      return d;
    }));

    // Trigger visual annunciation pulse
    setAnimatingDeviceId(id);
    setTimeout(() => {
      setAnimatingDeviceId(null);
    }, 1500);

    // Logging & Toasting based on status
    const statusLabel = newStatus.replace("_", " ").toUpperCase();
    const logMsg = `EVENT // ${device.type.toUpperCase()} [${device.label}] // STATUS: ${statusLabel}${note ? ` // DETAIL: ${note}` : ""}`;
    
    if (newStatus === "passed") {
      addActivity(logMsg, "success");
      toast.success(`TEST PASSED: ${device.label}`, {
        description: `${device.type.toUpperCase()} // PASS`,
      });
    } else if (newStatus === "failed") {
      addActivity(logMsg, "error");
      toast.error(`TEST FAILED: ${device.label}`, {
        description: `CRITICAL DEFICIENCY: ${note || "NO DETAILS PROVIDED"}`,
      });
    } else if (newStatus === "deficiency") {
      addActivity(logMsg, "warning");
      toast.warning(`DEFICIENCY: ${device.label}`, {
        description: `WARNING // ${note || "NEEDS REVIEW"}`,
      });
    } else if (newStatus === "no_access") {
      addActivity(logMsg, "info");
      toast.info(`NO ACCESS: ${device.label}`, {
        description: "SIGNAL UNREACHABLE // ACCESS DENIED",
      });
    } else {
      addActivity(`RESET // ${device.type.toUpperCase()} [${device.label}] TO PENDING`, "info");
    }
  };

  // Run Test Simulation
  const startSimulation = () => {
    setIsSimulating(true);
    addActivity("SYS_SIM // INITIATING AUTOMATED TELEMETRY SWEEP", "info");
    toast.info("SIMULATION RUNNING", {
      description: "PINGING UNTESTED HARDWARE NODES..."
    });

    simulationIntervalRef.current = setInterval(() => {
      // 1. Find all untested devices on the current floor
      const currentDevices = devicesRef.current.filter(d => d.floor === selectedFloor);
      const untested = currentDevices.filter(d => d.status === "not_tested");

      if (untested.length === 0) {
        // All tested! Stop simulation
        clearInterval(simulationIntervalRef.current!);
        setIsSimulating(false);
        addActivity("SYS_SIM // SWEEP COMPLETE. ALL HARDWARE NODES RESPONDED.", "success");
        toast.success("SIMULATION COMPLETE", {
          description: "ALL NODES INSPECTED ON THIS VECTOR."
        });
        return;
      }

      // 2. Select a random untested device
      const randomDevice = untested[Math.floor(Math.random() * untested.length)];
      
      // 3. Mark as testing first (visual cue)
      setDevices(prev => prev.map(d => d.id === randomDevice.id ? { ...d, status: "testing" } : d));
      setAnimatingDeviceId(randomDevice.id);

      // 4. Resolve the test after 1 second
      setTimeout(() => {
        const rand = Math.random();
        let finalStatus: DeviceStatus = "passed";
        let note = "";

        if (rand < 0.75) {
          finalStatus = "passed";
        } else if (rand < 0.88) {
          finalStatus = "failed";
          note = "VOLTAGE_DROP / SIGNAL_DELAY";
        } else if (rand < 0.94) {
          finalStatus = "deficiency";
          note = "HOUSING_CORROSION / LABEL_UNREADABLE";
        } else {
          finalStatus = "no_access";
        }

        updateDeviceStatus(randomDevice.id, finalStatus, note);
      }, 1000);

    }, 2200); // Run a test cycle every 2.2 seconds (1s testing + 1.2s delay)
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    setIsSimulating(false);
    addActivity("SYS_SIM // SIMULATION SWEEP INTERRUPTED BY OPERATOR", "info");
    toast.info("SIMULATION ABORTED");
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  // Device Selection from list/map
  const handleSelectDevice = (id: string) => {
    setSelectedDeviceId(id);
    
    // Pulse selected device on map
    setAnimatingDeviceId(id);
    setTimeout(() => {
      setAnimatingDeviceId(null);
    }, 1500);

    const device = devices.find(d => d.id === id);
    if (device) {
      addActivity(`OPERATOR_SELECT // NODE [${device.label}] ACTIVE`, "info");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#040711] text-cyan-400 font-mono">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 flex-none px-6 py-4 flex items-center justify-between border-b border-cyan-500/20 hud-corners">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <ShieldAlert className="w-6 h-6 text-cyan-400 animate-glow" />
            <h1 className="text-lg font-extrabold font-display tracking-widest">
              INSPECTRA <span className="font-normal text-slate-500">// HUD_SITE_MAP</span>
            </h1>
          </div>
          <Separator orientation="vertical" className="h-6 bg-cyan-500/20" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">LOC: HARBOUR_VIEW_APT</div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Summary */}
          <div className="hidden xl:flex items-center gap-4 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">SYS_TELEMETRY</span>
              <span className="font-bold text-cyan-400">{stats.tested} / {stats.total} NODES</span>
            </div>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-500/30 rounded-none text-[10px] font-bold">
                {stats.passed} PASS
              </Badge>
              <Badge variant="outline" className="bg-rose-950/30 text-rose-400 border-rose-500/30 rounded-none text-[10px] font-bold animate-pulse">
                {stats.failed} FAIL
              </Badge>
              {stats.deficiency > 0 && (
                <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-500/30 rounded-none text-[10px] font-bold">
                  {stats.deficiency} WARN
                </Badge>
              )}
              {stats.noAccess > 0 && (
                <Badge variant="outline" className="bg-purple-950/30 text-purple-400 border-purple-500/30 rounded-none text-[10px] font-bold">
                  {stats.noAccess} NO_ACC
                </Badge>
              )}
              <Badge variant="outline" className="bg-slate-900/40 text-slate-400 border-slate-700/40 rounded-none text-[10px] font-bold">
                {stats.notTested} PEND
              </Badge>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6 hidden xl:block bg-cyan-500/20" />

          {/* Floor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">VECTOR:</span>
            <Select value={selectedFloor} onValueChange={(val) => {
              setSelectedFloor(val);
              setSelectedDeviceId(null); // Clear selection when floor changes
              addActivity(`VEC_SHIFT // SWITCHED VECTOR TO ${val}`, "info");
            }}>
              <SelectTrigger className="w-[160px] bg-slate-950 border-cyan-500/20 text-cyan-400 font-bold rounded-none shadow-sm text-xs focus:ring-cyan-500/50">
                <SelectValue placeholder="Select vector" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-cyan-500/30 text-cyan-400 font-mono rounded-none">
                {FLOORS.map(floor => (
                  <SelectItem key={floor} value={floor} className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-300">{floor.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant={isSimulating ? "destructive" : "default"} 
            className={`gap-2 rounded-none transition-all duration-300 font-bold text-xs tracking-wider border ${
              isSimulating 
                ? "bg-rose-950 text-rose-400 border-rose-500 hover:bg-rose-900" 
                : "bg-cyan-950 text-cyan-400 border-cyan-500 hover:bg-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            }`}
            onClick={toggleSimulation}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? "HALT_SWEEP" : "RUN_SWEEP"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Device List & Filters */}
        <aside className="w-80 flex-none border-r border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl flex flex-col z-10 shadow-[10px_0_30px_rgba(0,0,0,0.3)] hud-corners">
          <div className="p-4 flex flex-col gap-3 bg-slate-950/40">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-cyan-500/60" />
              <Input 
                placeholder="SEARCH_NODES..." 
                className="pl-9 bg-slate-950 border-cyan-500/20 text-cyan-400 placeholder:text-slate-700 text-xs h-9 rounded-none focus-visible:ring-cyan-500/50 uppercase"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-slate-950 border-cyan-500/20 text-cyan-500/70 text-[10px] font-bold h-8 rounded-none focus:ring-cyan-500/50">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-3 h-3 text-cyan-500/60" />
                  <SelectValue placeholder="FILTER_STATUS" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-cyan-500/30 text-cyan-400 font-mono rounded-none">
                <SelectItem value="all" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">ALL STATUSES</SelectItem>
                <SelectItem value="not_tested" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">PENDING</SelectItem>
                <SelectItem value="passed" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">PASSED</SelectItem>
                <SelectItem value="failed" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">FAILED</SelectItem>
                <SelectItem value="deficiency" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">DEFICIENCY</SelectItem>
                <SelectItem value="no_access" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10">NO ACCESS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-cyan-500/10" />

          <ScrollArea className="flex-1 bg-[#020409]/40">
            <div className="p-3 flex flex-col gap-2">
              {filteredDevices.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-600 flex flex-col items-center gap-2 font-mono">
                  <MapIcon className="w-6 h-6 opacity-20" />
                  <span>NO_NODES_FOUND_MATCHING_FILTER</span>
                </div>
              ) : (
                filteredDevices.map(device => (
                  <button
                    key={device.id}
                    onClick={() => handleSelectDevice(device.id)}
                    className={`flex flex-col items-start p-3 rounded-none border text-left transition-all duration-200 font-mono ${
                      selectedDeviceId === device.id 
                        ? "bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30" 
                        : "bg-slate-950/40 border-cyan-500/5 hover:border-cyan-500/20 hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-[11px] text-cyan-400">{device.label}</span>
                      <StatusIndicator status={device.status} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{device.type}</span>
                    <span className="text-[9px] text-slate-400 mt-1 truncate w-full uppercase">{device.location}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Center - Map Area */}
        <main className="flex-1 relative bg-[#020408] overflow-hidden flex flex-col">
          <div className="flex-1 relative z-10 p-6 md:p-12 flex items-center justify-center">
            <MapCanvas 
              floor={selectedFloor}
              devices={currentFloorDevices}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={handleSelectDevice}
              animatingDeviceId={animatingDeviceId}
            />
          </div>

          {/* Bottom Activity Feed Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-20">
            <div className="glass-panel rounded-none p-4 flex flex-col gap-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-cyan-500/20 bg-slate-950/90 backdrop-blur-md hud-corners">
              <div className="flex items-center gap-2 text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-cyan-500/60 animate-pulse" /> TELEMETRY_FEED_LOGS
              </div>
              <ScrollArea className="h-[80px]">
                <div className="flex flex-col gap-1 pr-2 font-mono">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-2.5 text-[10px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-[9px] text-slate-600 font-mono w-16 flex-none mt-0.5">[{activity.time}]</span>
                      <span className={`font-bold tracking-wide
                        ${activity.type === 'success' ? 'text-emerald-400' : ''}
                        ${activity.type === 'error' ? 'text-rose-400 animate-pulse' : ''}
                        ${activity.type === 'warning' ? 'text-amber-400' : ''}
                        ${activity.type === 'info' ? 'text-cyan-400/80' : ''}
                      `}>
                        &gt; {activity.message}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Device Details */}
        {selectedDevice && (
          <DeviceDetailPanel 
            device={selectedDevice}
            onClose={() => setSelectedDeviceId(null)}
            onUpdateStatus={updateDeviceStatus}
          />
        )}
      </div>
    </div>
  );
}

// Helper component for status dots
function StatusIndicator({ status }: { status: DeviceStatus }) {
  const config = {
    not_tested: { color: "bg-slate-600", label: "PENDING" },
    testing: { color: "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]", label: "TESTING" },
    passed: { color: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]", label: "PASS" },
    failed: { color: "bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]", label: "FAIL" },
    deficiency: { color: "bg-amber-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]", label: "WARN" },
    no_access: { color: "bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]", label: "NO_ACC" },
  };

  const { color, label } = config[status];

  return (
    <div className="flex items-center gap-1.5" title={label}>
      <div className={`w-2 h-2 rounded-none ${color}`} />
      <span className="text-[9px] text-slate-500 font-bold hidden md:inline capitalize">{label}</span>
    </div>
  );
}

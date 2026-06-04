import { useState, useMemo, useEffect, useRef } from "react";
import { Device, DeviceStatus, FLOORS, MOCK_DEVICES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Map as MapIcon, ListFilter, Activity, Play, Pause, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import MapCanvas from "@/components/MapCanvas";
import DeviceDetailPanel from "@/components/DeviceDetailPanel";

// Helper to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
    { id: "init-1", time: formatTime(new Date()), message: "System initialized. Ready for inspection.", type: "info" }
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
      { id: Math.random().toString(36).substring(7), time: formatTime(new Date()), message, type },
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
    const logMsg = `${device.type} ${device.label} on ${device.floor} — ${statusLabel}${note ? ` (${note})` : ""}`;
    
    if (newStatus === "passed") {
      addActivity(logMsg, "success");
      toast.success(`Device Tested: ${device.label} — PASS`, {
        description: `${device.type} at ${device.location}`,
      });
    } else if (newStatus === "failed") {
      addActivity(logMsg, "error");
      toast.error(`Device Tested: ${device.label} — FAIL`, {
        description: `Deficiency logged: ${note || "No details provided"}`,
      });
    } else if (newStatus === "deficiency") {
      addActivity(logMsg, "warning");
      toast.warning(`Device Tested: ${device.label} — DEFICIENCY`, {
        description: note || "Needs review",
      });
    } else if (newStatus === "no_access") {
      addActivity(logMsg, "info");
      toast.info(`Device Tested: ${device.label} — NO ACCESS`, {
        description: "Area was inaccessible during inspection.",
      });
    } else {
      addActivity(`${device.type} ${device.label} reset to Not Tested`, "info");
    }
  };

  // Run Test Simulation
  const startSimulation = () => {
    setIsSimulating(true);
    addActivity("Started automated test simulation", "info");
    toast.info("Test simulation started", {
      description: "Testing devices one by one..."
    });

    simulationIntervalRef.current = setInterval(() => {
      // 1. Find all untested devices on the current floor
      const currentDevices = devicesRef.current.filter(d => d.floor === selectedFloor);
      const untested = currentDevices.filter(d => d.status === "not_tested");

      if (untested.length === 0) {
        // All tested! Stop simulation
        clearInterval(simulationIntervalRef.current!);
        setIsSimulating(false);
        addActivity("Simulation complete. All devices tested on this floor.", "success");
        toast.success("Simulation Complete", {
          description: "All devices on this floor have been inspected."
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
          note = "Battery depleted / signal delay";
        } else if (rand < 0.94) {
          finalStatus = "deficiency";
          note = "Physical damage / label faded";
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
    addActivity("Stopped automated test simulation", "info");
    toast.info("Test simulation stopped");
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
      addActivity(`Selected device: ${device.label} (${device.type})`, "info");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50/50">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 flex-none px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-primary">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold font-display tracking-tight">Inspectra <span className="font-normal text-muted-foreground">Visual Site Map</span></h1>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm font-semibold text-slate-700">Harbour View Apartments</div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Summary */}
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Progress</span>
              <span className="font-bold text-slate-700">{stats.tested} / {stats.total} Tested</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {stats.passed} Pass
              </Badge>
              <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                {stats.failed} Fail
              </Badge>
              {stats.deficiency > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {stats.deficiency} Defect
                </Badge>
              )}
              {stats.noAccess > 0 && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {stats.noAccess} No Access
                </Badge>
              )}
              <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                {stats.notTested} Pending
              </Badge>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6 hidden lg:block" />

          {/* Floor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">Floor:</span>
            <Select value={selectedFloor} onValueChange={(val) => {
              setSelectedFloor(val);
              setSelectedDeviceId(null); // Clear selection when floor changes
              addActivity(`Switched view to ${val}`, "info");
            }}>
              <SelectTrigger className="w-[160px] bg-white font-medium text-slate-700 shadow-sm">
                <SelectValue placeholder="Select floor" />
              </SelectTrigger>
              <SelectContent>
                {FLOORS.map(floor => (
                  <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant={isSimulating ? "destructive" : "default"} 
            className={`gap-2 shadow-sm transition-all duration-300 font-medium ${
              isSimulating ? "bg-rose-500 hover:bg-rose-600" : "bg-slate-900 hover:bg-slate-800"
            }`}
            onClick={toggleSimulation}
          >
            {isSimulating ? <Pause className="w-4 h-4 animate-spin-slow" /> : <Play className="w-4 h-4" />}
            {isSimulating ? "Stop Simulation" : "Run Simulation"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Device List & Filters */}
        <aside className="w-80 flex-none border-r border-slate-200 bg-white/60 backdrop-blur-xl flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
          <div className="p-4 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search devices or types..." 
                className="pl-9 bg-white shadow-sm border-slate-200/80 text-sm h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-white shadow-sm border-slate-200/80 text-slate-600 text-xs h-9">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_tested">Not Tested</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="deficiency">Deficiency</SelectItem>
                <SelectItem value="no_access">No Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-slate-100" />

          <ScrollArea className="flex-1 bg-slate-50/30">
            <div className="p-3 flex flex-col gap-2">
              {filteredDevices.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400 flex flex-col items-center gap-2">
                  <MapIcon className="w-8 h-8 opacity-30" />
                  <span>No devices found matching filters.</span>
                </div>
              ) : (
                filteredDevices.map(device => (
                  <button
                    key={device.id}
                    onClick={() => handleSelectDevice(device.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 ${
                      selectedDeviceId === device.id 
                        ? "bg-white border-slate-300 shadow-md ring-1 ring-slate-200 scale-[1.01]" 
                        : "bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-semibold text-xs text-slate-800">{device.label}</span>
                      <StatusIndicator status={device.status} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{device.type}</span>
                    <span className="text-[10px] text-slate-500 mt-1 truncate w-full">{device.location}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Center - Map Area */}
        <main className="flex-1 relative bg-slate-100/40 overflow-hidden flex flex-col">
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
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/60">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-slate-400" /> Activity Log Feed
              </div>
              <ScrollArea className="h-[80px]">
                <div className="flex flex-col gap-1.5 pr-2">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-[10px] text-slate-400 font-mono w-16 flex-none mt-0.5">{activity.time}</span>
                      <span className={`font-medium
                        ${activity.type === 'success' ? 'text-emerald-600' : ''}
                        ${activity.type === 'error' ? 'text-rose-600 animate-pulse' : ''}
                        ${activity.type === 'warning' ? 'text-amber-600' : ''}
                        ${activity.type === 'info' ? 'text-slate-600' : ''}
                      `}>
                        {activity.message}
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
    not_tested: { color: "bg-slate-300", label: "Pending" },
    testing: { color: "bg-blue-500 animate-pulse", label: "Testing" },
    passed: { color: "bg-emerald-500", label: "Pass" },
    failed: { color: "bg-rose-500 animate-pulse", label: "Fail" },
    deficiency: { color: "bg-amber-500", label: "Deficiency" },
    no_access: { color: "bg-purple-500", label: "No Access" },
  };

  const { color, label } = config[status];

  return (
    <div className="flex items-center gap-1.5" title={label}>
      <div className={`w-2 h-2 rounded-full ${color} shadow-sm`} />
      <span className="text-[10px] text-slate-400 font-medium hidden md:inline capitalize">{status.replace("_", " ")}</span>
    </div>
  );
}

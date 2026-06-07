import React, { useState, useRef, useEffect } from "react";
import { Device, DeviceStatus, DeviceType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  Flame, Shield, AlertTriangle, CheckCircle, HelpCircle, 
  Search, ZoomIn, ZoomOut, Maximize2, RefreshCw, Layers,
  Droplets, Waves, Radio, Volume2, ShieldAlert, Key, HelpCircle as HelpIcon,
  Compass, ArrowRight, Eye, Info
} from "lucide-react";

interface MapCanvasProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
  activeFloor: string;
  activeRole: string; // "fire_company" | "property_manager" | "government"
  theme: "light" | "dark";
}

export default function MapCanvas({ 
  devices, 
  selectedDeviceId, 
  onSelectDevice, 
  activeFloor,
  activeRole,
  theme
}: MapCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when floor changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activeFloor]);

  // Zoom Handler
  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const step = 0.2;
      const next = direction === "in" ? prev + step : prev - step;
      return Math.max(0.5, Math.min(3, next));
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY < 0 ? "in" : "out");
  };

  // Mouse Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Filter devices based on floor & role
  const isEmergencyAsset = (type: DeviceType): boolean => {
    const emergencyTypes: DeviceType[] = [
      "Fire Alarm Panel", "Annunciator", "FDC", "Sprinkler Riser", 
      "Lockbox", "Roof Access", "Electrical Shutoff", "Gas Shutoff", "Standpipe", "Smoke Control Panel"
    ];
    return emergencyTypes.includes(type);
  };

  const filteredDevices = devices.filter((dev) => {
    // Floor filter
    if (dev.floor !== activeFloor) return false;
    
    // Government Mode: Show ONLY emergency-response assets
    if (activeRole === "government") {
      return isEmergencyAsset(dev.type);
    }
    
    return true;
  });

  const getStatusColor = (status: DeviceStatus, isEmergency: boolean) => {
    // Government view override: Highlight emergency assets in vibrant high-contrast purple/blue
    if (activeRole === "government" && isEmergency) {
      return "bg-fuchsia-500 text-slate-950 shadow-[0_0_15px_#d946ef] border-fuchsia-300";
    }

    switch (status) {
      case "passed":
        return "bg-emerald-500 text-slate-950 shadow-[0_0_10px_#10b981] border-emerald-300";
      case "failed":
        return "bg-rose-500 text-slate-950 shadow-[0_0_12px_#f43f5e] border-rose-300 animate-pulse";
      case "deficiency":
        return "bg-amber-500 text-slate-950 shadow-[0_0_10px_#f59e0b] border-amber-300";
      case "testing":
        return "bg-cyan-500 text-slate-950 shadow-[0_0_15px_#06b6d4] border-cyan-300 animate-pulse";
      case "no_access":
        return "bg-slate-500 text-slate-950 shadow-[0_0_8px_#6b7280] border-slate-300";
      case "attention_required":
        return "bg-fuchsia-500 text-slate-950 shadow-[0_0_12px_#d946ef] border-fuchsia-300 animate-pulse";
      default:
        return theme === "light" 
          ? "bg-slate-300 text-slate-700 border-slate-400" 
          : "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  const renderDeviceIcon = (type: DeviceType, className = "w-4 h-4") => {
    switch (type) {
      case "Fire Alarm Panel":
        return <Shield className={className} />;
      case "Annunciator":
        return <Radio className={className} />;
      case "Smoke Detector":
        return <Flame className={className} />;
      case "Heat Detector":
        return <Flame className={className} />;
      case "Pull Station":
        return <Volume2 className={className} />;
      case "Horn/Strobe":
        return <Radio className={className} />;
      case "Speaker/Strobe":
        return <Radio className={className} />;
      case "Sprinkler Riser":
        return <Droplets className={className} />;
      case "FDC":
        return <Waves className={className} />;
      case "Standpipe":
        return <Waves className={className} />;
      case "Fire Extinguisher":
        return <ShieldAlert className={className} />;
      case "Emergency Light":
        return <Compass className={className} />;
      case "Exit Sign":
        return <ArrowRight className={className} />;
      case "Lockbox":
        return <Key className={className} />;
      default:
        return <HelpIcon className={className} />;
    }
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  // Dynamic schematic rendering based on active floor
  const renderFloorSchematic = () => {
    const strokeColor = theme === "light" ? "rgba(71, 85, 105, 0.2)" : "rgba(6, 182, 212, 0.25)";
    const wallColor = theme === "light" ? "rgba(15, 23, 42, 0.7)" : "rgba(6, 182, 212, 0.85)";
    const roomBg = theme === "light" ? "rgba(241, 245, 249, 0.7)" : "rgba(8, 47, 73, 0.15)";

    return (
      <svg className="w-full h-full min-h-[450px]" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Blueprint Grid Mesh */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={strokeColor} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Outer Boundary Wall */}
        <rect x="50" y="50" width="700" height="400" rx="4" stroke={wallColor} strokeWidth="3" fill={roomBg} />

        {/* Core structural dividers based on Floor */}
        {activeFloor === "Parkade P1" && (
          <>
            {/* Pillars and Parking Bays */}
            <line x1="50" y1="150" x2="350" y2="150" stroke={wallColor} strokeWidth="2" strokeDasharray="5,5" />
            <line x1="450" y1="150" x2="750" y2="150" stroke={wallColor} strokeWidth="2" strokeDasharray="5,5" />
            <line x1="50" y1="350" x2="750" y2="350" stroke={wallColor} strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Sprinkler Riser Room */}
            <rect x="50" y="350" width="150" height="100" stroke={wallColor} strokeWidth="2" fill="rgba(6,182,212,0.05)" />
            <text x="125" y="400" fill={theme === "light" ? "#475569" : "#22d3ee"} fontSize="10" fontFamily="monospace" textAnchor="middle">SPRINKLER_RM</text>

            {/* Parking Pillars */}
            <rect x="200" y="240" width="20" height="20" fill={wallColor} />
            <rect x="400" y="240" width="20" height="20" fill={wallColor} />
            <rect x="600" y="240" width="20" height="20" fill={wallColor} />
          </>
        )}

        {activeFloor === "Main Floor" && (
          <>
            {/* Center Corridor */}
            <rect x="50" y="200" width="700" height="100" stroke={wallColor} strokeWidth="2" fill="none" />
            {/* Vertical Office Dividers - Top Row */}
            <line x1="200" y1="50" x2="200" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="350" y1="50" x2="350" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="500" y1="50" x2="500" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="650" y1="50" x2="650" y2="200" stroke={wallColor} strokeWidth="2" />
            {/* Vertical Office Dividers - Bottom Row */}
            <line x1="250" y1="300" x2="250" y2="450" stroke={wallColor} strokeWidth="2" />
            <line x1="550" y1="300" x2="550" y2="450" stroke={wallColor} strokeWidth="2" />
            {/* Lobby & Entrance */}
            <rect x="350" y="300" width="200" height="150" stroke={wallColor} strokeWidth="2" fill="rgba(6,182,212,0.05)" />
            <text x="450" y="380" fill={theme === "light" ? "#475569" : "#22d3ee"} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">MAIN_LOBBY</text>
            {/* Stairwell A */}
            <rect x="50" y="200" width="80" height="100" stroke={wallColor} strokeWidth="2" fill="rgba(244,63,94,0.05)" />
            <text x="90" y="255" fill={theme === "light" ? "#475569" : "#f43f5e"} fontSize="9" fontFamily="monospace" textAnchor="middle">STAIR_A</text>
          </>
        )}

        {activeFloor === "Level 2" && (
          <>
            {/* Center Corridor */}
            <rect x="50" y="200" width="700" height="100" stroke={wallColor} strokeWidth="2" fill="none" />
            {/* Vertical Unit Dividers - Top Row (5 units) */}
            <line x1="175" y1="50" x2="175" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="300" y1="50" x2="300" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="425" y1="50" x2="425" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="550" y1="50" x2="550" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="675" y1="50" x2="675" y2="200" stroke={wallColor} strokeWidth="2" />
            {/* Vertical Unit Dividers - Bottom Row */}
            <line x1="200" y1="300" x2="200" y2="450" stroke={wallColor} strokeWidth="2" />
            <line x1="400" y1="300" x2="400" y2="450" stroke={wallColor} strokeWidth="2" />
            <line x1="600" y1="300" x2="600" y2="450" stroke={wallColor} strokeWidth="2" />
            {/* Laundry Room */}
            <rect x="50" y="300" width="150" height="150" stroke={wallColor} strokeWidth="2" fill="rgba(6,182,212,0.05)" />
            <text x="125" y="378" fill={theme === "light" ? "#475569" : "#22d3ee"} fontSize="10" fontFamily="monospace" textAnchor="middle">LAUNDRY_RM</text>
            {/* Stairwell A */}
            <rect x="50" y="200" width="80" height="100" stroke={wallColor} strokeWidth="2" fill="rgba(244,63,94,0.05)" />
            <text x="90" y="255" fill={theme === "light" ? "#475569" : "#f43f5e"} fontSize="9" fontFamily="monospace" textAnchor="middle">STAIR_A</text>
            <text x="650" y="440" fill={theme === "light" ? "#94a3b8" : "#0891b2"} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.5">UNITS_201-216</text>
          </>
        )}

        {activeFloor === "Level 3" && (
          <>
            {/* Center Corridor */}
            <rect x="50" y="200" width="700" height="100" stroke={wallColor} strokeWidth="2" fill="none" />
            {/* Vertical Dividers - Top Row (3 larger penthouse units) */}
            <line x1="250" y1="50" x2="250" y2="200" stroke={wallColor} strokeWidth="2" />
            <line x1="500" y1="50" x2="500" y2="200" stroke={wallColor} strokeWidth="2" />
            {/* Vertical Dividers - Bottom Row */}
            <line x1="350" y1="300" x2="350" y2="450" stroke={wallColor} strokeWidth="2" />
            <line x1="600" y1="300" x2="600" y2="450" stroke={wallColor} strokeWidth="2" />
            {/* Mechanical Room */}
            <rect x="50" y="300" width="150" height="150" stroke={wallColor} strokeWidth="2" fill="rgba(244,63,94,0.05)" />
            <text x="125" y="378" fill={theme === "light" ? "#475569" : "#f43f5e"} fontSize="9" fontFamily="monospace" textAnchor="middle">MECH_RM</text>
            {/* Storage Room */}
            <rect x="600" y="300" width="150" height="150" stroke={wallColor} strokeWidth="2" fill="rgba(6,182,212,0.05)" />
            <text x="675" y="378" fill={theme === "light" ? "#475569" : "#22d3ee"} fontSize="9" fontFamily="monospace" textAnchor="middle">STORAGE_RM</text>
            {/* Stairwell A */}
            <rect x="50" y="200" width="80" height="100" stroke={wallColor} strokeWidth="2" fill="rgba(244,63,94,0.05)" />
            <text x="90" y="255" fill={theme === "light" ? "#475569" : "#f43f5e"} fontSize="9" fontFamily="monospace" textAnchor="middle">STAIR_A</text>
            <text x="650" y="440" fill={theme === "light" ? "#94a3b8" : "#0891b2"} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.5">UNITS_301-308</text>
          </>
        )}

        {activeFloor === "Roof" && (
          <>
            {/* Roof Deck Area */}
            <rect x="150" y="100" width="500" height="300" rx="2" stroke={wallColor} strokeWidth="2" strokeDasharray="4,4" fill="none" />
            <text x="400" y="250" fill={theme === "light" ? "#94a3b8" : "#0891b2"} fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ROOF_DECK_ZONE</text>

            {/* Elevator Machine Room Penthouse */}
            <rect x="320" y="180" width="160" height="140" stroke={wallColor} strokeWidth="2.5" fill="rgba(6,182,212,0.08)" />
            <text x="400" y="240" fill={theme === "light" ? "#475569" : "#22d3ee"} fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ELEVATOR_PENTHOUSE</text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-0 select-none">
      {/* HUD Toolbar Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 border border-cyan-500/30 p-1.5 backdrop-blur-md">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleZoom("in")} 
          className="h-8 w-8 rounded-none text-cyan-400 hover:bg-cyan-500/10"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleZoom("out")} 
          className="h-8 w-8 rounded-none text-cyan-400 hover:bg-cyan-500/10"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleReset} 
          className="h-8 w-8 rounded-none text-cyan-400 hover:bg-cyan-500/10"
          title="Recenter Map"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-cyan-500/20 mx-1" />
        <span className="text-[9px] font-mono text-slate-500 px-2 uppercase font-bold">
          ZOOM: {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Map Mode Notification Badge */}
      {activeRole === "government" && (
        <div className="absolute top-4 right-4 z-10 bg-fuchsia-950/90 border border-fuchsia-500 text-fuchsia-400 px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.3)] animate-pulse flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>GOVERNMENT_EMERGENCY_TACTICAL_VIEW</span>
        </div>
      )}

      {/* Main Map Canvas Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing transition-colors duration-200 ${
          theme === "light" ? "bg-slate-100" : "bg-[#040814]"
        }`}
      >
        {/* Blueprint Canvas Frame */}
        <div 
          ref={mapRef}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)"
          }}
          className="w-full h-full relative flex items-center justify-center min-w-[800px] min-h-[500px]"
        >
          {/* Schematic SVG Vector Blueprint */}
          {renderFloorSchematic()}

          {/* Coordinate crosshair overlays for selected device */}
          {selectedDevice && selectedDevice.floor === activeFloor && (
            <>
              {/* Horizontal Crosshair Guideline */}
              <div 
                style={{ top: `${selectedDevice.y}%` }}
                className="absolute left-0 right-0 h-px border-t border-dashed border-cyan-500/30 pointer-events-none"
              />
              {/* Vertical Crosshair Guideline */}
              <div 
                style={{ left: `${selectedDevice.x}%` }}
                className="absolute top-0 bottom-0 w-px border-l border-dashed border-cyan-500/30 pointer-events-none"
              />
            </>
          )}

          {/* Device Pins */}
          {filteredDevices.map((dev) => {
            const isSelected = dev.id === selectedDeviceId;
            const isEmergency = isEmergencyAsset(dev.type);
            const statusClass = getStatusColor(dev.status, isEmergency);

            return (
              <button
                key={dev.id}
                id={`pin-${dev.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDevice(dev.id);
                }}
                style={{
                  left: `${dev.x}%`,
                  top: `${dev.y}%`,
                  transform: "translate(-50%, -50%)"
                }}
                className={`absolute p-1.5 border transition-all duration-200 focus:outline-none group z-20 ${statusClass} ${
                  isSelected 
                    ? "scale-125 ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 z-30" 
                    : "hover:scale-110"
                }`}
              >
                {/* Glowing ring under selected or testing pins */}
                {isSelected && (
                  <span className="absolute inset-0 rounded-none border border-cyan-400 animate-ping opacity-75 pointer-events-none" />
                )}
                {dev.status === "testing" && (
                  <span className="absolute inset-[-4px] rounded-none border border-cyan-500 animate-ping opacity-60 pointer-events-none" />
                )}
                {activeRole === "government" && isEmergency && (
                  <span className="absolute inset-[-6px] rounded-none border border-fuchsia-500/40 animate-pulse pointer-events-none" />
                )}

                {/* Device Icon */}
                {renderDeviceIcon(dev.type)}

                {/* Tooltip Overlay */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950/95 border border-cyan-500/30 text-cyan-400 text-[9px] font-mono whitespace-nowrap rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-40 shadow-[0_0_10px_rgba(6,182,212,0.15)] uppercase">
                  {dev.label} // {dev.type}
                  {dev.status !== "not_tested" && ` [${dev.status.toUpperCase()}]`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Legends Footer */}
      <div className="border-t border-cyan-500/10 bg-slate-950/60 p-3 backdrop-blur-md font-mono text-[9px] flex flex-wrap gap-x-6 gap-y-2 items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-500 uppercase font-bold">MAP_STATUS_LEGEND:</span>
          
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-slate-800 border border-slate-700" />
            <span className="text-slate-400 uppercase">PENDING (NOT TESTED)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 border border-emerald-300 shadow-[0_0_5px_#10b981]" />
            <span className="text-slate-400 uppercase">PASSED (COMPLIANT)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-rose-500 border border-rose-300 shadow-[0_0_5px_#f43f5e]" />
            <span className="text-slate-400 uppercase">FAILED (CRITICAL)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-amber-500 border border-amber-300 shadow-[0_0_5px_#f59e0b]" />
            <span className="text-slate-400 uppercase">DEFICIENCY (WARNING)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-cyan-500 border border-cyan-300 shadow-[0_0_5px_#06b6d4]" />
            <span className="text-slate-400 uppercase">TESTING IN PROGRESS</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-slate-500 border border-slate-300" />
            <span className="text-slate-400 uppercase">NO ACCESS</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_5px_#d946ef]" />
            <span className="text-slate-400 uppercase">ATTENTION REQUIRED</span>
          </div>

          {activeRole === "government" && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-fuchsia-500 border border-fuchsia-300 shadow-[0_0_8px_#d946ef]" />
              <span className="text-fuchsia-400 uppercase font-bold">EMERGENCY RESPOND-NODE</span>
            </div>
          )}
        </div>

        <div className="text-slate-500 uppercase flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-500/50" />
          <span>DRAG TO PAN // SCROLL OR HUD BUTTONS TO ZOOM</span>
        </div>
      </div>
    </div>
  );
}

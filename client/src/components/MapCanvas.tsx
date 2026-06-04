import React, { useState, useRef, useMemo } from "react";
import { Device, DeviceStatus, DeviceType } from "@/lib/mock-data";
import { 
  ZoomIn, ZoomOut, RefreshCw, 
  Flame, BellRing, ShieldAlert, Zap, Radio, 
  Lightbulb, ShieldAlert as ExitIcon, FlameKindling, 
  Droplets, Waves, ClipboardList, Crosshair
} from "lucide-react";

interface MapCanvasProps {
  floor: string;
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
  animatingDeviceId?: string | null;
}

// Map Icon Config mapping device types to Lucide Icons
export const getDeviceIcon = (type: DeviceType, className = "w-4 h-4") => {
  switch (type) {
    case "Smoke Detector":
      return <Flame className={className} />;
    case "Heat Detector":
      return <FlameKindling className={className} />;
    case "Pull Station":
      return <ShieldAlert className={className} />;
    case "Horn/Strobe":
      return <BellRing className={className} />;
    case "Fire Alarm Panel":
      return <ClipboardList className={className} />;
    case "Annunciator":
      return <Radio className={className} />;
    case "Emergency Light":
      return <Zap className={className} />;
    case "Exit Sign":
      return <ExitIcon className={className} />;
    case "Fire Extinguisher":
      return <FlameKindling className={className} />;
    case "Sprinkler Flow Switch":
      return <Droplets className={className} />;
    case "Backflow Preventer":
      return <Waves className={className} />;
    default:
      return <Flame className={className} />;
  }
};

export const getStatusColors = (status: DeviceStatus) => {
  switch (status) {
    case "not_tested":
      return {
        bg: "bg-slate-900/90 hover:bg-slate-850 border-slate-700 text-slate-400",
        text: "text-slate-400",
        glow: "shadow-inner border-slate-700",
        accent: "border-slate-600",
        neon: "rgba(100,116,139,0.2)"
      };
    case "testing":
      return {
        bg: "bg-cyan-950/95 hover:bg-cyan-900 border-cyan-500 text-cyan-400 animate-pulse",
        text: "text-cyan-400",
        glow: "shadow-[0_0_15px_rgba(6,182,212,0.6)] ring-2 ring-cyan-500/30",
        accent: "border-cyan-400",
        neon: "rgba(6,182,212,0.6)"
      };
    case "passed":
      return {
        bg: "bg-emerald-950/95 hover:bg-emerald-900 border-emerald-500 text-emerald-400",
        text: "text-emerald-400",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.5)] border-emerald-500",
        accent: "border-emerald-400",
        neon: "rgba(16,185,129,0.4)"
      };
    case "failed":
      return {
        bg: "bg-rose-950/95 hover:bg-rose-900 border-rose-500 text-rose-400 animate-bounce-slow",
        text: "text-rose-400",
        glow: "shadow-[0_0_20px_rgba(244,63,94,0.7)] ring-2 ring-rose-500/40 border-rose-500",
        accent: "border-rose-400",
        neon: "rgba(244,63,94,0.6)"
      };
    case "deficiency":
      return {
        bg: "bg-amber-950/95 hover:bg-amber-900 border-amber-500 text-amber-400",
        text: "text-amber-400",
        glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)] border-amber-500",
        accent: "border-amber-400",
        neon: "rgba(234,179,8,0.4)"
      };
    case "no_access":
      return {
        bg: "bg-purple-950/95 hover:bg-purple-900 border-purple-500 text-purple-400",
        text: "text-purple-400",
        glow: "shadow-[0_0_12px_rgba(139,92,246,0.5)] border-purple-500",
        accent: "border-purple-400",
        neon: "rgba(139,92,246,0.4)"
      };
  }
};

export default function MapCanvas({ floor, devices, selectedDeviceId, onSelectDevice, animatingDeviceId }: MapCanvasProps) {
  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Reset zoom and pan
  const resetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.6));

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click drag
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  // Selected device object for coordinates crosshair
  const selectedDevice = useMemo(() => {
    return devices.find(d => d.id === selectedDeviceId) || null;
  }, [devices, selectedDeviceId]);

  // SVG Floor Schematics (Industrial Tactical HUD styling - Neon cyan/green vectors on dark obsidian)
  const renderFloorSchematic = useMemo(() => {
    const wallColor = "#0f172a";
    const lineStroke = "oklch(0.7 0.18 190 / 40%)"; // Neon cyan low-opacity
    const textFill = "oklch(0.7 0.18 190 / 60%)";
    const roomFill = "#020617"; // Obsidian dark room fill

    switch (floor) {
      case "P1 Parkade":
        return (
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="4" stroke={lineStroke} strokeWidth="3" fill={roomFill} />
            {/* Parking pillars */}
            <rect x="150" y="150" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            <rect x="350" y="150" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            <rect x="550" y="150" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            <rect x="150" y="350" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            <rect x="350" y="350" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            <rect x="550" y="350" width="40" height="40" stroke={lineStroke} strokeWidth="1.5" fill="#0f172a" />
            {/* Driveway lines */}
            <line x1="50" y1="280" x2="750" y2="280" stroke={lineStroke} strokeWidth="1" strokeDasharray="6 6" />
            <line x1="50" y1="320" x2="750" y2="320" stroke={lineStroke} strokeWidth="1" strokeDasharray="6 6" />
            {/* Rooms */}
            <rect x="50" y="450" width="180" height="100" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="140" y="500" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">SPRINKLER RISER ROOM</text>
            <rect x="230" y="450" width="120" height="100" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="290" y="500" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">MECHANICAL</text>
            {/* Parking spaces lines */}
            <line x1="100" y1="50" x2="100" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="200" y1="50" x2="200" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="300" y1="50" x2="300" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="400" y1="50" x2="400" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="500" y1="50" x2="500" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="600" y1="50" x2="600" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            <line x1="700" y1="50" x2="700" y2="120" stroke={lineStroke} strokeWidth="1" opacity="0.5" />
            {/* Storage room */}
            <rect x="250" y="50" width="150" height="80" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="325" y="95" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">STORAGE LOCKERS</text>
            {/* Elevator Lobby */}
            <rect x="300" y="240" width="140" height="80" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="370" y="285" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">ELEVATOR LOBBY</text>
          </svg>
        );
      case "Main Floor":
        return (
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="4" stroke={lineStroke} strokeWidth="3" fill={roomFill} />
            {/* Main Corridor */}
            <rect x="150" y="150" width="500" height="300" stroke={lineStroke} strokeWidth="1.5" strokeDasharray="4 4" fill="#090d16" />
            <text x="400" y="305" textAnchor="middle" fill={textFill} className="text-xs font-bold tracking-widest">MAIN CORRIDOR SEC-01</text>
            {/* Office Rooms */}
            <rect x="50" y="50" width="200" height="150" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="150" y="130" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">OFFICE SUITE 101</text>
            <rect x="550" y="50" width="200" height="150" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="650" y="130" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">OFFICE SUITE 102</text>
            {/* Electrical Room */}
            <rect x="600" y="250" width="150" height="150" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="675" y="330" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">MAIN ELEC. ROOM</text>
            {/* Main Lobby */}
            <rect x="250" y="400" width="300" height="150" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="400" y="480" textAnchor="middle" fill={textFill} className="text-xs font-bold tracking-widest">MAIN ENTRANCE LOBBY</text>
            {/* Kitchen */}
            <rect x="50" y="250" width="150" height="150" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="125" y="330" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">BREAKROOM KITCHEN</text>
          </svg>
        );
      case "2nd Floor":
        return (
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="4" stroke={lineStroke} strokeWidth="3" fill={roomFill} />
            {/* Central Corridor */}
            <rect x="150" y="150" width="500" height="300" stroke={lineStroke} strokeWidth="1.5" strokeDasharray="4 4" fill="#090d16" />
            <text x="400" y="305" textAnchor="middle" fill={textFill} className="text-xs font-bold tracking-widest">CENTRAL RESIDENTIAL HALLWAY</text>
            {/* Apartments units */}
            <rect x="50" y="50" width="350" height="180" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="225" y="140" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">RESIDENCE UNIT 201</text>
            <rect x="400" y="50" width="350" height="180" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="575" y="140" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">RESIDENCE UNIT 202</text>
            <rect x="50" y="370" width="350" height="180" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="225" y="460" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">RESIDENCE UNIT 203</text>
            <rect x="400" y="370" width="350" height="180" stroke={lineStroke} strokeWidth="2" fill="#090d16" />
            <text x="575" y="460" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">RESIDENCE UNIT 204</text>
            {/* Stairwells */}
            <rect x="50" y="230" width="100" height="140" stroke={lineStroke} strokeWidth="2" fill="#0f172a" />
            <text x="100" y="305" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">STAIR A</text>
            <rect x="650" y="230" width="100" height="140" stroke={lineStroke} strokeWidth="2" fill="#0f172a" />
            <text x="700" y="305" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">STAIR B</text>
          </svg>
        );
      case "Roof":
        return (
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Roof Outline */}
            <rect x="150" y="100" width="500" height="400" rx="4" stroke={lineStroke} strokeWidth="3" fill={roomFill} />
            {/* Elevator Machine Room */}
            <rect x="320" y="200" width="160" height="160" stroke={lineStroke} strokeWidth="2.5" fill="#090d16" />
            <text x="400" y="285" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">ELEVATOR MACHINE ROOM</text>
            {/* Roof Deck */}
            <rect x="180" y="130" width="440" height="340" stroke={lineStroke} strokeWidth="1" strokeDasharray="8 4" />
            <text x="400" y="160" textAnchor="middle" fill={textFill} className="text-xs font-bold tracking-widest">ROOF DECK / HELIPAD ACCESS</text>
            {/* Stairwell exit */}
            <rect x="500" y="200" width="80" height="80" stroke={lineStroke} strokeWidth="2" fill="#0f172a" />
            <text x="540" y="245" textAnchor="middle" fill={textFill} className="text-[10px] font-bold tracking-wider">STAIR C</text>
          </svg>
        );
      default:
        return null;
    }
  }, [floor]);

  return (
    <div className="relative w-full h-full select-none scanline-overlay">
      {/* Zoom / Pan Control Panel */}
      <div className="absolute top-4 right-4 z-30 flex gap-1.5 p-1 rounded-md glass-panel border border-cyan-500/30">
        <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetZoomPan} className="p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400 hover:text-cyan-300 transition-colors" title="Reset View">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Floor / Telemetry Tag */}
      <div className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded glass-panel border border-cyan-500/30 text-[10px] font-bold tracking-wider text-cyan-400 flex items-center gap-2">
        <Crosshair className="w-3.5 h-3.5 animate-spin-slow" />
        <span>SYS.MAP // {floor.toUpperCase()}</span>
      </div>

      {/* Main Map Container */}
      <div 
        ref={mapRef}
        className={`w-full h-full overflow-hidden relative rounded-md border border-cyan-500/20 bg-[#040711] flex items-center justify-center transition-colors duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Dynamic HUD Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.06)_1px,transparent_1px)] bg-[size:25px_25px]" />
        
        {/* Radar concentric sweep graphic */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_0%,transparent_70%)] pointer-events-none" />

        {/* Transform Wrapper */}
        <div 
          className="relative w-[800px] h-[600px] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {/* Floor Schematic */}
          <div className="absolute inset-0 z-0 shadow-2xl rounded border border-cyan-500/10 overflow-hidden bg-[#02040a]">
            {renderFloorSchematic}
          </div>

          {/* Crosshair guidelines when a device is selected */}
          {selectedDevice && (
            <div className="absolute inset-0 z-5 pointer-events-none">
              {/* Horizontal line */}
              <div 
                className="absolute left-0 right-0 h-[1px] bg-cyan-500/20 border-t border-dashed border-cyan-500/30"
                style={{ top: `${selectedDevice.y}%` }}
              />
              {/* Vertical line */}
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-cyan-500/20 border-l border-dashed border-cyan-500/30"
                style={{ left: `${selectedDevice.x}%` }}
              />
            </div>
          )}

          {/* Device Pins */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {devices.map((device) => {
              const colors = getStatusColors(device.status);
              const isSelected = selectedDeviceId === device.id;
              const isAnimating = animatingDeviceId === device.id;

              return (
                <button
                  key={device.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDevice(device.id);
                  }}
                  className={`absolute pointer-events-auto group -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 ${
                    isSelected ? "z-40 scale-125" : "z-20 hover:scale-110"
                  }`}
                  style={{
                    left: `${device.x}%`,
                    top: `${device.y}%`,
                  }}
                >
                  {/* Glowing Radar Rings (Testing, Animating, or Failed) */}
                  {(isAnimating || device.status === "testing" || isSelected) && (
                    <div 
                      className="absolute -inset-4 rounded-full animate-ping opacity-60 border border-current"
                      style={{ color: colors.neon }}
                    />
                  )}

                  {/* Pin Body (Cyberpunk HUD styled hexagonal/circular badge with neon border glow) */}
                  <div 
                    className={`relative w-8 h-8 rounded border flex items-center justify-center transition-all duration-300 ${colors.bg} ${colors.glow} ${
                      isSelected ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-110" : ""
                    }`}
                    style={{ boxShadow: isSelected ? `0 0 15px ${colors.neon}` : '' }}
                  >
                    {getDeviceIcon(device.type, "w-4 h-4")}
                    
                    {/* Tiny badge for deficiency */}
                    {device.status === "deficiency" && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border border-slate-950 flex items-center justify-center text-[8px] font-extrabold text-slate-950">!</div>
                    )}
                  </div>

                  {/* Tooltip / Label */}
                  <div className="absolute top-full mt-1.5 px-2 py-1 bg-slate-950/95 border border-cyan-500/30 text-cyan-400 text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.2)] whitespace-nowrap z-50 font-mono">
                    {device.label} // {device.type.toUpperCase()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

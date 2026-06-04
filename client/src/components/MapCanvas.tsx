import React, { useState, useRef, useMemo } from "react";
import { Device, DeviceStatus, DeviceType } from "@/lib/mock-data";
import { 
  ZoomIn, ZoomOut, RefreshCw, Maximize2,
  Flame, BellRing, ShieldAlert, Zap, Radio, 
  Lightbulb, ShieldAlert as ExitIcon, FlameKindling, 
  Droplets, Waves, ClipboardList
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
        bg: "bg-slate-100 hover:bg-slate-200 border-slate-300",
        text: "text-slate-600",
        glow: "shadow-sm",
        accent: "border-slate-400"
      };
    case "testing":
      return {
        bg: "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white animate-pulse",
        text: "text-white",
        glow: "shadow-[0_0_15px_rgba(59,130,246,0.6)] ring-4 ring-blue-100",
        accent: "border-blue-700"
      };
    case "passed":
      return {
        bg: "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white",
        text: "text-white",
        glow: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
        accent: "border-emerald-700"
      };
    case "failed":
      return {
        bg: "bg-rose-500 hover:bg-rose-600 border-rose-600 text-white animate-bounce-slow",
        text: "text-white",
        glow: "shadow-[0_0_15px_rgba(244,63,94,0.6)] ring-4 ring-rose-100",
        accent: "border-rose-700"
      };
    case "deficiency":
      return {
        bg: "bg-amber-500 hover:bg-amber-600 border-amber-600 text-white",
        text: "text-white",
        glow: "shadow-[0_0_12px_rgba(234,179,8,0.4)]",
        accent: "border-amber-700"
      };
    case "no_access":
      return {
        bg: "bg-purple-500 hover:bg-purple-600 border-purple-600 text-white",
        text: "text-white",
        glow: "shadow-[0_0_12px_rgba(139,92,246,0.4)]",
        accent: "border-purple-700"
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

  // SVG Floor Schematics based on Floor Name
  const renderFloorSchematic = useMemo(() => {
    switch (floor) {
      case "P1 Parkade":
        return (
          <svg className="w-full h-full text-slate-200" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="8" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Parking pillars */}
            <rect x="150" y="150" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <rect x="350" y="150" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <rect x="550" y="150" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <rect x="150" y="350" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <rect x="350" y="350" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <rect x="550" y="350" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            {/* Driveway lines */}
            <line x1="50" y1="280" x2="750" y2="280" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            <line x1="50" y1="320" x2="750" y2="320" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            {/* Rooms */}
            <rect x="50" y="450" width="180" height="100" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="140" y="500" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Sprinkler Room</text>
            <rect x="230" y="450" width="120" height="100" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="290" y="500" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Mechanical</text>
            {/* Parking spaces lines */}
            <line x1="100" y1="50" x2="100" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="200" y1="50" x2="200" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="300" y1="50" x2="300" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="400" y1="50" x2="400" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="500" y1="50" x2="500" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="600" y1="50" x2="600" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="700" y1="50" x2="700" y2="120" stroke="currentColor" strokeWidth="1.5" />
            {/* Storage room */}
            <rect x="250" y="50" width="150" height="80" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="325" y="95" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Storage Room</text>
            {/* Elevator Lobby */}
            <rect x="300" y="240" width="140" height="80" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="370" y="285" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Elevator Lobby</text>
          </svg>
        );
      case "Main Floor":
        return (
          <svg className="w-full h-full text-slate-200" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="8" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Main Corridor */}
            <rect x="150" y="150" width="500" height="300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="#f1f5f9" />
            <text x="400" y="305" textAnchor="middle" fill="#64748b" className="text-sm font-semibold tracking-wider">Main Corridor</text>
            {/* Office Rooms */}
            <rect x="50" y="50" width="200" height="150" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="150" y="130" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Office 101</text>
            <rect x="550" y="50" width="200" height="150" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="650" y="130" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Office 102</text>
            {/* Electrical Room */}
            <rect x="600" y="250" width="150" height="150" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="675" y="330" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Electrical Room</text>
            {/* Main Lobby */}
            <rect x="250" y="400" width="300" height="150" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="400" y="480" textAnchor="middle" fill="#64748b" className="text-sm font-semibold">Main Lobby</text>
            {/* Kitchen */}
            <rect x="50" y="250" width="150" height="150" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="125" y="330" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Kitchen</text>
          </svg>
        );
      case "2nd Floor":
        return (
          <svg className="w-full h-full text-slate-200" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer walls */}
            <rect x="50" y="50" width="700" height="500" rx="8" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Central Corridor */}
            <rect x="150" y="150" width="500" height="300" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="#f1f5f9" />
            <text x="400" y="305" textAnchor="middle" fill="#64748b" className="text-sm font-semibold tracking-wider">Central Corridor</text>
            {/* Apartments units */}
            <rect x="50" y="50" width="350" height="180" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="225" y="140" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Unit 201</text>
            <rect x="400" y="50" width="350" height="180" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="575" y="140" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Unit 202</text>
            <rect x="50" y="370" width="350" height="180" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="225" y="460" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Unit 203</text>
            <rect x="400" y="370" width="350" height="180" stroke="currentColor" strokeWidth="2" fill="#f1f5f9" />
            <text x="575" y="460" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Unit 204</text>
            {/* Stairwells */}
            <rect x="50" y="230" width="100" height="140" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <text x="100" y="305" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Stairwell A</text>
            <rect x="650" y="230" width="100" height="140" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <text x="700" y="305" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Stairwell B</text>
          </svg>
        );
      case "Roof":
        return (
          <svg className="w-full h-full text-slate-200" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Roof Outline */}
            <rect x="150" y="100" width="500" height="400" rx="8" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Elevator Machine Room */}
            <rect x="320" y="200" width="160" height="160" stroke="currentColor" strokeWidth="3" fill="#f1f5f9" />
            <text x="400" y="285" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Elevator Machine Room</text>
            {/* Roof Deck */}
            <rect x="180" y="130" width="440" height="340" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            <text x="400" y="160" textAnchor="middle" fill="#94a3b8" className="text-sm font-semibold">Roof Deck</text>
            {/* Stairwell exit */}
            <rect x="500" y="200" width="80" height="80" stroke="currentColor" strokeWidth="2" fill="#e2e8f0" />
            <text x="540" y="245" textAnchor="middle" fill="#64748b" className="text-xs font-semibold">Stairwell C</text>
          </svg>
        );
      default:
        return null;
    }
  }, [floor]);

  return (
    <div className="relative w-full h-full select-none">
      {/* Zoom / Pan Control Panel */}
      <div className="absolute top-4 right-4 z-30 flex gap-1.5 p-1.5 rounded-xl glass-panel">
        <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={resetZoomPan} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Reset View">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map Container */}
      <div 
        ref={mapRef}
        className={`w-full h-full overflow-hidden relative rounded-2xl border border-slate-200/60 bg-slate-50 flex items-center justify-center transition-colors duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.25]" />

        {/* Transform Wrapper */}
        <div 
          className="relative w-[800px] h-[600px] transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {/* Floor Schematic */}
          <div className="absolute inset-0 z-0 shadow-lg rounded-xl overflow-hidden bg-white border border-slate-200/50">
            {renderFloorSchematic}
          </div>

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
                  {/* Glowing Outer Ring (Pulsing for active animation, failed state, or selected state) */}
                  {(isAnimating || device.status === "testing" || isSelected) && (
                    <div className={`absolute -inset-3 rounded-full animate-ping opacity-75 ${
                      device.status === "failed" ? "bg-rose-400" : "bg-blue-400"
                    }`} />
                  )}

                  {/* Pin Body */}
                  <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${colors.bg} ${colors.glow} ${
                    isSelected ? "ring-2 ring-slate-900 ring-offset-2 scale-110" : ""
                  }`}>
                    {getDeviceIcon(device.type, "w-4 h-4")}
                    
                    {/* Tiny badge for deficiency */}
                    {device.status === "deficiency" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white">!</div>
                    )}
                  </div>

                  {/* Tooltip / Label */}
                  <div className={`absolute top-full mt-1 px-2 py-1 bg-slate-900/90 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md whitespace-nowrap z-50`}>
                    {device.label} ({device.type})
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

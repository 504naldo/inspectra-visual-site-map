import React, { useState, useEffect } from "react";
import { Device, DeviceStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, CheckCircle, AlertTriangle, EyeOff, 
  RotateCcw, AlertCircle, MapPin, Calendar, Tag, Crosshair
} from "lucide-react";
import { getDeviceIcon, getStatusColors } from "./MapCanvas";

interface DeviceDetailPanelProps {
  device: Device | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: DeviceStatus, note?: string) => void;
}

export default function DeviceDetailPanel({ device, onClose, onUpdateStatus }: DeviceDetailPanelProps) {
  const [deficiencyNote, setDeficiencyNote] = useState("");
  const [showDeficiencyInput, setShowDeficiencyInput] = useState(false);
  const [isFailing, setIsFailing] = useState(false);

  // Sync state when device changes
  useEffect(() => {
    if (device) {
      setDeficiencyNote(device.deficiencyNote || "");
      setShowDeficiencyInput(device.status === "deficiency" || device.status === "failed");
      setIsFailing(device.status === "failed");
    }
  }, [device]);

  if (!device) return null;

  const colors = getStatusColors(device.status);

  const handleMarkPass = () => {
    onUpdateStatus(device.id, "passed");
    setShowDeficiencyInput(false);
    setIsFailing(false);
  };

  const handleMarkFail = () => {
    setIsFailing(true);
    setShowDeficiencyInput(true);
  };

  const handleSaveFailOrDeficiency = () => {
    const status: DeviceStatus = isFailing ? "failed" : "deficiency";
    onUpdateStatus(device.id, status, deficiencyNote);
  };

  const handleNoAccess = () => {
    onUpdateStatus(device.id, "no_access");
    setShowDeficiencyInput(false);
    setIsFailing(false);
  };

  const handleReset = () => {
    onUpdateStatus(device.id, "not_tested");
    setDeficiencyNote("");
    setShowDeficiencyInput(false);
    setIsFailing(false);
  };

  const handleAddDeficiency = () => {
    setIsFailing(false);
    setShowDeficiencyInput(true);
  };

  return (
    <div className="w-80 flex-none border-l border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 font-mono hud-corners">
      {/* Panel Header */}
      <div className="p-4 flex items-center justify-between border-b border-cyan-500/10 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded border flex items-center justify-center ${colors.bg}`}>
            {getDeviceIcon(device.type, "w-4 h-4")}
          </div>
          <div>
            <h3 className="font-bold text-xs tracking-wider text-cyan-400">{device.label}</h3>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{device.type}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Status Badge */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Crosshair className="w-3 h-3 text-cyan-500/60" /> STATUS_TELEMETRY
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`capitalize px-2.5 py-0.5 text-[10px] font-bold rounded-none ${colors.bg} ${colors.text} border-current shadow-sm`}>
              {device.status.replace("_", " ")}
            </Badge>
            {device.deficiencyNote && (
              <Badge variant="outline" className="bg-rose-950/40 text-rose-400 border-rose-500/30 text-[9px] rounded-none">
                DEFECT_LOGGED
              </Badge>
            )}
          </div>
        </div>

        {/* Location Info */}
        <div className="flex flex-col gap-3 bg-slate-900/60 p-3 rounded-none border border-cyan-500/10">
          <div className="flex items-start gap-2.5 text-[10px]">
            <MapPin className="w-3.5 h-3.5 text-cyan-500/60 mt-0.5 flex-none" />
            <div>
              <span className="font-bold text-cyan-400 uppercase tracking-wider">{device.floor}</span>
              <p className="text-slate-400 mt-1 leading-normal uppercase">{device.area} // {device.location}</p>
            </div>
          </div>

          <Separator className="bg-cyan-500/10" />

          <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
            <Tag className="w-3.5 h-3.5 text-cyan-500/60 flex-none" />
            <span>CLASS: <strong className="text-cyan-400 font-bold uppercase">{device.category}</strong></span>
          </div>

          {device.lastTestedAt && (
            <>
              <Separator className="bg-cyan-500/10" />
              <div className="flex items-center gap-2.5 text-[10px] text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-cyan-500/60 flex-none" />
                <span>TIMESTAMP: <strong className="text-cyan-400 font-bold">{new Date(device.lastTestedAt).toLocaleTimeString()}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Deficiency Note Display */}
        {device.deficiencyNote && !showDeficiencyInput && (
          <div className="p-3 bg-rose-950/20 rounded-none border border-rose-500/30 flex flex-col gap-1">
            <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> DEFICIENCY_LOG
            </span>
            <p className="text-[10px] text-rose-300 leading-relaxed italic">"{device.deficiencyNote}"</p>
          </div>
        )}

        {/* Action Form for Deficiency/Fail */}
        {showDeficiencyInput && (
          <div className="p-3 bg-slate-900/80 rounded-none border border-cyan-500/20 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{isFailing ? "LOG_TEST_FAILURE" : "LOG_DEFICIENCY"}</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note" className="text-[9px] text-slate-400 uppercase tracking-wider">Deficiency Log Input</Label>
              <Textarea 
                id="note"
                placeholder="INPUT REASON FOR TEST DEVIATION..."
                className="text-[10px] bg-slate-950 border-cyan-500/20 text-cyan-400 placeholder:text-slate-600 rounded-none min-h-[60px] focus-visible:ring-cyan-500/50 uppercase"
                value={deficiencyNote}
                onChange={(e) => setDeficiencyNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" className="text-[10px] h-7 rounded-none hover:bg-cyan-500/10 text-slate-400" onClick={() => setShowDeficiencyInput(false)}>
                CANCEL
              </Button>
              <Button size="sm" className="text-[10px] h-7 rounded-none bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold" onClick={handleSaveFailOrDeficiency} disabled={!deficiencyNote.trim()}>
                COMMIT_{isFailing ? "FAIL" : "DEFICIENCY"}
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showDeficiencyInput && (
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-cyan-500/60" /> OVERRIDE_CONTROLS
            </span>
            
            <Button 
              className="w-full justify-start gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-none shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
              onClick={handleMarkPass}
            >
              <CheckCircle className="w-4 h-4" /> MARK PASS
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start gap-1.5 text-rose-400 border-rose-500/30 hover:bg-rose-950/30 hover:border-rose-500 font-bold rounded-none"
                onClick={handleMarkFail}
              >
                <AlertCircle className="w-3.5 h-3.5" /> MARK FAIL
              </Button>

              <Button 
                variant="outline" 
                className="justify-start gap-1.5 text-amber-400 border-amber-500/30 hover:bg-amber-950/30 hover:border-amber-500 font-bold rounded-none"
                onClick={handleAddDeficiency}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> DEFICIENCY
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 text-purple-400 border-purple-500/30 hover:bg-purple-950/30 hover:border-purple-500 font-bold rounded-none"
              onClick={handleNoAccess}
            >
              <EyeOff className="w-4 h-4" /> NO ACCESS
            </Button>

            {device.status !== "not_tested" && (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-none"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" /> RESET TO PENDING
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Device, DeviceStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, CheckCircle, AlertTriangle, EyeOff, 
  RotateCcw, AlertCircle, MapPin, Calendar, Tag
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
    <div className="w-80 flex-none border-l border-slate-200 bg-white/80 backdrop-blur-xl flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] animate-in slide-in-from-right duration-300">
      {/* Panel Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
            {getDeviceIcon(device.type, "w-4 h-4")}
          </div>
          <div>
            <h3 className="font-bold text-sm">{device.label}</h3>
            <p className="text-xs text-muted-foreground">{device.type}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* Status Badge */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Current Status</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`capitalize px-2.5 py-0.5 text-xs ${colors.bg} ${colors.text} border-transparent shadow-sm`}>
              {device.status.replace("_", " ")}
            </Badge>
            {device.deficiencyNote && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                Deficiency Logged
              </Badge>
            )}
          </div>
        </div>

        {/* Location Info */}
        <div className="flex flex-col gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-none" />
            <div>
              <span className="font-semibold text-slate-700">{device.floor}</span>
              <p className="text-slate-500 mt-0.5">{device.area} &bull; {device.location}</p>
            </div>
          </div>

          <Separator className="bg-slate-200/50" />

          <div className="flex items-center gap-2.5 text-xs text-slate-500">
            <Tag className="w-4 h-4 text-slate-400 flex-none" />
            <span>Category: <strong className="text-slate-700 font-medium">{device.category}</strong></span>
          </div>

          {device.lastTestedAt && (
            <>
              <Separator className="bg-slate-200/50" />
              <div className="flex items-center gap-2.5 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 flex-none" />
                <span>Tested: <strong className="text-slate-700 font-medium">{new Date(device.lastTestedAt).toLocaleTimeString()}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* Deficiency Note Display */}
        {device.deficiencyNote && !showDeficiencyInput && (
          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Deficiency Log
            </span>
            <p className="text-xs text-rose-800 leading-relaxed italic">"{device.deficiencyNote}"</p>
          </div>
        )}

        {/* Action Form for Deficiency/Fail */}
        {showDeficiencyInput && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{isFailing ? "Log Test Failure" : "Log Deficiency"}</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note" className="text-xs text-slate-500">Deficiency Note / Reason</Label>
              <Textarea 
                id="note"
                placeholder="Enter details about the failure or deficiency..."
                className="text-xs bg-white min-h-[60px]"
                value={deficiencyNote}
                onChange={(e) => setDeficiencyNote(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" className="text-xs h-8" onClick={() => setShowDeficiencyInput(false)}>
                Cancel
              </Button>
              <Button size="sm" className="text-xs h-8" onClick={handleSaveFailOrDeficiency} disabled={!deficiencyNote.trim()}>
                Save {isFailing ? "Failure" : "Deficiency"}
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showDeficiencyInput && (
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Inspection Controls</span>
            
            <Button 
              className="w-full justify-start gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
              onClick={handleMarkPass}
            >
              <CheckCircle className="w-4 h-4" /> Mark Pass
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                onClick={handleMarkFail}
              >
                <AlertCircle className="w-4 h-4" /> Mark Fail
              </Button>

              <Button 
                variant="outline" 
                className="justify-start gap-1.5 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                onClick={handleAddDeficiency}
              >
                <AlertTriangle className="w-4 h-4" /> Deficiency
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              onClick={handleNoAccess}
            >
              <EyeOff className="w-4 h-4" /> No Access
            </Button>

            {device.status !== "not_tested" && (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-slate-500 hover:bg-slate-100"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4" /> Reset to Not Tested
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

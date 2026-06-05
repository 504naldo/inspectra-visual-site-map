import React from "react";
import { Device, DeviceStatus, DeviceType } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Flame, Shield, Radio, Droplets, Waves, ShieldAlert, Compass, 
  ArrowRight, Key, HelpCircle, Check, X, Eye, EyeOff, Camera, Clock, QrCode
} from "lucide-react";

interface DeviceDetailPanelProps {
  device: Device | null;
  onClose: () => void;
  onUpdateStatus: (deviceId: string, status: DeviceStatus) => void;
  onTriggerDeficiencyModal: (isFailure: boolean) => void;
  activeRole: string; // "fire_company" | "property_manager" | "government"
}

export default function DeviceDetailPanel({
  device,
  onClose,
  onUpdateStatus,
  onTriggerDeficiencyModal,
  activeRole
}: DeviceDetailPanelProps) {
  if (!device) return null;

  // Local helper for icon rendering
  const renderDeviceIcon = (type: DeviceType, className = "w-5 h-5") => {
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
        return <Radio className={className} />;
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
        return <HelpCircle className={className} />;
    }
  };

  // Local helper for status badges
  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-emerald-950/50 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">PASSED</Badge>;
      case "failed":
        return <Badge className="bg-rose-950/50 text-rose-400 border-rose-500/30 rounded-none text-[9px] font-bold animate-pulse">FAILED</Badge>;
      case "deficiency":
        return <Badge className="bg-amber-950/50 text-amber-400 border-amber-500/30 rounded-none text-[9px] font-bold">DEFICIENCY</Badge>;
      case "testing":
        return <Badge className="bg-cyan-950/50 text-cyan-400 border-cyan-500/30 rounded-none text-[9px] font-bold animate-pulse">TESTING</Badge>;
      case "no_access":
        return <Badge className="bg-slate-900 text-slate-400 border-slate-700 rounded-none text-[9px] font-bold">NO_ACCESS</Badge>;
      default:
        return <Badge className="bg-slate-950 text-slate-500 border-slate-800 rounded-none text-[9px] font-bold">NOT_TESTED</Badge>;
    }
  };

  return (
    <div className="w-80 border-l border-cyan-500/20 bg-slate-950/95 p-4 flex flex-col h-full overflow-y-auto font-mono text-xs text-cyan-400 gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
        <span className="font-bold text-slate-500 text-[10px] tracking-widest uppercase">DEVICE_DETAILS // {device.id}</span>
        <button onClick={onClose} className="text-slate-500 hover:text-cyan-400 text-sm font-bold">[X]</button>
      </div>

      {/* Main Metadata */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
          {renderDeviceIcon(device.type, "w-6 h-6")}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-cyan-300 text-sm uppercase leading-tight">{device.label}</h3>
          <p className="text-[10px] text-slate-500 uppercase">{device.type}</p>
          <div className="pt-1">{getStatusBadge(device.status)}</div>
        </div>
      </div>

      <Separator className="bg-cyan-500/10" />

      {/* Location Details */}
      <div className="space-y-2.5">
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-bold">FLOOR_ZONE:</span>
          <p className="text-cyan-300 font-bold mt-0.5">{device.floor.toUpperCase()} // {device.area.toUpperCase()}</p>
        </div>
        <div>
          <span className="text-[9px] text-slate-500 uppercase font-bold">SPECIFIC_LOCATION:</span>
          <p className="text-cyan-300 mt-0.5">{device.location.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">X_COORD:</span>
            <span className="text-cyan-300 font-bold ml-1">{device.x}%</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">Y_COORD:</span>
            <span className="text-cyan-300 font-bold ml-1">{device.y}%</span>
          </div>
        </div>
      </div>

      <Separator className="bg-cyan-500/10" />

      {/* Technician vs Customer Notes (SaaS Role Privacy Demonstration) */}
      <div className="space-y-3">
        {/* Customer / Shared Notes */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold">
            <Eye className="w-3.5 h-3.5 text-cyan-500" />
            <span>CUSTOMER_SHARED_NOTES</span>
            <Badge className="bg-cyan-950/20 text-cyan-400 border-cyan-500/10 text-[8px] scale-90 py-0 px-1 rounded-none">PUBLIC</Badge>
          </div>
          <p className="text-slate-300 text-[10px] bg-slate-900/30 p-2 border border-cyan-500/5 leading-relaxed uppercase">
            {device.customerNotes || "NO SHARED NOTES LOGGED FOR THIS NODE."}
          </p>
        </div>

        {/* Technician-Only Notes (Hidden in Gov Mode or Client Mode if configured) */}
        {activeRole === "fire_company" && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] text-rose-400/80 font-bold">
              <EyeOff className="w-3.5 h-3.5 text-rose-500" />
              <span>TECHNICIAN_INTERNAL_NOTES</span>
              <Badge className="bg-rose-950/20 text-rose-400 border-rose-500/10 text-[8px] scale-90 py-0 px-1 rounded-none font-bold">INTERNAL_ONLY</Badge>
            </div>
            <p className="text-rose-300/90 text-[10px] bg-rose-950/10 p-2 border border-rose-500/10 leading-relaxed uppercase">
              {device.technicianNotes || "NO INTERNAL TECHNICIAN TELEMETRY LOGGED."}
            </p>
          </div>
        )}
      </div>

      {/* Photo attachment placeholder */}
      {device.photoUrl && (
        <div className="space-y-1.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> FIELD_PHOTO_ATTACHMENT
          </span>
          <div className="border border-cyan-500/20 bg-slate-900 overflow-hidden h-28 relative">
            <img src={device.photoUrl} alt="field attachment" className="w-full h-full object-cover" />
            <div className="absolute bottom-1.5 right-1.5 bg-slate-950/80 px-1.5 py-0.5 text-[8px] text-cyan-400 border border-cyan-500/20">
              ATTACHED_JPG
            </div>
          </div>
        </div>
      )}

      {/* Service History Logs */}
      {device.serviceHistory && device.serviceHistory.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> SERVICE_HISTORY
          </span>
          <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
            {device.serviceHistory.map((hist, i) => (
              <div key={i} className="bg-slate-900/40 p-1.5 border border-cyan-500/5 text-[9px] leading-relaxed">
                <div className="flex justify-between font-bold text-cyan-300">
                  <span>{hist.date}</span>
                  <span>{hist.technician}</span>
                </div>
                <p className="text-slate-400 mt-0.5 uppercase">{hist.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR telemetry placeholder */}
      {device.qrCode && (
        <div className="flex items-center gap-2 bg-slate-900/40 p-2 border border-cyan-500/5">
          <QrCode className="w-6 h-6 text-cyan-500/60" />
          <div>
            <span className="text-[8px] text-slate-500 font-bold uppercase">DIGITAL_ID_TAG:</span>
            <p className="text-[10px] text-cyan-300 font-bold">{device.qrCode}</p>
          </div>
        </div>
      )}

      <Separator className="bg-cyan-500/10 mt-auto" />

      {/* Interactive Technician Action Workflows */}
      {activeRole === "fire_company" && (
        <div className="space-y-2 pt-2">
          <span className="text-[9px] text-slate-500 uppercase font-bold">RECORD_INSPECTION_RESULT:</span>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => onUpdateStatus(device.id, "passed")}
              className="bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 rounded-none text-[10px] font-bold h-8 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> MARK_PASS
            </Button>
            
            <Button 
              onClick={() => onTriggerDeficiencyModal(true)}
              className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-400 rounded-none text-[10px] font-bold h-8 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> MARK_FAIL
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => onTriggerDeficiencyModal(false)}
              className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-400 rounded-none text-[10px] font-bold h-8 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> DEFICIENCY
            </Button>

            <Button 
              onClick={() => onUpdateStatus(device.id, "no_access")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-400 rounded-none text-[10px] font-bold h-8 flex items-center gap-1"
            >
              <EyeOff className="w-3.5 h-3.5" /> NO_ACCESS
            </Button>
          </div>

          <Button 
            onClick={() => onUpdateStatus(device.id, "not_tested")}
            variant="ghost"
            className="w-full border border-cyan-500/10 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-none text-[10px] font-bold h-8"
          >
            RESET_TO_NOT_TESTED
          </Button>
        </div>
      )}
    </div>
  );
}

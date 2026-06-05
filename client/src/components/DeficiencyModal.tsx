import React, { useState, useEffect } from "react";
import { Device, DeficiencyHistory } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ShieldAlert, FileText, Camera, DollarSign } from "lucide-react";

interface DeficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  isFailureMode: boolean; // True for failed, false for warning/deficiency
  onSave: (deficiency: Omit<DeficiencyHistory, "id" | "loggedAt" | "resolved"> & {
    addToQuote: boolean;
    addToReport: boolean;
    shareWithGovernment: boolean;
    codeReference?: string;
    customerExplanation: string;
    internalNote?: string;
  }) => void;
}

export default function DeficiencyModal({ isOpen, onClose, device, isFailureMode, onSave }: DeficiencyModalProps) {
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [description, setDescription] = useState("");
  const [codeReference, setCodeReference] = useState("");
  const [recommendedRepair, setRecommendedRepair] = useState("");
  const [customerExplanation, setCustomerExplanation] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [addToQuote, setAddToQuote] = useState(true);
  const [addToReport, setAddToReport] = useState(true);
  const [shareWithGovernment, setShareWithGovernment] = useState(false);
  const [photoPlaceholder, setPhotoPlaceholder] = useState<string | null>(null);

  // Load default/suggested text when device changes
  useEffect(() => {
    if (device) {
      setDescription(isFailureMode ? "FAILED ANNUAL OPERATION TEST." : "DEVICE SHOWS MINOR DEVIATIONS.");
      setPriority(isFailureMode ? "high" : "medium");
      setCodeReference(device.type === "Fire Extinguisher" ? "NFPA 10 // Sec 7.3" : device.type === "Smoke Detector" ? "CAN/ULC-S536 // Sec 5.7" : "NFPA 72 // Ch 14");
      setShareWithGovernment(false);
      
      // Auto-populate recommended repair and customer explanation
      if (device.type === "Smoke Detector") {
        setRecommendedRepair("Replace smoke detector and retest.");
        setCustomerExplanation("The smoke detector in the main corridor did not respond properly during testing. Replacement is recommended to restore detection coverage in this area.");
        setInternalNote("Detector did not activate during smoke entry test. Confirmed circuit response from adjacent device.");
      } else if (device.type === "Emergency Light") {
        setRecommendedRepair("Replace battery or fixture.");
        setCustomerExplanation("The emergency lighting unit failed the required 30-minute battery discharge test. Battery replacement is required to restore emergency illumination.");
        setInternalNote("Battery terminals are oxidized, and cell voltage dropped quickly under load drop.");
      } else if (device.type === "Sprinkler Riser") {
        setRecommendedRepair("Troubleshoot supervisory circuit and restore signal to fire alarm panel.");
        setCustomerExplanation("A sprinkler valve supervisory signal is not reporting properly to the fire alarm panel. This may prevent building staff or monitoring from being notified of an abnormal valve condition. Immediate repair is recommended.");
        setInternalNote("Confirmed device operation at valve, signal not received at panel. Requires circuit troubleshooting.");
        setPriority("critical");
        setShareWithGovernment(true);
      } else {
        setRecommendedRepair("REPAIR / REPLACE SUB-COMPONENT.");
        setCustomerExplanation("Device did not meet the full testing standards. Repair is recommended to maintain building compliance.");
        setInternalNote("");
      }
      
      setPhotoPlaceholder(null);
    }
  }, [device, isFailureMode, isOpen]);

  if (!device) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description,
      priority,
      codeReference,
      recommendedRepair,
      customerExplanation,
      internalNote,
      addToQuote,
      addToReport,
      shareWithGovernment
    });
    onClose();
  };

  const handleSimulatePhoto = () => {
    setPhotoPlaceholder("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=150&q=80");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-slate-950 border border-cyan-500/30 text-cyan-400 font-mono rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-cyan-500/10 pb-3">
          <DialogTitle className="text-sm font-bold tracking-widest flex items-center gap-2 text-rose-500 uppercase">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>LOG_DEFICIENCY // NODE: {device.label}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3 text-xs">
          {/* Header Metadata */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/40 p-2.5 border border-cyan-500/10 text-[10px]">
            <div>
              <span className="text-slate-500 font-bold uppercase">DEVICE_TYPE:</span>
              <p className="text-cyan-300 font-bold uppercase mt-0.5">{device.type}</p>
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase">LOCATION:</span>
              <p className="text-cyan-300 font-bold uppercase mt-0.5">{device.floor} // {device.area}</p>
            </div>
          </div>

          {/* Issue Description & Priority */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="desc" className="text-[10px] text-slate-400 uppercase font-bold">Deficiency Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none h-8 text-xs focus-visible:ring-cyan-500/40"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-[10px] text-slate-400 uppercase font-bold">Priority</Label>
              <Select value={priority} onValueChange={(val: any) => setPriority(val)}>
                <SelectTrigger className="bg-slate-900 border-cyan-500/20 text-cyan-400 h-8 rounded-none text-xs focus:ring-cyan-500/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-cyan-500/30 text-cyan-400 font-mono rounded-none">
                  <SelectItem value="low" className="hover:bg-cyan-500/10 text-xs">LOW</SelectItem>
                  <SelectItem value="medium" className="hover:bg-cyan-500/10 text-xs">MEDIUM</SelectItem>
                  <SelectItem value="high" className="hover:bg-cyan-500/10 text-xs">HIGH</SelectItem>
                  <SelectItem value="critical" className="hover:bg-cyan-500/10 text-xs text-rose-500">CRITICAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NFPA/ULC Code Reference */}
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-[10px] text-slate-400 uppercase font-bold">Regulatory Code / NFPA Reference</Label>
            <Input
              id="code"
              value={codeReference}
              onChange={(e) => setCodeReference(e.target.value.toUpperCase())}
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none h-8 text-xs focus-visible:ring-cyan-500/40 uppercase"
              placeholder="E.G. NFPA 72 SECTION 14.4"
            />
          </div>

          {/* Recommended Repair */}
          <div className="space-y-1.5">
            <Label htmlFor="repair" className="text-[10px] text-slate-400 uppercase font-bold">Recommended Repair Action</Label>
            <Input
              id="repair"
              value={recommendedRepair}
              onChange={(e) => setRecommendedRepair(e.target.value)}
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none h-8 text-xs focus-visible:ring-cyan-500/40"
              required
            />
          </div>

          {/* Customer Facing Explanation */}
          <div className="space-y-1.5">
            <Label htmlFor="cust" className="text-[10px] text-slate-400 uppercase font-bold">Customer-Facing Explanation (Plain Language)</Label>
            <Textarea
              id="cust"
              value={customerExplanation}
              onChange={(e) => setCustomerExplanation(e.target.value)}
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none min-h-[60px] text-xs focus-visible:ring-cyan-500/40"
              required
            />
          </div>

          {/* Internal Tech Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="internal" className="text-[10px] text-slate-400 uppercase font-bold">Internal Technician Notes (Not Shared with Client)</Label>
            <Textarea
              id="internal"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="E.G. BRACKET CORRODED, SPARE NOT IN VAN, ORDER PART #SD-MIRCOM."
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none min-h-[50px] text-xs placeholder:text-slate-700 focus-visible:ring-cyan-500/40"
            />
          </div>

          {/* Workflow checkboxes & Photo */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-2 border-t border-cyan-500/10">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="quote"
                  checked={addToQuote}
                  onCheckedChange={(checked) => setAddToQuote(checked === true)}
                  className="border-cyan-500/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-950 rounded-none"
                />
                <Label htmlFor="quote" className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-cyan-500" /> AUTO_GENERATE_QUOTE_ITEM
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="report"
                  checked={addToReport}
                  onCheckedChange={(checked) => setAddToReport(checked === true)}
                  className="border-cyan-500/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-950 rounded-none"
                />
                <Label htmlFor="report" className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1">
                  <FileText className="w-3 h-3 text-cyan-500" /> INCLUDE_IN_COMPLIANCE_REPORT
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="shareGov"
                  checked={shareWithGovernment}
                  onCheckedChange={(checked) => setShareWithGovernment(checked === true)}
                  className="border-cyan-500/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-slate-950 rounded-none"
                />
                <Label htmlFor="shareGov" className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-500" /> SHARE WITH GOVERNMENT IF CRITICAL
                </Label>
              </div>
            </div>

            {/* Photo upload mock */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimulatePhoto}
                className="h-8 rounded-none text-[10px] font-bold border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                {photoPlaceholder ? "PHOTO_ATTACHED" : "ATTACH_PHOTO"}
              </Button>
              {photoPlaceholder && (
                <div className="w-8 h-8 border border-cyan-500/30 bg-slate-900 overflow-hidden">
                  <img src={photoPlaceholder} alt="deficiency thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-cyan-500/10 pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-none text-xs hover:bg-cyan-500/10 text-slate-400"
            >
              ABORT_LOG
            </Button>
            <Button
              type="submit"
              className="rounded-none text-xs bg-rose-500 hover:bg-rose-600 text-slate-950 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]"
            >
              COMMIT_DEFICIENCY
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

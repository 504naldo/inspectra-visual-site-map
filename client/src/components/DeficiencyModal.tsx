import React, { useState } from "react";
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
  isFailure: boolean; // True for failed, false for warning/deficiency
  onSubmit: (data: {
    priority: "low" | "medium" | "high" | "critical";
    description: string;
    nfpaCode: string;
    recommendedRepair: string;
    photoUrl?: string;
    autoGenerateQuote: boolean;
    autoGenerateReport: boolean;
  }) => void;
}

export default function DeficiencyModal({ isOpen, onClose, isFailure, onSubmit }: DeficiencyModalProps) {
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [description, setDescription] = useState("");
  const [nfpaCode, setNfpaCode] = useState("");
  const [recommendedRepair, setRecommendedRepair] = useState("");
  const [autoGenerateQuote, setAutoGenerateQuote] = useState(true);
  const [autoGenerateReport, setAutoGenerateReport] = useState(true);
  const [mockPhoto, setMockPhoto] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !nfpaCode.trim() || !recommendedRepair.trim()) return;

    onSubmit({
      priority,
      description,
      nfpaCode,
      recommendedRepair,
      photoUrl: mockPhoto,
      autoGenerateQuote,
      autoGenerateReport
    });

    // Reset state
    setDescription("");
    setNfpaCode("");
    setRecommendedRepair("");
    setMockPhoto(undefined);
  };

  const handleSimulatePhoto = () => {
    // Standard mock image of a broken smoke detector
    setMockPhoto("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=300&q=80");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-md p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-cyan-500/10 pb-3">
          <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
            {isFailure ? <ShieldAlert className="w-5 h-5 text-rose-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
            <span>{isFailure ? "LOG_CRITICAL_FAILURE" : "LOG_COMPLIANCE_DEFICIENCY"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          
          {/* Priority Level */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[9px]">Priority Level</Label>
            <Select 
              value={priority} 
              onValueChange={(val: any) => setPriority(val)}
            >
              <SelectTrigger className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs h-9">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-cyan-500 text-cyan-400 rounded-none text-xs font-mono">
                <SelectItem value="low">LOW (MAINTENANCE)</SelectItem>
                <SelectItem value="medium">MEDIUM (RECOMMENDED)</SelectItem>
                <SelectItem value="high">HIGH (COMPLIANCE GAP)</SelectItem>
                <SelectItem value="critical">CRITICAL (LIFE-SAFETY ALARM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NFPA Code Reference */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[9px]">NFPA Standard / Local Fire Code</Label>
            <Input 
              value={nfpaCode}
              onChange={(e) => setNfpaCode(e.target.value)}
              placeholder="e.g., NFPA 72 (14.4.5) / Vancouver Fire Bylaw 4.2"
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs h-9"
              required
            />
          </div>

          {/* Deficiency Description */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[9px]">Plain-Language Deficiency Description</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in clear language for the property owner..."
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs uppercase"
              rows={3}
              required
            />
          </div>

          {/* Recommended Repair */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[9px]">Recommended Compliance Repair</Label>
            <Input 
              value={recommendedRepair}
              onChange={(e) => setRecommendedRepair(e.target.value)}
              placeholder="e.g., Replace defective smoke detector head assembly"
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs uppercase h-9"
              required
            />
          </div>

          {/* Photo Attachment */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[9px]">Field Photo Attachment</Label>
            {mockPhoto ? (
              <div className="relative border border-cyan-500/20 p-1 bg-slate-900">
                <img src={mockPhoto} alt="Deficiency" className="w-full h-32 object-cover" />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setMockPhoto(undefined)}
                  className="absolute top-2 right-2 bg-slate-950/80 hover:bg-rose-950 text-cyan-400 hover:text-rose-400 rounded-none h-6 px-2 text-[8px]"
                >
                  REMOVE
                </Button>
              </div>
            ) : (
              <Button 
                type="button"
                onClick={handleSimulatePhoto}
                className="w-full h-10 rounded-none bg-slate-900 border border-cyan-500/20 text-slate-500 hover:text-cyan-400 hover:bg-slate-900/60 font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>SIMULATE_PHOTO_UPLOAD</span>
              </Button>
            )}
          </div>

          {/* Automation Checkboxes */}
          <div className="space-y-2 border-t border-cyan-500/10 pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoQuote" 
                checked={autoGenerateQuote} 
                onCheckedChange={(checked: any) => setAutoGenerateQuote(!!checked)}
                className="border-cyan-500/30 text-cyan-400"
              />
              <label htmlFor="autoQuote" className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-500" />
                <span>Auto-Generate Repair Quote Item</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="autoReport" 
                checked={autoGenerateReport} 
                onCheckedChange={(checked: any) => setAutoGenerateReport(!!checked)}
                className="border-cyan-500/30 text-cyan-400"
              />
              <label htmlFor="autoReport" className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-500" />
                <span>Auto-Draft Compliance Report</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-t border-cyan-500/10 pt-3 gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400"
            >
              CANCEL
            </Button>
            <Button 
              type="submit"
              className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
            >
              SUBMIT_DEFICIENCY
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

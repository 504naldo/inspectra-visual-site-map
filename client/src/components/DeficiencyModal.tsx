import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ShieldAlert, Camera, Pencil } from "lucide-react";

type Priority = "low" | "medium" | "high" | "critical";

interface SubmitData {
  priority: Priority;
  description: string;
  nfpaCode: string;
  recommendedRepair: string;
  photoUrl?: string;
}

interface DeficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFailure: boolean;
  onSubmit: (data: SubmitData) => void;
  // When provided, the modal opens in edit mode pre-filled with these values
  initialData?: SubmitData;
}

export default function DeficiencyModal({ isOpen, onClose, isFailure, onSubmit, initialData }: DeficiencyModalProps) {
  const isEditMode = !!initialData;

  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? "medium");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [nfpaCode, setNfpaCode] = useState(initialData?.nfpaCode ?? "");
  const [recommendedRepair, setRecommendedRepair] = useState(initialData?.recommendedRepair ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photoUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-populate fields whenever the modal opens with new initial data (e.g. editing a different deficiency)
  useEffect(() => {
    if (isOpen) {
      setPriority(initialData?.priority ?? "medium");
      setDescription(initialData?.description ?? "");
      setNfpaCode(initialData?.nfpaCode ?? "");
      setRecommendedRepair(initialData?.recommendedRepair ?? "");
      setPhotoUrl(initialData?.photoUrl);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !nfpaCode.trim() || !recommendedRepair.trim()) return;
    onSubmit({ priority, description, nfpaCode, recommendedRepair, photoUrl });
    if (!isEditMode) {
      setDescription("");
      setNfpaCode("");
      setRecommendedRepair("");
      setPhotoUrl(undefined);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Reset the input so the same file can be re-selected after removal
    e.target.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-md p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-cyan-500/10 pb-3">
          <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
            {isEditMode
              ? <Pencil className="w-5 h-5 text-cyan-500" />
              : isFailure
              ? <ShieldAlert className="w-5 h-5 text-rose-500" />
              : <AlertTriangle className="w-5 h-5 text-amber-500" />}
            <span>
              {isEditMode ? "EDIT_DEFICIENCY_RECORD" : isFailure ? "LOG_CRITICAL_FAILURE" : "LOG_COMPLIANCE_DEFICIENCY"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">

          {/* Priority Level */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[10px]">Priority Level</Label>
            <Select value={priority} onValueChange={(val: Priority) => setPriority(val)}>
              <SelectTrigger className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs h-10">
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
            <Label className="text-slate-500 uppercase font-bold text-[10px]">NFPA Standard / Local Fire Code</Label>
            <Input
              value={nfpaCode}
              onChange={(e) => setNfpaCode(e.target.value)}
              placeholder="e.g., NFPA 72 (14.4.5) / Vancouver Fire Bylaw 4.2"
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs h-10"
              required
            />
          </div>

          {/* Deficiency Description */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[10px]">Plain-Language Deficiency Description</Label>
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
            <Label className="text-slate-500 uppercase font-bold text-[10px]">Recommended Compliance Repair</Label>
            <Input
              value={recommendedRepair}
              onChange={(e) => setRecommendedRepair(e.target.value)}
              placeholder="e.g., Replace defective smoke detector head assembly"
              className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs uppercase h-10"
              required
            />
          </div>

          {/* Photo Attachment — real file picker with camera capture on mobile */}
          <div className="space-y-1.5">
            <Label className="text-slate-500 uppercase font-bold text-[10px]">Field Photo Attachment</Label>
            {/* Hidden file input — capture="environment" opens the rear camera on iOS/Android */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            {photoUrl ? (
              <div className="relative border border-cyan-500/20 p-1 bg-slate-900">
                <img src={photoUrl} alt="Deficiency" className="w-full h-32 object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute top-2 right-2 bg-slate-950/80 hover:bg-rose-950 text-cyan-400 hover:text-rose-400 rounded-none h-9 px-3 text-[10px]"
                >
                  REMOVE
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-10 rounded-none bg-slate-900 border border-cyan-500/20 text-slate-500 hover:text-cyan-400 hover:bg-slate-900/60 font-bold flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>ATTACH_PHOTO</span>
              </Button>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-t border-cyan-500/10 pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="h-11 rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
            >
              {isEditMode ? "SAVE_CHANGES" : "SUBMIT_DEFICIENCY"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

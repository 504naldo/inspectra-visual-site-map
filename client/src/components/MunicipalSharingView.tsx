import React from "react";
import { MunicipalSharingSettings } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

interface MunicipalSharingViewProps {
  settings: MunicipalSharingSettings;
  onUpdateSettings: (settings: MunicipalSharingSettings) => void;
}

export default function MunicipalSharingView({ settings, onUpdateSettings }: MunicipalSharingViewProps) {
  
  const handleToggle = (key: keyof MunicipalSharingSettings, val: boolean) => {
    const updated = { ...settings, [key]: val };
    onUpdateSettings(updated);
    toast.success("PRIVACY POLICY MODIFIED", {
      description: `UPDATED ACCESS FOR: ${key.toUpperCase()}`
    });
  };

  const handleSaveAll = () => {
    toast.success("MUNICIPAL DATA PROTOCOLS COMMITTED", {
      description: "GOVERNMENT & EMERGENCY DATABASES SYNCHRONIZED."
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-500" />
            <span>MUNICIPAL_SHARING_CONTROLS</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase mt-1">Configure emergency-response access protocols for government and fire services</p>
        </div>
        <Button 
          onClick={handleSaveAll}
          className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 rounded-none text-xs font-bold h-9"
        >
          COMMIT_PROTOCOLS
        </Button>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-slate-900/30 border border-cyan-500/15 text-[10px] leading-relaxed text-slate-400 font-mono">
        <p>
          Inspectra allows property owners and fire protection companies to securely share emergency-response and compliance information with municipal partners while keeping private business records protected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* SHARED WITH GOVERNMENT / EMERGENCY SERVICES */}
        <div className="border border-cyan-500/15 bg-slate-950/60 p-5 flex flex-col gap-4 hud-corners">
          <h3 className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-2">
            <Eye className="w-4 h-4 text-cyan-500" />
            <span>SHARED_WITH_FIRE_DEPARTMENT</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-fsp" className="font-bold text-slate-300">FIRE_SAFETY_PLAN_DOCUMENT</Label>
                <p className="text-[9px] text-slate-500 uppercase">Emergency pre-planning digital PDF.</p>
              </div>
              <Switch 
                id="s-fsp" 
                checked={settings.fireSafetyPlan} 
                onCheckedChange={(val) => handleToggle("fireSafetyPlan", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-fdc" className="font-bold text-slate-300">FDC_OUTLET_LOCATION</Label>
                <p className="text-[9px] text-slate-500 uppercase">FDC coordinates and intake details.</p>
              </div>
              <Switch 
                id="s-fdc" 
                checked={settings.fdcLocation} 
                onCheckedChange={(val) => handleToggle("fdcLocation", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-facp" className="font-bold text-slate-300">FIRE_ALARM_PANEL_COORDINATES</Label>
                <p className="text-[9px] text-slate-500 uppercase">Main FACP location on blueprint.</p>
              </div>
              <Switch 
                id="s-facp" 
                checked={settings.fireAlarmPanelLocation} 
                onCheckedChange={(val) => handleToggle("fireAlarmPanelLocation", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-ann" className="font-bold text-slate-300">ANNUNCIATOR_LOCATION</Label>
                <p className="text-[9px] text-slate-500 uppercase">Lobby annunciator display coordinates.</p>
              </div>
              <Switch 
                id="s-ann" 
                checked={settings.annunciatorLocation} 
                onCheckedChange={(val) => handleToggle("annunciatorLocation", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-spr" className="font-bold text-slate-300">SPRINKLER_RISER_ROOM</Label>
                <p className="text-[9px] text-slate-500 uppercase"> Riser room map marker & valve details.</p>
              </div>
              <Switch 
                id="s-spr" 
                checked={settings.sprinklerRiserRoom} 
                onCheckedChange={(val) => handleToggle("sprinklerRiserRoom", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="s-crit" className="font-bold text-slate-300">CRITICAL_DEFICIENCIES_ONLY</Label>
                <p className="text-[9px] text-slate-500 uppercase">Failed systems posing life-safety risks.</p>
              </div>
              <Switch 
                id="s-crit" 
                checked={settings.criticalDeficiencies} 
                onCheckedChange={(val) => handleToggle("criticalDeficiencies", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* PRIVATE / NOT SHARED BY DEFAULT */}
        <div className="border border-cyan-500/15 bg-slate-950/60 p-5 flex flex-col gap-4 hud-corners">
          <h3 className="font-bold text-rose-400 text-[11px] uppercase tracking-wider flex items-center gap-2 border-b border-cyan-500/10 pb-2">
            <EyeOff className="w-4 h-4 text-rose-500" />
            <span>PROTECTED_PRIVATE_RECORDS</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="p-quote" className="font-bold text-slate-300">QUOTE_PRICING_ESTIMATES</Label>
                <p className="text-[9px] text-slate-500 uppercase">Repair labor/material cost schedules.</p>
              </div>
              <Switch 
                id="p-quote" 
                checked={settings.quotePricing} 
                onCheckedChange={(val) => handleToggle("quotePricing", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="p-tech" className="font-bold text-slate-300">TECHNICIAN_INTERNAL_NOTES</Label>
                <p className="text-[9px] text-slate-500 uppercase">Internal parts ordering & van inventory logs.</p>
              </div>
              <Switch 
                id="p-tech" 
                checked={settings.internalNotes} 
                onCheckedChange={(val) => handleToggle("internalNotes", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="p-bill" className="font-bold text-slate-300">CUSTOMER_BILLING_DETAILS</Label>
                <p className="text-[9px] text-slate-500 uppercase">Account billing and contract terms.</p>
              </div>
              <Switch 
                id="p-bill" 
                checked={settings.customerBillingDetails} 
                onCheckedChange={(val) => handleToggle("customerBillingDetails", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="p-photo" className="font-bold text-slate-300">PRIVATE_FIELD_PHOTOS</Label>
                <p className="text-[9px] text-slate-500 uppercase">Technician photos not marked for share.</p>
              </div>
              <Switch 
                id="p-photo" 
                checked={settings.privatePhotos} 
                onCheckedChange={(val) => handleToggle("privatePhotos", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="p-draft" className="font-bold text-slate-300">DRAFT_INSPECTION_REPORTS</Label>
                <p className="text-[9px] text-slate-500 uppercase">In-progress inspections before review.</p>
              </div>
              <Switch 
                id="p-draft" 
                checked={settings.draftReports} 
                onCheckedChange={(val) => handleToggle("draftReports", val)}
                className="data-[state=checked]:bg-cyan-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

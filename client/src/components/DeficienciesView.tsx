import React from "react";
import { Device, DeficiencyHistory } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, ArrowUpRight, Check, Pencil } from "lucide-react";

interface DeficienciesViewProps {
  devices: Device[];
  onSelectDevice?: (deviceId: string) => void;
  onResolveDeficiency?: (deviceId: string, deficiencyId: string) => void;
  onEditDeficiency?: (deviceId: string, deficiency: DeficiencyHistory) => void;
  activeRole: string;
}

export default function DeficienciesView({ devices, onSelectDevice, onResolveDeficiency, onEditDeficiency, activeRole }: DeficienciesViewProps) {

  const loggedDeficiencies = devices.flatMap((dev) =>
    (dev.deficiencyHistory || []).map((def) => ({
      ...def,
      deviceId: dev.id,
      deviceLabel: dev.label,
      deviceType: dev.type,
      deviceFloor: dev.floor,
      deviceArea: dev.area
    }))
  );

  const getPriorityBadge = (priority: DeficiencyHistory["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-slate-900 text-slate-400 border-slate-700 rounded-none text-[9px] font-bold">LOW</Badge>;
      case "medium":
        return <Badge className="bg-amber-950/40 text-amber-400 border-amber-500/30 rounded-none text-[9px] font-bold">MEDIUM</Badge>;
      case "high":
        return <Badge className="bg-orange-950/40 text-orange-400 border-orange-500/30 rounded-none text-[9px] font-bold animate-pulse">HIGH</Badge>;
      case "critical":
        return <Badge className="bg-rose-950/50 text-rose-400 border-rose-500/30 rounded-none text-[9px] font-bold animate-pulse">CRITICAL</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="border-b border-cyan-500/10 pb-4">
        <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cyan-500" />
          <span>DEFICIENCIES_COMPLIANCE_REGISTRY</span>
        </h2>
        <p className="text-[10px] text-slate-500 uppercase mt-1">Audit trail of all logged hardware deficiencies, priorities, and resolution states</p>
      </div>

      {loggedDeficiencies.length === 0 ? (
        <div className="text-center py-20 text-xs text-slate-600 flex flex-col items-center gap-2 font-mono border border-cyan-500/10 bg-slate-950/30">
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-30" />
          <span>NO_OPEN_DEFICIENCIES_IN_BUILDING</span>
        </div>
      ) : (
        <div className="border border-cyan-500/15 bg-slate-950/60 backdrop-blur-md rounded-none">
          <Table className="font-mono text-xs">
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-b border-cyan-500/15 hover:bg-transparent">
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Device Node</TableHead>
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Deficiency Description</TableHead>
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Priority</TableHead>
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Recommended Repair</TableHead>
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Logged Date</TableHead>
                <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">State</TableHead>
                <TableHead className="text-right text-cyan-500/70 font-bold text-[10px] uppercase">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loggedDeficiencies.map((def) => (
                <TableRow key={def.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                  <TableCell className="font-bold text-cyan-300 py-3.5">
                    <div>
                      <span className="text-cyan-300 font-bold">{def.deviceLabel}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">// {def.deviceType.toUpperCase()}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase mt-0.5">{def.deviceFloor} // {def.deviceArea}</div>
                  </TableCell>
                  <TableCell className="text-slate-300 max-w-xs whitespace-normal break-words leading-relaxed">{def.description.toUpperCase()}</TableCell>
                  <TableCell>{getPriorityBadge(def.priority)}</TableCell>
                  <TableCell className="text-slate-400 text-[10px] max-w-xs whitespace-normal break-words leading-relaxed">{def.recommendedRepair.toUpperCase()}</TableCell>
                  <TableCell className="text-slate-400">{def.loggedAt}</TableCell>
                  <TableCell>
                    {def.resolved ? (
                      <Badge className="bg-emerald-950/40 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">RESOLVED</Badge>
                    ) : (
                      <Badge className="bg-rose-950/40 text-rose-400 border-rose-500/30 rounded-none text-[9px] font-bold animate-pulse">OPEN</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <div className="flex items-center justify-end gap-1.5">
                      {onSelectDevice && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectDevice(def.deviceId)}
                          className="h-10 w-10 rounded-none text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                          title="Locate Node on Blueprint"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      )}

                      {activeRole === "fire_company" && !def.resolved && onEditDeficiency && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditDeficiency(def.deviceId, def)}
                          className="h-10 w-10 rounded-none text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                          title="Edit Deficiency"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}

                      {activeRole === "fire_company" && !def.resolved && onResolveDeficiency && (
                        <Button
                          variant="outline"
                          onClick={() => onResolveDeficiency(def.deviceId, def.id)}
                          className="h-10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-none text-[10px] font-bold px-3 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> MARK_RESOLVED
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

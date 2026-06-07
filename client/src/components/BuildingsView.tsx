import React from "react";
import { Building } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Layers, ShieldAlert, CheckCircle, Clock, ArrowRight, ShieldCheck } from "lucide-react";

interface BuildingsViewProps {
  buildings: Building[];
  onSelectBuilding: (buildingId: string) => void;
  activeRole: string;
}

export default function BuildingsView({ buildings, onSelectBuilding, activeRole }: BuildingsViewProps) {
  
  const getStatusBadge = (status: Building["status"]) => {
    switch (status) {
      case "In Progress":
        return <Badge className="bg-blue-950/50 text-blue-400 border-blue-500/30 rounded-none text-[9px] font-bold animate-pulse">IN_PROGRESS</Badge>;
      case "Critical Deficiencies":
        return <Badge className="bg-rose-950/50 text-rose-400 border-rose-500/30 rounded-none text-[9px] font-bold">CRITICAL_DEFICIENCIES</Badge>;
      case "Compliant":
        return <Badge className="bg-emerald-950/50 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">COMPLIANT</Badge>;
      case "Overdue":
        return <Badge className="bg-amber-950/50 text-amber-400 border-amber-500/30 rounded-none text-[9px] font-bold">OVERDUE</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="border-b border-cyan-500/10 pb-4">
        <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-500" />
          <span>BUILDING_PORTFOLIO_REGISTRY</span>
        </h2>
        <p className="text-[10px] text-slate-500 uppercase mt-1">Manage physical sites, blueprints, compliance levels, and emergency pre-plans</p>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {buildings.map((bld) => (
          <div 
            key={bld.id} 
            className="border border-cyan-500/15 bg-slate-950/70 p-5 flex flex-col gap-4 relative hud-corners hover:border-cyan-500/30 transition-colors"
          >
            {/* Top row */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">{bld.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500/50" />
                  <span>{bld.address}</span>
                </div>
              </div>
              {getStatusBadge(bld.status)}
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-cyan-500/10 text-[10px]">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 uppercase">OCCUPANCY_CLASSIFICATION:</span>
                  <p className="text-slate-300 font-bold uppercase mt-0.5">{bld.occupancyType}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase">TOTAL_TESTED_NODES:</span>
                  <p className="text-cyan-400 font-bold mt-0.5">{bld.totalDevices} DEVICES ({bld.floorsCount} FLOORS)</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 uppercase">LAST_INSPECTION:</span>
                  <p className="text-slate-300 font-bold uppercase mt-0.5">{bld.lastInspectionDate}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase">NEXT_DUE:</span>
                  <p className="text-slate-300 font-bold uppercase mt-0.5">{bld.nextInspectionDue}</p>
                </div>
              </div>
            </div>

            {/* Deficiency count and progress row */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-slate-400">CRITICAL:</span>
                    <strong className={`font-bold ${bld.criticalDeficiencies > 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                      {bld.criticalDeficiencies}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-slate-400">OPEN:</span>
                    <strong className={`font-bold ${bld.openDeficiencies > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                      {bld.openDeficiencies}
                    </strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase">SETUP_PROGRESS:</span>
                  <strong className="text-cyan-400 font-bold ml-1.5">{bld.setupProgress}%</strong>
                </div>
              </div>
              <Progress value={bld.setupProgress} className="h-1 bg-slate-900 border border-cyan-500/10" />
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between border-t border-cyan-500/10 pt-3 mt-1">
              <div className="text-[9px] text-slate-500 uppercase">
                SYSTEM: <strong className="text-cyan-500/80 font-bold">{bld.fireAlarmType}</strong>
              </div>
              <Button 
                onClick={() => onSelectBuilding(bld.id)}
                className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 rounded-none text-[11px] font-bold gap-1.5 h-11 px-4"
              >
                <span>LAUNCH_VISUAL_MAP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

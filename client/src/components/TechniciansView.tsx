import React, { useState } from "react";
import { TechnicianMetric, MOCK_TECHNICIANS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Users, Award, Calendar, CheckSquare, Clipboard, AlertTriangle, 
  BarChart3, ShieldAlert, Zap, Clock, ChevronRight
} from "lucide-react";

export default function TechniciansView() {
  const [technicians, setTechnicians] = useState<TechnicianMetric[]>(MOCK_TECHNICIANS);

  const handleAssignInspection = (techName: string) => {
    toast.success("INSPECTION ASSIGNED", {
      description: `Dispatched new Annual Fire Alarm inspection order to ${techName}.`
    });
    setTechnicians(prev => prev.map(t => {
      if (t.name === techName) {
        return { ...t, assignedInspections: t.assignedInspections + 1 };
      }
      return t;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>TECHNICIAN_MANAGEMENT</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Monitor ASTTBC-certified technician dispatch schedules, monthly inspections completed, and field productivity.
          </span>
        </div>
      </div>

      {/* Tech Roster Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <Card key={tech.id} className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners flex flex-col justify-between">
            <CardHeader className="border-b border-cyan-500/5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{tech.name}</CardTitle>
                  <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-1">
                    {tech.role} // TECH_ID: {tech.id}
                  </CardDescription>
                </div>
                <Badge className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-none text-[8px] uppercase font-bold">
                  {tech.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-5">
              
              {/* Productivity progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan-500" />
                    <span>PRODUCTIVITY_SCORE</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{tech.productivityScore}%</span>
                </div>
                <Progress value={tech.productivityScore} className="h-1.5 bg-slate-900 rounded-none" />
              </div>

              {/* Monthly Stats */}
              <div className="grid grid-cols-2 gap-3 border border-cyan-500/5 p-2.5 bg-slate-900/10 text-[10px]">
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold block">ASSIGNED_JOBS</span>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{tech.assignedInspections} ACTIVE</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500 uppercase font-bold block">COMPLETED_MTH</span>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{tech.completedThisMonth} INSPECTIONS</span>
                  </div>
                </div>
                <div className="space-y-1 border-t border-cyan-500/5 pt-2">
                  <span className="text-slate-500 uppercase font-bold block">DEFICIENCIES_LOGGED</span>
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>{tech.deficienciesCreated} OPEN</span>
                  </div>
                </div>
                <div className="space-y-1 border-t border-cyan-500/5 pt-2">
                  <span className="text-slate-500 uppercase font-bold block">PENDING_REVIEW</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Clipboard className="w-3.5 h-3.5 text-amber-500" />
                    <span>{tech.reportsPendingReview} REPORTS</span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <span className="text-[8px] text-slate-500 uppercase font-bold block flex items-center gap-1">
                  <Award className="w-3 h-3 text-cyan-500" />
                  <span>ASTTBC_CREDENTIALS</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {tech.certifications.map((cert, idx) => (
                    <Badge key={idx} className="bg-slate-900 border border-cyan-500/10 text-cyan-400/90 rounded-none text-[8px] uppercase">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <Separator className="bg-cyan-500/5" />

            <div className="p-3 bg-slate-900/10 flex justify-end gap-1.5">
              <Button 
                variant="ghost"
                onClick={() => toast.info("SCHEDULE_LOADED", { description: `Opening calendar dispatch view for ${tech.name}...` })}
                className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 font-bold"
              >
                <Clock className="w-3 h-3 mr-1" />
                <span>SCHEDULE</span>
              </Button>
              <Button 
                onClick={() => handleAssignInspection(tech.name)}
                className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
              >
                <span>DISPATCH_JOB</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Roster performance analytics */}
      <Card className="bg-slate-950/80 border border-cyan-500/20 rounded-none hud-corners mt-6">
        <CardHeader className="border-b border-cyan-500/10">
          <CardTitle className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            <span>Field Team Analytics Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-slate-400 text-[10px] space-y-2 leading-relaxed">
          <p>
            ASTTBC fire protection guidelines require field technicians to hold active registration stamps matching the device systems being inspected. Eagle Eye's roster currently covers 100% of municipal fire alarm, sprinkler, emergency lighting, portable extinguisher, and backflow preventer inspection systems.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 font-bold mt-2">
            <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>ALL TECHNICIANS CURRENTLY CONFORM TO LOCAL VANCOUVER AND RICHMOND FIRE BYLAWS.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

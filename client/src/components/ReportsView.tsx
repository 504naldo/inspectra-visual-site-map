import React from "react";
import { Device, Report } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Eye, Plus, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { exportReportToPDF } from "@/lib/pdf-export";

interface ReportsViewProps {
  reports: Report[];
  devices: Device[];
  onAddReport?: () => void;
  activeRole: string;
  onViewReport?: (report: Report) => void;
}

export default function ReportsView({ reports, devices, onAddReport, activeRole, onViewReport }: ReportsViewProps) {

  const handleExportPDF = (report: Report) => {
    exportReportToPDF(report, devices);
    toast.success("PDF EXPORT SUCCESSFUL", {
      description: `DOWNLOADED REPORT: ${report.reportNumber}.PDF`
    });
  };

  const handleSendToClient = (reportId: string) => {
    toast.success("REPORT TRANSMITTED", {
      description: "SENT TO PROPERTY MANAGER VIA SECURE PORTAL & REPORTS@EWANDF.CA"
    });
  };

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "Draft":
        return <Badge className="bg-slate-900 text-slate-400 border-slate-700 rounded-none text-[9px] font-bold">DRAFT</Badge>;
      case "Ready for Review":
        return <Badge className="bg-amber-950/40 text-amber-400 border-amber-500/30 rounded-none text-[9px] font-bold animate-pulse">READY FOR REVIEW</Badge>;
      case "Sent":
        return <Badge className="bg-cyan-950/40 text-cyan-400 border-cyan-500/30 rounded-none text-[9px] font-bold">SENT TO PM</Badge>;
      case "Approved":
        return <Badge className="bg-emerald-950/40 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">APPROVED</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" />
            <span>COMPLIANCE_REPORTS_REGISTRY</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase mt-1">Official NFPA and Municipal Life-Safety Compliance Documentation</p>
        </div>

        {activeRole === "fire_company" && (
          <Button 
            onClick={onAddReport}
            className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 rounded-none text-xs font-bold gap-1.5 h-9 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
          >
            <Plus className="w-4 h-4" /> GENERATE_NEW_REPORT
          </Button>
        )}
      </div>

      {/* Reports Table */}
      <div className="border border-cyan-500/15 bg-slate-950/60 backdrop-blur-md rounded-none">
        <Table className="font-mono text-xs">
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-b border-cyan-500/15 hover:bg-transparent">
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Report Number</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Building Site</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Systems Inspected</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Date Generated</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Tested Nodes</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Deficiencies</TableHead>
              <TableHead className="text-cyan-500/70 font-bold text-[10px] uppercase">Status</TableHead>
              <TableHead className="text-right text-cyan-500/70 font-bold text-[10px] uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                <TableCell className="font-bold text-cyan-300 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-500/60" />
                    <span>{report.reportNumber}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300 font-medium">
                  <div>{report.buildingName}</div>
                  <div className="text-[9px] text-slate-500 uppercase">{report.address}</div>
                </TableCell>
                <TableCell className="text-slate-400 uppercase text-[10px]">
                  {report.systemsInspected.join(", ")}
                </TableCell>
                <TableCell className="text-slate-400">{report.date}</TableCell>
                <TableCell className="text-cyan-400 font-bold">{report.devicesTested}</TableCell>
                <TableCell className={`font-bold ${report.deficienciesFound > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {report.deficienciesFound} {report.criticalDeficiencies > 0 && <span className="text-[9px] text-rose-500 font-bold animate-pulse">({report.criticalDeficiencies} CRIT)</span>}
                </TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-right py-2">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewReport && onViewReport(report)}
                      className="h-10 w-10 rounded-none text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                      title="View / Preview Report"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExportPDF(report)}
                      className="h-10 w-10 rounded-none text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                      title="Export PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    {activeRole === "fire_company" && report.status === "Ready for Review" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSendToClient(report.id)}
                        className="h-10 w-10 rounded-none text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        title="Transmit to Client"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Info Card explaining PDF structure */}
      <div className="p-4 bg-slate-900/40 border border-cyan-500/10 text-[10px] leading-relaxed text-slate-400 space-y-2">
        <h4 className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANCE_EXPORT_PREFERENCE_ENGINE
        </h4>
        <p>
          Inspectra's report builder formats client-facing PDF documents with professional white-background templates and high-contrast safety details. This ensures high-contrast clarity for municipal inspectors reviewing photographic proof and CAD drawings. 
          Technician reports are transmitted instantly to <strong className="text-cyan-300">reports@ewandf.ca</strong> with complete hardware log telemetry.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Device, Report } from "@/lib/mock-data";
import { FileText, Download, ShieldCheck, AlertTriangle, PenLine } from "lucide-react";
import { toast } from "sonner";

interface ReportPreviewModalProps {
  report: Report | null;
  devices: Device[];
  onClose: () => void;
}

const STATUS_LABEL: Record<Device["status"], string> = {
  passed: "PASSED",
  failed: "FAILED",
  deficiency: "DEFICIENCY",
  not_tested: "NOT TESTED",
  testing: "TESTING",
  no_access: "NO ACCESS",
  attention_required: "ATTENTION REQUIRED",
  repair_approved: "REPAIR APPROVED"
};

const STATUS_BADGE_CLASS: Record<Device["status"], string> = {
  passed: "bg-emerald-950/50 text-emerald-400 border-emerald-500/30",
  failed: "bg-rose-950/50 text-rose-400 border-rose-500/30",
  deficiency: "bg-amber-950/50 text-amber-400 border-amber-500/30",
  not_tested: "bg-slate-950 text-slate-500 border-slate-800",
  testing: "bg-cyan-950/50 text-cyan-400 border-cyan-500/30",
  no_access: "bg-slate-900 text-slate-400 border-slate-700",
  attention_required: "bg-fuchsia-950/50 text-fuchsia-400 border-fuchsia-500/30",
  repair_approved: "bg-cyan-950/50 text-cyan-400 border-cyan-500/30"
};

export default function ReportPreviewModal({ report, devices, onClose }: ReportPreviewModalProps) {
  if (!report) return null;

  // Device-level breakdown is only available for the active demo building (Harbour View Apartments)
  const hasDeviceData = report.buildingId === "BLD-HVA";
  const reportDevices = hasDeviceData ? devices : [];
  const testedDevices = reportDevices.filter(d => d.status !== "not_tested");
  const passedDevices = reportDevices.filter(d => d.status === "passed");
  const openDeficiencies = reportDevices.filter(d =>
    d.status === "failed" || d.status === "deficiency" || d.status === "attention_required"
  );

  const compliancePct = hasDeviceData && reportDevices.length > 0
    ? Math.round((passedDevices.length / reportDevices.length) * 100)
    : report.devicesTested > 0
      ? Math.round(((report.devicesTested - report.deficienciesFound) / report.devicesTested) * 100)
      : 0;

  const handleExportPDF = () => {
    toast.success("PDF EXPORT SUCCESSFUL", {
      description: `DOWNLOADED REPORT: ${report.reportNumber}.PDF`
    });
  };

  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-2xl p-6 text-xs overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b border-cyan-500/10 pb-3">
          <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" />
            <span>REPORT_PREVIEW // {report.reportNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Report Header / Building Info */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-cyan-300 font-bold text-sm uppercase">{report.buildingName}</h3>
              <p className="text-slate-500 text-[10px] uppercase mt-0.5">{report.address}</p>
              <p className="text-slate-500 text-[10px] uppercase mt-0.5">Inspection Date: {report.date} &middot; Prepared By: {report.preparedBy}</p>
            </div>
            <Badge className="bg-cyan-950/40 text-cyan-300 border-cyan-500/30 rounded-none text-[9px] font-bold shrink-0">{report.status.toUpperCase()}</Badge>
          </div>

          <p className="text-[10px] text-slate-500 uppercase">
            Systems Inspected: <span className="text-cyan-300">{report.systemsInspected.join(", ")}</span>
          </p>

          <Separator className="bg-cyan-500/10" />

          {/* Compliance Summary */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> COMPLIANCE_SUMMARY
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-900/60 border border-cyan-500/10 p-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Devices Tested</div>
                <div className="text-lg font-bold text-cyan-300">{hasDeviceData ? testedDevices.length : report.devicesTested} / {hasDeviceData ? reportDevices.length : report.devicesTested}</div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-500/10 p-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Compliance Rate</div>
                <div className={`text-lg font-bold ${compliancePct >= 90 ? "text-emerald-400" : "text-amber-400"}`}>{compliancePct}%</div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-500/10 p-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Open Deficiencies</div>
                <div className={`text-lg font-bold ${(hasDeviceData ? openDeficiencies.length : report.deficienciesFound) > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {hasDeviceData ? openDeficiencies.length : report.deficienciesFound}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-500/10 p-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1">Critical Items</div>
                <div className={`text-lg font-bold ${report.criticalDeficiencies > 0 ? "text-rose-400" : "text-emerald-400"}`}>{report.criticalDeficiencies}</div>
              </div>
            </div>
          </div>

          <Separator className="bg-cyan-500/10" />

          {/* Device Summary Table */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 uppercase font-bold">DEVICE_SUMMARY</span>
            {hasDeviceData ? (
              <div className="border border-cyan-500/10 divide-y divide-cyan-500/5 max-h-48 overflow-y-auto">
                {reportDevices.map(dev => (
                  <div key={dev.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-900/30">
                    <div className="min-w-0">
                      <span className="font-bold text-cyan-300 uppercase">{dev.label}</span>
                      <span className="text-slate-500 text-[9px] uppercase ml-1.5">// {dev.type} &middot; {dev.floor} / {dev.area}</span>
                    </div>
                    <Badge className={`${STATUS_BADGE_CLASS[dev.status]} rounded-none text-[8px] font-bold shrink-0`}>{STATUS_LABEL[dev.status]}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[10px] uppercase bg-slate-900/30 border border-cyan-500/5 p-3 leading-relaxed">
                Device-level telemetry for this site has not been imported into Inspectra yet. Aggregate totals above are sourced from the field inspection log.
              </p>
            )}
          </div>

          {/* Deficiency Summary */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> DEFICIENCY_SUMMARY
            </span>
            {hasDeviceData ? (
              openDeficiencies.length > 0 ? (
                <div className="space-y-1.5">
                  {openDeficiencies.map(dev => (
                    <div key={dev.id} className="bg-rose-950/10 border border-rose-500/10 p-2.5 text-[10px] leading-relaxed">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-cyan-300 uppercase">{dev.label} // {dev.type}</span>
                        <Badge className={`${STATUS_BADGE_CLASS[dev.status]} rounded-none text-[8px] font-bold shrink-0`}>{STATUS_LABEL[dev.status]}</Badge>
                      </div>
                      <p className="text-slate-400 mt-1 uppercase">{dev.deficiencyNote || dev.customerNotes || "Deficiency logged — see device record for details."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-400 text-[10px] uppercase bg-emerald-950/10 border border-emerald-500/10 p-3">No open deficiencies — all tested devices are currently compliant.</p>
              )
            ) : (
              <p className="text-slate-500 text-[10px] uppercase bg-slate-900/30 border border-cyan-500/5 p-3 leading-relaxed">
                {report.deficienciesFound} deficienc{report.deficienciesFound === 1 ? "y" : "ies"} logged on-site ({report.criticalDeficiencies} critical) — see the full field report for itemized descriptions.
              </p>
            )}
          </div>

          <Separator className="bg-cyan-500/10" />

          {/* Signature Block */}
          <div className="space-y-2">
            <span className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5" /> SIGN_OFF
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-cyan-500/10 bg-slate-900/30 p-3 space-y-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Inspecting Technician</div>
                <div className="h-8 border-b border-cyan-500/20 flex items-end pb-1 text-cyan-300 font-bold uppercase italic">{report.preparedBy}</div>
                <div className="text-[9px] text-slate-500 uppercase">Date: {report.date}</div>
              </div>
              <div className="border border-cyan-500/10 bg-slate-900/30 p-3 space-y-3">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Property Manager / Owner Acknowledgement</div>
                <div className="h-8 border-b border-cyan-500/20 flex items-end pb-1 text-slate-600 uppercase italic">Pending signature</div>
                <div className="text-[9px] text-slate-500 uppercase">Date: —</div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-cyan-500/10 pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400"
            >
              CLOSE
            </Button>
            <Button
              type="button"
              onClick={handleExportPDF}
              className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT_PDF
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

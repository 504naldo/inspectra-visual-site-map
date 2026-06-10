import jsPDF from "jspdf";
import { Device, Report } from "@/lib/mock-data";

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

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const MARGIN = 15;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export function exportReportToPDF(report: Report, devices: Device[]) {
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

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 30, 40);
  doc.text(`Fire & Life Safety Compliance Report`, MARGIN, y);
  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80, 90, 100);
  doc.text(`Report #: ${report.reportNumber}`, MARGIN, y);
  doc.text(`Status: ${report.status}`, PAGE_WIDTH - MARGIN, y, { align: "right" });
  y += 8;

  doc.setDrawColor(180, 190, 200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 7;

  // Building info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 30, 40);
  doc.text(report.buildingName, MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 110);
  doc.text(report.address, MARGIN, y);
  y += 5;
  doc.text(`Inspection Date: ${report.date}    Prepared By: ${report.preparedBy}`, MARGIN, y);
  y += 5;
  doc.text(`Systems Inspected: ${report.systemsInspected.join(", ")}`, MARGIN, y);
  y += 9;

  // Compliance summary boxes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 30, 40);
  doc.text("Compliance Summary", MARGIN, y);
  y += 4;

  const summaryItems = [
    { label: "Devices Tested", value: hasDeviceData ? `${testedDevices.length} / ${reportDevices.length}` : `${report.devicesTested} / ${report.devicesTested}` },
    { label: "Compliance Rate", value: `${compliancePct}%` },
    { label: "Open Deficiencies", value: `${hasDeviceData ? openDeficiencies.length : report.deficienciesFound}` },
    { label: "Critical Items", value: `${report.criticalDeficiencies}` }
  ];

  const boxWidth = CONTENT_WIDTH / 4 - 2;
  summaryItems.forEach((item, i) => {
    const x = MARGIN + i * (boxWidth + 2.66);
    doc.setDrawColor(200, 210, 220);
    doc.setFillColor(245, 248, 250);
    doc.rect(x, y, boxWidth, 16, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 120);
    doc.text(item.label, x + 2, y + 5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20, 30, 40);
    doc.text(item.value, x + 2, y + 12);
  });
  y += 22;

  doc.setDrawColor(220, 225, 230);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 7;

  // Device summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 30, 40);
  doc.text("Device Summary", MARGIN, y);
  y += 5;

  if (hasDeviceData && reportDevices.length > 0) {
    doc.setFontSize(8);
    reportDevices.forEach(dev => {
      ensureSpace(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 30, 40);
      doc.text(`${dev.label}`, MARGIN, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 110, 120);
      doc.text(`${dev.type} - ${dev.floor} / ${dev.area}`, MARGIN + 50, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 30, 40);
      doc.text(STATUS_LABEL[dev.status], PAGE_WIDTH - MARGIN, y, { align: "right" });
      y += 5;
      doc.setDrawColor(235, 238, 242);
      doc.line(MARGIN, y - 1.5, PAGE_WIDTH - MARGIN, y - 1.5);
    });
    y += 4;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 120);
    const text = "Device-level telemetry for this site has not been imported into Inspectra yet. Aggregate totals above are sourced from the field inspection log.";
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    doc.text(lines, MARGIN, y);
    y += lines.length * 4 + 4;
  }

  ensureSpace(15);
  doc.setDrawColor(220, 225, 230);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 7;

  // Deficiency summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 30, 40);
  doc.text("Deficiency Summary", MARGIN, y);
  y += 5;

  if (hasDeviceData) {
    if (openDeficiencies.length > 0) {
      openDeficiencies.forEach(dev => {
        const note = dev.deficiencyNote || dev.customerNotes || "Deficiency logged - see device record for details.";
        const lines = doc.splitTextToSize(note, CONTENT_WIDTH - 4);
        ensureSpace(8 + lines.length * 4);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(20, 30, 40);
        doc.text(`${dev.label} (${dev.type}) - ${STATUS_LABEL[dev.status]}`, MARGIN, y);
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 110, 120);
        doc.text(lines, MARGIN, y);
        y += lines.length * 4 + 3;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(40, 130, 90);
      doc.text("No open deficiencies - all tested devices are currently compliant.", MARGIN, y);
      y += 6;
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 110, 120);
    const text = `${report.deficienciesFound} deficienc${report.deficienciesFound === 1 ? "y" : "ies"} logged on-site (${report.criticalDeficiencies} critical) - see the full field report for itemized descriptions.`;
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    doc.text(lines, MARGIN, y);
    y += lines.length * 4 + 4;
  }

  ensureSpace(40);
  y += 5;
  doc.setDrawColor(220, 225, 230);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 7;

  // Sign-off block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 30, 40);
  doc.text("Sign-Off", MARGIN, y);
  y += 6;

  const colWidth = CONTENT_WIDTH / 2 - 3;
  const drawSignBlock = (x: number, title: string, name: string, date: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 120);
    doc.text(title, x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 30, 40);
    doc.text(name, x, y + 11);
    doc.setDrawColor(180, 190, 200);
    doc.line(x, y + 13, x + colWidth, y + 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 120);
    doc.text(`Date: ${date}`, x, y + 18);
  };

  drawSignBlock(MARGIN, "Inspecting Technician", report.preparedBy, report.date);
  drawSignBlock(MARGIN + colWidth + 6, "Property Manager / Owner Acknowledgement", "Pending signature", "-");
  y += 25;

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 160, 170);
    doc.text(`Generated by Inspectra | ${report.reportNumber}`, MARGIN, PAGE_HEIGHT - 8);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 8, { align: "right" });
  }

  doc.save(`${report.reportNumber}.pdf`);
}

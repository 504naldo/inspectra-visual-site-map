import React, { useState } from "react";
import { 
  Database, ShieldAlert, GitBranch, FileText, DollarSign, Users, 
  Eye, FolderGit, History, WifiOff, Map, Server, KeyRound, TableProperties,
  ArrowRight, CheckCircle2, AlertTriangle, Shield, Check, Info, Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SystemArchitectureView() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>("Device");

  // 1. Core Data Objects
  const dataObjects = [
    {
      name: "Company",
      desc: "Represents the fire protection company using Inspectra.",
      fields: ["Company ID", "Company name", "Logo", "Address", "Phone", "Email", "Service area", "Branding settings", "Default quote terms", "Default report footer"],
      relations: ["Users", "Customers", "Buildings", "Reports", "Quotes"]
    },
    {
      name: "User",
      desc: "An authenticated account belonging to the fire company or external stakeholder.",
      fields: ["User ID", "Name", "Email", "Phone", "Password hash", "Role ID", "ASTTBC Certification Number", "Status (Active/Disabled)", "Created at"],
      relations: ["Role", "Company", "Inspections (as inspector)", "Audit logs"]
    },
    {
      name: "Role",
      desc: "Defines the access permissions and interface dashboard rules.",
      fields: ["Role ID", "Role name", "Permissions array", "Description"],
      relations: ["Users"]
    },
    {
      name: "Customer",
      desc: "The property owner or management firm responsible for buildings.",
      fields: ["Customer ID", "Company ID", "Customer name", "Billing address", "Primary contact name", "Email", "Phone", "Portal access status"],
      relations: ["Buildings", "Reports", "Quotes", "Users (External PMs)"]
    },
    {
      name: "Building",
      desc: "Represents a customer site or facility.",
      fields: ["Building ID", "Customer ID", "Building name", "Address", "Occupancy type", "Number of floors", "Compliance status", "Last inspection date", "Next inspection due", "Emergency profile status"],
      relations: ["Floors", "Site maps", "Devices", "Inspections", "Reports", "Quotes", "Emergency profile"]
    },
    {
      name: "Floor",
      desc: "An individual floor level within a building.",
      fields: ["Floor ID", "Building ID", "Floor name/number", "Sequence order", "Blueprint image URL"],
      relations: ["Building", "Site map", "Devices"]
    },
    {
      name: "Site Map",
      desc: "The visual interactive overlay structure mapping floor plans to device coordinates.",
      fields: ["Site Map ID", "Floor ID", "Scale factor", "Grid resolution", "Orientation degrees", "Last modified"],
      relations: ["Floor", "Devices"]
    },
    {
      name: "Device",
      desc: "Represents a mapped fire or life-safety asset.",
      fields: ["Device ID", "Building ID", "Floor ID", "Device type", "Location", "Map coordinates (X/Y %)", "QR/NFC tag ID", "Current status", "Last tested date", "Last tested by", "Government-shareable flag"],
      relations: ["Inspection results", "Deficiencies", "Photos", "Quote items", "Reports"]
    },
    {
      name: "Device Type",
      desc: "Standard hardware definition catalogued in the device library.",
      fields: ["Device Type ID", "Type name", "Category (Detection/Suppression/etc)", "Default checklist items", "Government sharing eligibility"],
      relations: ["Devices", "Inspection templates"]
    },
    {
      name: "Inspection",
      desc: "A scheduled or active testing event for a specific building.",
      fields: ["Inspection ID", "Building ID", "Template ID", "Assigned technician ID", "Status (Scheduled/In Progress/Complete)", "Scheduled date", "Started at", "Completed at"],
      relations: ["Building", "Inspection template", "Inspection results", "Deficiencies", "Reports", "Quotes"]
    },
    {
      name: "Inspection Template",
      desc: "The digital checklist rules used to execute a specific inspection type.",
      fields: ["Template ID", "Template name", "Checklist items array", "Required photos list", "Standard compliance code (NFPA 25/72)"],
      relations: ["Inspections"]
    },
    {
      name: "Inspection Result",
      desc: "The logged outcome of a single device test during an inspection.",
      fields: ["Result ID", "Inspection ID", "Device ID", "Status (Passed/Failed/Deficient/No Access)", "Checklist responses JSON", "Tested at", "Tested by"],
      relations: ["Inspection", "Device", "Deficiencies", "Photos"]
    },
    {
      name: "Deficiency",
      desc: "Represents a failed, deficient, inaccessible, or attention-required item.",
      fields: ["Deficiency ID", "Device ID", "Building ID", "Inspection ID", "Priority (Low/Medium/High/Critical)", "Technical description", "Customer-facing explanation", "Internal technician note", "Recommended repair", "Status (Open/Quoted/Resolved)", "Add to report", "Add to quote", "Share with government", "Created by", "Created date", "Closed date"],
      relations: ["Device", "Inspection", "Report", "Quote item", "Photos", "Audit logs"]
    },
    {
      name: "Report",
      desc: "The formal compliance document generated for stakeholders.",
      fields: ["Report ID", "Company ID", "Building ID", "Inspection ID", "Report number", "Report type", "Status (Draft/Approved/Sent)", "PDF URL", "Created by", "Created at", "Sent at"],
      relations: ["Building", "Inspection", "Deficiencies", "Attachments"]
    },
    {
      name: "Quote",
      desc: "A financial estimate for repairing logged deficiencies.",
      fields: ["Quote ID", "Company ID", "Customer ID", "Building ID", "Quote number", "Status (Draft/Sent/Approved/Declined)", "Subtotal", "Tax", "Total", "Expiry date", "Approved at", "Created at"],
      relations: ["Customer", "Building", "Quote items", "Deficiencies"]
    },
    {
      name: "Quote Item",
      desc: "An individual line item within a repair quote.",
      fields: ["Quote Item ID", "Quote ID", "Deficiency ID", "Description", "Quantity", "Unit price", "Labor hours", "Labor rate", "Total cost"],
      relations: ["Quote", "Deficiency"]
    },
    {
      name: "Photo / Attachment",
      desc: "Media file uploaded by field technicians to prove status or log deficiencies.",
      fields: ["Attachment ID", "File ID", "Building ID", "Device ID (optional)", "Deficiency ID (optional)", "Uploaded by", "Uploaded date", "Visibility setting"],
      relations: ["Building", "Device", "Deficiency"]
    },
    {
      name: "Fire Safety Plan",
      desc: "The approved building safety document outlining evacuation and hazards.",
      fields: ["Plan ID", "Building ID", "Revision date", "Approved by municipality", "Document URL", "Emergency notes"],
      relations: ["Building"]
    },
    {
      name: "Emergency Profile",
      desc: "Key fire safety and access coordinates shared with emergency responders.",
      fields: ["Profile ID", "Building ID", "FDC coordinates", "Lockbox combination/location", "Main gas shutoff", "Main electrical shutoff", "Emergency contacts list"],
      relations: ["Building"]
    },
    {
      name: "Government Sharing Rule",
      desc: "Defines municipal sharing triggers and privacy filters.",
      fields: ["Rule ID", "Company ID", "Customer ID (optional)", "Share critical deficiencies", "Share fire safety plans", "Share emergency profiles", "Automatic sharing enabled"],
      relations: ["Company", "Customer"]
    },
    {
      name: "Audit Log",
      desc: "Immutable record of all actions performed in the platform.",
      fields: ["Log ID", "Timestamp", "User ID", "User role", "Action category", "Building ID", "Record affected", "Previous values JSON", "New values JSON", "IP Address/Device"],
      relations: ["User", "Building"]
    }
  ];

  // 2. User Permissions Matrix
  const roles = ["Company Owner", "Admin", "Technician", "Report Reviewer", "Property Manager", "Government / FD", "Read-Only Viewer"];
  const permissionCategories = [
    { name: "Company Admin", desc: "Manage subscription, settings, templates", access: ["Full", "Full", "None", "None", "None", "None", "None"] },
    { name: "Customers", desc: "Create and edit customer records", access: ["Full", "Full", "Read", "Read", "None", "None", "None"] },
    { name: "Buildings", desc: "Create, edit, and map buildings", access: ["Full", "Full", "Read", "Full", "Read (Own)", "Read (Emergency)", "Read"] },
    { name: "Site Maps", desc: "Upload blueprints, place device pins", access: ["Full", "Full", "Read", "Full", "Read (Own)", "Read (Emergency)", "Read"] },
    { name: "Devices", desc: "Manage device library and instances", access: ["Full", "Full", "Full", "Full", "Read (Own)", "Read (Emergency)", "Read"] },
    { name: "Inspections", desc: "Create, assign, and execute inspections", access: ["Full", "Full", "Full (Assigned)", "Full", "Read (Own)", "None", "Read"] },
    { name: "Deficiencies", desc: "Log, edit, and resolve deficiencies", access: ["Full", "Full", "Full", "Full", "Read (Public)", "Read (Critical)", "Read"] },
    { name: "Internal Tech Notes", desc: "Private notes, margins, technician logs", access: ["Full", "Full", "Full", "Full", "None", "None", "None"] },
    { name: "Reports", desc: "Generate, review, approve, and send reports", access: ["Full", "Full", "Read", "Full", "Read (Sent)", "Read (Summary)", "Read"] },
    { name: "Quotes", desc: "Create and approve deficiency repair quotes", access: ["Full", "Full", "None", "Full", "Approve (Own)", "None", "None"] },
    { name: "Quote Pricing", desc: "View margins, cost breakdown, labor rates", access: ["Full", "Full", "None", "Full", "None", "None", "None"] },
    { name: "Customer Portal", desc: "Access the client-facing dashboard", access: ["Full", "Full", "None", "Full", "Full (Own)", "None", "None"] },
    { name: "Government Portal", desc: "Access emergency profile and safety plans", access: ["Full", "Full", "None", "Full", "None", "Full", "None"] },
    { name: "Emergency View", desc: "High-contrast map of life-safety shutoffs", access: ["Full", "Full", "Full", "Full", "Full", "Full", "Full"] },
    { name: "Municipal Sharing", desc: "Configure privacy sharing rules", access: ["Full", "Full", "None", "Full", "Full (Own)", "None", "None"] },
    { name: "Audit Log", desc: "View immutable platform history", access: ["Full", "Read", "None", "Read", "None", "None", "None"] },
    { name: "Settings", desc: "Branding, default quote terms, email templates", access: ["Full", "Full", "None", "None", "None", "None", "None"] }
  ];

  // 3. Inspection Workflow Steps
  const workflowSteps = [
    { step: 1, title: "Inspection Created", desc: "Admin schedules inspection event in the back office." },
    { step: 2, title: "Building Selected", desc: "Target building is linked to load existing blueprints and devices." },
    { step: 3, title: "Template Assigned", desc: "Checklist protocols (NFPA 25, 72, or custom) are bound to the inspection." },
    { step: 4, title: "Technician Assigned", desc: "A certified technician is assigned to the inspection task." },
    { step: 5, title: "Devices Loaded", desc: "All mapped devices are pulled into the local active inspection checklist." },
    { step: 6, title: "Inspection Starts", desc: "Technician opens the mobile app and starts testing." },
    { step: 7, title: "Devices Initialized", desc: "All device statuses begin in the 'Pending' state." },
    { step: 8, title: "Technician Tests Device", desc: "Technician physically locates and tests the device." },
    { step: 9, title: "Status Marked", desc: "Device is marked Passed, Failed, Deficient, No Access, or Attention Required." },
    { step: 10, title: "Result Saved", desc: "The device test timestamp, operator ID, and answers are logged." },
    { step: 11, title: "Deficiencies Logged", desc: "Failures automatically generate Deficiency records in the database." },
    { step: 12, title: "Media Attached", desc: "Photos of failures and internal/external notes are attached." },
    { step: 13, title: "Report Drafted", desc: "Platform automatically compiles the raw results into a PDF draft." },
    { step: 14, title: "Report Reviewed", desc: "Office admin or Report Reviewer inspects and signs off on the draft." },
    { step: 15, title: "Sent to Customer", desc: "Official Customer Report is dispatched to the Property Manager portal." },
    { step: 16, title: "Quotes Generated", desc: "Deficiencies marked 'Add to Quote' are converted into a pricing estimate." },
    { step: 17, title: "Customer Approves", desc: "Property Manager reviews and approves/authorizes repair work online." },
    { step: 18, title: "Repair Scheduled", desc: "Work order is dispatched to technicians to repair the deficiency." },
    { step: 19, title: "Device Repaired", desc: "Technician repairs the physical asset and performs a compliance retest." },
    { step: 20, title: "Deficiency Closed", desc: "Deficiency status is updated to 'Closed' and compliance score returns to 100%." },
    { step: 21, title: "Audit Log Recorded", desc: "Each transition is permanently logged for municipal and liability compliance." }
  ];

  // 4. File Storage visibility
  const fileTypes = [
    { type: "Floor plans", ext: "SVG, PDF, PNG", path: "buildings/{id}/floors/{id}/blueprint.*", visibility: "Internal, Customer, Government" },
    { type: "Device photos", ext: "JPG, WEBP", path: "buildings/{id}/devices/{id}/photos/*.*", visibility: "Internal, Customer" },
    { type: "Deficiency photos", ext: "JPG, WEBP", path: "deficiencies/{id}/evidence/*.*", visibility: "Internal, Customer, Government (if shared)" },
    { type: "Report PDFs", ext: "PDF", path: "buildings/{id}/reports/RPT-{number}.pdf", visibility: "Customer, Government (Summary only)" },
    { type: "Quote PDFs", ext: "PDF", path: "buildings/{id}/quotes/Q-{number}.pdf", visibility: "Internal, Customer" },
    { type: "Fire safety plans", ext: "PDF", path: "buildings/{id}/safety-plans/*.*", visibility: "Customer, Government" },
    { type: "Customer documents", ext: "PDF, DOCX", path: "customers/{id}/documents/*.*", visibility: "Internal, Customer" },
    { type: "Signature images", ext: "PNG", path: "signatures/{user_id}.png", visibility: "Internal (system rendering only)" }
  ];

  // 5. Database table fields
  const dbTables = [
    {
      name: "companies",
      fields: ["id (UUID, PK)", "name (VARCHAR)", "logo_url (VARCHAR)", "address (TEXT)", "phone (VARCHAR)", "email (VARCHAR)", "service_areas (JSONB)", "branding (JSONB)", "quote_terms (TEXT)", "report_footer (TEXT)", "created_at (TIMESTAMP)"]
    },
    {
      name: "users",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "name (VARCHAR)", "email (VARCHAR, UNIQUE)", "password_hash (VARCHAR)", "role_id (UUID, FK)", "asttbc_number (VARCHAR)", "status (VARCHAR)", "created_at (TIMESTAMP)"]
    },
    {
      name: "roles",
      fields: ["id (UUID, PK)", "name (VARCHAR)", "permissions (TEXT[])", "description (TEXT)", "created_at (TIMESTAMP)"]
    },
    {
      name: "customers",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "name (VARCHAR)", "billing_address (TEXT)", "primary_contact (VARCHAR)", "email (VARCHAR)", "phone (VARCHAR)", "portal_status (VARCHAR)", "created_at (TIMESTAMP)"]
    },
    {
      name: "buildings",
      fields: ["id (UUID, PK)", "customer_id (UUID, FK)", "name (VARCHAR)", "address (TEXT)", "occupancy_type (VARCHAR)", "num_floors (INT)", "compliance_status (VARCHAR)", "last_inspection_at (TIMESTAMP)", "next_inspection_due (TIMESTAMP)", "created_at (TIMESTAMP)"]
    },
    {
      name: "floors",
      fields: ["id (UUID, PK)", "building_id (UUID, FK)", "name (VARCHAR)", "sequence (INT)", "blueprint_url (VARCHAR)", "created_at (TIMESTAMP)"]
    },
    {
      name: "devices",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "customer_id (UUID, FK)", "building_id (UUID, FK)", "floor_id (UUID, FK)", "device_type_id (UUID, FK)", "device_code (VARCHAR)", "location (TEXT)", "map_x (NUMERIC)", "map_y (NUMERIC)", "status (VARCHAR)", "qr_code (VARCHAR)", "nfc_tag (VARCHAR)", "last_tested_at (TIMESTAMP)", "last_tested_by (UUID, FK)", "created_at (TIMESTAMP)"]
    },
    {
      name: "deficiencies",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "building_id (UUID, FK)", "device_id (UUID, FK)", "inspection_id (UUID, FK)", "priority (VARCHAR)", "technical_description (TEXT)", "customer_description (TEXT)", "internal_note (TEXT)", "recommended_repair (TEXT)", "status (VARCHAR)", "add_to_report (BOOLEAN)", "add_to_quote (BOOLEAN)", "share_with_government (BOOLEAN)", "created_by (UUID, FK)", "created_at (TIMESTAMP)", "closed_at (TIMESTAMP)"]
    },
    {
      name: "reports",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "customer_id (UUID, FK)", "building_id (UUID, FK)", "inspection_id (UUID, FK)", "report_number (VARCHAR)", "report_type (VARCHAR)", "status (VARCHAR)", "pdf_url (VARCHAR)", "sent_at (TIMESTAMP)", "approved_at (TIMESTAMP)", "created_by (UUID, FK)", "created_at (TIMESTAMP)"]
    },
    {
      name: "quotes",
      fields: ["id (UUID, PK)", "company_id (UUID, FK)", "customer_id (UUID, FK)", "building_id (UUID, FK)", "quote_number (VARCHAR)", "status (VARCHAR)", "subtotal (NUMERIC)", "tax (NUMERIC)", "total (NUMERIC)", "expiry_date (DATE)", "approved_at (TIMESTAMP)", "created_at (TIMESTAMP)"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Server className="h-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold tracking-wider text-cyan-400 font-mono uppercase">SYSTEM_ARCHITECTURE_PLANNER</h2>
        </div>
        <p className="text-xs text-slate-400 font-mono uppercase">
          Product planning, backend schemas, stakeholder visibility, and data pipelines for founders, developers, and enterprise customers.
        </p>
      </div>

      <Tabs defaultValue="data-model" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-1 bg-slate-950 border border-cyan-500/20 p-1 mb-6 rounded-none font-mono text-[10px] text-slate-400">
          <TabsTrigger value="data-model" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">1. Data Model</TabsTrigger>
          <TabsTrigger value="relationship-diagram" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">2. Relationships</TabsTrigger>
          <TabsTrigger value="permissions" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">3. Permissions Matrix</TabsTrigger>
          <TabsTrigger value="workflow" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">4. Workflows</TabsTrigger>
          <TabsTrigger value="pipelines" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">5. Reports & Quotes</TabsTrigger>
          <TabsTrigger value="portals" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">6. Portal Sharing</TabsTrigger>
          <TabsTrigger value="storage" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">7. Storage & Audit</TabsTrigger>
          <TabsTrigger value="offline" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">8. Offline Mode</TabsTrigger>
          <TabsTrigger value="roadmap" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">9. Roadmap & Stack</TabsTrigger>
          <TabsTrigger value="database" className="rounded-none data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 border-none uppercase py-1.5">10. DB Mockup</TabsTrigger>
        </TabsList>

        {/* 1. DATA MODEL */}
        <TabsContent value="data-model" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <div className="bg-slate-950 border border-cyan-500/20 p-4">
                <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase mb-2">Core Objects Catalog</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase mb-4">Click an entity below to inspect its schema fields and relational bounds.</p>
                <div className="grid grid-cols-2 gap-1 max-h-[350px] overflow-y-auto pr-1">
                  {dataObjects.map((obj) => (
                    <button
                      key={obj.name}
                      onClick={() => setSelectedEntity(obj.name)}
                      className={`text-left font-mono text-[10px] p-2 border ${
                        selectedEntity === obj.name 
                          ? "bg-cyan-950 border-cyan-500 text-cyan-400" 
                          : "bg-slate-900/40 border-cyan-500/10 text-slate-400 hover:border-cyan-500/30 hover:text-slate-300"
                      }`}
                    >
                      {obj.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedEntity && (
                (() => {
                  const entity = dataObjects.find(o => o.name === selectedEntity);
                  if (!entity) return null;
                  return (
                    <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
                      <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                            <Database className="w-4 h-4 text-cyan-400" />
                            {entity.name} Object Schema
                          </CardTitle>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[9px] rounded-none">POSTGRESQL_RELATIONAL</Badge>
                        </div>
                        <CardDescription className="text-[10px] text-slate-400 uppercase mt-1 leading-relaxed">
                          {entity.desc}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-2">
                          <span className="text-[10px] text-cyan-500 font-bold uppercase block">Attributes & Fields:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {entity.fields.map((field) => (
                              <div key={field} className="flex items-center gap-2 p-2 bg-slate-900/40 border border-cyan-500/5 text-[10px] text-slate-300">
                                <div className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full"></div>
                                <span>{field}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-cyan-500/10 pt-4">
                          <span className="text-[10px] text-emerald-500 font-bold uppercase block">Relational Bounds (Foreign Keys / Joins):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {entity.relations.map((rel) => (
                              <Badge 
                                key={rel} 
                                variant="outline" 
                                className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 rounded-none text-[9px]"
                              >
                                <ArrowRight className="w-3 h-3 mr-1" />
                                {rel.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              )}
            </div>
          </div>
        </TabsContent>

        {/* 2. RELATIONSHIP DIAGRAM */}
        <TabsContent value="relationship-diagram" className="space-y-4 outline-none">
          <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
            <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
              <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Stakeholder Data Flow & Relationships
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 uppercase mt-1">
                Visualizing how entities propagate across the platform, from company accounts down to client portals and emergency-response profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 overflow-x-auto">
              <div className="min-w-[800px] p-6 bg-slate-900/20 border border-cyan-500/10 relative space-y-12">
                
                {/* Flow 1: Core Operations */}
                <div className="space-y-4">
                  <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-2">Flow A: Core Operations & Inspection Lifecycle</div>
                  <div className="flex items-center justify-between gap-2">
                    {[
                      { name: "Company", desc: "Fire Protection Co" },
                      { name: "Users", desc: "Technicians & Admins" },
                      { name: "Customers", desc: "Property Management" },
                      { name: "Buildings", desc: "Real Estate Portfolios" },
                      { name: "Floors", desc: "Blueprints & Levels" },
                      { name: "Site Maps", desc: "Interactive Coordinates" },
                      { name: "Devices", desc: "Life-Safety Hardware Assets" }
                    ].map((node, i, arr) => (
                      <React.Fragment key={node.name}>
                        <div className="flex-1 bg-slate-950 border border-cyan-500/30 p-3 text-center hover:border-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                          <div className="text-[10px] font-bold text-cyan-400">{node.name.toUpperCase()}</div>
                          <div className="text-[8px] text-slate-500 mt-1 uppercase">{node.desc}</div>
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-cyan-500/50 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Flow 2: Inspection Outputs */}
                <div className="space-y-4">
                  <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-2">Flow B: Field Testing, Compliance Outputs & Approvals</div>
                  <div className="flex items-center justify-between gap-2">
                    {[
                      { name: "Inspections", desc: "Scheduled Events" },
                      { name: "Results", desc: "Pass / Fail Logs" },
                      { name: "Deficiencies", desc: "Logged Hardware Faults" },
                      { name: "Reports", desc: "Compliance PDF Drafts" },
                      { name: "Quotes", desc: "Repairs Estimates" },
                      { name: "PM Portal", desc: "Customer Authorizations" }
                    ].map((node, i, arr) => (
                      <React.Fragment key={node.name}>
                        <div className="flex-1 bg-slate-950 border border-emerald-500/30 p-3 text-center hover:border-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          <div className="text-[10px] font-bold text-emerald-400">{node.name.toUpperCase()}</div>
                          <div className="text-[8px] text-slate-500 mt-1 uppercase">{node.desc}</div>
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-emerald-500/50 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Flow 3: Government Emergency Sharing */}
                <div className="space-y-4">
                  <div className="text-[10px] text-fuchsia-500 font-bold uppercase tracking-wider mb-2">Flow C: Public Safety & Municipal Emergency Data Sharing</div>
                  <div className="flex items-center gap-2">
                    {[
                      { name: "Building", desc: "Registered Site", color: "border-cyan-500/30 text-cyan-400" },
                      { name: "Emergency Profile", desc: "FDC / Lockbox / Utilities", color: "border-fuchsia-500/40 text-fuchsia-400" },
                      { name: "Sharing Rules", desc: "Privacy Controls", color: "border-fuchsia-500/40 text-fuchsia-400" },
                      { name: "Gov / FD Portal", desc: "Emergency Responders", color: "border-fuchsia-500/40 text-fuchsia-400" },
                      { name: "Emergency View", desc: "Tactical HUD Map Overlay", color: "border-fuchsia-500/40 text-fuchsia-400 animate-pulse" }
                    ].map((node, i, arr) => (
                      <React.Fragment key={node.name}>
                        <div className={`w-[150px] bg-slate-950 border p-3 text-center hover:border-fuchsia-400 transition-colors shadow-[0_0_10px_rgba(217,70,239,0.1)] ${node.color}`}>
                          <div className="text-[10px] font-bold">{node.name.toUpperCase()}</div>
                          <div className="text-[8px] text-slate-500 mt-1 uppercase">{node.desc}</div>
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-fuchsia-500/50 shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. USER PERMISSIONS */}
        <TabsContent value="permissions" className="space-y-4 outline-none">
          <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
            <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Role-Based Access Control (RBAC) Matrix
                </CardTitle>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[9px] rounded-none">RBAC_COMPLIANT</Badge>
              </div>
              <CardDescription className="text-[10px] text-slate-400 uppercase mt-1 leading-relaxed">
                Inspectra uses role-based permissions so each stakeholder sees only the information they need. Private business data, quote pricing, labour estimates, internal technician notes, and billing details are protected from government and external users by default.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-cyan-500/20 bg-slate-900/40">
                    <th className="p-3 text-cyan-400 font-bold uppercase border-r border-cyan-500/10">Access Module</th>
                    {roles.map((role) => (
                      <th key={role} className="p-3 text-slate-300 font-bold uppercase text-center border-r border-cyan-500/10 last:border-0">{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionCategories.map((cat) => (
                    <tr key={cat.name} className="border-b border-cyan-500/10 hover:bg-slate-900/20">
                      <td className="p-3 border-r border-cyan-500/10">
                        <div className="font-bold text-slate-200">{cat.name}</div>
                        <div className="text-[8px] text-slate-500 mt-0.5">{cat.desc}</div>
                      </td>
                      {cat.access.map((acc, idx) => {
                        let badgeColor = "bg-slate-900/60 text-slate-500 border-slate-800";
                        if (acc.startsWith("Full")) badgeColor = "bg-cyan-950/40 text-cyan-400 border-cyan-500/30";
                        else if (acc.startsWith("Read")) badgeColor = "bg-blue-950/30 text-blue-400 border-blue-500/20";
                        else if (acc.startsWith("Approve")) badgeColor = "bg-emerald-950/30 text-emerald-400 border-emerald-500/20";
                        
                        return (
                          <td key={idx} className="p-3 text-center border-r border-cyan-500/10 last:border-0">
                            <span className={`inline-block px-2 py-0.5 border text-[9px] font-mono rounded-none uppercase ${badgeColor}`}>
                              {acc}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. WORKFLOWS */}
        <TabsContent value="workflow" className="space-y-4 outline-none">
          <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
            <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
              <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Inspection & Deficiency Lifecycle Timeline
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 uppercase mt-1">
                A chronological breakdown of database status transitions during a standard life-safety testing lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timeline */}
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  <span className="text-[10px] text-cyan-500 font-bold uppercase block mb-2">Chronological Steps:</span>
                  {workflowSteps.map((s) => (
                    <div key={s.step} className="flex gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                          {s.step}
                        </div>
                        <div className="w-0.5 h-full bg-cyan-500/10 min-h-[20px]"></div>
                      </div>
                      <div className="p-2 bg-slate-900/30 border border-cyan-500/5 flex-1 text-[10px] space-y-0.5">
                        <div className="font-bold text-slate-200 uppercase">{s.title}</div>
                        <p className="text-slate-400 text-[9px] uppercase leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* State Machine Badges */}
                <div className="space-y-6">
                  <div className="bg-slate-900/40 border border-cyan-500/10 p-4 space-y-4">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Database Status Enums
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">Device Statuses (`devices.status`):</span>
                        <div className="flex flex-wrap gap-1">
                          {["Pending", "In Progress", "Passed", "Failed", "Deficient", "No Access", "Attention Required", "Repaired", "Retest Required", "Closed"].map((st) => (
                            <Badge key={st} variant="outline" className="border-cyan-500/20 text-slate-300 text-[8px] rounded-none uppercase">{st}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-cyan-500/10 pt-3">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">Inspection Statuses (`inspections.status`):</span>
                        <div className="flex flex-wrap gap-1">
                          {["Scheduled", "In Progress", "Field Complete", "Report Draft", "Ready for Review", "Sent to Customer", "Approved", "Closed"].map((st) => (
                            <Badge key={st} variant="outline" className="border-emerald-500/20 text-slate-300 text-[8px] rounded-none uppercase">{st}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-cyan-500/10 pt-3">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">Deficiency Statuses (`deficiencies.status`):</span>
                        <div className="flex flex-wrap gap-1">
                          {["Open", "Added to Report", "Quoted", "Awaiting Approval", "Repair Approved", "Scheduled", "Repaired", "Retest Required", "Closed"].map((st) => (
                            <Badge key={st} variant="outline" className="border-fuchsia-500/20 text-slate-300 text-[8px] rounded-none uppercase">{st}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. REPORTS & QUOTES */}
        <TabsContent value="pipelines" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Report Generation */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  PDF Report Compiler Pipeline
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  How field results compile into distinct compliance PDFs based on target stakeholder visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="space-y-2">
                  <span className="text-[9px] text-cyan-500 font-bold uppercase block">Pipeline Inputs:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Building info", "Customer profile", "Inspection template", "Device pass/fail log", "Deficiencies registry", "Photo evidence", "Tech field notes", "Signatures"].map((inp) => (
                      <div key={inp} className="p-1.5 bg-slate-900/40 border border-cyan-500/5 text-slate-300">{inp.toUpperCase()}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-cyan-500/10 pt-3">
                  <span className="text-[9px] text-emerald-500 font-bold uppercase block">Distinct PDF Output Compile Profiles:</span>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-900/60 border-l-2 border-cyan-500">
                      <div className="font-bold text-cyan-400">INTERNAL COMPANY REPORT</div>
                      <p className="text-[8px] text-slate-400 uppercase mt-0.5">Includes raw technician logs, internal diagnostic comments, contractor margins, and private photos.</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 border-l-2 border-emerald-500">
                      <div className="font-bold text-emerald-400">CUSTOMER COMPLIANCE REPORT</div>
                      <p className="text-[8px] text-slate-400 uppercase mt-0.5">Includes plain-language customer explanations, recommended repairs, clear deficiency photos, and online approval triggers.</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 border-l-2 border-fuchsia-500">
                      <div className="font-bold text-fuchsia-400">GOVERNMENT COMPLIANCE SUMMARY</div>
                      <p className="text-[8px] text-slate-400 uppercase mt-0.5">Includes overall building compliance status, critical fire-safety deficiencies, and emergency profile details. Quote prices and internal technician notes are stripped.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 pt-2">
                  <Button variant="outline" className="flex-1 rounded-none text-[9px] h-7 uppercase border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/20" onClick={() => alert("Simulating Report Draft Generation...")}>Draft Report</Button>
                  <Button variant="outline" className="flex-1 rounded-none text-[9px] h-7 uppercase border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/20" onClick={() => alert("Simulating Customer PDF Preview...")}>Preview Customer PDF</Button>
                  <Button variant="outline" className="flex-1 rounded-none text-[9px] h-7 uppercase border-cyan-500/20 text-cyan-400 hover:bg-cyan-950/20" onClick={() => alert("Simulating Gov PDF Preview...")}>Preview Gov PDF</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quote Generation */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  Deficiency Quote Generator
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  How database deficiencies compile into automated customer repair quotes.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="space-y-2">
                  <span className="text-[9px] text-cyan-500 font-bold uppercase block">Quote Generation Flow:</span>
                  <div className="space-y-2 relative pl-4 border-l border-cyan-500/20">
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                      <div className="font-bold text-slate-200">DEFICIENCY CREATED</div>
                      <p className="text-[8px] text-slate-500 uppercase">Device fails test during active inspection sweep.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                      <div className="font-bold text-slate-200">MARKED "ADD TO QUOTE"</div>
                      <p className="text-[8px] text-slate-500 uppercase">Technician or office reviews and flags item for repairs pricing.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                      <div className="font-bold text-slate-200">AUTO-ESTIMATE ASSIGNED</div>
                      <p className="text-[8px] text-slate-500 uppercase">Default labor hours and materials costs are loaded from the Device Library.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
                      <div className="font-bold text-slate-200">CUSTOMER REVIEW & AUTHORIZATION</div>
                      <p className="text-[8px] text-slate-500 uppercase">Property Manager approves line items online, updating deficiency status to 'Repair Approved'.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-cyan-500/10 pt-3">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Quote Object Fields:</span>
                  <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-400">
                    {["Quote ID", "Customer ID", "Building ID", "Labor hours", "Material cost", "Taxes placeholder", "Expiry date", "Status (Draft/Sent/Approved)"].map((f) => (
                      <div key={f} className="p-1 bg-slate-900/20 border border-cyan-500/5">{f.toUpperCase()}</div>
                    ))}
                  </div>
                </div>

                <div className="p-2 bg-cyan-950/10 border border-dashed border-cyan-500/30 text-[9px] text-cyan-400/80 uppercase leading-relaxed">
                  <Info className="w-3.5 h-3.5 inline mr-1.5 shrink-0" />
                  Quotes are linked directly back to mapped deficiencies so customers can see exactly where each repair is located and why it is recommended.
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* 6. PORTAL SHARING */}
        <TabsContent value="portals" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Customer Portal Data */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Customer Portal Visibility
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  Defines what property managers can and cannot access within their client console.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] text-emerald-500 font-bold uppercase block">Visible to Customer:</span>
                    <div className="space-y-1">
                      {["Linked buildings", "Compliance status score", "Open deficiencies", "Customer-facing explanations", "Completed report PDFs", "Active quotes & estimates", "Online approvals", "Emergency contacts"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-slate-300 text-[9px]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-l border-cyan-500/10 pl-4">
                    <span className="text-[9px] text-red-500 font-bold uppercase block">Hidden from Customer:</span>
                    <div className="space-y-1">
                      {["Internal technician notes", "Contractor profit margins", "Private diagnostic photos", "Unreviewed draft reports", "Labor cost breakdowns", "Other customers' records", "Government sharing controls"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-slate-500 text-[9px]">
                          <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-cyan-500/10 bg-slate-900/20 p-3 space-y-2">
                  <span className="text-[9px] text-cyan-400 font-bold uppercase block">Data Masking Example:</span>
                  <div className="space-y-1.5 text-[8px]">
                    <div className="flex justify-between border-b border-cyan-500/5 pb-1">
                      <span className="text-slate-500">CUSTOMER VIEW:</span>
                      <span className="text-emerald-400">"Smoke detector in main corridor did not respond properly."</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">INTERNAL TECH VIEW:</span>
                      <span className="text-cyan-400">"Detector failed entry test. Adjacent device responded. Recommend replacement."</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government Sharing Data */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Government & FD Sharing Controls
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  Defines what data is exposed to local fire inspectors and municipal emergency responders.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] text-fuchsia-500 font-bold uppercase block">Shared with Fire Dept:</span>
                    <div className="space-y-1">
                      {["Building emergency profile", "Lockbox locations", "FDC coordinates", "Utility shutoffs", "Standpipe zones", "Fire safety plans", "Critical deficiencies", "Compliance summaries"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-slate-300 text-[9px]">
                          <Check className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-l border-cyan-500/10 pl-4">
                    <span className="text-[9px] text-red-500 font-bold uppercase block">Hidden from Fire Dept:</span>
                    <div className="space-y-1">
                      {["Repair quote pricing", "Labor estimates", "Material costs", "Internal technician notes", "Billing details", "Contractor margins", "Private site photos", "Draft reports"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-slate-500 text-[9px]">
                          <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-cyan-500/10 bg-slate-900/20 p-3 space-y-2">
                  <span className="text-[9px] text-cyan-400 font-bold uppercase block">Automatic Sharing Logic:</span>
                  <p className="text-[8px] text-slate-400 uppercase leading-relaxed">
                    A deficiency appears in the Government Portal ONLY if it is marked <span className="text-fuchsia-400 font-bold">Critical</span>, or <span className="text-fuchsia-400 font-bold">"Share with Government"</span> is enabled, or it is required for emergency response. Otherwise, it stays private to the fire company and customer.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* 7. STORAGE & AUDIT */}
        <TabsContent value="storage" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* File Storage */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <FolderGit className="w-4 h-4 text-cyan-400" />
                  Cloud Object Storage Architecture
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  How media files and blueprints are partitioned and structured in cloud storage buckets.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="space-y-2">
                  <span className="text-[9px] text-cyan-500 font-bold uppercase block">File Partitioning Rules:</span>
                  <div className="space-y-2">
                    {fileTypes.map((f) => (
                      <div key={f.type} className="p-2 bg-slate-900/40 border border-cyan-500/5 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200">{f.type.toUpperCase()} ({f.ext})</span>
                          <Badge variant="outline" className="border-cyan-500/20 text-slate-400 text-[8px] rounded-none uppercase">{f.visibility}</Badge>
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono uppercase">PATH: {f.path}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2 bg-cyan-950/10 border border-dashed border-cyan-500/30 text-[9px] text-cyan-400/80 uppercase leading-relaxed">
                  <Info className="w-3.5 h-3.5 inline mr-1.5 shrink-0" />
                  Photos and documents are not automatically shared externally. Each file has a strict visibility setting that controls whether it can be seen by customers, government users, or internal users only.
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Immutable Compliance Audit Logging
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  Audit logs are important for compliance, accountability, municipal sharing, and customer trust.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="space-y-2">
                  <span className="text-[9px] text-cyan-500 font-bold uppercase block">Logged Actions & Triggers:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[8px] text-slate-400">
                    {[
                      "User login / logout", "User invited / disabled", "Role changed", "Building created / edited",
                      "Device added / moved", "Inspection started / completed", "Deficiency created / closed",
                      "Report generated / exported", "Quote created / approved", "Municipal sharing changed",
                      "Gov user viewed profile", "File visibility toggled"
                    ].map((act) => (
                      <div key={act} className="p-1.5 bg-slate-900/40 border border-cyan-500/5 flex items-center gap-1.5">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                        <span>{act.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t border-cyan-500/10 pt-3">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Audit Log Database Schema:</span>
                  <div className="grid grid-cols-2 gap-1 text-[8px] text-slate-500">
                    {["Event ID (UUID, PK)", "Timestamp (TIMESTAMP)", "User ID (UUID, FK)", "User Role (VARCHAR)", "Action Category (VARCHAR)", "Record Affected (VARCHAR)", "Previous Value (JSONB)", "New Value (JSONB)"].map((f) => (
                      <div key={f} className="p-1 bg-slate-900/20 border border-cyan-500/5">{f}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* 8. OFFLINE MODE */}
        <TabsContent value="offline" className="space-y-4 outline-none">
          <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
            <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
              <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-cyan-400" />
                Offline Mode Sync Plan (Progressive Web App)
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Offline mode is critical for field technicians because many parkades, mechanical rooms, stairwells, rooftops, and service areas may have poor reception.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                
                {/* Stage 1 */}
                <div className="p-4 bg-slate-900/40 border border-cyan-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 rounded-none text-[9px]">STAGE_1</Badge>
                    <span className="font-bold text-slate-200 text-[10px] uppercase">BEFORE SITE VISIT</span>
                  </div>
                  <ul className="space-y-1.5 text-[9px] text-slate-400 uppercase list-disc list-inside">
                    <li>Technician downloads assigned inspection</li>
                    <li>Building floor blueprints cached</li>
                    <li>Device registry cached locally</li>
                    <li>Previous deficiencies cached</li>
                    <li>Required checklists cached</li>
                  </ul>
                </div>

                {/* Stage 2 */}
                <div className="p-4 bg-slate-900/40 border border-cyan-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 rounded-none text-[9px]">STAGE_2</Badge>
                    <span className="font-bold text-slate-200 text-[10px] uppercase">DURING INSPECTION</span>
                  </div>
                  <ul className="space-y-1.5 text-[9px] text-slate-400 uppercase list-disc list-inside">
                    <li>Technician tests devices offline</li>
                    <li>Logs notes & photo attachments</li>
                    <li>Creates local deficiencies</li>
                    <li>Marks device pass/fail statuses</li>
                    <li>Saves changes to IndexedDB</li>
                  </ul>
                </div>

                {/* Stage 3 */}
                <div className="p-4 bg-slate-900/40 border border-cyan-500/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 rounded-none text-[9px]">STAGE_3</Badge>
                    <span className="font-bold text-slate-200 text-[10px] uppercase">AFTER RECONNECTION</span>
                  </div>
                  <ul className="space-y-1.5 text-[9px] text-slate-400 uppercase list-disc list-inside">
                    <li>App detects network connection</li>
                    <li>Syncs local changes with API</li>
                    <li>Resolves merge conflicts</li>
                    <li>Uploads photo attachments</li>
                    <li>Updates dashboards & reports</li>
                  </ul>
                </div>

              </div>

              <div className="border border-dashed border-cyan-500/20 bg-cyan-500/5 p-4 space-y-2">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">Offline Sync Statuses:</span>
                <div className="flex flex-wrap gap-2">
                  {["Synced", "Pending Sync", "Sync Error", "Conflict Review", "Offline Mode Active"].map((st) => (
                    <Badge key={st} variant="outline" className="border-cyan-500/30 text-cyan-300 rounded-none text-[9px] uppercase px-3 py-1 bg-slate-950">{st}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. ROADMAP & STACK */}
        <TabsContent value="roadmap" className="space-y-4 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tech Stack */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  Recommended SaaS Tech Stack
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  The first real version should be a responsive web app/PWA so technicians can use it on tablets without building separate iOS and Android apps immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-[10px]">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-900/40 border border-cyan-500/10 space-y-1">
                    <span className="font-bold text-cyan-400 block text-[9px]">FRONTEND:</span>
                    <p className="text-[8px] text-slate-400 uppercase">Next.js or React, TypeScript, Tailwind CSS, Map/canvas SVG rendering engine</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/40 border border-cyan-500/10 space-y-1">
                    <span className="font-bold text-cyan-400 block text-[9px]">BACKEND:</span>
                    <p className="text-[8px] text-slate-400 uppercase">Node.js (NestJS/Express), REST or GraphQL API, RBAC Middleware, background PDF compiler workers</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/40 border border-cyan-500/10 space-y-1">
                    <span className="font-bold text-cyan-400 block text-[9px]">DATABASE:</span>
                    <p className="text-[8px] text-slate-400 uppercase">PostgreSQL (Relational structure for companies, customers, devices, and logs)</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/40 border border-cyan-500/10 space-y-1">
                    <span className="font-bold text-cyan-400 block text-[9px]">FILE STORAGE:</span>
                    <p className="text-[8px] text-slate-400 uppercase">Cloud Object Storage (AWS S3/MinIO) for blueprints, photos, and report PDFs</p>
                  </div>
                </div>

                <div className="border border-cyan-500/10 bg-slate-900/20 p-3 space-y-2">
                  <span className="text-[9px] text-cyan-400 font-bold uppercase block">Security & Privacy Controls:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[8px] text-slate-400">
                    {["Customer isolation", "Government filters", "Audit logs", "Secure auth", "Optional MFA", "Data encryption", "Daily Backups", "Access expiry"].map((item) => (
                      <div key={item} className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span>{item.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Roadmap */}
            <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
              <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  API Integration Roadmap
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-400 mt-1">
                  Future third-party system connections planned for the production rollout.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-[10px] max-h-[350px] overflow-y-auto">
                {[
                  { name: "Accounting Software", purpose: "Push approved quotes and invoices into QuickBooks/Xero.", priority: "High", status: "Future", data: "Customer, quote, invoice, tax" },
                  { name: "Email/SMS Dispatch", purpose: "Send inspection notices, report links, and quote approvals.", priority: "High", status: "Planned", data: "Customer contact, links, updates" },
                  { name: "GIS / Municipal Systems", purpose: "Allow municipalities to connect building emergency profiles to geographic maps.", priority: "Medium", status: "Future", data: "Address, FDC, critical deficiencies" },
                  { name: "Label Printers", purpose: "Print QR/NFC physical hardware labels for rapid field scans.", priority: "Medium", status: "Planned", data: "Device ID, QR link" },
                  { name: "Digital Signature Service", purpose: "Authorize compliance reports and repair quotes online.", priority: "High", status: "Prototype", data: "Signatures, document hashes" }
                ].map((item) => {
                  let statusColor = "border-slate-800 text-slate-500";
                  if (item.status === "Prototype") statusColor = "border-cyan-500/30 text-cyan-400 bg-cyan-950/20";
                  else if (item.status === "Planned") statusColor = "border-emerald-500/30 text-emerald-400 bg-emerald-950/10";
                  
                  return (
                    <div key={item.name} className="p-2.5 bg-slate-900/40 border border-cyan-500/5 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{item.name.toUpperCase()}</span>
                        <Badge variant="outline" className={`rounded-none text-[8px] uppercase ${statusColor}`}>{item.status}</Badge>
                      </div>
                      <p className="text-[8px] text-slate-400 uppercase leading-relaxed">{item.purpose}</p>
                      <div className="flex justify-between text-[7px] text-slate-500 uppercase font-mono pt-1 border-t border-cyan-500/5">
                        <span>PRIORITY: {item.priority}</span>
                        <span>DATA: {item.data}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* 10. DB MOCKUP */}
        <TabsContent value="database" className="space-y-4 outline-none">
          <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
            <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
              <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                <TableProperties className="w-4 h-4 text-cyan-400" />
                Relational Database Table Mockups
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 mt-1">
                Visualizing sample tables, primary keys (PK), foreign keys (FK), and data types in the Postgres database schema.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {dbTables.map((t) => (
                  <div key={t.name} className="p-3 bg-slate-900/40 border border-cyan-500/10 space-y-2">
                    <div className="flex items-center gap-1.5 border-b border-cyan-500/10 pb-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-cyan-400 text-[10px] uppercase">{t.name}</span>
                    </div>
                    <div className="space-y-1 font-mono text-[8px] text-slate-400">
                      {t.fields.map((f) => (
                        <div key={f} className="flex items-center justify-between p-1 bg-slate-950/40">
                          <span>{f.split(" ")[0]}</span>
                          <span className="text-slate-500 text-[7px] uppercase">{f.substring(f.indexOf(" ") + 1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

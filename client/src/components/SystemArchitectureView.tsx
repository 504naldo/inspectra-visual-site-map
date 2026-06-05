import React, { useState } from "react";
import { 
  Database, ShieldAlert, GitBranch, FileText, DollarSign, Users, 
  Eye, FolderGit, History, WifiOff, Map, Server, KeyRound, TableProperties,
  ArrowRight, CheckCircle2, AlertTriangle, Shield, Check, Info, Lock, Download, Code, FileCode, Plus, Trash2, Edit2, Move
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

  const [exportFormat, setExportFormat] = useState<"prisma" | "knex" | "sql">("prisma");
  const [copiedSchema, setCopiedSchema] = useState(false);

  // ERD Diagram State
  const [erdTables, setErdTables] = useState([
    { id: "companies", name: "COMPANIES", x: 40, y: 30, fields: ["id (UUID, PK)", "name (VARCHAR)", "email (VARCHAR)", "phone (VARCHAR)", "address (TEXT)"] },
    { id: "users", name: "USERS", x: 340, y: 30, fields: ["id (UUID, PK)", "company_id (UUID, FK)", "name (VARCHAR)", "email (VARCHAR)", "asttbc_number (VARCHAR)"] },
    { id: "customers", name: "CUSTOMERS", x: 40, y: 220, fields: ["id (UUID, PK)", "company_id (UUID, FK)", "name (VARCHAR)", "primary_contact (VARCHAR)"] },
    { id: "buildings", name: "BUILDINGS", x: 340, y: 220, fields: ["id (UUID, PK)", "customer_id (UUID, FK)", "name (VARCHAR)", "address (TEXT)"] },
    { id: "devices", name: "DEVICES", x: 640, y: 120, fields: ["id (UUID, PK)", "building_id (UUID, FK)", "device_code (VARCHAR)", "location (TEXT)", "status (VARCHAR)"] }
  ]);

  const [erdRelations, setErdRelations] = useState([
    { id: "r1", from: "companies", to: "users", type: "1:N" },
    { id: "r2", from: "companies", to: "customers", type: "1:N" },
    { id: "r3", from: "customers", to: "buildings", type: "1:N" },
    { id: "r4", from: "buildings", to: "devices", type: "1:N" }
  ]);

  const [selectedErdTable, setSelectedErdTable] = useState<string | null>(null);
  const [newFieldName, setNewErdFieldName] = useState("");
  const [newFieldType, setNewErdFieldType] = useState("VARCHAR");
  const [draggedTableId, setDraggedTableId] = useState<string | null>(null);
  const [dragOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [newRelationFrom, setNewRelationFrom] = useState("");
  const [newRelationTo, setNewRelationTo] = useState("");
  const [newRelationType, setNewRelationType] = useState("1:N");

  const handleErdTableMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    setDraggedTableId(tableId);
    const table = erdTables.find(t => t.id === tableId);
    if (table) {
      setDragStartOffset({
        x: e.clientX - table.x,
        y: e.clientY - table.y
      });
    }
  };

  const handleErdCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedTableId) {
      const newX = Math.max(10, Math.min(800, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(450, e.clientY - dragOffset.y));
      setErdTables(prev => prev.map(t => t.id === draggedTableId ? { ...t, x: newX, y: newY } : t));
    }
  };

  const handleErdCanvasMouseUp = () => {
    setDraggedTableId(null);
  };

  const handleAddErdField = () => {
    if (!selectedErdTable || !newFieldName) return;
    setErdTables(prev => prev.map(t => {
      if (t.id === selectedErdTable) {
        return {
          ...t,
          fields: [...t.fields, `${newFieldName.toLowerCase()} (${newFieldType})`]
        };
      }
      return t;
    }));
    setNewErdFieldName("");
  };

  const handleRemoveErdField = (tableId: string, fieldIndex: number) => {
    setErdTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const updatedFields = [...t.fields];
        updatedFields.splice(fieldIndex, 1);
        return { ...t, fields: updatedFields };
      }
      return t;
    }));
  };

  const handleAddErdRelation = () => {
    if (!newRelationFrom || !newRelationTo || newRelationFrom === newRelationTo) return;
    const relationId = `r_${Date.now()}`;
    setErdRelations(prev => [
      ...prev,
      { id: relationId, from: newRelationFrom, to: newRelationTo, type: newRelationType }
    ]);
    setNewRelationFrom("");
    setNewRelationTo("");
  };

  const handleRemoveErdRelation = (relationId: string) => {
    setErdRelations(prev => prev.filter(r => r.id !== relationId));
  };

  const handleExportErdLayout = () => {
    const erdLayout = {
      tables: erdTables,
      relations: erdRelations
    };
    const blob = new Blob([JSON.stringify(erdLayout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inspectra_erd_layout.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleErdAutoLayout = () => {
    // Force-Directed Layout physics simulation
    const canvasWidth = 800;
    const canvasHeight = 450;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const tableWidth = 180;
    const tableHeight = 120;

    // Parameters
    const iterations = 100;
    const gravity = 0.05; // pull to center
    const kRepulsion = 150000; // push apart
    const kSpring = 0.06; // pull connected tables together
    const desiredDistance = 250; // ideal spring length

    setErdTables(prev => {
      // Create mutable copy of nodes with velocities
      const nodes = prev.map(t => ({
        ...t,
        vx: 0,
        vy: 0,
        x: t.x === 0 && t.y === 0 ? Math.random() * 200 + 300 : t.x,
        y: t.y === 0 && t.y === 0 ? Math.random() * 150 + 150 : t.y
      }));

      // Run force simulation iterations
      for (let iter = 0; iter < iterations; iter++) {
        // 1. Repulsion forces (all nodes push each other apart)
        for (let i = 0; i < nodes.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            if (i === j) continue;
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distSq = dx * dx + dy * dy + 0.01; // avoid div by zero
            const dist = Math.sqrt(distSq);

            if (dist < 350) { // only repulse if relatively close
              const force = kRepulsion / distSq;
              nodes[i].vx += (dx / dist) * force;
              nodes[i].vy += (dy / dist) * force;
            }
          }
        }

        // 2. Attraction forces (connected nodes pull together)
        erdRelations.forEach(rel => {
          const idxFrom = nodes.findIndex(n => n.id === rel.from);
          const idxTo = nodes.findIndex(n => n.id === rel.to);

          if (idxFrom !== -1 && idxTo !== -1) {
            const dx = nodes[idxTo].x - nodes[idxFrom].x;
            const dy = nodes[idxTo].y - nodes[idxFrom].y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;

            // Spring force
            const force = kSpring * (dist - desiredDistance);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            nodes[idxFrom].vx += fx;
            nodes[idxFrom].vy += fy;
            nodes[idxTo].vx -= fx;
            nodes[idxTo].vy -= fy;
          }
        });

        // 3. Gravity (pull toward center) and apply velocities
        nodes.forEach(node => {
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * gravity;
          node.vy += dy * gravity;

          // Update position (damped velocity)
          node.x += node.vx * 0.15;
          node.y += node.vy * 0.15;

          // Reset velocities for next iteration
          node.vx *= 0.5;
          node.vy *= 0.5;

          // Keep inside boundary margins
          node.x = Math.max(30, Math.min(canvasWidth - tableWidth - 30, node.x));
          node.y = Math.max(30, Math.min(canvasHeight - tableHeight - 30, node.y));
        });
      }

      // Format back to original state structure
      return nodes.map(n => ({
        id: n.id,
        name: n.name,
        fields: n.fields,
        x: Math.round(n.x),
        y: Math.round(n.y)
      }));
    });
  };

  // Seeding tool states
  const [seedingLogs, setSeedingLogs] = useState<string[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedPreviewTable, setSeedPreviewTable] = useState<string>("companies");

  const runSeedingSimulation = () => {
    setIsSeeding(true);
    setSeedingLogs([]);
    
    const logs = [
      "SEEDING_INIT // CONNECTING TO TARGET DATABASE...",
      "AUTH_OK // DATABASE CONNECTION ESTABLISHED [POSTGRESQL // PORT 5432]",
      "MIGRATION_CHECK // SCHEMAS MATCH PRODUCTION VERSION v1.2.4",
      "CLEANING_DB // TRUNCATING EXISTING RECORDS (CASCADE)...",
      "CLEANING_DB // TABLE 'companies' TRUNCATED.",
      "CLEANING_DB // TABLE 'roles' TRUNCATED.",
      "CLEANING_DB // TABLE 'users' TRUNCATED.",
      "CLEANING_DB // TABLE 'customers' TRUNCATED.",
      "CLEANING_DB // TABLE 'buildings' TRUNCATED.",
      "CLEANING_DB // TABLE 'floors' TRUNCATED.",
      "CLEANING_DB // TABLE 'devices' TRUNCATED.",
      "CLEANING_DB // TABLE 'deficiencies' TRUNCATED.",
      "SEED_START // INJECTING SEED DATASETS...",
      "SEED_COMPANIES // INJECTED 1 COMPANY RECORD [EAGLE EYE FIRE & LIFE SAFETY]",
      "SEED_ROLES // INJECTED 3 ROLE DEFINITIONS [ADMIN, TECHNICIAN, CUSTOMER]",
      "SEED_USERS // INJECTED 5 USER ACCOUNTS WITH SECURE PASSWORD HASHES",
      "SEED_CUSTOMERS // INJECTED 4 REALISTIC PROPERTY MANAGEMENT CUSTOMERS",
      "SEED_BUILDINGS // INJECTED 4 MULTI-STORY BUILDINGS [HARBOUR VIEW APTS, PACIFIC MEDICAL, ETC]",
      "SEED_FLOORS // INJECTED 12 FLOOR Blueprints AND SEQUENCE INDICES",
      "SEED_DEVICES // INJECTING 85 COMPLIANCE HARDWARE ASSETS...",
      "SEED_DEVICES // 85 COMPLIANCE HARDWARE ASSETS PLOTTED TO BLUEPRINT COORDINATES",
      "SEED_DEFICIENCIES // INJECTED ACTIVE DEFICIENCIES [SD-M-10 (CRITICAL FAILURE), SUPV-D-01 (WARNING)]",
      "SEED_REPORTS // INJECTED 3 COMPLIANCE REGISTRY RECORDS",
      "SEED_QUOTES // INJECTED ACTIVE DEFICIENCY REPAIR QUOTES",
      "SEED_COMPLETE // RELATIONAL INTEGRITY VERIFIED (100% FOREIGN KEYS MATCHED)",
      "SEED_COMPLETE // DATABASE SEEDING COMPLETED SUCCESSFULLY [TOTAL RECORDS: 124]"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setSeedingLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, -1)}] ${logs[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsSeeding(false);
      }
    }, 150);
  };

  const getSeedCSVData = (tableName: string) => {
    // Find the matching table in our live ERD state
    const targetTable = erdTables.find(t => t.id === tableName);
    if (!targetTable) {
      return "id,status,created_at\n1,active,2026-06-05 08:00:00";
    }

    // Extract raw column names from fields
    const columns = targetTable.fields.map(f => f.split(" (")[0].trim());
    const header = columns.join(",");

    // Generate dynamic mock values based on the field types in erdTables
    const getMockValue = (colName: string, fieldDef: string, rowIndex: number) => {
      const defLower = fieldDef.toLowerCase();
      
      if (defLower.includes("pk")) {
        if (tableName === "companies") return "ee9c3d2d-27f5-4672-9114-1e293b2dc02d";
        if (tableName === "users") return rowIndex === 0 ? "u1b2c3d4-4672-9114-1e29-3b2dc02dc02d" : "u5f6g7h8-4672-9114-1e29-3b2dc02dc02d";
        if (tableName === "customers") return rowIndex === 0 ? "cust_hva_uuid" : "cust_pmg_uuid";
        if (tableName === "buildings") return rowIndex === 0 ? "bld_hva_uuid" : "bld_pmg_uuid";
        if (tableName === "devices") return rowIndex === 0 ? "dev_sd_10_uuid" : "dev_supv_01_uuid";
        if (tableName === "deficiencies") return rowIndex === 0 ? "def_sd_10_uuid" : "def_supv_01_uuid";
        return `mock-uuid-${tableName}-${rowIndex}`;
      }

      if (defLower.includes("fk")) {
        if (colName.includes("company")) return "ee9c3d2d-27f5-4672-9114-1e293b2dc02d";
        if (colName.includes("customer")) return rowIndex === 0 ? "cust_hva_uuid" : "cust_pmg_uuid";
        if (colName.includes("building")) return rowIndex === 0 ? "bld_hva_uuid" : "bld_pmg_uuid";
        if (colName.includes("floor")) return rowIndex === 0 ? "floor_main_uuid" : "floor_p1_uuid";
        if (colName.includes("device")) return rowIndex === 0 ? "dev_sd_10_uuid" : "dev_supv_01_uuid";
        if (colName.includes("user") || colName.includes("by") || colName.includes("creator")) return "u1b2c3d4-4672-9114-1e29-3b2dc02dc02d";
        return "fk-reference-uuid";
      }

      // Handle specific column names
      if (colName === "name") {
        if (tableName === "companies") return "Eagle Eye Fire & Life Safety";
        if (tableName === "users") return rowIndex === 0 ? "R. Daniels" : "A. Singh";
        if (tableName === "customers") return rowIndex === 0 ? "Harbour View Property Management" : "Pacific Medical Group";
        if (tableName === "buildings") return rowIndex === 0 ? "Harbour View Apartments" : "Pacific Medical Center";
        return `Mock Name ${rowIndex + 1}`;
      }

      if (colName === "email") {
        if (tableName === "companies") return "operations@eagleeyefire.ca";
        if (tableName === "users") return rowIndex === 0 ? "r.daniels@eagleeyefire.ca" : "a.singh@eagleeyefire.ca";
        if (tableName === "customers") return rowIndex === 0 ? "reports@ewandf.ca" : "s.jenkins@pacmedical.ca";
        return "info@example.com";
      }

      if (colName === "phone") {
        if (tableName === "companies") return "604-555-0199";
        if (tableName === "users") return "604-555-0102";
        if (tableName === "customers") return rowIndex === 0 ? "604-555-0144" : "604-555-0177";
        return "604-555-0000";
      }

      if (colName === "address" || colName === "billing_address") {
        if (tableName === "companies") return '"Suite 400, 1055 W Georgia St, Vancouver, BC"';
        if (tableName === "customers") return rowIndex === 0 ? '"1200 - 555 Hastings St, Vancouver, BC"' : '"450 - 1200 West Broadway, Vancouver, BC"';
        if (tableName === "buildings") return rowIndex === 0 ? '"1640 Harbour View Dr, Vancouver, BC"' : '"1200 West Broadway, Vancouver, BC"';
        return '"123 Main St, Vancouver, BC"';
      }

      if (colName === "device_code") return rowIndex === 0 ? "SD-M-10" : "SUPV-D-01";
      if (colName === "location") return rowIndex === 0 ? "Main Corridor East" : "Main Sprinkler Riser Room";
      if (colName === "map_x") return rowIndex === 0 ? "45.20" : "18.40";
      if (colName === "map_y") return rowIndex === 0 ? "38.60" : "76.10";
      if (colName === "status" || colName === "portal_status") {
        if (tableName === "devices") return rowIndex === 0 ? "failed" : "deficient";
        if (tableName === "deficiencies") return "open";
        return "active";
      }
      if (colName === "priority") return rowIndex === 0 ? "critical" : "warning";
      if (colName === "technical_description") return rowIndex === 0 ? "Smoke detector failed to activate control panel relays" : "Sprinkler supervisory pressure switch leaking";
      if (colName === "customer_description") return rowIndex === 0 ? "Smoke detector in main corridor failed testing and needs replacement" : "Supervisory switch is leaking slowly and needs adjustment";

      // Type-based defaults
      if (defLower.includes("varchar")) return `Sample_Varchar_${rowIndex + 1}`;
      if (defLower.includes("text")) return `"Sample long-form description text for row ${rowIndex + 1}"`;
      if (defLower.includes("int")) return String(rowIndex === 0 ? 4 : 6);
      if (defLower.includes("decimal") || defLower.includes("numeric")) return "125.00";
      if (defLower.includes("boolean")) return "true";
      if (defLower.includes("timestamp") || defLower.includes("date")) return "2026-06-05 09:00:00";

      return `value_${rowIndex + 1}`;
    };

    // Generate 2 mock rows for preview and CSV exports
    const numRows = tableName === "companies" ? 1 : 2;
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const rowValues = targetTable.fields.map(f => {
        const colName = f.split(" (")[0].trim();
        return getMockValue(colName, f, i);
      });
      rows.push(rowValues.join(","));
    }

    return `${header}\n${rows.join("\n")}`;
  };

  const handleDownloadCSV = (tableName: string) => {
    const text = getSeedCSVData(tableName);
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seed_${tableName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateSchemaText = (format: "prisma" | "knex" | "sql") => {
    // Dynamically generate schemas from live ERD tables and relations state
    if (format === "prisma") {
      let schema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
`;

      erdTables.forEach(t => {
        schema += `\nmodel ${t.name.charAt(0) + t.name.slice(1).toLowerCase()} {`;
        t.fields.forEach(f => {
          const parts = f.split(" (");
          const name = parts[0].trim();
          const rest = parts[1] ? parts[1].replace(")", "") : "";
          const typeLower = rest.toLowerCase();

          let prismaType = "String";
          let decorators = "";

          if (typeLower.includes("pk")) {
            decorators += " @id @default(uuid()) @db.Uuid";
          } else if (typeLower.includes("fk")) {
            prismaType = "String";
            decorators += " @db.Uuid";
          } else if (typeLower.includes("varchar")) {
            prismaType = "String";
            decorators += " @db.VarChar(255)";
          } else if (typeLower.includes("text")) {
            prismaType = "String";
            decorators += " @db.Text";
          } else if (typeLower.includes("int")) {
            prismaType = "Int";
          } else if (typeLower.includes("decimal") || typeLower.includes("numeric")) {
            prismaType = "Decimal";
            decorators += " @db.Decimal(12, 2)";
          } else if (typeLower.includes("boolean")) {
            prismaType = "Boolean";
            decorators += " @default(false)";
          } else if (typeLower.includes("timestamp") || typeLower.includes("date")) {
            prismaType = "DateTime";
            decorators += " @default(now())";
          }

          // Format camelCase for Prisma properties
          const camelName = name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          schema += `\n  ${camelName.padEnd(15)} ${prismaType}${decorators}`;
        });

        // Add relation fields
        const incoming = erdRelations.filter(r => r.to === t.id);
        incoming.forEach(r => {
          const fromModelName = r.from.charAt(0).toUpperCase() + r.from.slice(1).toLowerCase();
          const fromModelSingular = r.from.slice(0, -1);
          const camelFk = `${fromModelSingular}Id`.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          schema += `\n  ${fromModelSingular.padEnd(15)} ${fromModelName} @relation(fields: [${camelFk}], references: [id])`;
        });

        const outgoing = erdRelations.filter(r => r.from === t.id);
        outgoing.forEach(r => {
          const toModelName = r.to.charAt(0).toUpperCase() + r.to.slice(1).toLowerCase();
          schema += `\n  ${r.to.padEnd(15)} ${toModelName}[]`;
        });

        schema += `\n\n  @@map("${t.id}")\n}\n`;
      });

      return schema;
    }

    if (format === "knex") {
      let schema = `exports.up = function(knex) {
  return knex.schema`;

      erdTables.forEach(t => {
        schema += `\n    .createTable('${t.id}', table => {`;
        t.fields.forEach(f => {
          const parts = f.split(" (");
          const name = parts[0].trim();
          const rest = parts[1] ? parts[1].replace(")", "") : "";
          const typeLower = rest.toLowerCase();

          if (typeLower.includes("pk")) {
            schema += `\n      table.uuid('${name}').primary().defaultTo(knex.raw('gen_random_uuid()'));`;
          } else if (typeLower.includes("fk")) {
            // Find foreign table
            const refTable = erdRelations.find(r => r.to === t.id && name.startsWith(r.from.slice(0, -1)))?.from || "companies";
            schema += `\n      table.uuid('${name}').references('id').inTable('${refTable}').onDelete('CASCADE');`;
          } else if (typeLower.includes("varchar")) {
            schema += `\n      table.string('${name}', 255);`;
          } else if (typeLower.includes("text")) {
            schema += `\n      table.text('${name}');`;
          } else if (typeLower.includes("int")) {
            schema += `\n      table.integer('${name}');`;
          } else if (typeLower.includes("decimal") || typeLower.includes("numeric")) {
            schema += `\n      table.decimal('${name}', 12, 2);`;
          } else if (typeLower.includes("boolean")) {
            schema += `\n      table.boolean('${name}').defaultTo(false);`;
          } else if (typeLower.includes("timestamp") || typeLower.includes("date")) {
            schema += `\n      table.timestamp('${name}').defaultTo(knex.fn.now());`;
          }
        });
        schema += `\n    })`;
      });

      schema += `;\n};\n\nexports.down = function(knex) {\n  return knex.schema`;
      [...erdTables].reverse().forEach(t => {
        schema += `\n    .dropTableIfExists('${t.id}')`;
      });
      schema += `;\n};`;

      return schema;
    }

    // Default to SQL DDL
    let schema = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`;

    erdTables.forEach(t => {
      schema += `\n-- Table: ${t.name}\nCREATE TABLE ${t.id} (\n`;
      const fieldLines: string[] = [];

      t.fields.forEach(f => {
        const parts = f.split(" (");
        const name = parts[0].trim();
        const rest = parts[1] ? parts[1].replace(")", "") : "";
        const typeLower = rest.toLowerCase();

        let sqlLine = `    ${name.padEnd(20)}`;

        if (typeLower.includes("pk")) {
          sqlLine += " UUID PRIMARY KEY DEFAULT uuid_generate_v4()";
        } else if (typeLower.includes("fk")) {
          const refTable = erdRelations.find(r => r.to === t.id && name.startsWith(r.from.slice(0, -1)))?.from || "companies";
          sqlLine += ` UUID REFERENCES ${refTable}(id) ON DELETE CASCADE`;
        } else if (typeLower.includes("varchar")) {
          sqlLine += " VARCHAR(255)";
        } else if (typeLower.includes("text")) {
          sqlLine += " TEXT";
        } else if (typeLower.includes("int")) {
          sqlLine += " INTEGER";
        } else if (typeLower.includes("decimal") || typeLower.includes("numeric")) {
          sqlLine += " DECIMAL(12, 2)";
        } else if (typeLower.includes("boolean")) {
          sqlLine += " BOOLEAN DEFAULT FALSE";
        } else if (typeLower.includes("timestamp") || typeLower.includes("date")) {
          sqlLine += " TIMESTAMP DEFAULT CURRENT_TIMESTAMP";
        }

        fieldLines.push(sqlLine);
      });

      schema += fieldLines.join(",\n");
      schema += `\n);\n`;
    });

    return schema;
  };

  const handleCopySchema = () => {
    const text = generateSchemaText(exportFormat);
    navigator.clipboard.writeText(text);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDownloadSchema = () => {
    const text = generateSchemaText(exportFormat);
    const extensions = { prisma: "prisma", knex: "js", sql: "sql" };
    const filenames = {
      prisma: "schema.prisma",
      knex: "20260614_init_schema.js",
      sql: "schema.sql"
    };
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filenames[exportFormat];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            
            {/* Interactive ERD Canvas */}
            <div className="xl:col-span-3 space-y-4">
              <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
                <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-3.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-cyan-400 animate-pulse" />
                        Interactive ERD Diagram Editor
                      </CardTitle>
                      <CardDescription className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                        Drag tables around the canvas to design relational layouts. Select a table to add custom fields or create relationships.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleErdAutoLayout}
                        className="h-7 px-3 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase"
                      >
                        <Move className="w-3 h-3 mr-1.5" />
                        AUTO-ALIGN CANVAS
                      </Button>
                      <Button
                        onClick={handleExportErdLayout}
                        className="h-7 px-3 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase"
                      >
                        <Download className="w-3 h-3 mr-1.5" />
                        EXPORT LAYOUT JSON
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  
                  {/* ERD Canvas */}
                  <div 
                    onMouseMove={handleErdCanvasMouseMove}
                    onMouseUp={handleErdCanvasMouseUp}
                    className="relative w-full h-[450px] bg-slate-950 bg-[radial-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:16px_16px] border border-cyan-500/10 overflow-hidden cursor-crosshair select-none"
                  >
                    
                    {/* SVG Relationship Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                        </marker>
                      </defs>
                      {erdRelations.map((rel) => {
                        const fromTable = erdTables.find(t => t.id === rel.from);
                        const toTable = erdTables.find(t => t.id === rel.to);
                        if (!fromTable || !toTable) return null;

                        // Calculate centers of tables (width approx 160px, height approx variable)
                        const startX = fromTable.x + 80;
                        const startY = fromTable.y + 60;
                        const endX = toTable.x + 80;
                        const endY = toTable.y + 60;

                        return (
                          <g key={rel.id}>
                            <line 
                              x1={startX} 
                              y1={startY} 
                              x2={endX} 
                              y2={endY} 
                              stroke="#06b6d4" 
                              strokeWidth="1" 
                              strokeDasharray="4 4"
                              opacity="0.6"
                              markerEnd="url(#arrow)"
                            />
                            <rect 
                              x={(startX + endX) / 2 - 15} 
                              y={(startY + endY) / 2 - 8} 
                              width="30" 
                              height="16" 
                              fill="#020617" 
                              stroke="#06b6d4" 
                              strokeWidth="0.5"
                            />
                            <text 
                              x={(startX + endX) / 2} 
                              y={(startY + endY) / 2 + 4} 
                              fill="#22d3ee" 
                              fontSize="8" 
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              {rel.type}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Draggable Table Nodes */}
                    {erdTables.map((t) => (
                      <div
                        key={t.id}
                        style={{ left: t.x, top: t.y }}
                        onClick={() => setSelectedErdTable(t.id)}
                        className={`absolute w-[180px] bg-slate-900/90 border font-mono p-2.5 space-y-2 cursor-grab active:cursor-grabbing ${
                          selectedErdTable === t.id 
                            ? "border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]" 
                            : "border-cyan-500/20 hover:border-cyan-500/50"
                        }`}
                      >
                        {/* Table Header / Handle */}
                        <div 
                          onMouseDown={(e) => handleErdTableMouseDown(e, t.id)}
                          className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5"
                        >
                          <div className="flex items-center gap-1.5">
                            <Database className="w-3 h-3 text-cyan-400" />
                            <span className="text-[9px] font-bold text-cyan-400 uppercase">{t.name}</span>
                          </div>
                          <Move className="w-3 h-3 text-slate-500 hover:text-cyan-400 cursor-move" />
                        </div>

                        {/* Table Columns List */}
                        <div className="space-y-1 text-[8px] text-slate-300">
                          {t.fields.map((field, idx) => (
                            <div key={idx} className="flex justify-between items-center group bg-slate-950/40 p-1">
                              <span>{field.split(" ")[0]}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-500 text-[7px] uppercase">{field.substring(field.indexOf(" ") + 1)}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleRemoveErdField(t.id, idx); }}
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 ml-1"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ERD Control Panel */}
            <div className="xl:col-span-1 space-y-4">
              <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
                <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-3.5">
                  <CardTitle className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                    ERD Controls
                  </CardTitle>
                  <CardDescription className="text-[9px] text-slate-400 mt-1">
                    Manage fields and entity connections.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  
                  {/* Field Editor (Contextual) */}
                  <div className="space-y-2 border-b border-cyan-500/10 pb-4">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Add Field to Selected:</span>
                    {selectedErdTable ? (
                      <div className="space-y-2">
                        <div className="p-2 bg-cyan-950/10 border border-cyan-500/20 text-[8px] text-cyan-400 uppercase">
                          Selected Table: {erdTables.find(t => t.id === selectedErdTable)?.name}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="FIELD NAME"
                            value={newFieldName}
                            onChange={(e) => setNewErdFieldName(e.target.value)}
                            className="flex-1 h-7 bg-slate-900 border border-cyan-500/20 text-[9px] text-cyan-400 px-2 rounded-none outline-none focus:border-cyan-400 font-mono uppercase"
                          />
                          <select
                            value={newFieldType}
                            onChange={(e) => setNewErdFieldType(e.target.value)}
                            className="h-7 bg-slate-900 border border-cyan-500/20 text-[9px] text-cyan-400 px-1.5 rounded-none outline-none focus:border-cyan-400 font-mono"
                          >
                            {["VARCHAR", "UUID", "TEXT", "INT", "DECIMAL", "BOOLEAN", "TIMESTAMP"].map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <Button
                          onClick={handleAddErdField}
                          className="w-full h-7 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD COLUMN</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900/30 border border-slate-800 text-[8px] text-slate-500 uppercase italic">
                        Select a table node on the canvas to add columns.
                      </div>
                    )}
                  </div>

                  {/* Relationship Creator */}
                  <div className="space-y-2 border-b border-cyan-500/10 pb-4">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Create Relationship:</span>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        <select
                          value={newRelationFrom}
                          onChange={(e) => setNewRelationFrom(e.target.value)}
                          className="h-7 bg-slate-900 border border-cyan-500/20 text-[9px] text-cyan-400 px-1.5 rounded-none outline-none focus:border-cyan-400 font-mono"
                        >
                          <option value="">FROM TABLE</option>
                          {erdTables.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        <select
                          value={newRelationTo}
                          onChange={(e) => setNewRelationTo(e.target.value)}
                          className="h-7 bg-slate-900 border border-cyan-500/20 text-[9px] text-cyan-400 px-1.5 rounded-none outline-none focus:border-cyan-400 font-mono"
                        >
                          <option value="">TO TABLE</option>
                          {erdTables.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-1.5">
                        <select
                          value={newRelationType}
                          onChange={(e) => setNewRelationType(e.target.value)}
                          className="flex-1 h-7 bg-slate-900 border border-cyan-500/20 text-[9px] text-cyan-400 px-1.5 rounded-none outline-none focus:border-cyan-400 font-mono"
                        >
                          <option value="1:N">1:N (ONE TO MANY)</option>
                          <option value="N:1">N:1 (MANY TO ONE)</option>
                          <option value="1:1">1:1 (ONE TO ONE)</option>
                        </select>
                        <Button
                          onClick={handleAddErdRelation}
                          className="h-7 px-3 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase"
                        >
                          LINK
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Relationships List */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Active Connections:</span>
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                      {erdRelations.map((rel) => (
                        <div key={rel.id} className="p-2 bg-slate-900/40 border border-cyan-500/5 flex items-center justify-between text-[8px] text-slate-400">
                          <div className="flex items-center gap-1 font-mono">
                            <span className="text-cyan-400 uppercase font-bold">{rel.from}</span>
                            <span className="text-slate-600">({rel.type})</span>
                            <span className="text-cyan-400 uppercase font-bold">{rel.to}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveErdRelation(rel.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
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
          
          {/* Seeding & CSV Exporter Tool Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Terminal Log Console */}
            <div className="lg:col-span-2">
              <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono">
                <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-3.5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Database Seeder & CSV Exporter
                    </CardTitle>
                    <Button
                      onClick={runSeedingSimulation}
                      disabled={isSeeding}
                      className="h-7 px-3 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase disabled:opacity-50"
                    >
                      {isSeeding ? "SEEDING..." : "RUN DATABASE SEEDER"}
                    </Button>
                  </div>
                  <CardDescription className="text-[9px] text-slate-400 mt-1">
                    Simulate loading the 85-device sample dataset into local tables and export mock tables as production-ready CSV files.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* Console Terminal Screen */}
                  <div className="bg-black/90 border border-cyan-500/10 p-3 h-[180px] overflow-y-auto font-mono text-[8px] text-emerald-400 space-y-1.5 scrollbar-thin">
                    {seedingLogs.length === 0 ? (
                      <div className="text-slate-500 uppercase italic">
                        &gt;_ System Idle. Click "Run Database Seeder" to simulate Postgres table initialization.
                      </div>
                    ) : (
                      seedingLogs.map((log, i) => (
                        <div key={i} className="leading-relaxed">
                          <span className="text-cyan-500">&gt;&gt;</span> {log}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CSV Export & Seed Data Preview Panel */}
            <div className="lg:col-span-1">
              <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono h-full flex flex-col">
                <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-3.5">
                  <CardTitle className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    CSV Data Exporter
                  </CardTitle>
                  <CardDescription className="text-[9px] text-slate-400 mt-1">
                    Download realistic seeded relational datasets in raw CSV format.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col gap-3 min-h-0">
                  
                  {/* Table Select for CSV Preview */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] text-slate-500 uppercase font-bold block">Select Seed Dataset:</span>
                    <div className="grid grid-cols-2 gap-1">
                      {["companies", "users", "customers", "buildings", "devices", "deficiencies"].map((tbl) => (
                        <button
                          key={tbl}
                          onClick={() => setSeedPreviewTable(tbl)}
                          className={`py-1 text-[8px] font-bold uppercase border text-center ${
                            seedPreviewTable === tbl
                              ? "bg-cyan-950 border-cyan-500 text-cyan-400"
                              : "bg-transparent border-slate-800 text-slate-400 hover:text-slate-300"
                          }`}
                        >
                          {tbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CSV Content Preview */}
                  <div className="flex-1 bg-slate-900/40 border border-cyan-500/10 p-2.5 overflow-auto max-h-[110px] relative font-mono text-[7px] text-slate-300 whitespace-pre scrollbar-thin">
                    {getSeedCSVData(seedPreviewTable)}
                  </div>

                  <Button
                    onClick={() => handleDownloadCSV(seedPreviewTable)}
                    className="w-full h-8 bg-cyan-950 border border-cyan-500 text-cyan-400 rounded-none hover:bg-cyan-500/20 text-[9px] font-bold uppercase flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>DOWNLOAD SEED_{seedPreviewTable.toUpperCase()}.CSV</span>
                  </Button>

                </CardContent>
              </Card>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Table Mockups List */}
            <div className="lg:col-span-2 space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
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
            </div>

            {/* Interactive Schema Exporter Tool */}
            <div className="lg:col-span-1">
              <Card className="rounded-none bg-slate-950 border-cyan-500/20 font-mono h-full flex flex-col">
                <CardHeader className="border-b border-cyan-500/10 bg-slate-900/20 py-4">
                  <CardTitle className="text-sm font-bold text-cyan-400 uppercase flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    Schema Exporter Tool
                  </CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 mt-1">
                    Generate and download production-ready database schema scripts based on our architecture.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col gap-4 min-h-0">
                  
                  {/* Format Selector */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 border border-cyan-500/10">
                    {[
                      { id: "prisma", label: "Prisma" },
                      { id: "knex", label: "Knex.js" },
                      { id: "sql", label: "Postgres SQL" }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setExportFormat(fmt.id as any)}
                        className={`py-1.5 text-[9px] font-bold uppercase border ${
                          exportFormat === fmt.id
                            ? "bg-cyan-950 border-cyan-500 text-cyan-400"
                            : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Code Preview */}
                  <div className="flex-1 bg-slate-900/60 border border-cyan-500/10 p-3 overflow-auto max-h-[300px] min-h-[150px] relative font-mono text-[7px] text-slate-300 whitespace-pre scrollbar-thin">
                    <div className="absolute right-2 top-2 flex items-center gap-1.5 z-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopySchema}
                        className="h-6 rounded-none bg-slate-950/80 border border-cyan-500/20 text-[8px] text-cyan-400 hover:bg-cyan-500/10"
                      >
                        {copiedSchema ? "COPIED" : "COPY"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownloadSchema}
                        className="h-6 rounded-none bg-slate-950/80 border border-cyan-500/20 text-[8px] text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>DOWNLOAD</span>
                      </Button>
                    </div>
                    {generateSchemaText(exportFormat)}
                  </div>

                  {/* Schema Integration Info */}
                  <div className="p-3 bg-cyan-950/10 border border-cyan-500/10 flex gap-2 text-[9px] text-cyan-500/90 leading-relaxed uppercase">
                    <Info className="w-4 h-4 shrink-0 text-cyan-400" />
                    <div>
                      <span className="font-bold text-cyan-400 block mb-0.5">Integration Note:</span>
                      This schema defines all relational bounds, indexes, and primary/foreign keys to guarantee high-performance queries on production Postgres databases.
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

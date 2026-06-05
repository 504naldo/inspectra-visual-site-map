export type DeviceStatus = "not_tested" | "passed" | "deficiency" | "failed" | "testing" | "no_access" | "attention_required" | "repair_approved";

export type DeviceCategory = "Detection & Control" | "Notification" | "Suppression" | "Egress & Lighting" | "Access & Utilities";

export type DeviceType = 
  | "Fire Alarm Panel"
  | "Annunciator"
  | "Smoke Detector"
  | "Heat Detector"
  | "Pull Station"
  | "Horn/Strobe"
  | "Speaker/Strobe"
  | "Emergency Light"
  | "Exit Sign"
  | "Fire Extinguisher"
  | "Sprinkler Riser"
  | "Standpipe"
  | "FDC"
  | "Backflow Preventer"
  | "Smoke Control Panel"
  | "Roof Access"
  | "Electrical Shutoff"
  | "Gas Shutoff"
  | "Lockbox";

export interface ServiceHistory {
  date: string;
  action: string;
  technician: string;
  notes?: string;
}

export interface DeficiencyHistory {
  id: string;
  loggedAt: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  recommendedRepair: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface Device {
  id: string;
  label: string;
  type: DeviceType;
  category: DeviceCategory;
  floor: string;
  area: string;
  location: string;
  x: number; // percentage X on schematic
  y: number; // percentage Y on schematic
  status: DeviceStatus;
  lastTestedAt?: string;
  lastTestedBy?: string;
  customerNotes?: string;
  technicianNotes?: string;
  photoUrl?: string;
  qrCode?: string;
  serviceHistory?: ServiceHistory[];
  deficiencyHistory?: DeficiencyHistory[];
  deficiencyNote?: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  occupancyType: string;
  floorsCount: number;
  floors: string[];
  status: "In Progress" | "Critical Deficiencies" | "Compliant" | "Overdue";
  lastInspectionDate: string;
  nextInspectionDue: string;
  totalDevices: number;
  openDeficiencies: number;
  criticalDeficiencies: number;
  setupProgress: number; // 0-100
  fireAlarmType: string;
  lockboxLocation: string;
  fdcLocation: string;
  panelLocation: string;
  constructionType: string;
  occupancyTypeDetail: string;
  emergencyContacts: { name: string; role: string; phone: string; afterHours: boolean }[];
}

export interface Report {
  id: string;
  reportNumber: string;
  buildingId: string;
  buildingName: string;
  address: string;
  date: string;
  status: "Draft" | "Ready for Review" | "Sent" | "Approved";
  devicesTested: number;
  deficienciesFound: number;
  criticalDeficiencies: number;
  preparedBy: string;
  systemsInspected: string[];
}

export interface QuoteItem {
  id: string;
  deviceId: string;
  deviceLabel: string;
  description: string;
  labourCost: number;
  materialCost: number;
  qty: number;
  approved?: boolean;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  buildingId: string;
  buildingName: string;
  customerName: string;
  status: "Draft" | "Sent" | "Awaiting Approval" | "Approved" | "Declined";
  items: QuoteItem[];
  createdDate: string;
  expiryDate: string;
  notes?: string;
}

export interface MunicipalSharingSettings {
  fireSafetyPlan: boolean;
  fdcLocation: boolean;
  fireAlarmPanelLocation: boolean;
  annunciatorLocation: boolean;
  sprinklerRiserRoom: boolean;
  standpipeZones: boolean;
  firePumpLocation: boolean;
  lockboxLocation: boolean;
  roofAccessInfo: boolean;
  electricalShutoff: boolean;
  gasShutoff: boolean;
  emergencyContacts: boolean;
  criticalDeficiencies: boolean;
  lastInspectionDate: boolean;
  complianceSummary: boolean;
  quotePricing: boolean;
  internalNotes: boolean;
  customerBillingDetails: boolean;
  privatePhotos: boolean;
  draftReports: boolean;
  labourEstimates: boolean;
  materialEstimates: boolean;
  internalComments: boolean;
}

// 1. Portfolio Buildings
export const MOCK_BUILDINGS: Building[] = [
  {
    id: "BLD-HVA",
    name: "Harbour View Apartments",
    address: "123 Harbour View Drive, Vancouver, BC",
    occupancyType: "Multi-family residential",
    floorsCount: 5,
    floors: ["Parkade P1", "Main Floor", "Level 2", "Level 3", "Roof"],
    status: "In Progress",
    lastInspectionDate: "June 4, 2026",
    nextInspectionDue: "June 4, 2027",
    totalDevices: 85,
    openDeficiencies: 5,
    criticalDeficiencies: 1,
    setupProgress: 90,
    fireAlarmType: "Mircom FX-2000 Addressable",
    lockboxLocation: "Front Entrance Vestibule, Right Side Wall",
    fdcLocation: "North-West Corner, Street Level near Hydrant",
    panelLocation: "Main Lobby behind Reception Counter",
    constructionType: "Type I-A Fire-Resistive Concrete",
    occupancyTypeDetail: "Group R-2 Residential Apartment Block",
    emergencyContacts: [
      { name: "Sarah Jenkins", role: "Property Manager", phone: "604-555-0192", afterHours: false },
      { name: "Marcus Vance", role: "Chief Building Engineer", phone: "604-555-0144", afterHours: true },
      { name: "Metro Fire Dispatch", role: "Emergency Services", phone: "911", afterHours: true }
    ]
  },
  {
    id: "BLD-PMC",
    name: "Pacific Medical Centre",
    address: "810 West Broadway, Vancouver, BC",
    occupancyType: "Medical office building",
    floorsCount: 8,
    floors: ["P1 Parkade", "Lobby Level", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Roof"],
    status: "Critical Deficiencies",
    lastInspectionDate: "April 12, 2026",
    nextInspectionDue: "April 12, 2027",
    totalDevices: 142,
    openDeficiencies: 12,
    criticalDeficiencies: 3,
    setupProgress: 65,
    fireAlarmType: "Edwards EST3 Multiplex Network",
    lockboxLocation: "Exterior Wall next to Main Double Doors",
    fdcLocation: "East side facade on Broadway street level",
    panelLocation: "Dedicated Fire Command Room off Lobby",
    constructionType: "Type I-B Protected Steel & Concrete",
    occupancyTypeDetail: "Group B Business / Medical Clinic Outpatient",
    emergencyContacts: [
      { name: "Dr. Arthur Pendelton", role: "Clinic Director", phone: "604-555-0822", afterHours: false },
      { name: "Security Operations Desk", role: "24/7 Security", phone: "604-555-0900", afterHours: true }
    ]
  },
  {
    id: "BLD-RCA",
    name: "Richmond Civic Annex",
    address: "6500 Minoru Boulevard, Richmond, BC",
    occupancyType: "Government office",
    floorsCount: 3,
    floors: ["Ground Floor", "Level 2", "Level 3"],
    status: "Compliant",
    lastInspectionDate: "January 15, 2026",
    nextInspectionDue: "January 15, 2027",
    totalDevices: 64,
    openDeficiencies: 0,
    criticalDeficiencies: 0,
    setupProgress: 100,
    fireAlarmType: "Simplex 4100ES Voice Annunciation",
    lockboxLocation: "Directly under Keypad at Staff Entrance",
    fdcLocation: "West side near Minoru Boulevard access lane",
    panelLocation: "Electrical Vault Room, Ground Floor Room 104",
    constructionType: "Type II-A Protected Non-Combustible",
    occupancyTypeDetail: "Group B Municipal Government Office",
    emergencyContacts: [
      { name: "Richmond Facilities Dept", role: "Municipal Operations", phone: "604-276-4000", afterHours: false },
      { name: "Duty Custodian", role: "After Hours Emergency", phone: "604-276-4321", afterHours: true }
    ]
  },
  {
    id: "BLD-GRP",
    name: "Granville Retail Plaza",
    address: "1100 Granville Street, Vancouver, BC",
    occupancyType: "Mixed-use retail",
    floorsCount: 2,
    floors: ["Main Retail", "Upper Storage & Mezzanine"],
    status: "Overdue",
    lastInspectionDate: "May 20, 2025",
    nextInspectionDue: "May 20, 2026",
    totalDevices: 38,
    openDeficiencies: 4,
    criticalDeficiencies: 0,
    setupProgress: 25,
    fireAlarmType: "Notifier NFS-320 Conventional Panel",
    lockboxLocation: "Front entrance pillar, left of sliding doors",
    fdcLocation: "Rear alleyway access near loading dock B",
    panelLocation: "Service Corridor 101, Retail Alleyway",
    constructionType: "Type III-B Unprotected Wood/Brick Joist",
    occupancyTypeDetail: "Group M Retail Shopping Center",
    emergencyContacts: [
      { name: "Plaza Management Corp", role: "Asset Manager", phone: "604-555-1100", afterHours: false },
      { name: "Night Watch Patrol", role: "Plaza Patrol Dispatch", phone: "604-555-1199", afterHours: true }
    ]
  }
];

// Helper to generate the exact 85 devices for Harbour View Apartments
const generateHarbourViewDevices = (): Device[] => {
  const list: Device[] = [];

  // Critical Emergency Response Assets (always purple/blue or highlighted)
  list.push({
    id: "FACP-01",
    label: "FACP-01",
    type: "Fire Alarm Panel",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Lobby",
    location: "Behind reception counter",
    x: 91,
    y: 45,
    status: "passed",
    lastTestedAt: "2026-06-04T09:15:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    qrCode: "QR-FACP-HVA01",
    serviceHistory: [
      { date: "2026-06-04", action: "Annual Operational Battery & Signal Test", technician: "R. Daniels" },
      { date: "2025-06-05", action: "Replaced backup batteries", technician: "M. Vance" }
    ]
  });

  list.push({
    id: "ANN-01",
    label: "ANN-01",
    type: "Annunciator",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Main Vestibule",
    location: "Inside main glass entry doors",
    x: 43,
    y: 67,
    status: "passed",
    lastTestedAt: "2026-06-04T09:20:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    qrCode: "QR-ANN-HVA01"
  });

  list.push({
    id: "FDC-001",
    label: "FDC-001",
    type: "FDC",
    category: "Access & Utilities",
    floor: "Main Floor",
    area: "Exterior Facade",
    location: "North-West exterior wall near hydrant",
    x: 65,
    y: 67,
    status: "deficiency", // Pre-loaded deficiency #4
    lastTestedAt: "2026-06-04T09:40:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    deficiencyNote: "FDC signage faded and unreadable from street.",
    qrCode: "QR-FDC-HVA01",
    customerNotes: "The fire department connection signage has weathered and is no longer clearly visible from the main roadway. Replacement is required to comply with Vancouver Fire Bylaw section 4.1.",
    technicianNotes: "FDC threads are in good condition and swivel moves freely. Outer sign is heavily oxidized and needs a standard 10x12 reflective aluminum replacement."
  });

  list.push({
    id: "RISER-01",
    label: "RISER-01",
    type: "Sprinkler Riser",
    category: "Suppression",
    floor: "Parkade P1",
    area: "Sprinkler Room",
    location: "Main wet pipe riser valve assembly",
    x: 15,
    y: 80,
    status: "passed",
    lastTestedAt: "2026-06-04T10:10:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    qrCode: "QR-RSR-HVA01"
  });

  list.push({
    id: "LBOX-001",
    label: "LBOX-001",
    type: "Lockbox",
    category: "Access & Utilities",
    floor: "Main Floor",
    area: "Main Entrance",
    location: "Exterior wall right of intercom panel",
    x: 12,
    y: 81,
    status: "passed",
    lastTestedAt: "2026-06-04T09:05:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    qrCode: "QR-LBOX-HVA01"
  });

  // Pre-loaded Deficiencies
  // 1. SD-M-10 (Smoke Detector - Main Floor) -> Pending/Not Tested to start so user can click it in the demo
  list.push({
    id: "SD-M-10",
    label: "SD-M-10",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Main Corridor",
    location: "Ceiling outside Suite 104",
    x: 60,
    y: 32,
    status: "not_tested", // User will trigger this during walkthrough
    qrCode: "QR-SD-M10",
    customerNotes: "Smoke detector in the main corridor did not respond properly during testing. Replacement is recommended to restore detection coverage in this area.",
    technicianNotes: "Detector did not activate during smoke entry test. Confirmed circuit response from adjacent device."
  });

  // 2. EL-P1-04 (Emergency Light - Parkade P1) -> Pre-failed
  list.push({
    id: "EL-P1-04",
    label: "EL-P1-04",
    type: "Emergency Light",
    category: "Egress & Lighting",
    floor: "Parkade P1",
    area: "Parking Zone B",
    location: "Pillar P-08, facing east exit lane",
    x: 50,
    y: 30,
    status: "failed",
    lastTestedAt: "2026-06-04T11:15:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    deficiencyNote: "Failed 30-minute load battery test.",
    qrCode: "QR-EL-P104",
    customerNotes: "The emergency lighting battery unit failed to hold its required charge during the standard 30-minute load simulation. Battery or full unit replacement is required to maintain egress illumination.",
    technicianNotes: "Battery terminals are oxidized, and cell voltage dropped to 4.2V within 5 minutes of load drop. Replace with standard 12V 9Ah SLA battery."
  });

  // 3. PS-W-02 (Pull Station - West Stair) -> Pre-deficiency
  list.push({
    id: "PS-W-02",
    label: "PS-W-02",
    type: "Pull Station",
    category: "Detection & Control",
    floor: "Level 2",
    area: "West Stairwell",
    location: "Next to stairwell exit door",
    x: 10,
    y: 51,
    status: "deficiency",
    lastTestedAt: "2026-06-04T12:30:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    deficiencyNote: "Cracked glass cover.",
    qrCode: "QR-PS-W02",
    customerNotes: "The pull station protective plastic glass cover is cracked. While the station remains operational, the cover must be replaced to prevent accidental activation or vandalism.",
    technicianNotes: "Station housing is solid and switch contacts are fully clean. Just needs a standard Mircom replacement shear-glass cover."
  });

  // 5. SUPV-D-01 (Sprinkler Supervisory Switch - Dry System Valve Room) -> Starts "not_tested" for Walkthrough Step 16
  list.push({
    id: "SUPV-D-01",
    label: "SUPV-D-01",
    type: "Sprinkler Riser", // Matches riser type
    category: "Suppression",
    floor: "Parkade P1",
    area: "Dry System Valve Room",
    location: "Main OS&Y control valve supervisor switch",
    x: 60,
    y: 70,
    status: "not_tested", // User will trigger this during walkthrough
    qrCode: "QR-SUPV-D01",
    customerNotes: "A sprinkler valve supervisory signal is not reporting properly to the fire alarm panel. This may prevent building staff or monitoring from being notified of an abnormal valve condition. Immediate repair is recommended.",
    technicianNotes: "Confirmed device mechanical operation at valve, but supervisory signal is not received at main FACP. Requires dedicated circuit troubleshooting."
  });

  // No Access Items
  list.push({
    id: "RM-R-01",
    label: "RM-R-01",
    type: "Roof Access",
    category: "Access & Utilities",
    floor: "Roof",
    area: "Mechanical Penthouse",
    location: "Elevator machine room double doors",
    x: 40,
    y: 20,
    status: "no_access",
    deficiencyNote: "No access - Room locked, building manager did not have keys on site.",
    qrCode: "QR-RM-R01"
  });

  list.push({
    id: "STOR-P1-02",
    label: "STOR-P1-02",
    type: "Lockbox",
    category: "Access & Utilities",
    floor: "Parkade P1",
    area: "Storage Room B",
    location: "Janitorial storage vault",
    x: 80,
    y: 80,
    status: "no_access",
    deficiencyNote: "No access - Room locked, tenant was away.",
    qrCode: "QR-STOR-P102"
  });

  // Attention Required Items
  list.push({
    id: "BAT-FACP-01",
    label: "BAT-FACP-01",
    type: "Fire Alarm Panel",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Lobby FACP",
    location: "Internal battery compartment",
    x: 91,
    y: 49,
    status: "attention_required",
    lastTestedAt: "2026-06-04T09:16:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    deficiencyNote: "FACP batteries approaching replacement window (manufactured 2022).",
    qrCode: "QR-BAT-FACP"
  });

  list.push({
    id: "EXIT-L2-06",
    label: "EXIT-L2-06",
    type: "Exit Sign",
    category: "Egress & Lighting",
    floor: "Level 2",
    area: "North Wing Corridor",
    location: "Above suite 208 ceiling mount",
    x: 70,
    y: 12,
    status: "attention_required",
    lastTestedAt: "2026-06-04T13:10:00Z",
    lastTestedBy: "R. Daniels (Tech #401)",
    deficiencyNote: "Exit sign dim but operational. Recommended bulb swap.",
    qrCode: "QR-EXIT-L206"
  });

  // Fill up the rest of the 85 devices with generic "passed" items to match totals
  // Passed totals = 76. We currently have ~10 items above. Let's populate remaining 75 devices dynamically.
  const floors = ["Parkade P1", "Main Floor", "Level 2", "Level 3", "Roof"];
  const types: DeviceType[] = ["Smoke Detector", "Heat Detector", "Pull Station", "Horn/Strobe", "Emergency Light", "Exit Sign", "Fire Extinguisher"];
  
  let idCounter = 1;
  while (list.length < 85) {
    const floor = floors[Math.floor(Math.random() * floors.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Category mapping
    let category: DeviceCategory = "Detection & Control";
    if (type === "Horn/Strobe") category = "Notification";
    else if (type === "Emergency Light" || type === "Exit Sign") category = "Egress & Lighting";
    else if (type === "Fire Extinguisher") category = "Suppression";

    const id = `${type.split(" ").map(w => w[0]).join("")}-${floor[0]}${floor.includes("P1") ? "P1" : floor.includes("Main") ? "M" : floor.slice(-1)}-${String(idCounter).padStart(2, "0")}`;
    
    // Prevent duplicate keys
    if (list.some(d => d.id === id)) {
      idCounter++;
      continue;
    }

    list.push({
      id,
      label: id,
      type,
      category,
      floor,
      area: "General Area",
      location: `Ceiling area ${idCounter}`,
      x: 15 + Math.floor(Math.random() * 70),
      y: 15 + Math.floor(Math.random() * 70),
      status: "passed",
      lastTestedAt: "2026-06-04T14:00:00Z",
      lastTestedBy: "R. Daniels (Tech #401)",
      qrCode: `QR-${id}`
    });

    idCounter++;
  }

  return list;
};

export const MOCK_DEVICES: Device[] = generateHarbourViewDevices();

// 2. Compliance Reports Portfolio
export const MOCK_REPORTS: Report[] = [
  {
    id: "RPT-001",
    reportNumber: "RPT-2026-0614-HVA",
    buildingId: "BLD-HVA",
    buildingName: "Harbour View Apartments",
    address: "123 Harbour View Drive, Vancouver, BC",
    date: "June 4, 2026",
    status: "Ready for Review",
    devicesTested: 85,
    deficienciesFound: 5,
    criticalDeficiencies: 1,
    preparedBy: "R. Daniels (Tech #401)",
    systemsInspected: ["Fire Alarm", "Emergency Lighting", "Fire Extinguishers", "Sprinkler Monitoring"]
  },
  {
    id: "RPT-002",
    reportNumber: "RPT-2026-0412-PMC",
    buildingId: "BLD-PMC",
    buildingName: "Pacific Medical Centre",
    address: "810 West Broadway, Vancouver, BC",
    date: "April 12, 2026",
    status: "Sent",
    devicesTested: 142,
    deficienciesFound: 12,
    criticalDeficiencies: 3,
    preparedBy: "R. Daniels (Tech #401)",
    systemsInspected: ["Fire Alarm Panel", "Sprinkler System", "Emergency Power Systems", "Fire Pumps"]
  },
  {
    id: "RPT-003",
    reportNumber: "RPT-2026-0115-RCA",
    buildingId: "BLD-RCA",
    buildingName: "Richmond Civic Annex",
    address: "6500 Minoru Boulevard, Richmond, BC",
    date: "January 15, 2026",
    status: "Approved",
    devicesTested: 64,
    deficienciesFound: 0,
    criticalDeficiencies: 0,
    preparedBy: "J. Vance (Tech #302)",
    systemsInspected: ["Annual Fire Alarm", "Emergency Egress Lighting"]
  }
];

// 3. Repair Estimates Portfolio
export const MOCK_QUOTES: Quote[] = [
  {
    id: "Q-2026-1047",
    quoteNumber: "Q-2026-1047",
    buildingId: "BLD-HVA",
    buildingName: "Harbour View Apartments",
    customerName: "Harbour View Property Management",
    status: "Awaiting Approval",
    createdDate: "June 4, 2026",
    expiryDate: "July 4, 2026",
    notes: "Deficiency repairs resulting from annual inspection completed on June 4, 2026. All repairs are quoted with certified NFPA parts.",
    items: [
      {
        id: "QI-001",
        deviceId: "SD-M-10",
        deviceLabel: "SD-M-10",
        description: "Replace smoke detector SD-M-10 and retest.",
        labourCost: 120,
        materialCost: 185,
        qty: 1
      },
      {
        id: "QI-002",
        deviceId: "EL-P1-04",
        description: "Replace emergency light battery or fixture EL-P1-04.",
        deviceLabel: "EL-P1-04",
        labourCost: 90,
        materialCost: 45,
        qty: 1
      },
      {
        id: "QI-003",
        deviceId: "PS-W-02",
        description: "Replace cracked pull station cover PS-W-02.",
        deviceLabel: "PS-W-02",
        labourCost: 45,
        materialCost: 20,
        qty: 1
      },
      {
        id: "QI-004",
        deviceId: "FDC-001",
        description: "Replace faded FDC signage.",
        deviceLabel: "FDC-001",
        labourCost: 60,
        materialCost: 50,
        qty: 1
      },
      {
        id: "QI-005",
        deviceId: "SUPV-D-01",
        description: "Troubleshoot sprinkler supervisory switch SUPV-D-01.",
        deviceLabel: "SUPV-D-01",
        labourCost: 180,
        materialCost: 0,
        qty: 1
      }
    ]
  }
];

// 4. Default Municipal Sharing Rules
export const DEFAULT_MUNICIPAL_SHARING: MunicipalSharingSettings = {
  fireSafetyPlan: true,
  fdcLocation: true,
  fireAlarmPanelLocation: true,
  annunciatorLocation: true,
  sprinklerRiserRoom: true,
  standpipeZones: true,
  firePumpLocation: true,
  lockboxLocation: true,
  roofAccessInfo: true,
  electricalShutoff: true,
  gasShutoff: true,
  emergencyContacts: true,
  criticalDeficiencies: true,
  lastInspectionDate: true,
  complianceSummary: true,
  quotePricing: false,
  internalNotes: false,
  customerBillingDetails: false,
  privatePhotos: false,
  draftReports: false,
  labourEstimates: false,
  materialEstimates: false,
  internalComments: false
};

// 5. Constant Floors List
export const FLOORS = ["Parkade P1", "Main Floor", "Level 2", "Level 3", "Roof"];

// 6. Setup Wizard Checklist Steps
export interface SetupStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed" | "current";
}

export const MOCK_SETUP_STEPS: SetupStep[] = [
  { id: 1, title: "Company Profile", description: "Define fire company licensing and certified technician credentials.", status: "completed" },
  { id: 2, title: "Add Customer", description: "Establish property management contact portals and billing accounts.", status: "completed" },
  { id: 3, title: "Add Building", description: "Register building address, occupancy types, and structural classifications.", status: "completed" },
  { id: 4, title: "Upload Floor Plan", description: "Upload vector architectural drawings or high-resolution PDF blueprints.", status: "completed" },
  { id: 5, title: "Add Floors & Zones", description: "Divide structure into floor plans, elevators, and hazard rooms.", status: "completed" },
  { id: 6, title: "Place Devices on Map", description: "Map detectors, pulls, emergency lights, and horns directly on the canvas.", status: "current" },
  { id: 7, title: "Add Emergency-Response Assets", description: "Flag FDC, FACP, Lockbox, and main utilities for Fire Dept access.", status: "pending" },
  { id: 8, title: "Create QR/NFC Labels", description: "Generate digital hardware ID tags for rapid physical field scans.", status: "pending" },
  { id: 9, title: "Assign Certified Technician", description: "Assign scheduled annual work orders to licensed field staff.", status: "pending" },
  { id: 10, title: "Start First Inspection", description: "Initialize active field testing, and sync real-time visual results.", status: "pending" }
];

// Single export of SAMPLE_BUILDING for backwards compatibility
export const SAMPLE_BUILDING = MOCK_BUILDINGS[0];

// ==========================================
// EXPANDED SAAS PLATFORM MODELS & DATA
// ==========================================

export interface CompanyProfile {
  name: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  serviceAreas: string[];
  businessNumber: string;
  defaultReportFooter: string;
  defaultQuoteTerms: string;
  defaultHourlyRate: number;
  reportBranding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    showLogo: boolean;
  };
}

export interface UserRole {
  name: string;
  permissions: string[];
}

export interface SaaSUser {
  id: string;
  name: string;
  role: string;
  certifications?: string[];
  status: "Active" | "External User" | "Disabled";
  email: string;
  phone?: string;
  company?: string;
}

export interface Customer {
  id: string;
  name: string;
  type: string;
  billingContact: string;
  siteContact: string;
  emergencyContact: string;
  email: string;
  phone: string;
  address: string;
  linkedBuildings: string[];
  portalAccessStatus: "Enabled" | "Disabled" | "Pending Invite";
  notes?: string[];
}

export interface TechnicianMetric {
  id: string;
  name: string;
  role: string;
  certifications: string[];
  assignedInspections: number;
  completedThisMonth: number;
  deficienciesCreated: number;
  reportsPendingReview: number;
  productivityScore: number; // 0-100
  status: "Active" | "On Leave" | "Offline";
}

export interface InspectionTemplate {
  id: string;
  name: string;
  systemsIncluded: string[];
  requiredCategories: string[];
  checklistItems: { id: string; text: string; required: boolean; photoRequired: boolean }[];
  requiredPhotos: string[];
  defaultReportType: string;
  lastUpdated: string;
}

export interface DeviceLibraryItem {
  id: string;
  type: string;
  category: DeviceCategory;
  icon: string;
  defaultChecklist: string[];
  commonDeficiencies: { issue: string; technical: string; customer: string; repair: string; priority: "low" | "medium" | "high" | "critical" }[];
  governmentShareable: boolean;
}

export interface DeficiencyLanguageItem {
  id: string;
  category: string;
  technical: string;
  customer: string;
  repair: string;
  priority: "low" | "medium" | "high" | "critical";
}

// MOCK DATA CONSTANTS

export const MOCK_COMPANY_PROFILE: CompanyProfile = {
  name: "Eagle Eye Fire & Life Safety",
  address: "400 - 1188 West Georgia St, Vancouver, BC V6E 4A2",
  phone: "604-555-0198",
  email: "service@eagleeyefire.ca",
  website: "www.eagleeyefire.ca",
  serviceAreas: ["Metro Vancouver", "Richmond", "Burnaby", "Surrey", "Delta", "North Vancouver"],
  businessNumber: "BC-8849102-LLC",
  defaultReportFooter: "Eagle Eye Fire & Life Safety is a licensed ASTTBC fire protection provider. All inspections conform to NFPA standards and local fire bylaws.",
  defaultQuoteTerms: "Net 30 days. Quote valid for 60 days. All materials are certified fire protection hardware. Retesting of replaced items included in price.",
  defaultHourlyRate: 110,
  reportBranding: {
    primaryColor: "#06b6d4", // Cyan
    secondaryColor: "#0f172a", // Slate 900
    fontFamily: "JetBrains Mono",
    showLogo: true
  }
};

export const MOCK_SAAS_USERS: SaaSUser[] = [
  {
    id: "U-001",
    name: "R. Daniels",
    role: "Company Owner",
    certifications: ["Fire Alarm (ASTTBC)", "Sprinkler ITM", "Emergency Lighting", "Extinguishers", "Backflow Testing"],
    status: "Active",
    email: "r.daniels@eagleeyefire.ca",
    phone: "604-555-0190"
  },
  {
    id: "U-002",
    name: "A. Singh",
    role: "Technician",
    certifications: ["Fire Alarm (ASTTBC)", "Emergency Lighting"],
    status: "Active",
    email: "a.singh@eagleeyefire.ca",
    phone: "604-555-0191"
  },
  {
    id: "U-003",
    name: "M. Chen",
    role: "Admin",
    certifications: [],
    status: "Active",
    email: "m.chen@eagleeyefire.ca",
    phone: "604-555-0192"
  },
  {
    id: "U-004",
    name: "S. Patel",
    role: "Technician",
    certifications: ["Sprinkler ITM", "Extinguishers"],
    status: "Active",
    email: "s.patel@eagleeyefire.ca",
    phone: "604-555-0193"
  },
  {
    id: "U-005",
    name: "J. Morgan",
    role: "Property Manager",
    company: "Harbour View Property Management",
    status: "External User",
    email: "j.morgan@harbourviewpm.com",
    phone: "604-555-0199"
  },
  {
    id: "U-006",
    name: "Vancouver Fire Prevention",
    role: "Government / Fire Department",
    company: "City of Vancouver Fire Rescue",
    status: "External User",
    email: "inspections@vancouver.ca"
  }
];

export const MOCK_ROLES_PERMISSIONS = [
  { name: "Company Owner", permissions: ["Full access to billing, users, templates, maps, and all company operations."] },
  { name: "Admin", permissions: ["Manage customers, buildings, reports, quotes, scheduling, and standard templates."] },
  { name: "Technician", permissions: ["Access assigned inspections, site maps, device testing, log deficiencies, upload photos and field notes."] },
  { name: "Report Reviewer", permissions: ["Review technician logs, edit final compliance reports, approve quotes, and export official reports."] },
  { name: "Property Manager", permissions: ["Access linked buildings, view compliance status, review customer-facing notes, approve repair quotes."] },
  { name: "Government / Fire Department", permissions: ["Access shared emergency profiles, lockbox locations, FDC maps, and critical deficiency summaries only."] },
  { name: "Read-Only Viewer", permissions: ["View dashboards and site maps without editing permissions."] }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "C-001",
    name: "Harbour View Property Management",
    type: "Property Management",
    billingContact: "Accounts Payable - HVPM",
    siteContact: "J. Morgan",
    emergencyContact: "HVPM 24/7 Dispatch",
    email: "j.morgan@harbourviewpm.com",
    phone: "604-555-0199",
    address: "1200 - 555 West Hastings St, Vancouver, BC",
    linkedBuildings: ["Harbour View Apartments", "Harbour View Estates"],
    portalAccessStatus: "Enabled",
    notes: ["Prefers morning inspections.", "Requires 48-hour tenant notice for entry."]
  },
  {
    id: "C-002",
    name: "Pacific Medical Group",
    type: "Healthcare",
    billingContact: "Finance - PMG",
    siteContact: "Dr. Lena Brooks",
    emergencyContact: "Hospital Facilities Lead",
    email: "l.brooks@pacificmedical.ca",
    phone: "604-555-0211",
    address: "750 West Broadway, Vancouver, BC",
    linkedBuildings: ["Pacific Medical Center"],
    portalAccessStatus: "Enabled",
    notes: ["Requires infection control protocols during testing.", "Sensitive clinical areas must be scheduled after 5 PM."]
  },
  {
    id: "C-003",
    name: "City of Richmond Facilities",
    type: "Government",
    billingContact: "City of Richmond Finance",
    siteContact: "Facilities Department",
    emergencyContact: "Richmond Security Dispatch",
    email: "facilities@richmond.ca",
    phone: "604-555-0399",
    address: "6911 No. 3 Road, Richmond, BC",
    linkedBuildings: ["Richmond Civic Center", "Richmond Fire Hall No. 1", "Richmond Library"],
    portalAccessStatus: "Pending Invite",
    notes: ["Requires ASTTBC certified technicians only.", "Official report must be submitted directly to municipal database."]
  },
  {
    id: "C-004",
    name: "Granville Retail Holdings",
    type: "Commercial Retail",
    billingContact: "Granville Accounts",
    siteContact: "K. Alvarez",
    emergencyContact: "Granville Security Control",
    email: "k.alvarez@granvilleretail.com",
    phone: "604-555-0911",
    address: "1055 Dunsmuir St, Vancouver, BC",
    linkedBuildings: ["Granville Business Center"],
    portalAccessStatus: "Disabled",
    notes: ["High-traffic commercial area.", "Requires testing to be done in phases to avoid retail disruption."]
  }
];

export const MOCK_TECHNICIANS: TechnicianMetric[] = [
  {
    id: "T-001",
    name: "R. Daniels",
    role: "Lead Technician / Owner",
    certifications: ["Fire Alarm", "Sprinkler", "Emergency Lighting", "Extinguishers", "Backflow"],
    assignedInspections: 4,
    completedThisMonth: 18,
    deficienciesCreated: 27,
    reportsPendingReview: 3,
    productivityScore: 96,
    status: "Active"
  },
  {
    id: "T-002",
    name: "A. Singh",
    role: "Technician",
    certifications: ["Fire Alarm", "Emergency Lighting"],
    assignedInspections: 6,
    completedThisMonth: 22,
    deficienciesCreated: 19,
    reportsPendingReview: 2,
    productivityScore: 92,
    status: "Active"
  },
  {
    id: "T-003",
    name: "S. Patel",
    role: "Technician",
    certifications: ["Sprinkler", "Extinguishers"],
    assignedInspections: 3,
    completedThisMonth: 14,
    deficienciesCreated: 11,
    reportsPendingReview: 1,
    productivityScore: 88,
    status: "Active"
  }
];

export const MOCK_INSPECTION_TEMPLATES: InspectionTemplate[] = [
  {
    id: "TMP-001",
    name: "Annual Fire Alarm Inspection",
    systemsIncluded: ["Control Panel", "Detection Circuits", "Notification Appliances", "Monitoring Signals"],
    requiredCategories: ["Detection & Control", "Notification"],
    checklistItems: [
      { id: "FA-01", text: "Verify fire alarm control panel normal condition", required: true, photoRequired: false },
      { id: "FA-02", text: "Test initiating devices (Smokes, Heats, Pulls)", required: true, photoRequired: true },
      { id: "FA-03", text: "Test notification appliances (Horns, Strobes)", required: true, photoRequired: false },
      { id: "FA-04", text: "Verify annunciator operation & key controls", required: true, photoRequired: false },
      { id: "FA-05", text: "Confirm supervisory devices & valve tampers", required: true, photoRequired: false },
      { id: "FA-06", text: "Confirm trouble signals & panel backup batteries", required: true, photoRequired: true },
      { id: "FA-07", text: "Confirm central station monitoring signals", required: true, photoRequired: false }
    ],
    requiredPhotos: ["FACP Normal Status", "Batteries Date Code", "Initiating Device Failure (if any)"],
    defaultReportType: "ASTTBC Standard Fire Alarm Report",
    lastUpdated: "2026-01-15"
  },
  {
    id: "TMP-002",
    name: "Emergency Lighting ITM",
    systemsIncluded: ["Battery Packs", "Remote Heads", "Exit Signs", "Evacuation Routes"],
    requiredCategories: ["Egress & Lighting"],
    checklistItems: [
      { id: "EL-01", text: "Verify physical integrity of battery units", required: true, photoRequired: false },
      { id: "EL-02", text: "Perform 30-minute operational duration test", required: true, photoRequired: false },
      { id: "EL-03", text: "Test manual push-to-test buttons", required: true, photoRequired: false },
      { id: "EL-04", text: "Check remote lighting heads alignment", required: true, photoRequired: false },
      { id: "EL-05", text: "Verify exit sign illumination & backup power", required: true, photoRequired: true }
    ],
    requiredPhotos: ["Tested Exit Sign", "Battery Pack Interior"],
    defaultReportType: "Monthly/Annual Emergency Lighting Log",
    lastUpdated: "2026-02-10"
  },
  {
    id: "TMP-003",
    name: "Sprinkler & Standpipe Review",
    systemsIncluded: ["Wet Riser", "Dry Riser", "Control Valves", "Pressure Switches", "FDC Connection"],
    requiredCategories: ["Suppression", "Access & Utilities"],
    checklistItems: [
      { id: "SP-01", text: "Inspect dry valve and air pressure levels", required: true, photoRequired: true },
      { id: "SP-02", text: "Verify water flow pressure switch alarms", required: true, photoRequired: false },
      { id: "SP-03", text: "Test main drain pressure drops", required: true, photoRequired: false },
      { id: "SP-04", text: "Inspect FDC physical threads and caps", required: true, photoRequired: true },
      { id: "SP-05", text: "Confirm lockbox keys match access locks", required: true, photoRequired: false }
    ],
    requiredPhotos: ["Dry Valve Gauge", "FDC Connection Thread"],
    defaultReportType: "NFPA 25 Sprinkler Compliance Report",
    lastUpdated: "2026-03-05"
  }
];

export const MOCK_DEVICE_LIBRARY: DeviceLibraryItem[] = [
  {
    id: "DL-001",
    type: "Fire Alarm Panel",
    category: "Detection & Control",
    icon: "Shield",
    defaultChecklist: ["Verify AC power normal", "Check backup battery load", "Test ground fault detection", "Verify signaling circuits"],
    commonDeficiencies: [
      {
        issue: "FACP backup batteries failed load test",
        technical: "FACP backup batteries failed required load duration test.",
        customer: "The backup batteries for the main fire alarm control panel did not hold a sufficient charge. Replaced batteries are required to ensure the system functions during a power outage.",
        repair: "Replace 12V 12Ah FACP backup batteries and retest panel charging circuit.",
        priority: "critical"
      }
    ],
    governmentShareable: true
  },
  {
    id: "DL-002",
    type: "Smoke Detector",
    category: "Detection & Control",
    icon: "Flame",
    defaultChecklist: ["Perform aerosol smoke entry test", "Check sensitivity readout", "Clean chamber dust", "Verify addressable ID"],
    commonDeficiencies: [
      {
        issue: "Smoke detector failed entry test",
        technical: "Smoke detector failed to activate during smoke entry testing.",
        customer: "The smoke detector in this area did not respond properly during testing. Replacement and retesting are recommended to restore detection coverage.",
        repair: "Replace smoke detector head and retest circuit.",
        priority: "medium"
      }
    ],
    governmentShareable: false
  },
  {
    id: "DL-003",
    type: "Emergency Light",
    category: "Egress & Lighting",
    icon: "Sun",
    defaultChecklist: ["Perform 30-minute duration test", "Verify battery charging voltage", "Align lighting heads", "Clean lenses"],
    commonDeficiencies: [
      {
        issue: "Emergency light battery failed duration test",
        technical: "Emergency lighting unit failed required battery-duration test.",
        customer: "The emergency light did not remain illuminated for the required test duration. Repair or replacement is recommended to support safe evacuation during a power outage.",
        repair: "Replace battery pack or entire emergency lighting unit.",
        priority: "high"
      }
    ],
    governmentShareable: false
  },
  {
    id: "DL-004",
    type: "Sprinkler Riser",
    category: "Suppression",
    icon: "Droplets",
    defaultChecklist: ["Verify control valves are locked open", "Perform main drain test", "Test pressure switch alarm", "Record water pressure gauges"],
    commonDeficiencies: [
      {
        issue: "Control valve tamper switch not reporting",
        technical: "Sprinkler supervisory switch did not report correctly to the fire alarm control panel.",
        customer: "A sprinkler valve supervisory signal is not reporting properly to the fire alarm panel. Immediate troubleshooting is recommended.",
        repair: "Troubleshoot supervisory circuit and restore proper reporting.",
        priority: "critical"
      }
    ],
    governmentShareable: true
  }
];

export const MOCK_DEFICIENCY_LANGUAGE_LIBRARY: DeficiencyLanguageItem[] = [
  {
    id: "DLL-001",
    category: "Fire alarm",
    technical: "Smoke detector failed to activate during smoke entry testing.",
    customer: "The smoke detector in this area did not respond properly during testing. Replacement and retesting are recommended to restore detection coverage.",
    repair: "Replace smoke detector head and retest circuit.",
    priority: "medium"
  },
  {
    id: "DLL-002",
    category: "Emergency lighting",
    technical: "Emergency lighting unit failed required battery-duration test.",
    customer: "The emergency light did not remain illuminated for the required test duration. Repair or replacement is recommended to support safe evacuation during a power outage.",
    repair: "Replace battery or emergency lighting unit and retest.",
    priority: "high"
  },
  {
    id: "DLL-003",
    category: "Sprinkler",
    technical: "Sprinkler supervisory switch did not report correctly to the fire alarm control panel.",
    customer: "A sprinkler valve supervisory signal is not reporting properly to the fire alarm panel. Immediate troubleshooting is recommended.",
    repair: "Troubleshoot supervisory circuit and restore proper reporting.",
    priority: "critical"
  },
  {
    id: "DLL-004",
    category: "Fire extinguishers",
    technical: "Fire extinguisher is past required hydrostatic test date or annual maintenance.",
    customer: "The portable fire extinguisher in this area is overdue for required maintenance or testing. Servicing is required to ensure it functions in an emergency.",
    repair: "Perform annual maintenance, recharge, or replace fire extinguisher.",
    priority: "medium"
  },
  {
    id: "DLL-005",
    category: "FDC / standpipe",
    technical: "FDC connection is missing protective caps, exposing water inlet threads.",
    customer: "The Fire Department Connection (FDC) on the building exterior is missing its protective caps. Replacement is required to prevent debris from blocking the water inlet during an emergency.",
    repair: "Install new 2.5-inch brass FDC caps with security chains.",
    priority: "high"
  }
];

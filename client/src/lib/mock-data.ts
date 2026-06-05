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

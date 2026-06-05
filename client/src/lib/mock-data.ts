export type DeviceStatus = "not_tested" | "testing" | "passed" | "failed" | "deficiency" | "no_access";

export type DeviceType =
  | "Fire Alarm Panel"
  | "Annunciator"
  | "Smoke Detector"
  | "Heat Detector"
  | "Pull Station"
  | "Horn/Strobe"
  | "Speaker/Strobe"
  | "Sprinkler Riser"
  | "FDC"
  | "Standpipe"
  | "Fire Extinguisher"
  | "Emergency Light"
  | "Exit Sign"
  | "Backflow Preventer"
  | "Smoke Control Panel"
  | "Roof Access"
  | "Electrical Shutoff"
  | "Gas Shutoff"
  | "Lockbox";

export type DeviceCategory = 
  | "Detection & Control" 
  | "Notification" 
  | "Suppression" 
  | "Egress & Lighting" 
  | "Access & Utilities";

export interface DeficiencyLog {
  id: string;
  type: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  codeReference?: string;
  recommendedRepair: string;
  customerExplanation: string;
  internalNote?: string;
  photoUrl?: string;
  addToQuote: boolean;
  addToReport: boolean;
  resolved: boolean;
  loggedAt: string;
}

export interface Device {
  id: string;
  label: string;
  type: DeviceType;
  category: DeviceCategory;
  floor: string;
  area: string;
  location: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  status: DeviceStatus;
  lastTestedAt?: string;
  lastTestedBy?: string;
  deficiencyNote?: string;
  deficiencyHistory?: DeficiencyLog[];
  serviceHistory?: { date: string; action: string; technician: string }[];
  qrCode?: string;
  photoUrl?: string;
  technicianNotes?: string;
  customerNotes?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface BuildingProfile {
  name: string;
  address: string;
  occupancyType: string;
  floorsCount: number;
  constructionType: string;
  fireAlarmType: string;
  sprinklerType: string;
  standpipeType: string;
  fdcLocation: string;
  lockboxLocation: string;
  electricalShutoff: string;
  gasShutoff: string;
  roofAccessInstructions: string;
  fireSafetyPlanUrl: string;
  emergencyContacts: { name: string; role: string; phone: string; afterHours: boolean }[];
  knownHazards: string[];
  specialInstructions: string;
}

export interface Report {
  id: string;
  title: string;
  type: "annual" | "deficiency" | "emergency_lighting" | "extinguisher" | "sprinkler" | "government";
  status: "draft" | "ready_for_review" | "sent" | "approved";
  date: string;
  site: string;
  devicesTested: number;
  deficienciesFound: number;
  pdfUrl?: string;
}

export interface QuoteItem {
  id: string;
  deviceId: string;
  deviceLabel: string;
  description: string;
  labourCost: number;
  materialCost: number;
  qty: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerSite: string;
  items: QuoteItem[];
  notes?: string;
  status: "draft" | "sent" | "approved" | "declined";
  createdAt: string;
}

export interface MunicipalSharingSettings {
  // Shared with Fire Department
  shareFireSafetyPlan: boolean;
  shareFdcLocation: boolean;
  shareFireAlarmPanelLocation: boolean;
  shareAnnunciatorLocation: boolean;
  shareSprinklerRiserRoom: boolean;
  shareStandpipeZones: boolean;
  shareFirePumpLocation: boolean;
  shareLockboxLocation: boolean;
  shareRoofAccessInfo: boolean;
  shareShutoffLocations: boolean;
  shareEmergencyContacts: boolean;
  shareCriticalDeficiencies: boolean;
  shareLastInspectionDate: boolean;
  shareComplianceSummary: boolean;
  
  // Private / Not shared by default
  shareQuotePricing: boolean;
  shareTechnicianNotes: boolean;
  shareCustomerBilling: boolean;
  sharePrivatePhotos: boolean;
  shareInternalComments: boolean;
  shareDraftReports: boolean;
  shareCostDetails: boolean;
}

export const FLOORS = ["P1 Parkade", "Main Floor", "Level 2", "Level 3", "Roof", "Mechanical Room"];

export const DEFAULT_MUNICIPAL_SHARING: MunicipalSharingSettings = {
  shareFireSafetyPlan: true,
  shareFdcLocation: true,
  shareFireAlarmPanelLocation: true,
  shareAnnunciatorLocation: true,
  shareSprinklerRiserRoom: true,
  shareStandpipeZones: true,
  shareFirePumpLocation: true,
  shareLockboxLocation: true,
  shareRoofAccessInfo: true,
  shareShutoffLocations: true,
  shareEmergencyContacts: true,
  shareCriticalDeficiencies: true,
  shareLastInspectionDate: true,
  shareComplianceSummary: true,
  
  shareQuotePricing: false,
  shareTechnicianNotes: false,
  shareCustomerBilling: false,
  sharePrivatePhotos: false,
  shareInternalComments: false,
  shareDraftReports: false,
  shareCostDetails: false,
};

export const SAMPLE_BUILDING: BuildingProfile = {
  name: "Harbour View Apartments",
  address: "123 Harbour View Drive, Vancouver, BC",
  occupancyType: "Multi-family Residential (Group C)",
  floorsCount: 6,
  constructionType: "Concrete Non-Combustible (Type I)",
  fireAlarmType: "Mircom FX-2000 Addressable Single Stage",
  sprinklerType: "Wet Pipe (Floors 1-3, Mech), Dry Pipe (Parkade P1)",
  standpipeType: "Class I Wet Standpipe (Stairwells)",
  fdcLocation: "Front Exterior Wall, East of Main Lobby Entrance",
  lockboxLocation: "Front Entrance Vestibule, Right Side (Key code: 4591)",
  electricalShutoff: "Main Electrical Room, Ground Floor (Southeast corner)",
  gasShutoff: "Exterior West Wall, adjacent to Service Bay",
  roofAccessInstructions: "Access Hatch located at Stair B 3rd Floor landing (Key in lockbox)",
  fireSafetyPlanUrl: "#",
  emergencyContacts: [
    { name: "Sarah Jenkins", role: "Property Manager", phone: "604-555-0192", afterHours: false },
    { name: "Marcus Vance", role: "Building Caretaker", phone: "604-555-0143", afterHours: true },
    { name: "Vanguard Security Dispatch", role: "Monitoring Station", phone: "1-800-555-9000", afterHours: true }
  ],
  knownHazards: [
    "Hazardous Chemical Storage in P1 Janitorial Closet",
    "High Voltage Transformers in Southeast Electrical Vault"
  ],
  specialInstructions: "Responders should prioritize clearing Stairwell A first, as it has the direct roof access vent controls."
};

export const MOCK_DEVICES: Device[] = [
  // MAIN FLOOR DEVICES
  {
    id: "FACP-001",
    label: "FACP-001",
    type: "Fire Alarm Panel",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Electrical Room",
    location: "Main Electrical Room, Ground Floor",
    x: 88,
    y: 53,
    status: "not_tested",
    qrCode: "QR-FACP-001-INS",
    photoUrl: "https://images.unsplash.com/photo-1590102421139-30ec739d153c?auto=format&fit=crop&w=150&q=80",
    technicianNotes: "Batteries replaced 2025-10. Firmware v4.2.1 installed.",
    customerNotes: "Main Control Unit. Keep clear of obstructions.",
    serviceHistory: [
      { date: "2025-10-12", action: "Annual Inspection & Battery Replacement", technician: "Alex Mercer" },
      { date: "2024-10-10", action: "Annual Certification", technician: "Alex Mercer" }
    ]
  },
  {
    id: "ANN-001",
    label: "ANN-001",
    type: "Annunciator",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Main Lobby",
    location: "Main Lobby Vestibule",
    x: 50,
    y: 83,
    status: "not_tested",
    qrCode: "QR-ANN-001-INS",
    photoUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=150&q=80",
    technicianNotes: "LED display segments verified. Key switch functional.",
    customerNotes: "Lobby Remote Display. Indicates fire location for emergency crews.",
    serviceHistory: [
      { date: "2025-10-12", action: "LED test & Lamp test", technician: "Alex Mercer" }
    ]
  },
  {
    id: "SD-M-03",
    label: "SD-M-03",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Main Corridor",
    location: "Ceiling Center, Corridor Section A",
    x: 43,
    y: 35,
    status: "not_tested",
    qrCode: "QR-SD-M-03-INS",
    photoUrl: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=150&q=80",
    technicianNotes: "Requires canned aerosol smoke entry test.",
    customerNotes: "Corridor ceiling sensor.",
    serviceHistory: []
  },
  {
    id: "PS-M-04",
    label: "PS-M-04",
    type: "Pull Station",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Main Lobby",
    location: "Next to Front Entrance Doors",
    x: 50,
    y: 92,
    status: "not_tested",
    qrCode: "QR-PS-M-04-INS",
    technicianNotes: "Manual pull station. Dual action. Requires hex reset key.",
    customerNotes: "Manual alarm pull. Pull in case of emergency.",
    serviceHistory: []
  },
  {
    id: "HS-M-05",
    label: "HS-M-05",
    type: "Horn/Strobe",
    category: "Notification",
    floor: "Main Floor",
    area: "Main Corridor",
    location: "West Wall Corridor, near Breakroom",
    x: 18,
    y: 53,
    status: "not_tested",
    qrCode: "QR-HS-M-05-INS",
    technicianNotes: "Audible dB output test required. Standard temporal 3 pattern.",
    customerNotes: "Audible and visual alarm signal.",
    serviceHistory: []
  },
  {
    id: "FE-M-06",
    label: "FE-M-06",
    type: "Fire Extinguisher",
    category: "Suppression",
    floor: "Main Floor",
    area: "Kitchen",
    location: "Near Breakroom Stove, Mounted at 4ft",
    x: 14,
    y: 28,
    status: "not_tested",
    qrCode: "QR-FE-M-06-INS",
    technicianNotes: "10lb ABC Dry Chemical. Check pressure gauge and nozzle.",
    customerNotes: "Dry chemical fire extinguisher.",
    serviceHistory: []
  },
  {
    id: "SD-M-07",
    label: "SD-M-07",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Office Suite 101",
    location: "Office 101 Ceiling Center",
    x: 14,
    y: 13,
    status: "not_tested",
    qrCode: "QR-SD-M-07-INS",
    technicianNotes: "Verify address matches FACP loop map.",
    customerNotes: "Office smoke sensor.",
    serviceHistory: []
  },
  {
    id: "EL-M-08",
    label: "EL-M-08",
    type: "Emergency Light",
    category: "Egress & Lighting",
    floor: "Main Floor",
    area: "Main Corridor",
    location: "Corridor Ceiling East",
    x: 63,
    y: 25,
    status: "not_tested",
    qrCode: "QR-EL-M-08-INS",
    technicianNotes: "Requires 30-minute battery discharge push button test.",
    customerNotes: "Emergency backup lighting unit.",
    serviceHistory: []
  },
  {
    id: "EX-M-09",
    label: "EX-M-09",
    type: "Exit Sign",
    category: "Egress & Lighting",
    floor: "Main Floor",
    area: "Main Lobby",
    location: "Above Main Lobby Exit Doors",
    x: 50,
    y: 97,
    status: "not_tested",
    qrCode: "QR-EX-M-09-INS",
    technicianNotes: "LED double-sided red exit sign. Verify AC power and battery backup.",
    customerNotes: "Illuminated exit pathway sign.",
    serviceHistory: []
  },
  {
    id: "SD-M-10",
    label: "SD-M-10",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "Main Floor",
    area: "Office Suite 102",
    location: "Office 102 Ceiling Center",
    x: 83,
    y: 13,
    status: "not_tested",
    qrCode: "QR-SD-M-10-INS",
    technicianNotes: "Requires canned smoke entry verification.",
    customerNotes: "Office smoke sensor.",
    serviceHistory: []
  },
  {
    id: "LBOX-001",
    label: "LBOX-001",
    type: "Lockbox",
    category: "Access & Utilities",
    floor: "Main Floor",
    area: "Main Lobby",
    location: "Exterior Entrance, right of door",
    x: 62,
    y: 92,
    status: "not_tested",
    qrCode: "QR-LBOX-001-INS",
    technicianNotes: "Supra key safe. Ensure building keys are present and correctly tagged.",
    customerNotes: "Emergency key lockbox for Fire Department access.",
    serviceHistory: []
  },

  // P1 PARKADE DEVICES
  {
    id: "SD-P1-01",
    label: "SD-P1-01",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "P1 Parkade",
    area: "Elevator Lobby",
    location: "Ceiling above Elevator Entrance",
    x: 43,
    y: 28,
    status: "not_tested",
    qrCode: "QR-SD-P1-01-INS",
    technicianNotes: "Verify elevator recall function activates upon alarm.",
    customerNotes: "Elevator lobby safety sensor.",
    serviceHistory: []
  },
  {
    id: "EL-P1-02",
    label: "EL-P1-02",
    type: "Emergency Light",
    category: "Egress & Lighting",
    floor: "P1 Parkade",
    area: "Driveway",
    location: "Pillar C2, West Lane",
    x: 23,
    y: 45,
    status: "not_tested",
    qrCode: "QR-EL-P1-02-INS",
    technicianNotes: "Dual head halogen emergency light.",
    customerNotes: "Parkade backup light.",
    serviceHistory: []
  },
  {
    id: "SPR-P1-03",
    label: "SPR-P1-03",
    type: "Sprinkler Riser",
    category: "Suppression",
    floor: "P1 Parkade",
    area: "Sprinkler Riser Room",
    location: "Southwest corner of Parkade",
    x: 14,
    y: 83,
    status: "not_tested",
    qrCode: "QR-SPR-P1-03-INS",
    technicianNotes: "Dry Pipe valve system. Check air pressure, water pressure, and alarm switches.",
    customerNotes: "Dry Sprinkler Riser supplying Parkade P1 freeze-protection zone.",
    serviceHistory: []
  },
  {
    id: "FDC-001",
    label: "FDC-001",
    type: "FDC",
    category: "Suppression",
    floor: "P1 Parkade",
    area: "Exterior Wall",
    location: "Front East Wall, exterior side",
    x: 88,
    y: 83,
    status: "not_tested",
    qrCode: "QR-FDC-001-INS",
    technicianNotes: "Fire Department Connection. Ensure caps are free, threads greased, and check valve dry.",
    customerNotes: "Fire Department Connection for pumping water into building standpipes.",
    serviceHistory: []
  },

  // LEVEL 2 DEVICES
  {
    id: "SD-L2-01",
    label: "SD-L2-01",
    type: "Smoke Detector",
    category: "Detection & Control",
    floor: "Level 2",
    area: "Central Hallway",
    location: "Corridor ceiling, near Suite 202",
    x: 43,
    y: 35,
    status: "not_tested",
    qrCode: "QR-SD-L2-01-INS",
    technicianNotes: "Addressable smoke sensor.",
    customerNotes: "Hallway smoke detector.",
    serviceHistory: []
  },
  {
    id: "STP-L2-02",
    label: "STP-L2-02",
    type: "Standpipe",
    category: "Suppression",
    floor: "Level 2",
    area: "Stairwell A",
    location: "Stair A landing, Level 2",
    x: 14,
    y: 53,
    status: "not_tested",
    qrCode: "QR-STP-L2-02-INS",
    technicianNotes: "2.5 inch hose valve connection. Ensure wheel handle is tight and cap is on.",
    customerNotes: "Stairwell fire hose connection valve.",
    serviceHistory: []
  },

  // ROOF DEVICES
  {
    id: "ROOF-001",
    label: "ROOF-001",
    type: "Roof Access",
    category: "Access & Utilities",
    floor: "Roof",
    area: "Roof Deck",
    location: "Exit door from Stairwell C",
    x: 62,
    y: 43,
    status: "not_tested",
    qrCode: "QR-ROOF-001-INS",
    technicianNotes: "Check door latch and self-closer. Ensure exit path is unobstructed.",
    customerNotes: "Roof access door.",
    serviceHistory: []
  },
  {
    id: "SCP-001",
    label: "SCP-001",
    type: "Smoke Control Panel",
    category: "Detection & Control",
    floor: "Roof",
    area: "Elevator Machine Room",
    location: "Elevator Machine Room Wall",
    x: 43,
    y: 53,
    status: "not_tested",
    qrCode: "QR-SCP-001-INS",
    technicianNotes: "Smoke venting damper control panel. Test manual override switches.",
    customerNotes: "Pressurization fan and damper override control board.",
    serviceHistory: []
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "REP-2026-01",
    title: "Annual Life-Safety Systems Inspection Report",
    type: "annual",
    status: "draft",
    date: "2026-06-04",
    site: "Harbour View Apartments",
    devicesTested: 19,
    deficienciesFound: 7
  },
  {
    id: "REP-2026-02",
    title: "Critical Deficiency & Repair Summary",
    type: "deficiency",
    status: "ready_for_review",
    date: "2026-06-03",
    site: "Harbour View Apartments",
    devicesTested: 19,
    deficienciesFound: 4
  },
  {
    id: "REP-2026-03",
    title: "Emergency Lighting 30-Min Battery Discharge Log",
    type: "emergency_lighting",
    status: "approved",
    date: "2025-10-12",
    site: "Harbour View Apartments",
    devicesTested: 4,
    deficienciesFound: 1
  },
  {
    id: "REP-2026-04",
    title: "Portable Fire Extinguisher Annual Maintenance Log",
    type: "extinguisher",
    status: "approved",
    date: "2025-10-12",
    site: "Harbour View Apartments",
    devicesTested: 6,
    deficienciesFound: 1
  }
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: "QTE-2026-01",
    quoteNumber: "QT-2026-00491",
    customerSite: "Harbour View Apartments",
    status: "draft",
    createdAt: "2026-06-04",
    notes: "Quote generated automatically from annual field inspection deficiencies.",
    items: [
      {
        id: "QI-01",
        deviceId: "SD-M-10",
        deviceLabel: "SD-M-10",
        description: "Replace defective addressable smoke detector ceiling unit and re-program address in FACP loop card.",
        labourCost: 120,
        materialCost: 185,
        qty: 1
      },
      {
        id: "QI-02",
        deviceId: "EL-P1-02",
        deviceLabel: "EL-P1-02",
        description: "Replace backup battery pack in emergency light.",
        labourCost: 60,
        materialCost: 45,
        qty: 1
      }
    ]
  }
];

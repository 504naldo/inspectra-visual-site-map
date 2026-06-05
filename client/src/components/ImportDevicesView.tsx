import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Upload, FileSpreadsheet, Map, CheckCircle2, AlertCircle, ChevronRight, 
  ArrowRight, ArrowLeft, Play, Settings, Database, Trash2
} from "lucide-react";

interface ImportDevicesViewProps {
  onImportComplete?: (importedCount: number) => void;
}

export default function ImportDevicesView({ onImportComplete }: ImportDevicesViewProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [columnMapping, setColumnMapping] = useState({
    deviceId: "Asset Tag ID",
    deviceType: "Device Type",
    floor: "Floor/Level",
    location: "Location Description",
    x: "X Coordinate (%)",
    y: "Y Coordinate (%)"
  });

  // Mock data parsed from CSV
  const [mockParsedDevices, setMockParsedDevices] = useState([
    { id: "SD-M-21", type: "Smoke Detector", floor: "Main Floor", location: "Suite 108 entry ceiling", x: 45, y: 32, status: "Valid" },
    { id: "HD-L2-15", type: "Heat Detector", floor: "Level 2", location: "Electrical Closet Room 204", x: 22, y: 78, status: "Valid" },
    { id: "FE-P1-09", type: "Fire Extinguisher", floor: "Parkade P1", location: "Pillar P-12, zone B", x: 71, y: 44, status: "Valid" },
    { id: "EXIT-L3-08", type: "Exit Sign", floor: "Level 3", location: "East Corridor Stairwell entry", x: 88, y: 15, status: "Valid" },
    { id: "FACP-ERR-02", type: "Invalid Type", floor: "Invalid Floor", location: "Test location", x: 120, y: -5, status: "Error: Invalid Device Type & Out-of-bounds Coordinates" }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    
    // Simulate parse delay
    setTimeout(() => {
      setIsUploading(false);
      toast.success("FILE PARSED SUCCESSFULLY", {
        description: `Found 5 rows in ${file.name}. Proceeding to Column Mapping.`
      });
      setCurrentStep(2);
    }, 1500);
  };

  const handleCommitImport = () => {
    const validCount = mockParsedDevices.filter(d => d.status === "Valid").length;
    toast.success("IMPORT COMMITTED TO SITE MAP", {
      description: `Successfully added ${validCount} devices to Harbour View Apartments.`
    });
    if (onImportComplete) {
      onImportComplete(validCount);
    }
    setCurrentStep(4);
  };

  const handleReset = () => {
    setFileName(null);
    setCurrentStep(1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>BULK_DEVICE_IMPORT_WIZARD</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Import bulk device registries from CSV/Excel spreadsheets, map layout coordinates, and plot them instantly on blueprints.
          </span>
        </div>
      </div>

      {/* Wizard Steps indicator */}
      <div className="grid grid-cols-4 gap-2 mb-6 text-[10px] text-center border-b border-cyan-500/5 pb-4">
        {[
          { step: 1, label: "UPLOAD_FILE", icon: Upload },
          { step: 2, label: "MAP_COLUMNS", icon: Map },
          { step: 3, label: "VALIDATE_DATA", icon: AlertCircle },
          { step: 4, label: "IMPORT_COMPLETE", icon: CheckCircle2 }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          return (
            <div 
              key={item.step} 
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2 border ${
                isActive ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold" :
                isCompleted ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" :
                "border-cyan-500/5 text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: UPLOAD FILE */}
      {currentStep === 1 && (
        <Card className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto">
          <FileSpreadsheet className="w-16 h-16 text-cyan-500/40 mb-4 animate-pulse" />
          <h3 className="text-sm font-bold text-cyan-300 uppercase mb-2">Upload Device Registry Spreadsheet</h3>
          <p className="text-slate-500 text-[10px] leading-relaxed max-w-md mb-6 uppercase">
            Upload your CSV, XLS, or XLSX device inventory export. The sheet must contain at least device type, floor name, and approximate X/Y layout percentage coordinates.
          </p>

          <div className="w-full max-w-xs">
            {isUploading ? (
              <div className="space-y-2">
                <span className="text-[10px] text-cyan-400 uppercase font-bold animate-pulse">PARSING_CSV_ROWS...</span>
                <Progress value={65} className="h-1 bg-slate-900 rounded-none" />
              </div>
            ) : (
              <div className="relative border border-dashed border-cyan-500/30 bg-slate-900/20 hover:bg-slate-900/40 p-6 transition-all">
                <input 
                  type="file" 
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-[10px] text-cyan-400 font-bold uppercase block">CHOOSE_SPREADSHEET</span>
                <span className="text-[8px] text-slate-500 block mt-1">DRAG & DROP FILE HERE</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {currentStep === 2 && (
        <Card className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners max-w-xl mx-auto">
          <CardHeader className="border-b border-cyan-500/5">
            <CardTitle className="text-xs font-bold text-cyan-300 uppercase">MAP SPREADSHEET COLUMNS</CardTitle>
            <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-1">
              FILE_NAME: {fileName} // Match spreadsheet columns to Inspectra system properties.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {[
                { field: "deviceId", label: "Asset Tag ID", required: true },
                { field: "deviceType", label: "Device Type", required: true },
                { field: "floor", label: "Floor/Level", required: true },
                { field: "location", label: "Location Description", required: false },
                { field: "x", label: "X Coordinate (%)", required: false },
                { field: "y", label: "Y Coordinate (%)", required: false }
              ].map((row) => (
                <div key={row.field} className="grid grid-cols-2 items-center gap-4 border-b border-cyan-500/5 pb-2 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-bold uppercase">{row.field}</span>
                    {row.required && <Badge className="bg-slate-900 border border-rose-500/20 text-rose-400 rounded-none text-[7px] py-0 h-4">REQUIRED</Badge>}
                  </div>
                  <div className="bg-slate-900 border border-cyan-500/20 p-2 text-cyan-400 text-xs font-bold flex justify-between items-center uppercase">
                    <span>{row.label}</span>
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-cyan-500/5" />

            <div className="flex justify-between gap-3">
              <Button variant="ghost" onClick={() => setCurrentStep(1)} className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>BACK</span>
              </Button>
              <Button onClick={() => setCurrentStep(3)} className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold">
                <span>RUN_VALIDATION</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: DATA VALIDATION */}
      {currentStep === 3 && (
        <Card className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners max-w-2xl mx-auto">
          <CardHeader className="border-b border-cyan-500/5">
            <CardTitle className="text-xs font-bold text-cyan-300 uppercase">IMPORT PRE-VALIDATION CHECK</CardTitle>
            <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-1">
              Review parse diagnostics. Correct rows before importing to Harbour View Apartments.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            
            {/* Parsed table */}
            <div className="border border-cyan-500/10 bg-slate-900/20 p-2 max-h-60 overflow-y-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-cyan-500/20 text-slate-500 font-bold uppercase">
                    <th className="pb-1.5">ID</th>
                    <th className="pb-1.5">TYPE</th>
                    <th className="pb-1.5">FLOOR</th>
                    <th className="pb-1.5">LOCATION</th>
                    <th className="pb-1.5">COORDS</th>
                    <th className="pb-1.5 text-right">DIAGNOSTICS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/5">
                  {mockParsedDevices.map((dev) => {
                    const isError = dev.status.includes("Error");
                    return (
                      <tr key={dev.id} className="text-slate-300">
                        <td className="py-2 font-bold text-cyan-300">{dev.id}</td>
                        <td className="py-2 uppercase">{dev.type}</td>
                        <td className="py-2 uppercase">{dev.floor}</td>
                        <td className="py-2 truncate max-w-[120px] uppercase">{dev.location}</td>
                        <td className="py-2">X:{dev.x}% Y:{dev.y}%</td>
                        <td className="py-2 text-right">
                          <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                            isError ? "bg-rose-950/40 text-rose-400 border-rose-500/30" : "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                          }`}>
                            {dev.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Separator className="bg-cyan-500/5" />

            <div className="flex justify-between items-center gap-3">
              <div className="text-[9px] text-slate-500 uppercase font-bold">
                VALID_ROWS: <span className="text-emerald-400">4</span> // ERRORS: <span className="text-rose-400">1</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span>BACK</span>
                </Button>
                <Button onClick={handleCommitImport} className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold">
                  <span>COMMIT_IMPORT</span>
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: IMPORT COMPLETE */}
      {currentStep === 4 && (
        <Card className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
          <h3 className="text-sm font-bold text-emerald-400 uppercase mb-2">Device Import Complete!</h3>
          <p className="text-slate-500 text-[10px] leading-relaxed max-w-md mb-6 uppercase">
            Successfully imported 4 valid device nodes and plotted them dynamically on the schematic layouts of Harbour View Apartments.
          </p>

          <div className="flex gap-3">
            <Button onClick={handleReset} className="rounded-none border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold">
              <span>IMPORT_ANOTHER_FILE</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

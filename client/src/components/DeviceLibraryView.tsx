import React, { useState } from "react";
import { DeviceLibraryItem, MOCK_DEVICE_LIBRARY, DeviceCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  BookOpen, Search, Shield, Flame, Sun, Droplets, ShieldCheck, 
  HelpCircle, CheckCircle2, ChevronRight, AlertTriangle, Plus
} from "lucide-react";

export default function DeviceLibraryView() {
  const [library, setLibrary] = useState<DeviceLibraryItem[]>(MOCK_DEVICE_LIBRARY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredLibrary = library.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: DeviceCategory) => {
    switch (category) {
      case "Detection & Control": return <Shield className="w-4 h-4 text-cyan-400" />;
      case "Notification": return <Flame className="w-4 h-4 text-amber-400" />;
      case "Egress & Lighting": return <Sun className="w-4 h-4 text-yellow-400" />;
      case "Suppression": return <Droplets className="w-4 h-4 text-blue-400" />;
      default: return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>DEVICE_LIBRARY</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Searchable registry of life-safety devices, default testing protocols, common deficiencies, and municipal sharing eligibility.
          </span>
        </div>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border border-cyan-500/10 p-3 bg-slate-950/40">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <Input 
            type="text"
            placeholder="SEARCH_LIBRARY_ASSETS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border-cyan-500/20 pl-9 text-cyan-400 rounded-none text-xs w-full uppercase"
          />
        </div>

        {/* Category Filter badges */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "Detection & Control", "Notification", "Egress & Lighting", "Suppression"].map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              onClick={() => setSelectedCategory(cat)}
              className={`h-7 rounded-none border text-[9px] px-3 font-bold ${
                selectedCategory === cat 
                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                  : "border-cyan-500/10 text-slate-500 hover:text-cyan-400"
              }`}
            >
              {cat.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Library Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredLibrary.map((item) => (
          <Card key={item.id} className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners flex flex-col justify-between">
            <CardHeader className="border-b border-cyan-500/5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 border border-cyan-500/20 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{item.type}</CardTitle>
                    <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">
                      {item.category} // ASSET_ID: {item.id}
                    </CardDescription>
                  </div>
                </div>

                <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                  item.governmentShareable ? "bg-purple-950/40 text-purple-400 border-purple-500/30" : "bg-slate-900 text-slate-500 border-slate-800"
                }`}>
                  GOVT_SHARE: {item.governmentShareable ? "ELIGIBLE" : "RESTRICTED"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              
              {/* Default Checklist */}
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1.5">DEFAULT_INSPECTION_CHECKLIST</span>
                <div className="space-y-1 bg-slate-900/10 border border-cyan-500/5 p-2">
                  {item.defaultChecklist.map((check, idx) => (
                    <div key={idx} className="text-[10px] text-slate-400 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span className="uppercase">{check}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Deficiencies Wording templates */}
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1.5">COMMON_DEFICIENCY_TEMPLATE</span>
                {item.commonDeficiencies.map((def, idx) => (
                  <div key={idx} className="border border-cyan-500/5 bg-slate-950 p-2.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-300 font-bold uppercase text-[9px]">{def.issue}</span>
                      <Badge className={`rounded-none text-[7px] uppercase font-bold ${
                        def.priority === "critical" ? "bg-rose-950/40 text-rose-400 border-rose-500/30" :
                        def.priority === "high" ? "bg-amber-950/40 text-amber-400 border-amber-500/30" :
                        "bg-blue-950/40 text-blue-400 border-blue-500/30"
                      }`}>
                        {def.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-[9px]">
                      <div>
                        <span className="text-slate-500 font-bold uppercase block">CUSTOMER_EXPLANATION:</span>
                        <p className="text-slate-400 italic leading-relaxed">{def.customer}</p>
                      </div>
                      <div className="pt-1">
                        <span className="text-slate-500 font-bold uppercase block">RECOMMENDED_REPAIR:</span>
                        <p className="text-cyan-400 font-bold uppercase">{def.repair}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <Separator className="bg-cyan-500/5" />

            <div className="p-3 bg-slate-900/10 flex justify-end">
              <Button 
                onClick={() => toast.success("MAPPED_TO_BLUEPRINT", { description: `Drag and drop device template ${item.type} on floor map.` })}
                className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span>ADD_TO_SITE_MAP</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { DeficiencyLanguageItem, MOCK_DEFICIENCY_LANGUAGE_LIBRARY } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  FileCode, Search, PlusCircle, Edit, Trash2, ShieldCheck, 
  HelpCircle, CheckCircle2, ChevronRight, AlertTriangle, AlertOctagon, Info
} from "lucide-react";

export default function DeficiencyLanguageView() {
  const [languageList, setLanguageList] = useState<DeficiencyLanguageItem[]>(MOCK_DEFICIENCY_LANGUAGE_LIBRARY);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedItem, setSelectedTemplateItem] = useState<DeficiencyLanguageItem | null>(null);

  // Editor form state
  const [formNfpa, setFormNfpa] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPriority, setFormPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [formCustomer, setFormCustomer] = useState("");
  const [formTechnical, setFormTechnical] = useState("");
  const [formRepair, setFormRepair] = useState("");

  const filteredLanguage = languageList.filter(item => 
    item.technical.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEditor = (item: DeficiencyLanguageItem | null) => {
    if (item) {
      setSelectedTemplateItem(item);
      setFormNfpa(item.technical);
      setFormCategory(item.category);
      setFormPriority(item.priority);
      setFormCustomer(item.customer);
      setFormTechnical(item.technical);
      setFormRepair(item.repair);
    } else {
      setSelectedTemplateItem(null);
      setFormNfpa("");
      setFormCategory("");
      setFormPriority("high");
      setFormCustomer("");
      setFormTechnical("");
      setFormRepair("");
    }
    setIsEditorOpen(true);
  };

  const handleSaveItem = () => {
    if (!formTechnical.trim() || !formCategory.trim() || !formCustomer.trim()) {
      toast.error("Technical/NFPA standard, category, and customer explanation are required.");
      return;
    }

    const updatedItem: DeficiencyLanguageItem = {
      id: selectedItem?.id || `DEF-LANG-${Date.now()}`,
      category: formCategory,
      technical: formTechnical,
      customer: formCustomer,
      repair: formRepair,
      priority: formPriority
    };

    if (selectedItem) {
      setLanguageList(languageList.map(item => item.id === selectedItem.id ? updatedItem : item));
      toast.success("DEFICIENCY TEMPLATE UPDATED", {
        description: `Successfully updated deficiency template for ${formTechnical}.`
      });
    } else {
      setLanguageList([...languageList, updatedItem]);
      toast.success("DEFICIENCY TEMPLATE CREATED", {
        description: `New deficiency template ${formTechnical} added to library.`
      });
    }

    setIsEditorOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setLanguageList(languageList.filter(item => item.id !== id));
    toast.success("DEFICIENCY TEMPLATE REMOVED");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <span>DEFICIENCY_LANGUAGE_LIBRARY</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Customize plain-language deficiency explanations, NFPA code references, and default recommended repairs.
          </span>
        </div>

        <Button 
          onClick={() => handleOpenEditor(null)}
          className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>ADD_TEMPLATE_WORDING</span>
        </Button>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border border-cyan-500/10 p-3 bg-slate-950/40">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <Input 
            type="text"
            placeholder="SEARCH_BY_NFPA_CODE_OR_SYSTEM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border-cyan-500/20 pl-9 text-cyan-400 rounded-none text-xs w-full uppercase"
          />
        </div>

        <div className="flex gap-4 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase font-bold">TOTAL_TEMPLATES:</span>
            <span className="text-cyan-300 font-bold">{languageList.length}</span>
          </div>
        </div>
      </div>

      {/* Language Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLanguage.map((item) => (
          <Card key={item.id} className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners flex flex-col justify-between">
            <CardHeader className="border-b border-cyan-500/5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{item.technical}</CardTitle>
                  <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-0.5">
                    CATEGORY: {item.category} // ID: {item.id}
                  </CardDescription>
                </div>

                <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                  item.priority === "critical" ? "bg-rose-950/40 text-rose-400 border-rose-500/30" :
                  item.priority === "high" ? "bg-amber-950/40 text-amber-400 border-amber-500/30" :
                  item.priority === "medium" ? "bg-yellow-950/40 text-yellow-400 border-yellow-500/30" :
                  "bg-blue-950/40 text-blue-400 border-blue-500/30"
                }`}>
                  {item.priority}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3 flex-1">
              {/* Customer Wording */}
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">CUSTOMER_PLAIN_LANGUAGE_EXPLANATION</span>
                <p className="text-slate-300 text-[10px] leading-relaxed uppercase bg-slate-900/10 border border-cyan-500/5 p-2.5">
                  {item.customer}
                </p>
              </div>

              {/* Recommended Repair */}
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">RECOMMENDED_COMPLIANCE_REPAIR</span>
                <p className="text-cyan-300 text-[10px] font-bold uppercase">
                  {item.repair}
                </p>
              </div>
            </CardContent>

            <Separator className="bg-cyan-500/5" />

            <div className="p-3 bg-slate-900/10 flex justify-end gap-1.5">
              <Button 
                variant="ghost"
                onClick={() => handleDeleteItem(item.id)}
                className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-rose-400 font-bold"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                <span>DELETE</span>
              </Button>
              <Button 
                onClick={() => handleOpenEditor(item)}
                className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
              >
                <Edit className="w-3 h-3 mr-1" />
                <span>EDIT_WORDING</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* LANGUAGE EDITOR DIALOG */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-md overflow-y-auto max-h-[85vh] text-xs">
          <DialogHeader className="border-b border-cyan-500/10 pb-3">
            <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold">
              {selectedItem ? "EDIT_DEFICIENCY_WORDING" : "ADD_DEFICIENCY_WORDING"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[10px] uppercase font-bold">
              Define reusable plain-language templates mapped to specific NFPA compliance standards.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-500 uppercase font-bold text-[10px]">Technical/NFPA Standard</Label>
                <Input 
                  value={formTechnical}
                  onChange={(e) => setFormTechnical(e.target.value)}
                  placeholder="e.g., NFPA 72 (14.4.5)"
                  className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-500 uppercase font-bold text-[10px]">Category</Label>
                <Input 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g., Detection & Control"
                  className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-500 uppercase font-bold text-[10px]">Severity Level</Label>
              <div className="flex gap-2">
                {(["critical", "high", "medium", "low"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    type="button"
                    variant="ghost"
                    onClick={() => setFormPriority(lvl)}
                    className={`flex-1 h-8 rounded-none border text-[9px] font-bold ${
                      formPriority === lvl 
                        ? lvl === "critical" ? "bg-rose-950/40 border-rose-500 text-rose-400" :
                          lvl === "high" ? "bg-amber-950/40 border-amber-500 text-amber-400" :
                          lvl === "medium" ? "bg-yellow-950/40 border-yellow-500 text-yellow-400" :
                          "bg-blue-950/40 border-blue-500 text-blue-400"
                        : "border-cyan-500/10 text-slate-500 hover:text-cyan-400"
                    }`}
                  >
                    {lvl.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-500 uppercase font-bold text-[10px]">Customer Plain-Language Explanation</Label>
              <Textarea 
                value={formCustomer}
                onChange={(e) => setFormCustomer(e.target.value)}
                placeholder="Plain-language description that appears on reports and client quotes..."
                rows={3}
                className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-500 uppercase font-bold text-[10px]">Recommended Compliance Repair</Label>
              <Input 
                value={formRepair}
                onChange={(e) => setFormRepair(e.target.value)}
                placeholder="e.g., Replace defective smoke detector head"
                className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs uppercase"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-cyan-500/10 pt-3 gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsEditorOpen(false)}
              className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400"
            >
              CANCEL
            </Button>
            <Button 
              onClick={handleSaveItem}
              className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900"
            >
              SAVE_TEMPLATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

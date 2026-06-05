import React, { useState } from "react";
import { InspectionTemplate, MOCK_INSPECTION_TEMPLATES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  ClipboardList, PlusCircle, Trash2, Edit, CheckSquare, 
  Eye, ShieldCheck, CheckCircle2
} from "lucide-react";

export default function TemplatesView() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>(MOCK_INSPECTION_TEMPLATES);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(null);

  // Template editor form state
  const [formName, setFormName] = useState("");
  const [formSystems, setFormSystems] = useState("");
  const [formChecklist, setFormChecklist] = useState<{ id: string; text: string; required: boolean; photoRequired: boolean }[]>([]);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [newCheckRequired, setNewCheckRequired] = useState(true);
  const [newCheckPhoto, setNewCheckPhoto] = useState(false);

  const handleOpenEditor = (template: InspectionTemplate | null) => {
    if (template) {
      setSelectedTemplate(template);
      setFormName(template.name);
      setFormSystems(template.systemsIncluded.join(", "));
      setFormChecklist([...template.checklistItems]);
    } else {
      setSelectedTemplate(null);
      setFormName("");
      setFormSystems("");
      setFormChecklist([
        { id: "CL-01", text: "Perform initial visual inspection", required: true, photoRequired: false }
      ]);
    }
    setIsEditorOpen(true);
  };

  const handleAddChecklistItem = () => {
    if (!newCheckItem.trim()) return;
    const newItem = {
      id: `CL-${Date.now()}`,
      text: newCheckItem,
      required: newCheckRequired,
      photoRequired: newCheckPhoto
    };
    setFormChecklist([...formChecklist, newItem]);
    setNewCheckItem("");
    toast.success("CHECKLIST ITEM ADDED");
  };

  const handleRemoveChecklistItem = (id: string) => {
    setFormChecklist(formChecklist.filter(item => item.id !== id));
  };

  const handleSaveTemplate = () => {
    if (!formName.trim()) {
      toast.error("Template name is required.");
      return;
    }

    const updatedTemplate: InspectionTemplate = {
      id: selectedTemplate?.id || `TMP-${Date.now()}`,
      name: formName,
      systemsIncluded: formSystems.split(",").map(s => s.trim()).filter(Boolean),
      requiredCategories: selectedTemplate?.requiredCategories || ["Detection & Control"],
      checklistItems: formChecklist,
      requiredPhotos: selectedTemplate?.requiredPhotos || ["Field Photo"],
      defaultReportType: selectedTemplate?.defaultReportType || "Standard ASTTBC Compliance Report",
      lastUpdated: new Date().toISOString().split("T")[0]
    };

    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
      toast.success("TEMPLATE UPDATED", {
        description: `Inspection template ${formName} successfully saved.`
      });
    } else {
      setTemplates([...templates, updatedTemplate]);
      toast.success("TEMPLATE CREATED", {
        description: `New inspection template ${formName} added to library.`
      });
    }

    setIsEditorOpen(false);
  };

  const handleOpenPreview = (template: InspectionTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-cyan-400" />
            <span>INSPECTION_TEMPLATES</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Manage reusable ASTTBC and NFPA compliance checklists, required photo attachments, and report mappings.
          </span>
        </div>

        <Button 
          onClick={() => handleOpenEditor(null)}
          className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>CREATE_TEMPLATE</span>
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners flex flex-col justify-between">
            <CardHeader className="border-b border-cyan-500/5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{template.name}</CardTitle>
                  <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-1">
                    TEMPLATE_ID: {template.id} // UPDATED: {template.lastUpdated}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 flex-1">
              
              {/* Systems Included */}
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">SYSTEMS_INCLUDED</span>
                <div className="flex flex-wrap gap-1">
                  {template.systemsIncluded.map((sys, idx) => (
                    <Badge key={idx} className="bg-slate-900 border border-cyan-500/10 text-cyan-300 rounded-none text-[8px] uppercase">
                      {sys}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Checklist Count Summary */}
              <div className="grid grid-cols-2 gap-3 border border-cyan-500/5 p-2 bg-slate-900/10 text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-slate-500 uppercase font-bold block">CHECKLIST_ITEMS</span>
                  <span className="text-cyan-300 font-bold">{template.checklistItems.length} STEPS</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 uppercase font-bold block">REQUIRED_PHOTOS</span>
                  <span className="text-cyan-300 font-bold">{template.requiredPhotos.length} IMAGES</span>
                </div>
              </div>

              {/* Report Mapping */}
              <div className="space-y-1">
                <span className="text-[8px] text-slate-500 uppercase font-bold block">DEFAULT_REPORT_TYPE</span>
                <span className="text-slate-400 text-[10px] flex items-center gap-1.5 uppercase font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{template.defaultReportType}</span>
                </span>
              </div>
            </CardContent>

            <Separator className="bg-cyan-500/5" />

            <div className="p-3 bg-slate-900/10 flex justify-end gap-1.5">
              <Button 
                variant="ghost"
                onClick={() => handleOpenPreview(template)}
                className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 font-bold"
              >
                <Eye className="w-3 h-3 mr-1" />
                <span>PREVIEW</span>
              </Button>
              <Button 
                onClick={() => handleOpenEditor(template)}
                className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
              >
                <Edit className="w-3 h-3 mr-1" />
                <span>EDIT_TEMPLATE</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* TEMPLATE EDITOR MODAL */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-lg overflow-y-auto max-h-[85vh] text-xs">
          <DialogHeader className="border-b border-cyan-500/10 pb-3">
            <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold">
              {selectedTemplate ? "EDIT_INSPECTION_TEMPLATE" : "CREATE_INSPECTION_TEMPLATE"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[10px] uppercase font-bold">
              Define standard compliance steps and required field photos for ASTTBC/NFPA reporting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-slate-500 uppercase font-bold text-[10px]">Template Name</Label>
              <Input 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Annual Fire Alarm Inspection"
                className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-500 uppercase font-bold text-[10px]">Systems Included (Comma-separated)</Label>
              <Input 
                value={formSystems}
                onChange={(e) => setFormSystems(e.target.value)}
                placeholder="e.g., Control Panel, Detection, Horns"
                className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
              />
            </div>

            <Separator className="bg-cyan-500/10" />

            {/* Checklist Builder */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Checklist Items Builder</span>
              
              {/* Existing Items */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto border border-cyan-500/10 p-2 bg-slate-900/30">
                {formChecklist.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-b border-cyan-500/5 pb-1.5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-1.5">
                      <span className="text-slate-500">{idx + 1}.</span>
                      <div>
                        <span className="text-slate-300 font-bold uppercase">{item.text}</span>
                        <div className="flex gap-1.5 mt-0.5">
                          {item.required && <Badge className="bg-slate-900 border border-cyan-500/20 text-cyan-400 rounded-none text-[7px] uppercase font-bold py-0 h-4">REQUIRED</Badge>}
                          {item.photoRequired && <Badge className="bg-slate-900 border border-rose-500/20 text-rose-400 rounded-none text-[7px] uppercase font-bold py-0 h-4">PHOTO_REQ</Badge>}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="h-6 w-6 p-0 text-slate-500 hover:text-rose-400 rounded-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add New Checklist Item Form */}
              <div className="border border-cyan-500/10 p-3 bg-slate-900/10 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-500 uppercase font-bold text-[9px]">Add Checklist Step</Label>
                  <Input 
                    value={newCheckItem}
                    onChange={(e) => setNewCheckItem(e.target.value)}
                    placeholder="e.g., Test backup battery capacity"
                    className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="step-required" 
                      checked={newCheckRequired} 
                      onCheckedChange={setNewCheckRequired}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                    <Label htmlFor="step-required" className="text-[9px] text-slate-400 uppercase font-bold">Step Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="step-photo" 
                      checked={newCheckPhoto} 
                      onCheckedChange={setNewCheckPhoto}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                    <Label htmlFor="step-photo" className="text-[9px] text-slate-400 uppercase font-bold">Photo Required</Label>
                  </div>
                  <Button 
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
                  >
                    ADD_STEP
                  </Button>
                </div>
              </div>
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
              onClick={handleSaveTemplate}
              className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900"
            >
              SAVE_TEMPLATE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TEMPLATE PREVIEW MODAL */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-slate-950 border border-cyan-500 text-cyan-400 rounded-none font-mono max-w-md text-xs">
          <DialogHeader className="border-b border-cyan-500/10 pb-3">
            <DialogTitle className="text-cyan-300 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              <span>{selectedTemplate?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[10px] uppercase font-bold">
              Checklist protocol layout preview for field technicians.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">MAPPED_SYSTEMS</span>
              <div className="flex flex-wrap gap-1">
                {selectedTemplate?.systemsIncluded.map((sys, idx) => (
                  <Badge key={idx} className="bg-slate-900 border border-cyan-500/10 text-cyan-300 rounded-none text-[8px] uppercase">
                    {sys}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-cyan-500/10" />

            <div className="space-y-2">
              <span className="text-[9px] text-slate-500 uppercase font-bold block">FIELD_TESTING_STEPS</span>
              <div className="space-y-2 border border-cyan-500/5 p-3 bg-slate-900/10">
                {selectedTemplate?.checklistItems.map((item, idx) => (
                  <div key={item.id} className="flex items-start gap-2 text-[10px] border-b border-cyan-500/5 pb-2 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-300 font-bold uppercase">{item.text}</p>
                      <div className="flex gap-1.5 mt-1">
                        {item.required && <span className="text-[7px] text-cyan-400/70 uppercase font-bold">[REQUIRED]</span>}
                        {item.photoRequired && <span className="text-[7px] text-rose-400/70 uppercase font-bold">[PHOTO_REQUIRED]</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-cyan-500/10 pt-3">
            <Button 
              onClick={() => setIsPreviewOpen(false)}
              className="w-full rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900"
            >
              CLOSE_PREVIEW
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

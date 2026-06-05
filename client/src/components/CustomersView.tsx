import React, { useState } from "react";
import { Customer, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Users, Search, UserPlus, Phone, Mail, MapPin, ExternalLink, 
  PlusCircle, FileText, DollarSign, Key, Plus, ChevronRight, AlertCircle
} from "lucide-react";

interface CustomersViewProps {
  onOpenCustomerPortal?: (customerName: string) => void;
}

export default function CustomersView({ onOpenCustomerPortal }: CustomersViewProps) {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.siteContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePortal = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextStatus = c.portalAccessStatus === "Enabled" ? "Disabled" : "Enabled";
        toast.info("PORTAL ACCESS CHANGED", {
          description: `Customer portal for ${c.name} is now ${nextStatus.toUpperCase()}.`
        });
        return { ...c, portalAccessStatus: nextStatus };
      }
      return c;
    }));
  };

  const handleAddNote = (customerId: string) => {
    const note = prompt("Enter site dispatch/technician note:");
    if (!note) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedNotes = c.notes ? [...c.notes, note] : [note];
        toast.success("NOTE ADDED", {
          description: "New site dispatch note saved to customer profile."
        });
        return { ...c, notes: updatedNotes };
      }
      return c;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>CUSTOMER_REGISTRY</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Manage customer profiles, dispatch site instructions, linked buildings, and portal access permissions.
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={() => toast.success("ADD CUSTOMER", { description: "Opening customer registration form..." })}
            className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span>ADD_CUSTOMER</span>
          </Button>
        </div>
      </div>

      {/* Search & Stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border border-cyan-500/10 p-3 bg-slate-950/40">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <Input 
            type="text"
            placeholder="SEARCH_CUSTOMERS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border-cyan-500/20 pl-9 text-cyan-400 rounded-none text-xs w-full uppercase"
          />
        </div>

        <div className="flex gap-4 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase font-bold">TOTAL_CUSTOMERS:</span>
            <span className="text-cyan-300 font-bold">{customers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase font-bold">PORTALS_ACTIVE:</span>
            <span className="text-emerald-400 font-bold">
              {customers.filter(c => c.portalAccessStatus === "Enabled").length}
            </span>
          </div>
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="bg-slate-950/80 border border-cyan-500/15 rounded-none hud-corners flex flex-col justify-between">
            <CardHeader className="border-b border-cyan-500/5 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{customer.name}</CardTitle>
                    <Badge className="bg-slate-900 border border-cyan-500/20 text-cyan-400 rounded-none text-[8px] uppercase font-bold">
                      {customer.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-[9px] text-slate-500 uppercase font-bold mt-1">
                    CUSTOMER_ID: {customer.id} // CONTACT: {customer.siteContact}
                  </CardDescription>
                </div>

                <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                  customer.portalAccessStatus === "Enabled" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" :
                  customer.portalAccessStatus === "Pending Invite" ? "bg-amber-950/40 text-amber-400 border-amber-500/30" :
                  "bg-rose-950/40 text-rose-400 border-rose-500/30"
                }`}>
                  PORTAL: {customer.portalAccessStatus}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px]">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="text-slate-400 truncate uppercase">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <Phone className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="text-slate-400">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <Mail className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="text-slate-400 truncate">{customer.email}</span>
                  </div>
                </div>

                {/* Operations links */}
                <div className="space-y-1.5 text-[10px] border-l border-cyan-500/5 pl-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">BILLING_CONTACT:</span>
                    <span className="text-cyan-300 font-bold uppercase">{customer.billingContact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">EMERGENCY_DISPATCH:</span>
                    <span className="text-rose-400 font-bold uppercase">{customer.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Linked Buildings */}
              <div className="border-t border-cyan-500/5 pt-3">
                <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1.5">LINKED_BUILDINGS</span>
                <div className="flex flex-wrap gap-1.5">
                  {customer.linkedBuildings.map((building, idx) => (
                    <Badge key={idx} className="bg-slate-900 border border-cyan-500/10 text-cyan-300 rounded-none text-[9px] uppercase font-bold">
                      {building}
                    </Badge>
                  ))}
                  <Button 
                    variant="ghost"
                    onClick={() => toast.success("ADD BUILDING LINK", { description: `Linking building to ${customer.name}...` })}
                    className="h-5 px-1.5 rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 text-[8px]"
                  >
                    <Plus className="w-2.5 h-2.5 mr-1" />
                    <span>LINK_BUILDING</span>
                  </Button>
                </div>
              </div>

              {/* Site Notes / Dispatch instructions */}
              {customer.notes && customer.notes.length > 0 && (
                <div className="border-t border-cyan-500/5 pt-3 bg-slate-900/10 p-2 border border-cyan-500/5">
                  <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1">SITE_DISPATCH_INSTRUCTIONS</span>
                  <ul className="space-y-1">
                    {customer.notes.map((note, idx) => (
                      <li key={idx} className="text-slate-400 text-[9px] flex items-start gap-1.5 italic">
                        <ChevronRight className="w-3 h-3 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>

            <Separator className="bg-cyan-500/5" />

            <div className="p-3 bg-slate-900/10 flex flex-wrap justify-between items-center gap-2">
              <div className="flex gap-1.5">
                <Button 
                  variant="ghost"
                  onClick={() => handleAddNote(customer.id)}
                  className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 font-bold"
                >
                  <PlusCircle className="w-3 h-3 mr-1" />
                  <span>ADD_NOTE</span>
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => handleTogglePortal(customer.id)}
                  className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 font-bold"
                >
                  <Key className="w-3 h-3 mr-1" />
                  <span>PORTAL_ACCESS</span>
                </Button>
              </div>

              {customer.portalAccessStatus === "Enabled" && onOpenCustomerPortal && (
                <Button 
                  onClick={() => onOpenCustomerPortal(customer.name)}
                  className="h-7 text-[9px] rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 font-bold"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span>OPEN_PORTAL</span>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Quote, QuoteItem } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Check, FileCheck, ClipboardList, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QuotesViewProps {
  quotes: Quote[];
  onApproveQuote?: (id: string) => void;
  onSendQuote?: (id: string) => void;
  activeRole: string;
}

export default function QuotesView({ quotes, onApproveQuote, onSendQuote, activeRole }: QuotesViewProps) {
  
  const handleApprove = (quoteId: string, quoteNum: string) => {
    if (onApproveQuote) {
      onApproveQuote(quoteId);
    } else {
      toast.success("QUOTE APPROVED", {
        description: `QUOTE ${quoteNum} SIGNED AND CONVERTED TO SERVICE ORDER.`
      });
    }
  };

  const handleSend = (quoteId: string, quoteNum: string) => {
    if (onSendQuote) {
      onSendQuote(quoteId);
    } else {
      toast.success("QUOTE SENT", {
        description: `QUOTE ${quoteNum} SENT TO CUSTOMER PORTAL.`
      });
    }
  };

  const getStatusBadge = (status: Quote["status"]) => {
    switch (status) {
      case "draft":
        return <Badge className="bg-slate-900 text-slate-400 border-slate-700 rounded-none text-[9px] font-bold">DRAFT</Badge>;
      case "sent":
        return <Badge className="bg-cyan-950/40 text-cyan-400 border-cyan-500/30 rounded-none text-[9px] font-bold animate-pulse">AWAITING_APPROVAL</Badge>;
      case "approved":
        return <Badge className="bg-emerald-950/40 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">APPROVED_WORK_ORDER</Badge>;
      case "declined":
        return <Badge className="bg-rose-950/40 text-rose-400 border-rose-500/30 rounded-none text-[9px] font-bold">DECLINED</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#02040a]/40">
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-500" />
            <span>DEFICIENCY_REPAIR_QUOTES</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase mt-1">Convert Logged Deficiencies and Failed Nodes into Cost Estimates</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-20 text-xs text-slate-600 flex flex-col items-center gap-2 font-mono">
          <ClipboardList className="w-8 h-8 opacity-20" />
          <span>NO_QUOTES_FOUND_IN_REGISTRY</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {quotes.map((quote) => {
            // Calculations
            const subtotal = quote.items.reduce((acc, item) => acc + (item.labourCost + item.materialCost) * item.qty, 0);
            const tax = subtotal * 0.12; // BC GST/PST 12%
            const total = subtotal + tax;

            return (
              <div key={quote.id} className="border border-cyan-500/20 bg-slate-950/70 p-5 flex flex-col gap-4 relative font-mono text-xs hud-corners">
                {/* Quote Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-300 text-sm">{quote.quoteNumber}</span>
                    <span className="text-slate-500">//</span>
                    <span className="text-slate-400 uppercase text-[10px]">{quote.customerSite}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(quote.status)}
                    <span className="text-[10px] text-slate-500">{quote.createdAt}</span>
                  </div>
                </div>

                {/* Quote Items List */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Repair Scope Items</span>
                  <div className="border border-cyan-500/10 divide-y divide-cyan-500/10">
                    {quote.items.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="rounded-none border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-[9px] font-bold">
                              {item.deviceLabel}
                            </Badge>
                            <span className="font-bold text-cyan-300 text-[11px]">{item.description.toUpperCase()}</span>
                          </div>
                        </div>
                        
                        {/* Cost detail (Private to Fire Company, or shown as flat item to Property Manager) */}
                        <div className="flex items-center gap-6 text-right">
                          {activeRole === "fire_company" ? (
                            <div className="grid grid-cols-2 gap-x-4 text-[10px] text-slate-500">
                              <span>LABOUR: <strong className="text-cyan-400/80">${item.labourCost}</strong></span>
                              <span>MATERIAL: <strong className="text-cyan-400/80">${item.materialCost}</strong></span>
                            </div>
                          ) : null}
                          <div className="text-cyan-300 font-bold text-xs">
                            ${(item.labourCost + item.materialCost) * item.qty}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary Block */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 bg-slate-900/40 p-4 border border-cyan-500/10 mt-2">
                  <div className="max-w-md text-[10px] text-slate-500 leading-relaxed uppercase">
                    <strong className="text-cyan-500/80 font-bold">TERMS & CONDITIONS:</strong>
                    <p className="mt-1">ESTIMATES ARE VALID FOR 60 DAYS. PRICING INCLUDES ALL APPLICABLE NFPA COMPLIANCE DOCUMENTATION UPDATES AND LABOUR RETESTING FEES.</p>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[200px] text-right font-mono">
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>SUBTOTAL:</span>
                      <span className="text-cyan-400/80">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>EST. TAX (12%):</span>
                      <span className="text-cyan-400/80">${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-cyan-500/10 my-1" />
                    <div className="flex justify-between text-sm font-bold text-cyan-300">
                      <span>TOTAL WORK ESTIMATE:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex justify-end gap-2.5 border-t border-cyan-500/10 pt-4">
                  {activeRole === "fire_company" && quote.status === "draft" && (
                    <Button 
                      onClick={() => handleSend(quote.id, quote.quoteNumber)}
                      className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 rounded-none text-xs font-bold gap-1.5 h-9"
                    >
                      <Send className="w-4 h-4" /> TRANSMIT_TO_CLIENT
                    </Button>
                  )}

                  {activeRole === "property_manager" && quote.status === "sent" && (
                    <Button 
                      onClick={() => handleApprove(quote.id, quote.quoteNumber)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-none text-xs font-bold gap-1.5 h-9 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <FileCheck className="w-4 h-4" /> SIGN_&_APPROVE_REPAIRS
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { CompanyProfile, SaaSUser, MOCK_COMPANY_PROFILE, MOCK_SAAS_USERS, MOCK_ROLES_PERMISSIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Building, Mail, Phone, Globe, MapPin, DollarSign, FileText, Shield, 
  UserPlus, Edit2, ShieldAlert, CheckCircle2, Sliders, Palette, Users
} from "lucide-react";

export default function CompanyAdminView() {
  const [profile, setProfile] = useState<CompanyProfile>(MOCK_COMPANY_PROFILE);
  const [users, setUsers] = useState<SaaSUser[]>(MOCK_SAAS_USERS);
  const [activeSubTab, setActivePage] = useState<"profile" | "users">("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editHourlyRate, setEditHourlyRate] = useState(profile.defaultHourlyRate);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editName,
      email: editEmail,
      phone: editPhone,
      defaultHourlyRate: Number(editHourlyRate)
    }));
    setIsEditing(false);
    toast.success("PROFILE UPDATED", {
      description: "Company credentials and hourly rates successfully synchronized."
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "Disabled" ? "Active" : "Disabled";
        toast.info("USER STATUS MODIFIED", {
          description: `User ${u.name} set to ${nextStatus.toUpperCase()}`
        });
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050814] font-mono text-xs text-cyan-400 p-6 overflow-y-auto">
      
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-6">
        <div>
          <h2 className="text-lg font-bold tracking-widest text-cyan-300 uppercase flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>COMPANY_ADMIN_CONSOLE</span>
          </h2>
          <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mt-1 block">
            Configure Fire Company credentials, hourly billing rates, and certified technician rosters.
          </span>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setActivePage("profile")}
            className={`rounded-none border text-xs px-4 ${
              activeSubTab === "profile" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-cyan-500/10 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5"
            }`}
          >
            <Building className="w-4 h-4 mr-2" />
            <span>COMPANY_PROFILE</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActivePage("users")}
            className={`rounded-none border text-xs px-4 ${
              activeSubTab === "users" 
                ? "bg-cyan-500/10 border-cyan-500 text-cyan-300" 
                : "border-cyan-500/10 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/5"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            <span>USERS_&_ROLES</span>
          </Button>
        </div>
      </div>

      {activeSubTab === "profile" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left/Center: Profile Config */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-950/80 border-cyan-500/20 rounded-none hud-corners">
              <CardHeader className="border-b border-cyan-500/10">
                <CardTitle className="text-sm font-bold text-cyan-300 uppercase flex items-center justify-between">
                  <span>Eagle Eye Fire & Life Safety Profile</span>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="h-7 rounded-none border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-[10px]"
                    >
                      <Edit2 className="w-3 h-3 mr-1.5" />
                      <span>EDIT_PROFILE</span>
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="text-slate-500 text-[10px] uppercase font-bold">
                  Official corporate registry, business license, and operations settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold">Company Name</label>
                        <Input 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold">Primary Email</label>
                        <Input 
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold">Phone Number</label>
                        <Input 
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 uppercase font-bold">Hourly Labour Rate ($/hr)</label>
                        <Input 
                          type="number"
                          value={editHourlyRate}
                          onChange={(e) => setEditHourlyRate(Number(e.target.value))}
                          className="bg-slate-900 border-cyan-500/20 text-cyan-400 rounded-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setIsEditing(false)}
                        className="rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400"
                      >
                        CANCEL
                      </Button>
                      <Button 
                        type="submit" 
                        className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900"
                      >
                        SAVE_CHANGES
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">CORPORATE_NAME</span>
                            <span className="text-cyan-300 font-bold uppercase">{profile.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">ADDRESS</span>
                            <span className="text-cyan-300 font-bold uppercase">{profile.address}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">PHONE</span>
                            <span className="text-cyan-300 font-bold">{profile.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">EMAIL</span>
                            <span className="text-cyan-300 font-bold">{profile.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">WEBSITE</span>
                            <span className="text-cyan-300 font-bold">{profile.website}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">DEFAULT_LABOUR_RATE</span>
                            <span className="text-cyan-300 font-bold">${profile.defaultHourlyRate} / HOUR</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-cyan-500" />
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold block">BUSINESS_LICENSE</span>
                            <span className="text-cyan-300 font-bold uppercase">{profile.businessNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-cyan-500/10" />

                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold block mb-2">SERVICE_AREAS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.serviceAreas.map((area, idx) => (
                          <Badge key={idx} className="bg-slate-900 border border-cyan-500/20 text-cyan-400 rounded-none text-[9px] uppercase font-bold">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document footers & terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-slate-950/80 border-cyan-500/20 rounded-none hud-corners">
                <CardHeader className="border-b border-cyan-500/10 py-3">
                  <CardTitle className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-500" />
                    <span>Report Footer Disclaimer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">{profile.defaultReportFooter}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-950/80 border-cyan-500/20 rounded-none hud-corners">
                <CardHeader className="border-b border-cyan-500/10 py-3">
                  <CardTitle className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-500" />
                    <span>Default Quote Terms</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">{profile.defaultQuoteTerms}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar: Branding Config */}
          <div className="space-y-6">
            <Card className="bg-slate-950/80 border-cyan-500/20 rounded-none hud-corners">
              <CardHeader className="border-b border-cyan-500/10">
                <CardTitle className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-500" />
                  <span>Report Branding</span>
                </CardTitle>
                <CardDescription className="text-slate-500 text-[10px] uppercase font-bold">
                  SaaS PDF output logo and visual layout parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between border border-cyan-500/10 p-3 bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-950 border border-cyan-500 flex items-center justify-between p-1">
                      <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-300 uppercase block">LOGO_PLACEHOLDER</span>
                      <span className="text-[8px] text-slate-500 uppercase block">eagle_eye_shield.png</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => toast.success("LOGO UPLOADED", { description: "Eagle Eye corporate logo updated." })}
                    className="h-7 rounded-none border border-cyan-500/20 text-cyan-400 text-[9px] uppercase font-bold"
                  >
                    UPLOAD
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 uppercase font-bold">PRIMARY_COLOR</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">#06B6D4</span>
                      <div className="w-4 h-4 bg-cyan-500 border border-cyan-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 uppercase font-bold">SECONDARY_COLOR</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">#0F172A</span>
                      <div className="w-4 h-4 bg-slate-900 border border-slate-700" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 uppercase font-bold">TYPOGRAPHY_FAMILY</span>
                    <span className="font-bold text-cyan-300">JetBrains Mono</span>
                  </div>
                </div>

                <Separator className="bg-cyan-500/10" />

                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={() => toast.success("GENERATING PREVIEW", { description: "Opening mock report layout with Eagle Eye branding..." })}
                    className="w-full rounded-none bg-cyan-950 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900 text-[10px] font-bold"
                  >
                    PREVIEW_REPORT_BRANDING
                  </Button>
                  <Button 
                    onClick={() => toast.success("GENERATING PREVIEW", { description: "Opening mock quote layout with Eagle Eye branding..." })}
                    className="w-full rounded-none bg-slate-900 border border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/5 text-[10px] font-bold"
                  >
                    PREVIEW_QUOTE_BRANDING
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* User management page */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-cyan-300 uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-500" />
              <span>Eagle Eye Roster & Portals</span>
            </h3>
            <Button 
              onClick={() => toast.success("INVITE DISPATCHED", { description: "Opening SaaS portal invite form..." })}
              className="rounded-none bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 font-bold"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span>INVITE_NEW_USER</span>
            </Button>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card 
                key={user.id} 
                className={`bg-slate-950/80 border rounded-none hud-corners flex flex-col justify-between ${
                  user.status === "Disabled" ? "border-rose-500/20 opacity-50" : "border-cyan-500/15"
                }`}
              >
                <CardHeader className="pb-3 border-b border-cyan-500/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm font-bold text-cyan-300 uppercase">{user.name}</CardTitle>
                      <CardDescription className="text-[10px] text-slate-500 uppercase font-bold mt-1">
                        {user.role} {user.company ? `// ${user.company}` : ""}
                      </CardDescription>
                    </div>
                    <Badge className={`rounded-none text-[8px] uppercase font-bold ${
                      user.status === "Active" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" :
                      user.status === "External User" ? "bg-blue-950/40 text-blue-400 border-blue-500/30" :
                      "bg-rose-950/40 text-rose-400 border-rose-500/30"
                    }`}>
                      {user.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-1">
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 uppercase font-bold">EMAIL:</span>
                      <span className="text-cyan-400">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 uppercase font-bold">PHONE:</span>
                        <span className="text-cyan-400">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {user.certifications && user.certifications.length > 0 && (
                    <div>
                      <span className="text-[8px] text-slate-500 uppercase font-bold block mb-1.5">CREDENTIALS_&_CERTIFICATIONS</span>
                      <div className="flex flex-wrap gap-1">
                        {user.certifications.map((cert, idx) => (
                          <Badge key={idx} className="bg-slate-900 border border-cyan-500/10 text-cyan-400/90 rounded-none text-[8px] uppercase">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <Separator className="bg-cyan-500/5" />
                <div className="p-3 bg-slate-900/10 flex justify-end gap-1.5">
                  <Button 
                    variant="ghost"
                    onClick={() => toast.success("EDIT PERMISSIONS", { description: `Modifying permissions for ${user.name}` })}
                    className="h-7 text-[9px] rounded-none border border-cyan-500/10 text-slate-500 hover:text-cyan-400 font-bold"
                  >
                    PERMISSIONS
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`h-7 text-[9px] rounded-none border font-bold ${
                      user.status === "Disabled" 
                        ? "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10" 
                        : "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                    }`}
                  >
                    {user.status === "Disabled" ? "ENABLE" : "DISABLE"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Permissions Registry Summary */}
          <Card className="bg-slate-950/80 border-cyan-500/20 rounded-none hud-corners">
            <CardHeader className="border-b border-cyan-500/10">
              <CardTitle className="text-xs font-bold text-cyan-300 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-500" />
                <span>Role Permissions Matrix</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {MOCK_ROLES_PERMISSIONS.map((role, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/5 pb-2 last:border-0 last:pb-0">
                    <span className="font-bold text-cyan-300 uppercase min-w-[180px]">{role.name}</span>
                    <p className="text-slate-400 text-[10px] flex-1 leading-normal">{role.permissions[0]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

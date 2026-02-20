// src/components/MemberDetailsModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Calendar, CreditCard, MapPin, Phone, Mail, User, UserCheck } from "lucide-react";
import { formatDate, getFullImageUrl } from "@/components/utils/helper";
import { Member } from "@/type/memberTypes";

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

const MemberDetailsModal = ({ isOpen, onClose, member }: MemberDetailsModalProps) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
    
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-shrink-0">
              {member?.memberPhoto ? (
                <img
                  src={getFullImageUrl(member.memberPhoto)}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                  <User className="h-10 w-10 text-slate-300" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{member.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {member?.renawals[0]?.plan?.planName || "Unknown Plan"}
                </Badge>
                <Badge 
                  className={
                    member.membershipStatus === "active" 
                      ? "bg-green-500/20 text-green-400" 
                      : member.membershipStatus === "expired" 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {member.membershipStatus}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {member.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Phone</p>
                <p className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {member.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Gender</p>
                <p className="text-white capitalize">{member.gender}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Date of Birth</p>
                <p className="text-white">{formatDate(member.dateOfBirth)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-slate-400">Address</p>
                <p className="text-white flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  {member.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Membership Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Membership Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Membership Type</p>
                <p className="text-white">{member?.renawals[0]?.plan?.planName || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <p className="text-white capitalize">{member.membershipStatus}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Start Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {formatDate(member.membershipStartDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">End Date</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {formatDate(member.membershipEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Days Remaining</p>
                <p className="text-white">
                  <Badge 
                    className={
                      member.membershipExpireInDays <= 30 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-green-500/20 text-green-400"
                    }
                  >
                    {member.membershipExpireInDays} days
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsModal;
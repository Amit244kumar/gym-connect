import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Member } from "@/type/memberTypes";
import { formatDate, getFullImageUrl } from "../utils/helper";
import { getDaysBadge, getPlanBadge, getStatusBadge } from "@/pages/owner/Members";


const RecentMembersTable = ({ members }) => {
console.log("recentMembers",members);
 if (members.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center text-slate-400">
            No recent members found
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="overflow-x-auto">
     <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300"></TableHead>
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Contact</TableHead>
                <TableHead className="text-slate-300">Plan</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Day Left</TableHead>
                <TableHead className="text-slate-300">Membership Period</TableHead>
                {/* <TableHead className="text-slate-300 text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.length > 0 ? (
                members.map((member: Member) => (
                  <TableRow key={member.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell>
                      {member?.memberPhoto ? (
                        <img
                          src={getFullImageUrl(member.memberPhoto)}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                          // crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{member.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-300">
                        <div>{member.email}</div>
                        <div className="text-slate-400">{member.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(member?.OwnerMembershipPlan?.planName)}</TableCell>
                    <TableCell>{getStatusBadge(member.membershipStatus)}</TableCell>
                    <TableCell>{getDaysBadge(member.membershipExpireInDays)}</TableCell>
                    <TableCell className="text-slate-300">
                      <div>{formatDate(member.membershipStartDate)}</div>
                      <div className="text-slate-400">to {formatDate(member.membershipEndDate)}</div>
                    </TableCell>
                    {/* <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem
                                onClick={() => handleViewMember(member)}
                                className="text-white hover:bg-slate-700 cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditMember(member)}
                                className="text-white hover:bg-slate-700 cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteMember(member)}
                                className="text-white hover:bg-slate-700 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentMembersTable;
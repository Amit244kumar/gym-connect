// src/components/dashboard/RecentMembersTable.tsx
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: number;
  name: string;
  plan: string;
  joinDate: string;
  status: string;
}

interface RecentMembersTableProps {
  members: Member[];
}

const RecentMembersTable = ({ members }: RecentMembersTableProps) => {
  const [sortConfig, setSortConfig] = useState<{key: keyof Member; direction: 'asc' | 'desc'} | null>(null);

  const requestSort = (key: keyof Member) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedMembers = [...members];
  if (sortConfig !== null) {
    sortedMembers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'expired':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            <th 
              className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
              onClick={() => requestSort('name')}
            >
              Name
            </th>
            <th 
              className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
              onClick={() => requestSort('plan')}
            >
              Plan
            </th>
            <th 
              className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
              onClick={() => requestSort('joinDate')}
            >
              Join Date
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="py-3 px-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {sortedMembers.map((member) => (
            <tr key={member.id} className="hover:bg-slate-700/30">
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-white">{member.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{member.plan}</div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{member.joinDate}</div>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <Badge variant={getBadgeVariant(member.status)}>
                  {member.status}
                </Badge>
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                      Edit Member
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                      Renew Membership
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentMembersTable;
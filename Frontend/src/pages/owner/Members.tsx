// src/pages/MembersPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Calendar,
  CreditCard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  joinDate: string;
  status: "active" | "expired" | "cancelled";
  lastVisit: string;
}

interface MembersPageProps {
  mode?: "list" | "add" | "view" | "edit";
}

const Members = ({ mode = "list" }: MembersPageProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockMembers: Member[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-1234",
        plan: "Premium",
        joinDate: "2023-01-15",
        status: "active",
        lastVisit: "2023-06-10",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-5678",
        plan: "Basic",
        joinDate: "2023-02-20",
        status: "active",
        lastVisit: "2023-06-09",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "555-9012",
        plan: "Standard",
        joinDate: "2023-03-10",
        status: "expired",
        lastVisit: "2023-05-20",
      },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "555-3456",
        plan: "Premium",
        joinDate: "2023-04-05",
        status: "active",
        lastVisit: "2023-06-11",
      },
      {
        id: 5,
        name: "David Brown",
        email: "david@example.com",
        phone: "555-7890",
        plan: "Basic",
        joinDate: "2023-05-15",
        status: "active",
        lastVisit: "2023-06-08",
      },
    ];
    setMembers(mockMembers);
    setFilteredMembers(mockMembers);
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    // In a real app, navigate to view page
    toast.info(`Viewing ${member.name}`);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    // In a real app, navigate to edit page
    toast.info(`Editing ${member.name}`);
  };

  const handleDeleteMember = (member: Member) => {
    // In a real app, show confirmation dialog and delete
    toast.success(`${member.name} has been deleted`);
    setMembers(members.filter((m) => m.id !== member.id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-500/20 text-red-400">Expired</Badge>;
      case "cancelled":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Basic":
        return <Badge className="bg-blue-500/20 text-blue-400">Basic</Badge>;
      case "Standard":
        return <Badge className="bg-purple-500/20 text-purple-400">Standard</Badge>;
      case "Premium":
        return <Badge className="bg-pink-500/20 text-pink-400">Premium</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Members</h1>
            <p className="text-slate-400">Manage your gym members and their subscriptions</p>
          </div>
          <Button onClick={handleAddMember} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{members.length}</div>
              <p className="text-xs text-slate-400">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Active Members
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {members.filter(m => m.status === 'active').length}
              </div>
              <p className="text-xs text-slate-400">85% of total</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Premium Members
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {members.filter(m => m.plan === 'Premium').length}
              </div>
              <p className="text-xs text-slate-400">25% of total</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Expired Memberships
              </CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {members.filter(m => m.status === 'expired').length}
              </div>
              <p className="text-xs text-slate-400">Need renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white pl-10"
                />
              </div>
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">All Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Contact</TableHead>
                  <TableHead className="text-slate-300">Plan</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Last Visit</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell>
                      <div className="font-medium text-white">{member.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-300">
                        <div>{member.email}</div>
                        <div className="text-slate-400">{member.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(member.plan)}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell className="text-slate-300">{member.lastVisit}</TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
};

export default Members;
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
  ChevronLeft,
  ChevronRight,
  User,
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
import { useSelector,useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { getAllMembersFeth } from "@/store/memberAuth/memberAuthThunk";
import {  Member, MemberQueryParams } from "@/type/memberTypes";
import { formatDate, getFullImageUrl } from "@/components/utils/helper";
import Shimmer from "@/components/ui/Shimmer";




interface FilterOptions {
  membershipType?: string;
  membershipStatus?: string;
  gender?: string;
}

const Members = () => {
  const {isLoading,memberData:members,isAdded}=useSelector((state:RootState)=>state.memberAuth)
  console.log("memberData",members)
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch members from API
  const fetchMembers = async (page: number, limit: number, search: string, filters: FilterOptions) => {
  try {
    // Create a MemberQueryParams object instead of URLSearchParams
    const params: MemberQueryParams = {
      page,
      limit,
    };
    
    if (search) {
      params.search = search;
    }
    
    if (filters.membershipType) {
      params.membershipType = filters.membershipType;
    }
    
    if (filters.membershipStatus) {
      params.membershipStatus = filters.membershipStatus;
    }
    
    if (filters.gender) {
      params.gender = filters.gender;
    }
    
    console.log("params", params);
    
    // Call the API with the correct parameter type
    const res =  await dispatch(getAllMembersFeth(params)).unwrap();
    console.log("rddes", res);
    
    if (res.success) {
      setTotalMembers(res?.data?.pagination?.totalItems);
      setCurrentPage(res?.data?.pagination?.currentPage);
      setTotalPages(res?.data.pagination?.totalPages);
    }
  } catch (error) {
    console.error('Error fetching members:', error);
    toast.error('Failed to load members');
  }
};

  useEffect(() => {
    fetchMembers(currentPage, membersPerPage, searchTerm, filters);
  }, [currentPage, membersPerPage, searchTerm, filters,isAdded]);

  const handleViewMember = (member: Member) => {
    // In a real app, navigate to view page
    toast.info(`Viewing ${member.name}`);
  };

  const handleEditMember = (member: Member) => {
    // In a real app, navigate to edit page
    toast.info(`Editing ${member.name}`);
  };

  const handleDeleteMember = async (member: Member) => {
    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete member');
      }
      
      toast.success(`${member.name} has been deleted`);
      // Refresh the members list
      fetchMembers(currentPage, membersPerPage, searchTerm, filters);
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
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
      case "basic":
        return <Badge className="bg-blue-500/20 text-blue-400">Basic</Badge>;
      case "standard":
        return <Badge className="bg-purple-500/20 text-purple-400">Standard</Badge>;
      case "premium":
        return <Badge className="bg-pink-500/20 text-pink-400">Premium</Badge>;
      case "annual":
        return <Badge className="bg-indigo-500/20 text-indigo-400">Annual</Badge>;
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
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {isLoading?<Shimmer width="120px" height="16px" />:"Total Members"}
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
           {isLoading?
            <Shimmer width="120px" height="16px" />
            :
            <> 
              <div className="text-2xl font-bold text-white">{totalMembers}</div>
              <p className="text-xs text-slate-400">+12% from last month</p>
            </>
           }
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
              {/* {members?.filter(m => m.membershipStatus === 'active').length} */}
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
              {/* {members.filter(m => m.membershipType === 'premium').length} */}
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
              {/* {members.filter(m => m.membershipStatus === 'expired').length} */}
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
                placeholder="Search members by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-slate-700/50 border-slate-600 text-white pl-10"
              />
            </div>
            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button  className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 w-56">
                <div className="p-2">
                  <div className="mb-3">
                    <label className="text-sm text-slate-300 mb-1 block">Membership Type</label>
                    <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded text-white p-1 text-sm"
                      value={filters.membershipType || 'all'}
                      onChange={(e) => handleFilterChange('membershipType', e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="text-sm text-slate-300 mb-1 block">Status</label>
                    <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded text-white p-1 text-sm"
                      value={filters.membershipStatus || 'all'}
                      onChange={(e) => handleFilterChange('membershipStatus', e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="text-sm text-slate-300 mb-1 block">Gender</label>
                    <select 
                      className="w-full bg-slate-700 border border-slate-600 rounded text-white p-1 text-sm"
                      value={filters.gender || 'all'}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                    >
                      <option value="all">All Genders</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Button 
                    onClick={clearFilters} 
                    size="sm"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300"></TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Contact</TableHead>
                    <TableHead className="text-slate-300">Plan</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300">Membership Period</TableHead>
                    <TableHead className="text-slate-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.length > 0 ? (
                    members.map((member:Member) => (
                      <TableRow key={member.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell>
                          {member?.memberPhoto ? (
                            <img
                              src={getFullImageUrl(member.memberPhoto)}
                              alt="Profile"
                              className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                              crossOrigin="anonymous"
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
                        <TableCell>{getPlanBadge(member.membershipType)}</TableCell>
                        <TableCell>{getStatusBadge(member.membershipStatus)}</TableCell>
                        <TableCell className="text-slate-300">
                          <div>{formatDate(member.membershipStartDate)}</div>
                          <div className="text-slate-400">to {formatDate(member.membershipEndDate)}</div>
                        </TableCell>
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
              
              {/* Pagination */}
              {totalPages  && (
                <div className="flex items-center justify-between  flex-wrap   mt-4">
                  <div className="text-sm text-slate-300">
                    Showing {(currentPage - 1) * membersPerPage + 1} to{" "}
                    {Math.min(currentPage * membersPerPage, totalMembers)} of {totalMembers} members
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-slate-600 "
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={`
                              
                              ${currentPage === pageNum
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "border-slate-600 "
                              }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
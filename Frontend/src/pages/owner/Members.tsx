// src/pages/MembersPage.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
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
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { getAllMembersFeth } from "@/store/memberAuth/memberAuthThunk";
import { getMembershipPlansfeth } from "@/store/ownerMembershipPlan/ownerMembershipPlanThunk";
import { Member, MemberQueryParams } from "@/type/memberTypes";
import { formatDate, getFullImageUrl } from "@/components/utils/helper";
import Shimmer from "@/components/ui/Shimmer";
import MemberDetailsModal from "@/components/modals/MemberDetailsModal";

// Helper functions for badges
export const getStatusBadge = (status: string) => {
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

export const getPlanBadge = (plan: string) => {
  switch (plan?.toLowerCase()) {
    case "basic":
      return <Badge className="bg-blue-500/20 text-blue-400">Basic</Badge>;
    case "standard":
      return <Badge className="bg-purple-500/20 text-purple-400">Standard</Badge>;
    case "premium":
      return <Badge className="bg-pink-500/20 text-pink-400">Premium</Badge>;
    case "annual":
      return <Badge className="bg-indigo-500/20 text-indigo-400">Annual</Badge>;
    default:
      return <Badge className="bg-gray-500/20 text-gray-400">{plan || "Unknown"}</Badge>;
  }
};

export const getDaysBadge = (daysLeft: number) => {
  if (daysLeft <= 30) {
    return <Badge className="bg-red-500/20 text-red-400">{daysLeft}</Badge>;
  } else {
    return <Badge className="bg-green-500/20 text-green-400">{daysLeft}</Badge>;
  }
};

// Helper to truncate text
const truncateText = (text: string, maxLength: number = 30) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

interface FilterOptions {
  membershipType?: string;
  membershipStatus?: string;
  gender?: string;
}

// Define available columns
const AVAILABLE_COLUMNS = [
  { id: "photo", label: "Photo", mandatory: true },
  { id: "name", label: "Name", mandatory: true },
  { id: "contact", label: "Contact", mandatory: true },
  { id: "plan", label: "Plan", mandatory: true },
  { id: "status", label: "Status", mandatory: true },
  { id: "daysLeft", label: "Days Left", mandatory: true },
  { id: "membershipPeriod", label: "Membership Period", mandatory: false },
  { id: "address", label: "Address", mandatory: false },
  { id: "gender", label: "Gender", mandatory: false },
  { id: "dateOfBirth", label: "Date of Birth", mandatory: false },
  { id: "actions", label: "Actions", mandatory: true },
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Members = () => {
  const { isLoading, memberData: members, isAdded, totalMembers: totalMember } = useSelector((state: RootState) => state.memberAuth);
  const { plans, isLoading: plansLoading } = useSelector((state: RootState) => state.ownerMembershipPlan);
  
  const dispatch = useDispatch<AppDispatch>();
  
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    AVAILABLE_COLUMNS
      .filter(col => col.mandatory)
      .map(col => col.id)
  );
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [membersPerPage, setMembersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // NEW: State for pagination loading
  const [isPaginating, setIsPaginating] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchInputValue, 500);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for member details modal
  const [isMemberDetailsOpen, setIsMemberDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Memoized stats calculations
  const stats = useMemo(() => {
    if (!members || members.length === 0) {
      return {
        total: 0,
        active: 0,
        premium: 0,
        expired: 0
      };
    }
    
    return {
      total: totalMembers,
      active: members.filter(m => m.membershipStatus === 'active').length,
      premium: members.filter(m => m.membershipType === 'premium').length,
      expired: members.filter(m => m.membershipStatus === 'expired').length
    };
  }, [members, totalMembers]);

  // Fetch membership plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        await dispatch(getMembershipPlansfeth()).unwrap();
      } catch (error) {
        console.error("Failed to fetch membership plans:", error);
        toast.error('Failed to load membership plans');
      }
    };
    
    fetchPlans();
  }, [dispatch]);

  // Fetch members from API with useCallback
  const fetchMembers = useCallback(async (page: number, limit: number, search: string, filters: FilterOptions, isPageChange: boolean = false) => {
    try {
      // Set the appropriate loading state
      if (isPageChange) {
        setIsPaginating(true);
      }

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
      
      const res = await dispatch(getAllMembersFeth(params)).unwrap();
      
      if (res.success) {
        setTotalMembers(res?.data?.pagination?.totalItems);
        setCurrentPage(res?.data?.pagination?.currentPage);
        setTotalPages(res?.data.pagination?.totalPages);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      // Reset the appropriate loading state
      if (isPageChange) {
        setIsPaginating(false);
      }
      if (initialLoad) {
        setInitialLoad(false);
      }
    }
  }, [dispatch, initialLoad]);

  // Effect for debounced search and filter changes
  useEffect(() => {
    if (!initialLoad) {
      setIsSearching(true);
      fetchMembers(1, membersPerPage, debouncedSearchTerm, filters).finally(() => {
        setIsSearching(false);
      });
    }
  }, [debouncedSearchTerm, filters, fetchMembers, initialLoad, membersPerPage]);

  // Effect for page changes
  useEffect(() => {
    if (!initialLoad) {
      // Pass true to indicate this is a page change
      fetchMembers(currentPage, membersPerPage, debouncedSearchTerm, filters, true);
    }
  }, [currentPage, fetchMembers, initialLoad, membersPerPage, debouncedSearchTerm, filters]);

  // Initial load effect
  useEffect(() => {
    if (initialLoad) {
      fetchMembers(currentPage, membersPerPage, debouncedSearchTerm, filters);
    }
  }, [isAdded, fetchMembers, initialLoad]);

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsMemberDetailsOpen(true);
  };

  const handleEditMember = (member: Member) => {
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
      fetchMembers(currentPage, membersPerPage, debouncedSearchTerm, filters);
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    if (isVisible) {
      setVisibleColumns(prev => [...prev, columnId]);
    } else {
      setVisibleColumns(prev => prev.filter(id => id !== columnId));
    }
  };

  const resetColumnVisibility = () => {
    setVisibleColumns(
      AVAILABLE_COLUMNS
        .filter(col => col.mandatory)
        .map(col => col.id)
    );
  };
  // console.log("Visible Columns:", member[0]??.renawals[0]?.plan?.planName));
  const isColumnVisible = (columnId: string) => visibleColumns.includes(columnId);

  // Initial page loading
  if (initialLoad && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400">Loading members...</p>
      </div>
    );
  }

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
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMember}</div>
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
            <div className="text-2xl font-bold text-white">{stats.active}</div>
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
            <div className="text-2xl font-bold text-white">{stats.premium}</div>
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
            <div className="text-2xl font-bold text-white">{stats.expired}</div>
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
                value={searchInputValue}
                onChange={handleSearchChange}
                className="bg-slate-700/50 border-slate-600 text-white pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                </div>
              )}
            </div>
            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button className="border-slate-600 text-slate-300 hover:bg-slate-700/50">
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
                      disabled={plansLoading}
                    >
                      <option value="all">All Types</option>
                      {plansLoading ? (
                        <option value="loading" disabled>Loading plans...</option>
                      ) : plans && plans.length > 0 ? (
                        plans.map((plan) => (
                          <option key={plan.id} value={plan.planName.toLowerCase()}>
                            {plan.planName}
                          </option>
                        ))
                      ) : (
                        <option value="none" disabled>No plans available</option>
                      )}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">All Members</CardTitle>
          <DropdownMenu open={isColumnSelectorOpen} onOpenChange={setIsColumnSelectorOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="border-slate-600 hover:bg-slate-700/50">
                <Settings className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 w-56">
              <div className="p-2 max-h-80 overflow-y-auto">
                {AVAILABLE_COLUMNS.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2 py-1">
                    <DropdownMenuCheckboxItem
                      checked={isColumnVisible(column.id)}
                      onCheckedChange={(checked) => handleColumnVisibilityChange(column.id, checked as boolean)}
                      disabled={column.mandatory}
                      className="text-white"
                    >
                      {column.label}
                      {column.mandatory && <span className="ml-1 text-xs text-orange-400">(required)</span>}
                    </DropdownMenuCheckboxItem>
                  </div>
                ))}
                <DropdownMenuSeparator />
                <Button
                  onClick={resetColumnVisibility}
                  size="sm"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 mt-2"
                >
                  Reset to Default
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {/* Show loader when paginating */}
          {isPaginating ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="ml-2 text-slate-400">Loading member...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    {AVAILABLE_COLUMNS.map((column) => (
                      isColumnVisible(column.id) && (
                        <TableHead key={column.id} className="text-slate-300">
                          {column.label}
                        </TableHead>
                      )
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members?.length > 0 ? (
                    members.map((member: Member) => (
                      
                      <TableRow key={member.id} className="border-slate-700 hover:bg-slate-700/50">
                        {/* Photo Column */}
                        {isColumnVisible('photo') && (
                          <TableCell>
                            {member?.memberPhoto ? (
                              <img
                                src={getFullImageUrl(member.memberPhoto)}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                                <User className="h-5 w-5 text-slate-300" />
                              </div>
                            )}
                          </TableCell>
                        )}
                        
                        {/* Name Column */}
                        {isColumnVisible('name') && (
                          <TableCell>
                            <div className="font-medium text-white">{member.name}</div>
                          </TableCell>
                        )}
                        
                        {/* Contact Column */}
                        {isColumnVisible('contact') && (
                          <TableCell>
                            <div className="text-sm text-slate-300">
                              <div>{member.email}</div>
                              <div className="text-slate-400">{member.phone}</div>
                            </div>
                          </TableCell>
                        )}
                        {console.log("Member Plan:", member)}
                        {/* Plan Column */} 
                        {isColumnVisible('plan') && (
                          <TableCell>{getPlanBadge(member?.renewals[0]?.plan?.planName)}</TableCell>
                        )}
                        
                        {/* Status Column */}
                        {isColumnVisible('status') && (
                          <TableCell>{getStatusBadge(member.membershipStatus)}</TableCell>
                        )}
                        
                        {/* Days Left Column */}
                        {isColumnVisible('daysLeft') && (
                          <TableCell>{getDaysBadge(member.membershipExpireInDays)}</TableCell>
                        )}
                        
                        {/* Membership Period Column */}
                        {isColumnVisible('membershipPeriod') && (
                          <TableCell className="text-slate-300">
                            <div>{formatDate(member.membershipStartDate)}</div>
                            <div className="text-slate-400">to {formatDate(member.membershipEndDate)}</div>
                          </TableCell>
                        )}
                        
                        {/* Address Column */}
                        {isColumnVisible('address') && (
                          <TableCell className="text-slate-300">
                            <div title={member.address}>
                              {truncateText(member.address)}
                            </div>
                          </TableCell>
                        )}
                        
                        {/* Gender Column */}
                        {isColumnVisible('gender') && (
                          <TableCell className="text-slate-300 capitalize">
                            {member.gender}
                          </TableCell>
                        )}
                        
                        {/* Date of Birth Column */}
                        {isColumnVisible('dateOfBirth') && (
                          <TableCell className="text-slate-300">
                            {formatDate(member.dateOfBirth)}
                          </TableCell>
                        )}
                        
                        {/* Actions Column */}
                        {isColumnVisible('actions') && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                // variant="ghost"
                                size="sm"
                                onClick={() => handleViewMember(member)}
                                className="h-8 w-8 p-0 "
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMember(member)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMember(member)}
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button> */}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-slate-400">
                        No members found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between flex-wrap mt-4">
                  <div className="text-sm text-slate-300">
                    Showing {(currentPage - 1) * membersPerPage + 1} to{" "}
                    {Math.min(currentPage * membersPerPage, totalMembers)} of {totalMembers} members
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isPaginating} // Disable during pagination
                      className="border-slate-600"
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
                            disabled={isPaginating} // Disable all page buttons during pagination
                            className={`
                              ${currentPage === pageNum
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "border-slate-600"
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
                      disabled={currentPage === totalPages || isPaginating} // Disable during pagination
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
      
      {/* Member Details Modal */}
      <MemberDetailsModal
        isOpen={isMemberDetailsOpen}
        onClose={() => setIsMemberDetailsOpen(false)}
        member={selectedMember}
      />
    </div>
  );
};

export default Members;
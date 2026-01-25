// src/pages/PlansPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Users,
  Clock,
  Check,
  Plus,
  Edit,
  Trash2,
  Star,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import AddPlanModal from "@/components/modals/AddPlanModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/index";
import { deleteMembershipPlanfeth, disableMembershipPlanfeth, getMembershipPlansfeth } from "@/store/ownerMembershipPlan/ownerMembershipPlanThunk";
import { Plan } from "@/type/ownerMemberShipPlan";
// Updated interface to match your API respon

const MembershipPlan = () => {
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [editPlan,setEditPlan] = useState<Plan>(null);
  const [isPlanDeleted, setIsPlanDeleted] = useState(false);
  const [isPlanStatusToggled, setIsPlanStatusToggled] = useState(false);
  const { plans, isLoading ,isCreated} = useSelector((state: RootState) => state.ownerMembershipPlan);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        await dispatch(getMembershipPlansfeth()).unwrap();
      } catch (error) {
        toast.error("Failed to fetch plans");
      }
    };
    fetchPlans();
  }, [dispatch,isCreated]);

  console.log('plans', plans);

  const handleAddPlan = () => {
    setEditPlan(null);
    setIsAddPlanModalOpen(true);
  };

  const handleEditPlan = (plan: Plan,isActive) => {
    console.log('Edit', plan);
    if(isActive === false){
      toast.error("Cannot edit an inactive plan. Please enable the plan first.");
      return;
    }
    setEditPlan(plan);
    setIsAddPlanModalOpen(true);
    
  };

  const handleDeletePlan = async (planId: number) => {
    try {
      setIsPlanDeleted(true);
      await dispatch(deleteMembershipPlanfeth(planId)).unwrap();

    }catch(error){
      console.error('Error deleting plan:', error); 
    }finally{
        setIsPlanDeleted(false);
    }
  };

  const handleToggleStatus = async(planId: number) => {
    // toast.success(`${plan.planName} plan has been ${plan.isActive ? 'deactivated' : 'activated'}`);
    try {
      setIsPlanStatusToggled(true);
      await dispatch(disableMembershipPlanfeth(planId)).unwrap();
    }catch(error){
      console.error('Error toggling plan status:', error);
    }finally{
        setIsPlanStatusToggled(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
            <p className="text-slate-400">Manage your gym membership plans and pricing</p>
          </div>
          <Button onClick={handleAddPlan} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Plans
              </CardTitle>
              <CreditCard className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{plans?.length || 0}</div>
              <p className="text-xs text-slate-400">Active memberships</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Most Popular
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {plans?.find(p => p.isPopular)?.planName || "None"}
              </div>
              <p className="text-xs text-slate-400">Highest subscription</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Avg. Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white flex">
                <IndianRupee className="w-[20px] mt-[5px]"/>
                <span>4000</span>
              </div>
              <p className="text-xs text-slate-400">Per month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Conversion Rate
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24%</div>
              <p className="text-xs text-slate-400">Trial to paid</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="plans" className="text-slate-300 hover:text-white">Membership Plans</TabsTrigger>
            <TabsTrigger value="analytics" className="text-slate-300 hover:text-white">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans?.map((plan) => (
                <Card key={plan.id} className={`bg-slate-800/50 border-slate-700 relative ${plan.isPopular ? 'ring-2 ring-orange-500' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white flex justify-between items-center">
                      {plan.planName}
                      <Badge className={plan.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-white flex items-center">
                        <IndianRupee className="w-[20px] inline-block mr-1"/>
                        <span>{plan.price}</span>
                      </div>
                      <span className="text-slate-400"> / {plan.duration} months</span>
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features?.map((feature) => (
                        <div key={feature.id} className="flex items-center">
                          <Check className="h-4 w-4 text-green-400 mr-2" />
                          <span className="text-sm text-slate-300">{feature.featureName}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Note: You'll need to add members count to your API or calculate it separately */}
                    <div className="text-sm text-slate-400">
                      <Users className="inline h-4 w-4 mr-1" />
                       {plan.totalMembers }  members
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleEditPlan(plan,plan.isActive)}
                        className="flex-1 border-slate-600 text-slate-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        disabled={isPlanStatusToggled}
                        size="sm" 
                        onClick={() => handleToggleStatus(plan.id)}
                        className={plan.isActive ? "border-red-500/50 text-red-400" : "border-green-500/50 text-green-400"}
                      >
                        {plan.isActive ? "Disable" : "Enable"}
                      </Button>
                      {/* <Button 
                        size="sm" 
                        disabled={isPlanDeleted}
                        onClick={() => handleDeletePlan(plan.id)}
                        className={`border-slate-600 text-slate-300${isPlanDeleted ? ' opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Delete
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans?.map((plan) => (
                      <div key={plan.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-300">{plan.planName}</span>
                          <span className="text-sm text-white">{/* {plan.members || 0} */} 0 members</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(0 / 100) * 100}%` }} // Update when you have member data
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans?.map((plan) => (
                      <div key={plan.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            plan.planName === "Basic" ? "bg-blue-500" : 
                            plan.planName === "Standard" ? "bg-purple-500" : "bg-pink-500"
                          }`}></div>
                          <span className="text-sm text-slate-300">{plan.planName}</span>
                        </div>
                        <div className="text-sm text-white flex">
                          <IndianRupee className="w-[16px] "/>
                          <span>{(plan.price * 0).toFixed(2)}/month</span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-700 flex justify-between">
                      <span className="text-sm font-medium text-white">Total Revenue</span>
                      <div className="text-sm font-medium text-white flex">
                        <IndianRupee className="w-[16px]"/>
                        <span>
                        {plans?.reduce((sum, plan) => sum + (plan.price * 0), 0).toFixed(2)}/month
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddPlanModal
        isOpen={isAddPlanModalOpen}
        onClose={() => {
          setIsAddPlanModalOpen(false);
          setEditPlan(undefined);
        }}
        editPlan={editPlan}
      />
    </>
  );
};

export default MembershipPlan;
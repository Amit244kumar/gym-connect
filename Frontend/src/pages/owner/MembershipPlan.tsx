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
} from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular: boolean;
  members: number;
  active: boolean;
}

const MembershipPlan = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockPlans: Plan[] = [
      {
        id: 1,
        name: "Basic",
        price: 29.99,
        duration: "per month",
        features: [
          "Gym access during off-peak hours",
          "1 group class per month",
          "Basic workout plan",
        ],
        popular: false,
        members: 45,
        active: true,
      },
      {
        id: 2,
        name: "Standard",
        price: 49.99,
        duration: "per month",
        features: [
          "Full gym access",
          "5 group classes per month",
          "Personalized workout plan",
          "Nutrition guidance",
        ],
        popular: true,
        members: 30,
        active: true,
      },
      {
        id: 3,
        name: "Premium",
        price: 79.99,
        duration: "per month",
        features: [
          "Full gym access",
          "Unlimited group classes",
          "Personal trainer sessions (2/month)",
          "Advanced nutrition plan",
          "Guest passes (2/month)",
        ],
        popular: false,
        members: 25,
        active: true,
      },
    ];
    setPlans(mockPlans);
  }, []);

  const handleAddPlan = () => {
    toast.info("Add Plan feature coming soon");
  };

  const handleEditPlan = (plan: Plan) => {
    toast.info(`Editing ${plan.name} plan`);
  };

  const handleDeletePlan = (plan: Plan) => {
    toast.success(`${plan.name} plan has been deleted`);
    setPlans(plans.filter(p => p.id !== plan.id));
  };

  const handleToggleStatus = (plan: Plan) => {
    const updatedPlans = plans.map(p => 
      p.id === plan.id ? { ...p, active: !p.active } : p
    );
    setPlans(updatedPlans);
    toast.success(`${plan.name} plan has been ${plan.active ? 'deactivated' : 'activated'}`);
  };

  return (
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
              <div className="text-2xl font-bold text-white">{plans.length}</div>
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
                {plans.find(p => p.popular)?.name || "None"}
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
              <div className="text-2xl font-bold text-white">$2,450</div>
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
              {plans.map((plan) => (
                <Card key={plan.id} className={`bg-slate-800/50 border-slate-700 relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white flex justify-between items-center">
                      {plan.name}
                      <Badge className={plan.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {plan.active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400"> / {plan.duration}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-400 mr-2" />
                          <span className="text-sm text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-slate-400">
                      <Users className="inline h-4 w-4 mr-1" />
                      {plan.members} members
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditPlan(plan)}
                        className="flex-1 border-slate-600 text-slate-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleStatus(plan)}
                        className={plan.active ? "border-red-500/50 text-red-400" : "border-green-500/50 text-green-400"}
                      >
                        {plan.active ? "Disable" : "Enable"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePlan(plan)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                    {plans.map((plan) => (
                      <div key={plan.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-300">{plan.name}</span>
                          <span className="text-sm text-white">{plan.members} members</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(plan.members / 100) * 100}%` }}
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
                    {plans.map((plan) => (
                      <div key={plan.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            plan.name === "Basic" ? "bg-blue-500" : 
                            plan.name === "Standard" ? "bg-purple-500" : "bg-pink-500"
                          }`}></div>
                          <span className="text-sm text-slate-300">{plan.name}</span>
                        </div>
                        <span className="text-sm text-white">
                          ${(plan.price * plan.members).toFixed(2)}/month
                        </span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-700 flex justify-between">
                      <span className="text-sm font-medium text-white">Total Revenue</span>
                      <span className="text-sm font-medium text-white">
                        ${plans.reduce((sum, plan) => sum + (plan.price * plan.members), 0).toFixed(2)}/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default MembershipPlan;
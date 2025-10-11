// src/pages/ReportsPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  RefreshCw,
  DollarSign,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  name: string;
  value: number;
  change: number;
  changeType: "positive" | "negative";
}

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  const [isGenerating, setIsGenerating] = useState(false);

  const membershipData: ReportData[] = [
    { name: "New Members", value: 24, change: 12, changeType: "positive" },
    { name: "Canceled Members", value: 5, change: 3, changeType: "negative" },
    { name: "Renewals", value: 18, change: 8, changeType: "positive" },
    { name: "Conversion Rate", value: 24, change: 5, changeType: "positive" },
  ];

  const revenueData: ReportData[] = [
    { name: "Total Revenue", value: 12450, change: 8, changeType: "positive" },
    { name: "Avg. Revenue/Member", value: 65, change: 3, changeType: "positive" },
    { name: "New Revenue", value: 3200, change: 15, changeType: "positive" },
    { name: "Lost Revenue", value: 450, change: 5, changeType: "negative" },
  ];

  const attendanceData = [
    { day: "Mon", attendance: 120 },
    { day: "Tue", attendance: 145 },
    { day: "Wed", attendance: 110 },
    { day: "Thu", attendance: 165 },
    { day: "Fri", attendance: 180 },
    { day: "Sat", attendance: 90 },
    { day: "Sun", attendance: 75 },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully");
    }, 1500);
  };

  const handleDownloadReport = () => {
    toast.success("Report downloaded successfully");
  };

  const getChangeBadge = (change: number, changeType: string) => {
    const color = changeType === "positive" ? "text-green-400" : "text-red-400";
    const icon = changeType === "positive" ? "↑" : "↓";
    
    return (
      <span className={`text-xs ${color}`}>
        {icon} {Math.abs(change)}%
      </span>
    );
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
            <p className="text-slate-400">Track your gym's performance and growth</p>
          </div>
          <div className="flex space-x-2">
            <select 
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="bg-orange-500 hover:bg-orange-600">
              {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <BarChart3 className="h-4 w-4 mr-2" />}
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 hover:text-white">Overview</TabsTrigger>
            <TabsTrigger value="membership" className="text-slate-300 hover:text-white">Membership</TabsTrigger>
            <TabsTrigger value="revenue" className="text-slate-300 hover:text-white">Revenue</TabsTrigger>
            <TabsTrigger value="attendance" className="text-slate-300 hover:text-white">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">128</div>
                  {getChangeBadge(12, "positive")}
                  <p className="text-xs text-slate-400 mt-1">from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Monthly Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$12,450</div>
                  {getChangeBadge(8, "positive")}
                  <p className="text-xs text-slate-400 mt-1">from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Avg. Attendance
                  </CardTitle>
                  <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">78%</div>
                  {getChangeBadge(3, "positive")}
                  <p className="text-xs text-slate-400 mt-1">from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    Conversion Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">24%</div>
                  {getChangeBadge(5, "positive")}
                  <p className="text-xs text-slate-400 mt-1">from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Membership Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {membershipData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">{item.value}</span>
                          {getChangeBadge(item.change, item.changeType)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{item.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">${item.value.toLocaleString()}</span>
                          {getChangeBadge(item.change, item.changeType)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="membership">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Membership Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-700/20 rounded-lg">
                    <BarChart3 className="h-24 w-24 text-slate-400" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">New Members (Last 30 days)</span>
                      <span className="text-white font-medium">24</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Canceled Members (Last 30 days)</span>
                      <span className="text-white font-medium">5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Net Growth</span>
                      <span className="text-green-400 font-medium">+19</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Membership Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Basic Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">45%</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Standard Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">30%</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Premium Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">25%</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-700/20 rounded-lg">
                    <BarChart3 className="h-24 w-24 text-slate-400" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">This Month</span>
                      <span className="text-white font-medium">$12,450</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Last Month</span>
                      <span className="text-white font-medium">$11,520</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Growth</span>
                      <span className="text-green-400 font-medium">+8.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue by Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Basic Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">$5,400</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "43%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Standard Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">$4,500</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "36%" }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                        <span className="text-sm text-slate-300">Premium Plan</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-white mr-2">$2,550</span>
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: "21%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-700/20 rounded-lg">
                    <BarChart3 className="h-24 w-24 text-slate-400" />
                  </div>
                  <div className="mt-4 space-y-2">
                    {attendanceData.map((day, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-400">{day.day}</span>
                        <div className="flex items-center">
                          <span className="text-white mr-2 w-8">{day.attendance}</span>
                          <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-orange-500 h-2 rounded-full" 
                              style={{ width: `${(day.attendance / 200) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Peak Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">6-7 PM</p>
                        <p className="text-xs text-slate-400">Weekdays</p>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400">Peak</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">8-9 AM</p>
                        <p className="text-xs text-slate-400">Weekdays</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">High</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">5-6 PM</p>
                        <p className="text-xs text-slate-400">Weekdays</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400">Medium</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">10-11 AM</p>
                        <p className="text-xs text-slate-400">Weekends</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center">
              <span>Recent Reports</span>
              <Button variant="outline" size="sm" onClick={handleDownloadReport} className="border-slate-600 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div>
                  <p className="font-medium text-white">Monthly Membership Report</p>
                  <p className="text-xs text-slate-400">Generated: Jun 1, 2023</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadReport} className="border-slate-600 text-slate-300">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div>
                  <p className="font-medium text-white">Revenue Analysis Report</p>
                  <p className="text-xs text-slate-400">Generated: May 28, 2023</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadReport} className="border-slate-600 text-slate-300">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div>
                  <p className="font-medium text-white">Attendance Trends Report</p>
                  <p className="text-xs text-slate-400">Generated: May 25, 2023</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadReport} className="border-slate-600 text-slate-300">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Reports;
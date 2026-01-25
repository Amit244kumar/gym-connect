// pages/member/Attendance.tsx
import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isSameDay, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const generateMockAttendanceData = () => {
  const today = new Date();
  const data = [];
  
  // Generate data for the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Randomly determine if the user attended (70% chance)
    const attended = Math.random() > 0.3;
    
    if (attended) {
      // Random check-in time between 5 AM and 10 AM
      const checkInHour = 5 + Math.floor(Math.random() * 5);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkIn = new Date(date);
      checkIn.setHours(checkInHour, checkInMinute, 0, 0);
      
      // Random check-out time between check-in + 30 min and check-in + 3 hours
      const workoutDuration = 30 + Math.floor(Math.random() * 150);
      const checkOut = new Date(checkIn);
      checkOut.setMinutes(checkOut.getMinutes() + workoutDuration);
      
      data.push({
        id: `attendance-${i}`,
        date,
        checkIn,
        checkOut,
        duration: workoutDuration,
        type: Math.random() > 0.7 ? "Personal Training" : "Regular Workout"
      });
    }
  }
  
  return data;
};

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(generateMockAttendanceData());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate statistics
  const totalDays = attendanceData.length;
  const totalHours = Math.round(attendanceData.reduce((acc, curr) => acc + curr.duration, 0) / 60);
  const avgDuration = Math.round(attendanceData.reduce((acc, curr) => acc + curr.duration, 0) / totalDays);
  
  // Get attendance for the selected month
  const getMonthlyAttendance = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    return attendanceData.filter(record => 
      isWithinInterval(record.date, { start: monthStart, end: monthEnd })
    );
  };
  
  // Get attendance for the selected date
  const getDailyAttendance = () => {
    if (!selectedDate) return null;
    
    return attendanceData.find(record => 
      isSameDay(record.date, selectedDate)
    );
  };
  
  // Get filtered attendance data
  const getFilteredAttendance = () => {
    if (filterType === "all") return getMonthlyAttendance();
    
    return getMonthlyAttendance().filter(record => 
      record.type === filterType
    );
  };
  
  // Function to get day content for calendar
  const getDayContent = (day: Date) => {
    const hasAttendance = attendanceData.some(record => 
      isSameDay(record.date, day)
    );
    
    if (hasAttendance) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <p className="text-slate-400">Track your gym visits and workout history</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-slate-800 border-slate-700 text-white">
                <Calendar className="mr-2 h-4 w-4" />
                {format(selectedMonth, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
              <CalendarComponent
                mode="single"
                selected={selectedMonth}
                onSelect={(date) => date && setSelectedMonth(date)}
                initialFocus
                className="bg-slate-800 text-white"
              />
            </PopoverContent>
          </Popover>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Regular Workout">Regular Workout</SelectItem>
              <SelectItem value="Personal Training">Personal Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 text-white data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-slate-700 text-white data-[state=active]:text-white">Calendar</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-slate-700 text-white data-[state=active]:text-white">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Total Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalDays}</div>
                <p className="text-xs text-slate-500 mt-1">This month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  Total Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalHours}h</div>
                <p className="text-xs text-slate-500 mt-1">This month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-400 text-sm font-medium flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-orange-500" />
                  Avg. Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{avgDuration}m</div>
                <p className="text-xs text-slate-500 mt-1">Per visit</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Attendance</CardTitle>
              <CardDescription className="text-slate-400">Your latest gym visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getMonthlyAttendance().slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{format(record.date, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-sm text-slate-400">
                          {format(record.checkIn, "h:mm a")} - {format(record.checkOut, "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-slate-700 border-slate-600 text-white">
                        {record.type}
                      </Badge>
                      <p className="text-sm text-slate-400 mt-1">{record.duration} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Attendance Calendar</CardTitle>
                <CardDescription className="text-slate-400">Days you visited the gym are marked with a dot</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  className="bg-slate-800 text-white rounded-md"
                  components={{
                    DayContent: ({ date, ...props }) => {
                      return (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {props.children}
                          {getDayContent(date)}
                        </div>
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a Date"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Attendance details for the selected date
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getDailyAttendance() ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Checked In</p>
                        <p className="text-sm text-slate-400">
                          {format(getDailyAttendance()!.checkIn, "h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Checked Out</p>
                        <p className="text-sm text-slate-400">
                          {format(getDailyAttendance()!.checkOut, "h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Workout Duration</p>
                        <p className="text-sm text-slate-400">
                          {getDailyAttendance()!.duration} minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <Badge variant="outline" className="bg-slate-700 border-slate-600 text-white">
                        {getDailyAttendance()!.type}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <XCircle className="h-12 w-12 text-slate-500 mb-3" />
                    <p className="text-slate-400">No attendance record for this date</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Attendance History</CardTitle>
              <CardDescription className="text-slate-400">Your complete attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getFilteredAttendance().map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{format(record.date, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-sm text-slate-400">
                          {format(record.checkIn, "h:mm a")} - {format(record.checkOut, "h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-slate-700 border-slate-600 text-white">
                        {record.type}
                      </Badge>
                      <p className="text-sm text-slate-400 mt-1">{record.duration} min</p>
                    </div>
                  </div>
                ))}
                
                {getFilteredAttendance().length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <XCircle className="h-12 w-12 text-slate-500 mb-3" />
                    <p className="text-slate-400">No attendance records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
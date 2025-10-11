    // src/pages/SettingsPage.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Shield,
  User,
  Mail,
  CreditCard,
  Palette,
  Globe,
  Save,
  Badge,
} from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    membershipRenewals: true,
    paymentReminders: true,
    newFeatures: true,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const [gymSettings, setGymSettings] = useState({
    gymName: "FitZone Gym",
    address: "123 Fitness Street, Health City",
    phone: "+1 (555) 123-4567",
    email: "info@fitzonegym.com",
    website: "www.fitzonegym.com",
    timezone: "America/New_York",
  });

  const handleNotificationChange = (name: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (name: string, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGymChange = (name: string, value: string) => {
    setGymSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully");
    }, 1500);
  };

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Manage your gym and account settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="general" className="text-slate-300 hover:text-white">General</TabsTrigger>
            <TabsTrigger value="notifications" className="text-slate-300 hover:text-white">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="text-slate-300 hover:text-white">Security</TabsTrigger>
            <TabsTrigger value="billing" className="text-slate-300 hover:text-white">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Gym Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gymName" className="text-slate-300">Gym Name</Label>
                    <Input
                      id="gymName"
                      value={gymSettings.gymName}
                      onChange={(e) => handleGymChange("gymName", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-slate-300">Address</Label>
                    <Input
                      id="address"
                      value={gymSettings.address}
                      onChange={(e) => handleGymChange("address", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                    <Input
                      id="phone"
                      value={gymSettings.phone}
                      onChange={(e) => handleGymChange("phone", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={gymSettings.email}
                      onChange={(e) => handleGymChange("email", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-slate-300">Website</Label>
                    <Input
                      id="website"
                      value={gymSettings.website}
                      onChange={(e) => handleGymChange("website", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                    <select
                      id="timezone"
                      value={gymSettings.timezone}
                      onChange={(e) => handleGymChange("timezone", e.target.value)}
                      className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Monday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="06:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Tuesday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="06:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Wednesday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="06:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Thursday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="06:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Friday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="06:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Saturday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="07:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="20:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Sunday</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="time"
                          defaultValue="07:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                        <span className="text-slate-400">to</span>
                        <Input
                          type="time"
                          defaultValue="20:00"
                          className="bg-slate-700/50 border-slate-600 text-white w-24"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Membership Renewals</p>
                      <p className="text-sm text-slate-400">Notify when memberships are about to expire</p>
                    </div>
                    <Switch
                      checked={notificationSettings.membershipRenewals}
                      onCheckedChange={(checked) => handleNotificationChange("membershipRenewals", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Payment Reminders</p>
                      <p className="text-sm text-slate-400">Remind members about upcoming payments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => handleNotificationChange("paymentReminders", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">New Features</p>
                      <p className="text-sm text-slate-400">Get notified about new features and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newFeatures}
                      onCheckedChange={(checked) => handleNotificationChange("newFeatures", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Marketing Emails</p>
                      <p className="text-sm text-slate-400">Receive promotional offers and marketing content</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Push Notifications</p>
                      <p className="text-sm text-slate-400">Receive push notifications on your devices</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Authentication</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Login Alerts</p>
                      <p className="text-sm text-slate-400">Get notified when someone logs into your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => handleSecurityChange("loginAlerts", checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white">Session Timeout</p>
                      <span className="text-sm text-slate-400">{securitySettings.sessionTimeout} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-400">15 min</span>
                      <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => handleSecurityChange("sessionTimeout", parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-slate-400">120 min</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <h3 className="text-lg font-medium text-white">Password</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="text-white">Last Changed</p>
                        <p className="text-sm text-slate-400">3 months ago</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-300">
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-700/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-white">Premium Plan</h3>
                        <p className="text-slate-400">$79.99/month</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Next Billing Date</span>
                        <span className="text-white">July 1, 2023</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Payment Method</span>
                        <span className="text-white">•••• •••• •••• 1234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Billing Email</span>
                        <span className="text-white">billing@fitzonegym.com</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 border-slate-600 text-slate-300">
                      Update Payment
                    </Button>
                    <Button variant="outline" className="flex-1 border-slate-600 text-slate-300">
                      Cancel Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="text-white font-medium">Premium Plan</p>
                        <p className="text-xs text-slate-400">Jun 1, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">$79.99</p>
                        <p className="text-xs text-green-400">Paid</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="text-white font-medium">Premium Plan</p>
                        <p className="text-xs text-slate-400">May 1, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">$79.99</p>
                        <p className="text-xs text-green-400">Paid</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="text-white font-medium">Premium Plan</p>
                        <p className="text-xs text-slate-400">Apr 1, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">$79.99</p>
                        <p className="text-xs text-green-400">Paid</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 mt-4">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
  );
};

export default Settings;
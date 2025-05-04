
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormDescription } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';

const SettingsManagement: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form methods for each settings form
  const storeForm = useForm();
  const deliveryForm = useForm();
  const notificationForm = useForm();
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Vijaya Sai Provisions',
    storeAddress: '123 Main Street, Hyderabad, Telangana',
    storePhone: '+91 9951690420',
    storeEmail: 'contact@vijayasaiprovisions.com',
    storeTimings: '9:00 AM - 9:00 PM',
    gstNumber: 'GST1234567890',
  });
  
  // Delivery settings
  const [deliverySettings, setDeliverySettings] = useState({
    minimumOrderAmount: 999,
    deliveryCharge: 50,
    freeDeliveryAmount: 999,
    deliveryRadius: 10,
    deliveryEnabled: true,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    lowStockNotifications: true,
    customerMessageNotifications: true,
    marketingNotifications: false,
  });
  
  const handleStoreSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDeliverySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDeliverySettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean, settingType: 'delivery' | 'notification') => {
    if (settingType === 'delivery') {
      setDeliverySettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setNotificationSettings(prev => ({ ...prev, [name]: checked }));
    }
  };
  
  const handleSaveSettings = (type: string) => {
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: `${type} settings have been updated successfully.`,
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your store configuration and preferences</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store">Store Information</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
        </TabsList>
        
        {/* Store Information Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...storeForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input 
                        id="storeName" 
                        name="storeName" 
                        value={storeSettings.storeName} 
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storePhone">Phone Number</Label>
                      <Input 
                        id="storePhone" 
                        name="storePhone" 
                        value={storeSettings.storePhone} 
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input 
                      id="storeAddress" 
                      name="storeAddress" 
                      value={storeSettings.storeAddress} 
                      onChange={handleStoreSettingChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">Email Address</Label>
                      <Input 
                        id="storeEmail" 
                        name="storeEmail" 
                        value={storeSettings.storeEmail} 
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storeTimings">Store Timings</Label>
                      <Input 
                        id="storeTimings" 
                        name="storeTimings" 
                        value={storeSettings.storeTimings} 
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input 
                        id="gstNumber" 
                        name="gstNumber" 
                        value={storeSettings.gstNumber} 
                        onChange={handleStoreSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSaveSettings('Store')}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Delivery Settings */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure how delivery works for your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...deliveryForm}>
                <form className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Delivery</Label>
                      <p className="text-sm text-muted-foreground">Turn on/off delivery service</p>
                    </div>
                    <Switch 
                      checked={deliverySettings.deliveryEnabled}
                      onCheckedChange={(checked) => handleSwitchChange('deliveryEnabled', checked, 'delivery')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minimumOrderAmount">Minimum Order Amount (₹)</Label>
                      <Input 
                        id="minimumOrderAmount" 
                        name="minimumOrderAmount" 
                        type="number"
                        value={deliverySettings.minimumOrderAmount} 
                        onChange={handleDeliverySettingChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
                      <Input 
                        id="deliveryCharge" 
                        name="deliveryCharge" 
                        type="number"
                        value={deliverySettings.deliveryCharge} 
                        onChange={handleDeliverySettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeDeliveryAmount">Free Delivery Above (₹)</Label>
                      <Input 
                        id="freeDeliveryAmount" 
                        name="freeDeliveryAmount" 
                        type="number"
                        value={deliverySettings.freeDeliveryAmount} 
                        onChange={handleDeliverySettingChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                      <Input 
                        id="deliveryRadius" 
                        name="deliveryRadius" 
                        type="number"
                        value={deliverySettings.deliveryRadius} 
                        onChange={handleDeliverySettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSaveSettings('Delivery')}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure what notifications you receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts for new orders</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={(checked) => handleSwitchChange('orderNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when products are low in stock</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.lowStockNotifications}
                      onCheckedChange={(checked) => handleSwitchChange('lowStockNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Customer Messages</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts for new customer messages</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.customerMessageNotifications}
                      onCheckedChange={(checked) => handleSwitchChange('customerMessageNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional updates</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketingNotifications}
                      onCheckedChange={(checked) => handleSwitchChange('marketingNotifications', checked, 'notification')}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSaveSettings('Notification')}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users & Permissions */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage staff accounts and their access rights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium">Admin Users</h3>
                  <p className="text-sm text-gray-500 mb-4">Manage users who can access the admin dashboard</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Admin</p>
                        <p className="text-xs text-gray-500">admin@example.com</p>
                      </div>
                      <Badge>Owner</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Store Manager</p>
                        <p className="text-xs text-gray-500">manager@example.com</p>
                      </div>
                      <Badge variant="outline">Manager</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    Add New User
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium">Role Permissions</h3>
                  <p className="text-sm text-gray-500 mb-4">Configure what each role can do</p>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Edit Admin Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Edit Manager Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Edit Staff Permissions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsManagement;

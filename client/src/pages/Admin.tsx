import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useScans } from '@/contexts/ScanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileImage, 
  Settings, 
  Search,
  Ban,
  Trash2,
  CheckCircle,
  Activity,
  AlertTriangle,
  Shield,
  ArrowLeft,
  Home
} from 'lucide-react';
import { User, Scan } from '@/types';
import { format } from 'date-fns';

const USERS_STORAGE_KEY = 'medvision_users';

export default function Admin() {
  const navigate = useNavigate();
  const { scans, deleteScan } = useScans();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<(User & { password?: string })[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [scanSearch, setScanSearch] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  }, []);

  const saveUsers = (updatedUsers: (User & { password?: string })[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const toggleBlockUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast({
        title: 'Cannot block admin',
        description: 'Admin accounts cannot be blocked.',
        variant: 'destructive',
      });
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    );
    saveUsers(updatedUsers);
    
    const targetUser = updatedUsers.find(u => u.id === userId);
    toast({
      title: targetUser?.isBlocked ? 'User Blocked' : 'User Unblocked',
      description: `${targetUser?.name} has been ${targetUser?.isBlocked ? 'blocked' : 'unblocked'}.`,
    });
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'admin') {
      toast({
        title: 'Cannot delete admin',
        description: 'Admin accounts cannot be deleted.',
        variant: 'destructive',
      });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    toast({
      title: 'User Deleted',
      description: `${user?.name} has been removed from the system.`,
    });
  };

  const handleDeleteScan = (scanId: string) => {
    deleteScan(scanId);
    toast({
      title: 'Scan Deleted',
      description: 'The scan record has been removed.',
    });
  };

  const toggleAI = () => {
    setAiEnabled(!aiEnabled);
    toast({
      title: aiEnabled ? 'AI Disabled' : 'AI Enabled',
      description: `The AI diagnosis system has been ${aiEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredScans = scans.filter(s =>
    s.userName.toLowerCase().includes(scanSearch.toLowerCase()) ||
    s.diagnosis.disease.toLowerCase().includes(scanSearch.toLowerCase())
  );

  const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-destructive text-destructive-foreground',
    doctor: 'bg-primary text-primary-foreground',
    healthcare_worker: 'bg-secondary text-secondary-foreground',
    researcher: 'bg-info text-info-foreground',
  };

  return (
    <MainLayout requireAdmin>
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="-ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, scans, and system settings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => u.isBlocked).length} blocked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <FileImage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scans.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${aiEnabled ? 'text-success' : 'text-destructive'}`}>
                {aiEnabled ? 'Online' : 'Offline'}
              </div>
              <p className="text-xs text-muted-foreground">
                {aiEnabled ? 'Processing requests' : 'Disabled by admin'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Detections</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scans.filter(s => s.diagnosis.disease !== 'normal').length}
              </div>
              <p className="text-xs text-muted-foreground">Diseases found</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="scans">Scan Records</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registered Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={ROLE_COLORS[user.role]}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBlocked ? (
                            <Badge variant="destructive">Blocked</Badge>
                          ) : (
                            <Badge variant="outline" className="text-success border-success">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBlockUser(user.id)}
                              disabled={user.role === 'admin'}
                              title={user.isBlocked ? 'Unblock user' : 'Block user'}
                            >
                              {user.isBlocked ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <Ban className="h-4 w-4 text-warning" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteUser(user.id)}
                              disabled={user.role === 'admin'}
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scans Tab */}
          <TabsContent value="scans" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scan Records</CardTitle>
                    <CardDescription>View all diagnostic scans in the system</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search scans..."
                      className="pl-10"
                      value={scanSearch}
                      onChange={(e) => setScanSearch(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scan ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScans.slice(0, 20).map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-mono text-xs">{scan.id}</TableCell>
                        <TableCell>{scan.userName}</TableCell>
                        <TableCell className="capitalize">
                          {scan.diagnosis.disease.replace('_', ' ')}
                        </TableCell>
                        <TableCell>{(scan.diagnosis.confidence * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          <Badge 
                            variant={scan.diagnosis.riskLevel === 'high' ? 'destructive' : 
                                    scan.diagnosis.riskLevel === 'moderate' ? 'default' : 'secondary'}
                          >
                            {scan.diagnosis.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(scan.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteScan(scan.id)}
                            title="Delete scan"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    AI System Control
                  </CardTitle>
                  <CardDescription>
                    Enable or disable the AI diagnosis engine
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label htmlFor="ai-toggle" className="font-medium">
                        AI Diagnosis Engine
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {aiEnabled 
                          ? 'The AI system is currently processing diagnosis requests.' 
                          : 'The AI system is disabled. Users cannot run diagnoses.'}
                      </p>
                    </div>
                    <Switch
                      id="ai-toggle"
                      checked={aiEnabled}
                      onCheckedChange={toggleAI}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>
                    Current system performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <span>Average Response Time</span>
                      <span className="font-mono font-medium">1.2s</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <span>Success Rate</span>
                      <span className="font-mono font-medium text-success">99.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <span>Model Version</span>
                      <span className="font-mono font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <span>Last Updated</span>
                      <span className="font-mono font-medium">{format(new Date(), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

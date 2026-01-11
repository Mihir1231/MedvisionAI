import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useScans } from '@/contexts/ScanContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  FileImage, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { format } from 'date-fns';

const DISEASE_COLORS: Record<string, string> = {
  tuberculosis: 'hsl(0, 72%, 51%)',
  pneumonia: 'hsl(38, 92%, 50%)',
  bone_fracture: 'hsl(214, 90%, 44%)',
  normal: 'hsl(142, 71%, 45%)',
  unknown: 'hsl(215, 15%, 45%)',
};

const RISK_STYLES: Record<string, string> = {
  high: 'bg-destructive text-destructive-foreground',
  moderate: 'bg-warning text-warning-foreground',
  low: 'bg-success text-success-foreground',
  normal: 'bg-success text-success-foreground',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { getStats } = useScans();
  const { user } = useAuth();
  const stats = getStats();

  const pieData = stats.diseaseBreakdown
    .filter(d => d.count > 0)
    .map(d => ({
      name: d.disease.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: d.count,
      color: DISEASE_COLORS[d.disease],
    }));

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="-ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's your medical imaging overview.
          </p>
        </div>

        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <FileImage className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{stats.scansThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diseases Detected</CardTitle>
              <AlertTriangle className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.diseasesDetected}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.diseasesDetected / stats.totalScans) * 100).toFixed(1)}% detection rate
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(stats.accuracyRate * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on validated results
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                <span className="text-xl font-bold text-success">Online</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI engine operational
              </p>
            </CardContent>
          </Card>
        </div>

        
        <div className="grid gap-6 lg:grid-cols-2">
          
          <Card>
            <CardHeader>
              <CardTitle>Scan Activity Trend</CardTitle>
              <CardDescription>Monthly scans and disease detections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="scans" name="Total Scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="detections" name="Detections" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          
          <Card>
            <CardHeader>
              <CardTitle>Disease Distribution</CardTitle>
              <CardDescription>Breakdown by condition type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Latest diagnostic results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{scan.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {scan.bodyPart} • {scan.imageType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge 
                        className={RISK_STYLES[scan.diagnosis.riskLevel]}
                        variant="secondary"
                      >
                        {scan.diagnosis.disease.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(scan.diagnosis.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(scan.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

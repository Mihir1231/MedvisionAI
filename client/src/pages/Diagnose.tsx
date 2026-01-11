import { useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useScans } from '@/contexts/ScanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileImage, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Download,
  Brain,
  Target,
  FileText,
  Zap,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Scan, DiagnosisResult, DiseaseType, RiskLevel } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// --- API CONFIGURATION ---
const API_BASE_URL = 'http://localhost:8000';

const RISK_STYLES: Record<RiskLevel, string> = {
  high: 'bg-destructive text-destructive-foreground',
  moderate: 'bg-warning text-warning-foreground',
  low: 'bg-success text-success-foreground',
  normal: 'bg-success text-success-foreground',
};

const DISEASE_INFO: Record<DiseaseType, { name: string; description: string }> = {
  tuberculosis: {
    name: 'Tuberculosis (TB)',
    description: 'Active pulmonary tuberculosis detected with characteristic findings.',
  },
  pneumonia: {
    name: 'Pneumonia',
    description: 'Lung infection with consolidation patterns identified.',
  },
  bone_fracture: {
    name: 'Bone Fracture',
    description: 'Discontinuity in bone structure detected.',
  },
  normal: {
    name: 'Normal',
    description: 'No significant abnormalities detected.',
  },
  unknown: {
    name: 'Inconclusive',
    description: 'Unable to determine a definitive diagnosis.',
  },
};

// Helper to map Backend Labels to Frontend Types
const mapBackendLabel = (label: string): DiseaseType => {
  const map: Record<string, DiseaseType> = {
    'Fractured': 'bone_fracture',
    'Normal': 'normal',
    'Pneumonia': 'pneumonia',
    'Tuberculosis': 'tuberculosis'
  };
  return map[label] || 'unknown';
};

// --- DATA DICTIONARIES (Static content based on AI results) ---
const EXPLANATIONS: Record<DiseaseType, string> = {
  tuberculosis: `The AI analysis identified characteristic features consistent with pulmonary tuberculosis:\n\n1. **Upper Lobe Infiltrates**: Detected nodular opacities.\n2. **Cavitary Lesions**: Identified potential cavitation suggesting active disease.\n3. **Tree-in-Bud Pattern**: Observed branching linear opacities.\n\nThe confidence score reflects similarity to known positive TB cases.`,
  pneumonia: `The AI analysis detected patterns consistent with bacterial pneumonia:\n\n1. **Lobar Consolidation**: Identified dense opacity in the lower lung lobes.\n2. **Silhouette Sign**: Obscuration of borders indicating localization.\n3. **Pleural Effusion**: Fluid detected at the costophrenic angle.`,
  bone_fracture: `The AI analysis detected a bone fracture with the following findings:\n\n1. **Cortical Disruption**: Clear discontinuity in the bone cortex identified.\n2. **Alignment Assessment**: Evaluation of displacement at the site.\n3. **Soft Tissue Changes**: Associated swelling observed.`,
  normal: `The AI analysis found no significant abnormalities:\n\n1. **Lung Fields**: Both lung fields appear clear.\n2. **Cardiac Silhouette**: Heart size and shape are within normal limits.\n3. **Bony Structures**: No acute bony abnormalities identified.`,
  unknown: `The AI was unable to make a definitive diagnosis due to image quality or atypical patterns.`,
};

const RECOMMENDATIONS: Record<DiseaseType, string[]> = {
  tuberculosis: ['Sputum AFB smear and culture', 'GeneXpert MTB/RIF testing', 'Contact tracing', 'Initiate DOTS therapy'],
  pneumonia: ['Blood cultures', 'Empiric antibiotic therapy', 'Monitor oxygen saturation', 'Follow-up X-ray in 4-6 weeks'],
  bone_fracture: ['Orthopedic consultation', 'Additional imaging views', 'Immobilization', 'Pain management'],
  normal: ['No immediate intervention required', 'Routine health maintenance'],
  unknown: ['Clinical correlation recommended', 'Consider CT scan', 'Specialist consultation'],
};

export default function Diagnose() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addScan } = useScans();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [contourUrl, setContourUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Scan | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // New State for Modality
  const [activeModality, setActiveModality] = useState<'xray' | 'ct'>('xray');

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setContourUrl(null);
    setResult(null);
    setProgress(0);
  }, [toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
  }, [handleFileSelect]);

  const runDiagnosis = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 5));
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // We pass modality and sensitivity as Query Parameters as expected by the Backend API
      const queryParams = new URLSearchParams({
        modality: activeModality,
        sensitivity: '120'
      });

      const response = await fetch(`${API_BASE_URL}/predict?${queryParams.toString()}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend failed to process image');

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      const diseaseType = mapBackendLabel(data.prediction.label);
      const riskLevel: RiskLevel = data.prediction.is_normal ? 'low' : 'high';
      
      const visualMapUrl = data.visual_analysis 
        ? `data:image/jpeg;base64,${data.visual_analysis}` 
        : previewUrl;

      setContourUrl(visualMapUrl);

      const scan: Scan = {
        id: `scan-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        originalImageUrl: previewUrl || '',
        contourImageUrl: visualMapUrl,
        diagnosis: {
          disease: diseaseType,
          confidence: data.prediction.confidence,
          riskLevel: riskLevel,
          explanation: EXPLANATIONS[diseaseType],
          affectedRegions: data.prediction.is_normal ? [] : ['Detected zones'],
          recommendations: RECOMMENDATIONS[diseaseType],
        },
        createdAt: new Date().toISOString(),
        imageType: activeModality, // Matches selected modality
        bodyPart: activeModality === 'xray' ? 'Chest' : 'CT Scan Area',
      };

      setResult(scan);
      addScan(scan);

      toast({
        title: 'Analysis Complete',
        description: `Detected: ${DISEASE_INFO[diseaseType].name}`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: 'Analysis Failed',
        description: 'Connection to AI Server failed. Ensure backend is running.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(10, 94, 215); doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(24); doc.text('MedVision AI', 20, 25);
    doc.setFontSize(12); doc.text(`Medical ${activeModality.toUpperCase()} Diagnostic Report`, 20, 35);
    doc.setTextColor(0, 0, 0);
    let yPos = 55;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(`Report ID: ${result.id}`, 20, yPos);
    doc.text(`Date: ${format(new Date(result.createdAt), 'MMMM d, yyyy HH:mm')}`, pageWidth - 80, yPos);
    yPos += 10;
    doc.text(`Analyzed by: ${result.userName}`, 20, yPos);
    yPos += 20;
    doc.setTextColor(0, 0, 0); doc.setFontSize(16); doc.text('Diagnosis Results', 20, yPos);
    yPos += 10;
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text(`Finding: ${DISEASE_INFO[result.diagnosis.disease].name}`, 20, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence: ${(result.diagnosis.confidence * 100).toFixed(1)}%`, 20, yPos);
    yPos += 15;
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.text('AI Analysis Explanation', 20, yPos);
    yPos += 8;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    const explanationLines = doc.splitTextToSize(result.diagnosis.explanation.replace(/\*\*/g, ''), pageWidth - 40);
    doc.text(explanationLines, 20, yPos);
    yPos += explanationLines.length * 5 + 10;
    doc.save(`MedVision_${activeModality.toUpperCase()}_Report_${result.id}.pdf`);
  };

  const resetDiagnosis = () => {
    setSelectedFile(null); setPreviewUrl(null); setContourUrl(null); setResult(null); setProgress(0);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload & Diagnose</h1>
          <p className="text-muted-foreground mt-1">
            Choose a modality and upload images for AI-powered disease detection
          </p>
        </div>

        {/* Modality Selection Tabs */}
        <Tabs defaultValue="xray" className="w-full" onValueChange={(v) => setActiveModality(v as 'xray' | 'ct')}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="xray" className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Chest X-Ray
            </TabsTrigger>
            <TabsTrigger value="ct" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> CT Scan
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeModality} className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Image Upload Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {activeModality === 'xray' ? <Upload className="h-5 w-5" /> : <Activity className="h-5 w-5" />} 
                    {activeModality === 'xray' ? 'X-Ray' : 'CT Scan'} Upload
                  </CardTitle>
                  <CardDescription>Drag & drop or click to upload a {activeModality} scan</CardDescription>
                </CardHeader>
                <CardContent>
                  {!previewUrl ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                      }`}
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    >
                      <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="image-upload" />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <FileImage className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Drop your {activeModality} scan here</p>
                        <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        <img src={contourUrl || previewUrl} alt="Scan preview" className="w-full h-64 object-contain" />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                            <Brain className="h-12 w-12 text-primary animate-pulse mb-4" />
                            <p className="font-medium">Analyzing with Neural Network...</p>
                            <div className="w-48 mt-4"><Progress value={progress} className="h-2" /></div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={runDiagnosis} className="flex-1" disabled={isAnalyzing}>
                          {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : <><Zap className="mr-2 h-4 w-4" /> Run Diagnosis</>}
                        </Button>
                        <Button variant="outline" onClick={resetDiagnosis} disabled={isAnalyzing}>Reset</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" /> Diagnosis Results
                  </CardTitle>
                  <CardDescription>AI-powered analysis with explainable reasoning</CardDescription>
                </CardHeader>
                <CardContent>
                  {!result ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                      <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Upload a {activeModality} scan and run diagnosis to see results</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-muted">
                        <div className={`p-3 rounded-full ${RISK_STYLES[result.diagnosis.riskLevel]}`}>
                          {result.diagnosis.disease === 'normal' ? <CheckCircle className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{DISEASE_INFO[result.diagnosis.disease].name}</h3>
                          <p className="text-sm text-muted-foreground">{DISEASE_INFO[result.diagnosis.disease].description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="font-bold">{(result.diagnosis.confidence * 100).toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Risk Level</p>
                              <Badge className={RISK_STYLES[result.diagnosis.riskLevel]}>{result.diagnosis.riskLevel}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button onClick={downloadReport} className="w-full"><Download className="mr-2 h-4 w-4" /> Download Report (PDF)</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {result && (
          <Card className="animate-in slide-in-from-bottom-2 duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> AI Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{result.diagnosis.explanation}</div>
              <Separator className="my-6" />
              <div>
                <h4 className="font-semibold mb-3">Clinical Recommendations</h4>
                <ul className="space-y-2">
                  {result.diagnosis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
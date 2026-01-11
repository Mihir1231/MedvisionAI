export type UserRole = 'doctor' | 'healthcare_worker' | 'researcher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isBlocked?: boolean;
}

export type RiskLevel = 'high' | 'moderate' | 'low' | 'normal';

export type DiseaseType = 'tuberculosis' | 'pneumonia' | 'bone_fracture' | 'normal' | 'unknown';

export interface DiagnosisResult {
  disease: DiseaseType;
  confidence: number;
  riskLevel: RiskLevel;
  explanation: string;
  affectedRegions: string[];
  recommendations: string[];
}

export interface Scan {
  id: string;
  userId: string;
  userName: string;
  originalImageUrl: string;
  contourImageUrl?: string;
  diagnosis: DiagnosisResult;
  createdAt: string;
  imageType: 'xray' | 'ct';
  bodyPart: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  imageUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  journal: string;
  url: string;
  citations?: number;
  keywords: string[];
}

export interface DashboardStats {
  totalScans: number;
  diseasesDetected: number;
  accuracyRate: number;
  scansThisMonth: number;
  diseaseBreakdown: {
    disease: DiseaseType;
    count: number;
  }[];
  monthlyTrend: {
    month: string;
    scans: number;
    detections: number;
  }[];
  recentScans: Scan[];
}

export interface SystemHealth {
  aiStatus: 'online' | 'offline' | 'degraded';
  lastUpdated: string;
  averageResponseTime: number;
  totalProcessed: number;
  successRate: number;
}

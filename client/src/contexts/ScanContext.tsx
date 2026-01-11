import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Scan, DashboardStats, DiagnosisResult, DiseaseType, RiskLevel } from '@/types';

interface ScanContextType {
  scans: Scan[];
  addScan: (scan: Scan) => void;
  getStats: () => DashboardStats;
  getUserScans: (userId: string) => Scan[];
  deleteScan: (scanId: string) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

const SCANS_STORAGE_KEY = 'medvision_scans';


const generateSampleScans = (): Scan[] => {
  const diseases: DiseaseType[] = ['tuberculosis', 'pneumonia', 'bone_fracture', 'normal'];
  const bodyParts = ['Chest', 'Lungs', 'Ribs', 'Spine', 'Hand', 'Leg'];
  const sampleScans: Scan[] = [];

  for (let i = 0; i < 25; i++) {
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    sampleScans.push({
      id: `scan-${i + 1}`,
      userId: `user-${Math.floor(Math.random() * 5) + 1}`,
      userName: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Nurse Emily Davis', 'Dr. Robert Wilson', 'Tech Alex Brown'][Math.floor(Math.random() * 5)],
      originalImageUrl: '/placeholder.svg',
      contourImageUrl: '/placeholder.svg',
      diagnosis: {
        disease,
        confidence: 0.75 + Math.random() * 0.2,
        riskLevel: disease === 'normal' ? 'low' : (['high', 'moderate', 'low'] as RiskLevel[])[Math.floor(Math.random() * 3)],
        explanation: getExplanation(disease),
        affectedRegions: getAffectedRegions(disease),
        recommendations: getRecommendations(disease),
      },
      createdAt: date.toISOString(),
      imageType: Math.random() > 0.5 ? 'xray' : 'ct',
      bodyPart: bodyParts[Math.floor(Math.random() * bodyParts.length)],
    });
  }

  return sampleScans;
};

function getExplanation(disease: DiseaseType): string {
  const explanations: Record<DiseaseType, string> = {
    tuberculosis: 'Detected characteristic upper lobe infiltrates with cavitary lesions. The pattern shows typical nodular opacities consistent with active pulmonary tuberculosis.',
    pneumonia: 'Identified consolidation in the lower lobes with air bronchograms. The opacity pattern and distribution are consistent with bacterial pneumonia.',
    bone_fracture: 'Detected discontinuity in bone cortex with surrounding soft tissue swelling. The fracture line is visible with minimal displacement.',
    normal: 'No significant abnormalities detected. Lung fields appear clear, cardiac silhouette is within normal limits, and bony structures show no acute findings.',
    unknown: 'Unable to determine a definitive diagnosis. Further clinical correlation and additional imaging may be required.',
  };
  return explanations[disease];
}

function getAffectedRegions(disease: DiseaseType): string[] {
  const regions: Record<DiseaseType, string[]> = {
    tuberculosis: ['Upper right lobe', 'Apical segment', 'Posterior segment'],
    pneumonia: ['Lower left lobe', 'Right middle lobe', 'Basal segments'],
    bone_fracture: ['Cortical surface', 'Trabecular bone', 'Periosteum'],
    normal: [],
    unknown: [],
  };
  return regions[disease];
}

function getRecommendations(disease: DiseaseType): string[] {
  const recommendations: Record<DiseaseType, string[]> = {
    tuberculosis: [
      'Confirm with sputum culture and sensitivity testing',
      'Start empiric anti-tuberculosis therapy as per protocol',
      'Notify public health authorities',
      'Screen close contacts',
    ],
    pneumonia: [
      'Initiate appropriate antibiotic therapy',
      'Consider blood cultures before treatment',
      'Monitor oxygen saturation',
      'Follow-up imaging in 4-6 weeks',
    ],
    bone_fracture: [
      'Orthopedic consultation recommended',
      'Consider immobilization with splint or cast',
      'Pain management as needed',
      'Follow-up imaging in 2-4 weeks',
    ],
    normal: [
      'No immediate intervention required',
      'Continue routine screening as indicated',
      'Maintain healthy lifestyle practices',
    ],
    unknown: [
      'Recommend clinical correlation',
      'Consider additional imaging modalities',
      'Specialist consultation may be beneficial',
    ],
  };
  return recommendations[disease];
}

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SCANS_STORAGE_KEY);
    if (stored) {
      setScans(JSON.parse(stored));
    } else {
      const sampleScans = generateSampleScans();
      setScans(sampleScans);
      localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(sampleScans));
    }
  }, []);

  const addScan = (scan: Scan) => {
    const updatedScans = [scan, ...scans];
    setScans(updatedScans);
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updatedScans));
  };

  const deleteScan = (scanId: string) => {
    const updatedScans = scans.filter(s => s.id !== scanId);
    setScans(updatedScans);
    localStorage.setItem(SCANS_STORAGE_KEY, JSON.stringify(updatedScans));
  };

  const getUserScans = (userId: string): Scan[] => {
    return scans.filter(s => s.userId === userId);
  };

  const getStats = (): DashboardStats => {
    const totalScans = scans.length;
    const diseasesDetected = scans.filter(s => s.diagnosis.disease !== 'normal').length;
    const accuracyRate = 0.94; 

    const now = new Date();
    const thisMonth = scans.filter(s => {
      const scanDate = new Date(s.createdAt);
      return scanDate.getMonth() === now.getMonth() && scanDate.getFullYear() === now.getFullYear();
    }).length;

    
    const diseaseCount: Record<DiseaseType, number> = {
      tuberculosis: 0,
      pneumonia: 0,
      bone_fracture: 0,
      normal: 0,
      unknown: 0,
    };
    scans.forEach(s => {
      diseaseCount[s.diagnosis.disease]++;
    });
    const diseaseBreakdown = Object.entries(diseaseCount).map(([disease, count]) => ({
      disease: disease as DiseaseType,
      count,
    }));

    
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthScans = scans.filter(s => {
        const scanDate = new Date(s.createdAt);
        return scanDate.getMonth() === date.getMonth() && scanDate.getFullYear() === date.getFullYear();
      });
      monthlyTrend.push({
        month: monthName,
        scans: monthScans.length,
        detections: monthScans.filter(s => s.diagnosis.disease !== 'normal').length,
      });
    }

    
    const recentScans = [...scans].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    return {
      totalScans,
      diseasesDetected,
      accuracyRate,
      scansThisMonth: thisMonth,
      diseaseBreakdown,
      monthlyTrend,
      recentScans,
    };
  };

  return (
    <ScanContext.Provider value={{ scans, addScan, getStats, getUserScans, deleteScan }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScans() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScans must be used within a ScanProvider');
  }
  return context;
}

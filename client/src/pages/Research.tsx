import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Calendar,
  Users,
  Quote,
  Filter,
  ArrowLeft,
  Home
} from 'lucide-react';
import { ResearchPaper } from '@/types';
import { format } from 'date-fns';

//  research papers data
const MOCK_PAPERS: ResearchPaper[] = [
  {
    id: '1',
    title: 'Deep Learning for Automated Detection of Tuberculosis in Chest Radiographs: A Systematic Review',
    authors: ['Rajpurkar, P.', 'Irvin, J.', 'Zhu, K.', 'Yang, B.'],
    abstract: 'This systematic review evaluates the performance of deep learning algorithms for tuberculosis detection in chest X-rays. We analyzed 45 studies involving over 100,000 chest radiographs and found that modern CNN architectures achieve sensitivity above 90% and specificity above 85%, comparable to expert radiologists.',
    publishedDate: '2024-08-15',
    journal: 'Nature Medicine',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    citations: 342,
    keywords: ['tuberculosis', 'deep learning', 'chest x-ray', 'CNN'],
  },
  {
    id: '2',
    title: 'Explainable AI for Medical Image Analysis: A Survey of Current Methods and Clinical Applications',
    authors: ['Singh, A.', 'Sengupta, S.', 'Lakshminarayanan, V.'],
    abstract: 'We present a comprehensive survey of explainable AI techniques applied to medical imaging. The review covers gradient-based methods, attention mechanisms, and concept-based explanations, analyzing their effectiveness in providing clinically meaningful interpretations.',
    publishedDate: '2024-07-22',
    journal: 'Medical Image Analysis',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    citations: 128,
    keywords: ['explainable AI', 'medical imaging', 'interpretability', 'XAI'],
  },
  {
    id: '3',
    title: 'CheXNet: Radiologist-Level Pneumonia Detection on Chest X-Rays with Deep Learning',
    authors: ['Rajpurkar, P.', 'Irvin, J.', 'Zhu, K.'],
    abstract: 'We develop CheXNet, a 121-layer convolutional neural network that detects pneumonia from chest X-rays at a level exceeding practicing radiologists. The model was trained on ChestX-ray14, the largest publicly available chest X-ray dataset.',
    publishedDate: '2024-06-10',
    journal: 'arXiv (Stanford ML Group)',
    url: 'https://arxiv.org',
    citations: 2847,
    keywords: ['pneumonia', 'deep learning', 'chest x-ray', 'CheXNet'],
  },
  {
    id: '4',
    title: 'Automated Bone Fracture Detection Using Convolutional Neural Networks: A Multi-Center Validation Study',
    authors: ['Lindsey, R.', 'Daluiski, A.', 'Chopra, S.', 'Lachapelle, A.'],
    abstract: 'We present a deep learning system for detecting bone fractures in radiographs. In a multi-center study involving 10 hospitals and 31,000 X-rays, the AI system achieved 94% sensitivity and 92% specificity, reducing missed fractures by 35%.',
    publishedDate: '2024-05-18',
    journal: 'Radiology',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    citations: 456,
    keywords: ['bone fracture', 'deep learning', 'radiograph', 'CNN'],
  },
  {
    id: '5',
    title: 'Contour Detection and Segmentation in Medical Images Using U-Net Architectures',
    authors: ['Ronneberger, O.', 'Fischer, P.', 'Brox, T.'],
    abstract: 'We introduce variations of the U-Net architecture specifically designed for contour detection and anatomical segmentation in medical images. Our models achieve state-of-the-art performance on lung segmentation and lesion boundary detection tasks.',
    publishedDate: '2024-04-05',
    journal: 'IEEE Transactions on Medical Imaging',
    url: 'https://ieeexplore.ieee.org',
    citations: 1234,
    keywords: ['segmentation', 'U-Net', 'contour detection', 'medical imaging'],
  },
  {
    id: '6',
    title: 'Transfer Learning in Medical Imaging: From ImageNet to Pathology',
    authors: ['Mormont, R.', 'Geurts, P.', 'Marée, R.'],
    abstract: 'This study investigates the effectiveness of transfer learning from natural images to medical imaging tasks. We demonstrate that pre-trained models significantly improve performance on small medical datasets and reduce training time.',
    publishedDate: '2024-03-12',
    journal: 'Journal of Machine Learning Research',
    url: 'https://jmlr.org',
    citations: 567,
    keywords: ['transfer learning', 'ImageNet', 'medical imaging', 'deep learning'],
  },
  {
    id: '7',
    title: 'Federated Learning for Privacy-Preserving Medical AI: A Framework for Multi-Institutional Collaboration',
    authors: ['Sheller, M. J.', 'Edwards, B.', 'Reina, G. A.'],
    abstract: 'We propose a federated learning framework that enables multiple healthcare institutions to collaboratively train AI models without sharing patient data. The approach achieves comparable accuracy to centralized training while maintaining HIPAA compliance.',
    publishedDate: '2024-02-28',
    journal: 'Nature Digital Medicine',
    url: 'https://www.nature.com/npjdigitalmed',
    citations: 234,
    keywords: ['federated learning', 'privacy', 'medical AI', 'HIPAA'],
  },
  {
    id: '8',
    title: 'Uncertainty Quantification in Deep Learning for Medical Image Analysis',
    authors: ['Gal, Y.', 'Ghahramani, Z.'],
    abstract: 'We present methods for estimating prediction uncertainty in deep learning models applied to medical images. Our Bayesian approach helps identify cases requiring human review, improving clinical safety and trust in AI systems.',
    publishedDate: '2024-01-15',
    journal: 'Medical Image Computing and Computer Assisted Intervention',
    url: 'https://miccai.org',
    citations: 789,
    keywords: ['uncertainty', 'Bayesian deep learning', 'medical imaging', 'safety'],
  },
];

const FOCUS_AREAS = [
  'All',
  'Tuberculosis',
  'Pneumonia', 
  'Bone Fracture',
  'Explainable AI',
  'Deep Learning',
];

export default function Research() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');

  useEffect(() => {
    // API fetch
    const fetchPapers = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPapers(MOCK_PAPERS);
      setIsLoading(false);
    };
    fetchPapers();
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesArea = selectedArea === 'All' || 
                        paper.keywords.some(k => k.toLowerCase().includes(selectedArea.toLowerCase())) ||
                        paper.title.toLowerCase().includes(selectedArea.toLowerCase());
    return matchesSearch && matchesArea;
  });

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

        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
          <p className="text-muted-foreground mt-1">
            Academic publications in medical imaging and AI diagnostics
          </p>
        </div>

       
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers by title, author, or keyword..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {FOCUS_AREAS.map(area => (
              <Button
                key={area}
                variant={selectedArea === area ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedArea(area)}
              >
                {area}
              </Button>
            ))}
          </div>
        </div>

        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPapers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No papers found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-snug hover:text-primary transition-colors">
                        <a href={paper.url} target="_blank" rel="noopener noreferrer">
                          {paper.title}
                        </a>
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {paper.authors.join(', ')}
                      </CardDescription>
                    </div>
                    <a 
                      href={paper.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {paper.abstract}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.keywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-foreground">{paper.journal}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(paper.publishedDate), 'MMM yyyy')}
                      </span>
                    </div>
                    {paper.citations && (
                      <span className="flex items-center gap-1">
                        <Quote className="h-3 w-3" />
                        {paper.citations.toLocaleString()} citations
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

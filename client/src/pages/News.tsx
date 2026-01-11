import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Newspaper, 
  ExternalLink, 
  Search, 
  Clock, 
  RefreshCw,
  Stethoscope,
  Brain,
  Activity,
  ArrowLeft,
  Home
} from 'lucide-react';
import { NewsArticle } from '@/types';
import { format } from 'date-fns';

// news data
const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'AI System Achieves 95% Accuracy in Tuberculosis Detection from Chest X-rays',
    summary: 'A new deep learning model developed by researchers demonstrates remarkable accuracy in detecting tuberculosis from chest radiographs, potentially revolutionizing TB screening in resource-limited settings.',
    source: 'Nature Medicine',
    url: 'https://www.nature.com/nm',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'AI Research',
  },
  {
    id: '2',
    title: 'WHO Recommends AI-Powered CAD Tools for TB Screening Programs',
    summary: 'The World Health Organization has issued new guidelines recommending computer-aided detection software as an alternative to human readers in tuberculosis screening programs.',
    source: 'WHO News',
    url: 'https://www.who.int',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Healthcare Policy',
  },
  {
    id: '3',
    title: 'Explainable AI in Medical Imaging: Building Trust Through Transparency',
    summary: 'New research highlights the importance of interpretable AI models in clinical settings, showing that explainable systems improve physician adoption and patient outcomes.',
    source: 'JAMA Network',
    url: 'https://jamanetwork.com',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'AI Research',
  },
  {
    id: '4',
    title: 'Breakthrough in Pneumonia Detection Using Multi-Modal AI Analysis',
    summary: 'Scientists combine chest X-ray analysis with clinical data to create a comprehensive AI system that can differentiate between bacterial and viral pneumonia with high precision.',
    source: 'The Lancet Digital Health',
    url: 'https://www.thelancet.com',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Clinical Research',
  },
  {
    id: '5',
    title: 'Mobile AI App Enables TB Screening in Remote Villages',
    summary: 'A smartphone-based AI application is helping community health workers screen for tuberculosis in rural areas without access to radiologists, processing images in under 30 seconds.',
    source: 'MIT Technology Review',
    url: 'https://www.technologyreview.com',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Healthcare Innovation',
  },
  {
    id: '6',
    title: 'FDA Approves First AI System for Autonomous Bone Fracture Detection',
    summary: 'The U.S. Food and Drug Administration has cleared an AI system that can independently identify bone fractures in X-rays, marking a significant milestone for autonomous medical AI.',
    source: 'FDA News',
    url: 'https://www.fda.gov',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Regulatory',
  },
  {
    id: '7',
    title: 'Deep Learning Outperforms Radiologists in Lung Cancer Screening Study',
    summary: 'A large-scale clinical trial shows that AI systems can detect early-stage lung cancer with greater accuracy than human radiologists, potentially saving thousands of lives through earlier intervention.',
    source: 'New England Journal of Medicine',
    url: 'https://www.nejm.org',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Clinical Research',
  },
  {
    id: '8',
    title: 'India Launches National AI Health Initiative for Rural Healthcare',
    summary: 'The Indian government announces a nationwide program to deploy AI-powered diagnostic tools in primary health centers across rural areas, aiming to improve access to specialist-level diagnosis.',
    source: 'Healthcare Global',
    url: 'https://www.healthcareglobal.com',
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Healthcare Policy',
  },
];

const CATEGORIES = ['All', 'AI Research', 'Clinical Research', 'Healthcare Policy', 'Healthcare Innovation', 'Regulatory'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'AI Research': <Brain className="h-4 w-4" />,
  'Clinical Research': <Stethoscope className="h-4 w-4" />,
  'Healthcare Policy': <Activity className="h-4 w-4" />,
  'Healthcare Innovation': <Activity className="h-4 w-4" />,
  'Regulatory': <Activity className="h-4 w-4" />,
};

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // API fetch
    const fetchNews = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews(MOCK_NEWS);
      setIsLoading(false);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const refreshNews = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNews(MOCK_NEWS);
    setIsLoading(false);
  };

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

        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medical News</h1>
            <p className="text-muted-foreground mt-1">
              Latest updates in healthcare AI and medical imaging
            </p>
          </div>
          <Button variant="outline" onClick={refreshNews} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap">
              {CATEGORIES.map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredNews.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {CATEGORY_ICONS[article.category]}
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-snug hover:text-primary transition-colors">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">{article.source}</span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                      </span>
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Read
                      </a>
                    </div>
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

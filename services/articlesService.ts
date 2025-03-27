import type { ArticleCardProps } from '@/components/ui/Cards/Articles/ArticleCard';

/**
 * Mock service para obter dados de artigos
 */
export const getMockArticles = (): ArticleCardProps[] => {
  return [
    {
      id: 1,
      title: 'Top 10 TypeScript Tips Every Developer Should Know',
      excerpt: 'Improve your TypeScript code with these essential tips that will make you more productive.',
      thumbnailUrl: 'https://picsum.photos/id/0/800/600',
      category: 'Development',
      readTime: 8,
      publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      views: 1245,
      likes: 87,
      author: {
        id: 1,
        name: 'Alex Johnson',
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
      },
    },
    {
      id: 2,
      title: 'Creating Accessible React Components: A Complete Guide',
      excerpt: 'Learn how to build React components that everyone can use, regardless of ability.',
      thumbnailUrl: 'https://picsum.photos/id/1/800/600',
      category: 'Design',
      readTime: 12,
      publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      views: 932,
      likes: 64,
      author: {
        id: 2,
        name: 'Maria Garcia',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
      },
    },
    {
      id: 3,
      title: 'Next.js 14: What&apos;s New and Why It Matters',
      excerpt: 'Explore the latest features of Next.js 14 and how they can improve your web development workflow.',
      thumbnailUrl: 'https://picsum.photos/id/20/800/600',
      category: 'Technology',
      readTime: 6,
      publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      views: 1876,
      likes: 128,
      author: {
        id: 3,
        name: 'David Kim',
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
      },
    },
    {
      id: 4,
      title: 'Responsive Design in 2025: Beyond Media Queries',
      excerpt: 'Discover modern approaches to responsive design using CSS Container Queries and other new features.',
      thumbnailUrl: 'https://picsum.photos/id/42/800/600',
      category: 'Design',
      readTime: 10,
      publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
      views: 754,
      likes: 53,
      author: {
        id: 4,
        name: 'Emma Wilson',
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
      },
    },
    {
      id: 5,
      title: 'Getting Started with Tailwind CSS: A Practical Approach',
      excerpt: 'A beginner-friendly guide to Tailwind CSS that will have you building beautiful interfaces in no time.',
      thumbnailUrl: 'https://picsum.photos/id/65/800/600',
      category: 'Development',
      readTime: 9,
      publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      views: 1023,
      likes: 76,
      author: {
        id: 5,
        name: 'Juan Perez',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
    },
  ];
};

// Função para obter artigos com possibilidade de filtros
export const getArticles = async (params?: {
  limit?: number;
  category?: string;
  trending?: boolean;
}): Promise<ArticleCardProps[]> => {
  // Em um ambiente real, isso seria uma chamada de API
  let articles = getMockArticles();
  
  // Aplicar filtros
  if (params?.category) {
    articles = articles.filter(article => article.category === params.category);
  }
  
  // Ordenar por trending (baseado em visualizações + likes)
  if (params?.trending) {
    articles.sort((a, b) => {
      const scoreA = (a.views || 0) + (a.likes || 0) * 2; // Peso maior para likes
      const scoreB = (b.views || 0) + (b.likes || 0) * 2;
      return scoreB - scoreA;
    });
  }
  
  // Limitar resultados
  if (params?.limit && params.limit > 0) {
    articles = articles.slice(0, params.limit);
  }
  
  // Simulando delay de uma API real
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return articles;
};
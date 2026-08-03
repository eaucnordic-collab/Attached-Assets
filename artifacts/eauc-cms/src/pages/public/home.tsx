import { useListPages, useListBlocks } from '@workspace/api-client-react';
import { BlockRenderer } from '@/components/block-renderer';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: pages, isLoading: pagesLoading } = useListPages({ status: 'published' });
  
  const homePage = pages?.find(p => p.isHome);
  
  const { data: blocks, isLoading: blocksLoading } = useListBlocks(homePage?.id || 0, { 
    query: { enabled: !!homePage?.id, queryKey: ['/api/pages', homePage?.id, 'blocks'] } 
  });

  if (pagesLoading || (homePage && blocksLoading)) {
    return (
      <div className="w-full">
        <Skeleton className="h-[60vh] w-full rounded-none" />
        <div className="container mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!homePage || !blocks || blocks.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EAUC Nordic</h1>
        <p className="text-gray-600">The home page content is currently empty. Please configure it in the admin panel.</p>
      </div>
    );
  }

  return (
    <div>
      <BlockRenderer blocks={blocks.sort((a, b) => a.order - b.order)} />
    </div>
  );
}

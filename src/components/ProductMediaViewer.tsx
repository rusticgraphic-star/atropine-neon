import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface ProductMediaViewerProps {
  thumbnail: string;
  images?: string[];
  videos?: string[];
  productName: string;
}

export const ProductMediaViewer = ({ 
  thumbnail, 
  images = [], 
  videos = [], 
  productName 
}: ProductMediaViewerProps) => {
  // Combine all media into one array
  const allMedia: MediaItem[] = [
    { type: 'image', url: thumbnail },
    ...images.map(url => ({ type: 'image' as const, url })),
    ...videos.map(url => ({ type: 'video' as const, url }))
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainViewportRef, mainEmbla] = useEmblaCarousel({ loop: false, skipSnaps: false });
  const [thumbViewportRef, thumbEmbla] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback((index: number) => {
    if (!mainEmbla || !thumbEmbla) return;
    mainEmbla.scrollTo(index);
  }, [mainEmbla, thumbEmbla]);

  const onSelect = useCallback(() => {
    if (!mainEmbla || !thumbEmbla) return;
    setSelectedIndex(mainEmbla.selectedScrollSnap());
    thumbEmbla.scrollTo(mainEmbla.selectedScrollSnap());
  }, [mainEmbla, thumbEmbla]);

  useEffect(() => {
    if (!mainEmbla) return;
    onSelect();
    mainEmbla.on('select', onSelect);
    return () => {
      mainEmbla.off('select', onSelect);
    };
  }, [mainEmbla, onSelect]);

  const scrollPrev = useCallback(() => {
    if (mainEmbla) mainEmbla.scrollPrev();
  }, [mainEmbla]);

  const scrollNext = useCallback(() => {
    if (mainEmbla) mainEmbla.scrollNext();
  }, [mainEmbla]);

  const canScrollPrev = mainEmbla?.canScrollPrev() ?? false;
  const canScrollNext = mainEmbla?.canScrollNext() ?? false;

  return (
    <div className="space-y-4">
      {/* Main Viewer */}
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-panel" ref={mainViewportRef}>
          <div className="flex touch-pan-y">
            {allMedia.map((media, index) => (
              <div key={index} className="relative flex-[0_0_100%] min-w-0">
                <div className="relative aspect-square">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`${productName} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm ${
                !canScrollPrev ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm ${
                !canScrollNext ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm text-foreground">
            {selectedIndex + 1} / {allMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="overflow-hidden" ref={thumbViewportRef}>
          <div className="flex gap-2">
            {allMedia.map((media, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_20%] md:flex-[0_0_15%] min-w-0 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-primary shadow-neon'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="relative aspect-square">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-primary border-y-[4px] border-y-transparent ml-0.5" />
                      </div>
                    </div>
                  )}
                  {media.type === 'video' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[5px] border-l-black border-y-[3px] border-y-transparent ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

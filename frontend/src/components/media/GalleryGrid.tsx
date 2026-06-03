import ImagePlaceholder from './ImagePlaceholder';

export interface GalleryItem {
  id: string;
  src?: string;
  alt: string;
  caption?: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  placeholderLabel?: string;
  className?: string;
}

export default function GalleryGrid({
  items,
  columns = 3,
  placeholderLabel = 'Gallery image — Educate.Strong to provide',
  className = '',
}: GalleryGridProps) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-3 ${className}`}>
      {items.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-lg">
          {item.src ? (
            <>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full aspect-square object-cover"
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white text-xs px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  {item.caption}
                </div>
              )}
            </>
          ) : (
            <ImagePlaceholder
              label={item.alt || placeholderLabel}
              aspectRatio="1/1"
              className="rounded-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
}

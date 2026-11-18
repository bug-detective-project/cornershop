import { useState } from 'react';

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-border bg-surface-raised text-muted">No photos yet</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <img data-testid="gallery-main" src={images[selected]} alt={name} className="aspect-[4/3] w-full rounded-xl border border-border object-cover" />
      <ul className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <li key={image}>
            <button
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === selected}
              className={`overflow-hidden rounded-lg border-2 ${index === selected ? 'border-accent' : 'border-border'}`}
              onClick={() => setSelected(index)}
            >
              <img src={image} alt="" className="h-16 w-20 object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

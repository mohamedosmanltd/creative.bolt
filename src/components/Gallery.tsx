import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  images: string[]
  alt: string
}

export default function Gallery({ images, alt }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [idx, setIdx] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
        No images
      </div>
    )
  }

  const open = (i: number) => {
    setIdx(i)
    setActive(images[i])
  }

  const next = () => {
    const n = (idx + 1) % images.length
    setIdx(n)
    setActive(images[n])
  }

  const prev = () => {
    const n = (idx - 1 + images.length) % images.length
    setIdx(n)
    setActive(images[n])
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Main image */}
        <button
          onClick={() => open(0)}
          className="sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-square overflow-hidden rounded-xl group relative bg-neutral-100"
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </button>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => open(i + 1)}
            className="aspect-square overflow-hidden rounded-xl group relative bg-neutral-100"
          >
            <img
              src={img}
              alt={`${alt} ${i + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-sm">
                +{images.length - 5}
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActive(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation()
              setActive(null)
            }}
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <img
            src={active}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
          >
            <ChevronRight className="w-7 h-7" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

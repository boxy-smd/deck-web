import { User2 } from 'lucide-react'
import Image from 'next/image'

interface ProfileImageProps {
  src?: string
  alt?: string
}

export function ProfileImage({ src, alt }: ProfileImageProps) {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt || ''}
          className="h-10 w-10 cursor-pointer rounded-full"
          width={40}
          height={40}
        />
      ) : (
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-300">
          <User2 size={24} className="text-slate-700" />
        </div>
      )}
    </>
  )
}

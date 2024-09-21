import { Image } from 'lucide-react'

import { Badge } from '../ui/badge'

interface ContentPreviewProps {
  bannerUrl?: string
  title?: string
  trails?: string[]
  subject?: string
  publishedYear?: number
  semester?: number
  description?: string
  professors?: string[]
  content?: string
}

export function ContentPreview({
  bannerUrl,
  title,
  trails,
  subject,
  publishedYear,
  semester,
  description,
  professors,
  content,
}: ContentPreviewProps) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-[860px]">
        <div>
          <div
            className="h-[300px] w-[860px] bg-slate-600"
            style={{
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {title && (
            <h1 className="pt-6 font-semibold text-[32px] text-slate-700">
              {title}
            </h1>
          )}

          {trails && (
            <div className="flex gap-4 pt-6">
              {trails.map(trail => (
                <Badge key={trail}>
                  <Image className="size-4 text-slate-900" />
                  {trail}
                </Badge>
              ))}
            </div>
          )}

          {(subject || publishedYear || semester) && (
            <div className="flex items-center gap-4 pt-6">
              {subject && <Badge>{subject}</Badge>}
              {semester && <Badge>{semester}º Semestre</Badge>}
              {publishedYear && <Badge>{publishedYear}</Badge>}
            </div>
          )}

          {description && (
            <p className="pt-6 pl-[6px] text-slate-700">{description}</p>
          )}

          {professors && professors?.length > 0 && (
            <div className="flex items-center gap-4 pt-6">
              {professors.map(professor => (
                <Badge key={professor}>{professor}</Badge>
              ))}
            </div>
          )}
        </div>

        {content && (
          <div className="w-full py-11">
            <div
              className="prose prose-slate w-full max-w-none pt-6 text-slate-700 leading-5"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </main>
  )
}

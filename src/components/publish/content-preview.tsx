import { getMultiTrailConfig, getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'
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
  trails = [],
  subject,
  publishedYear,
  semester,
  description,
  professors,
  content,
}: ContentPreviewProps) {
  const multiTrailConfig = getMultiTrailConfig()
  const trailTheme =
    trails.length > 0
      ? trails.length > 1
        ? [multiTrailConfig.bgColor, multiTrailConfig.textColor]
        : (() => {
            const config = getTrailConfig(trails[0])
            return [config.bgColor, config.textColor]
          })()
      : [cn('bg-deck-bg'), cn('text-deck-secondary-text')]

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
            <h1 className="pt-6 font-semibold text-[32px] text-deck-darkest">
              {title}
            </h1>
          )}

          {trails && (
            <div className="flex gap-4 pt-6">
              {trails.map(trail => {
                const isMultiTrail = trails.length > 1
                const config = isMultiTrail
                  ? multiTrailConfig
                  : getTrailConfig(trail)
                const { icon: Icon, color, bgColor, textColor } = config

                return (
                  <Badge key={trail} className={cn(bgColor, textColor)}>
                    <Icon
                      className="size-[18px]"
                      innerColor={color}
                      foregroundColor="transparent"
                    />
                    {trail}
                  </Badge>
                )
              })}
            </div>
          )}

          {(subject || publishedYear || semester) && (
            <div className="flex items-center gap-4 pt-6">
              {subject && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {subject}
                </Badge>
              )}

              {semester && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {semester}º Semestre
                </Badge>
              )}

              {publishedYear && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {publishedYear}
                </Badge>
              )}
            </div>
          )}

          {description && (
            <p className="pt-6 pl-[6px] text-deck-secondary-text">
              {description}
            </p>
          )}

          {professors && professors.length > 0 && (
            <div className="flex items-center gap-4 pt-6">
              {professors.map(professor => (
                <Badge
                  key={professor}
                  className={cn(trailTheme[0], trailTheme[1])}
                >
                  {professor}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {content && (
          <div className="w-full py-11">
            <div
              className="prose prose-slate w-full max-w-none pt-6 text-deck-secondary-text leading-5"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Isso é seguro
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </main>
  )
}

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
    <main className="flex w-full flex-col items-center px-2 py-4 sm:px-3 sm:py-6 lg:px-0 lg:py-0">
      <div className="w-full max-w-[860px]">
        <div>
          <div
            className="h-[180px] w-full rounded-md bg-slate-600 sm:h-[220px] lg:h-[300px] lg:rounded-none"
            style={{
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {title && (
            <h1 className="pt-5 font-semibold text-[28px] text-deck-darkest leading-tight sm:pt-6 sm:text-[32px]">
              {title}
            </h1>
          )}

          {trails && (
            <div className="flex flex-wrap gap-2.5 pt-5 sm:gap-4 sm:pt-6">
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
            <div className="flex flex-wrap items-center gap-2.5 pt-5 sm:gap-4 sm:pt-6">
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
            <p className="pt-5 text-deck-secondary-text sm:pt-6">
              {description}
            </p>
          )}

          {professors && professors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 pt-5 sm:gap-4 sm:pt-6">
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
          <div className="w-full py-8 sm:py-10 lg:py-11">
            <div
              className="rich-text-content w-full max-w-none pt-4 text-deck-secondary-text leading-5 sm:pt-6"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Isso é seguro
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </main>
  )
}

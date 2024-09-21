import { ProjectCard, type ProjectCardProps } from './project-card'

export function ProjectCardPreview({
  title,
  author,
  description,
  professors,
  bannerUrl,
  publishedYear,
  semester,
  subject,
}: ProjectCardProps) {
  return (
    <div className="flex h-[716px] w-full max-w-[1036px] items-center justify-center gap-5">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-full w-[332px] rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        <div className="h-full w-[332px] rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-[90px] w-full rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />

        <ProjectCard
          bannerUrl={bannerUrl}
          title={title}
          author={author}
          publishedYear={publishedYear}
          semester={semester}
          subject={subject}
          description={description}
          professors={professors}
        />

        <div className="h-[90px] w-full rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-full w-[332px] rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        <div className="h-full w-[332px] rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>
    </div>
  )
}

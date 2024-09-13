import { ProjectCard, type ProjectCardProps } from './project-card'

export function ProjectCardPreview({
  title,
  author,
  tags,
  description,
  professor,
}: ProjectCardProps) {
  return (
    <div className="flex h-[716px] w-full items-center justify-center gap-5">
      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-full w-full rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        <div className="h-full w-full rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-[90px] w-full rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />

        <ProjectCard
          title={title}
          author={author}
          tags={tags}
          description={description}
          professor={professor}
        />

        <div className="h-[90px] w-full rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-5">
        <div className="h-full w-full rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        <div className="h-full w-full rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
      </div>
    </div>
  )
}

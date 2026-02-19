'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import homeWidget from '@/assets/widgets/homeWidget.svg'
import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Profile } from '@/entities/profile'
import { useUsersControllerGetProfile } from '@/http/api'

export default function ProfilePage() {
  const { username } = useParams<{
    username: string
  }>()

  const { data: profileData, isLoading } = useUsersControllerGetProfile(
    username,
    {
      query: {
        enabled: Boolean(username),
      },
    },
  )

  // The Swagger spec is missing 'posts' and 'drafts', but the backend returns them.
  // Casting to our internal Profile type to fix TypeScript errors.
  const profile = profileData as unknown as Profile | undefined

  const postsMidColumn = profile?.posts.filter((_, index) => index % 2 === 0)
  const postsLeftColumn = profile?.posts.filter((_, index) => index % 2 === 1)

  return (
    <div className="mx-auto grid w-full max-w-[1036px] grid-cols-1 gap-4 bg-deck-bg px-3 py-4 sm:px-4 lg:grid-cols-3 lg:gap-5 lg:px-0 lg:py-5">
      <div className="flex justify-center lg:col-span-1 lg:justify-start">
        {isLoading || !profile ? (
          <Skeleton className="h-[496px] w-full max-w-[332px] rounded-xl" />
        ) : (
          <ProfileCard {...profile} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:col-span-2 lg:grid-cols-2">
        <div className="flex flex-col gap-y-4 sm:gap-y-5">
          <div className="hidden overflow-hidden rounded-xl sm:block">
            <Image
              src={homeWidget}
              width={332}
              height={201}
              alt="Home Widget"
              className="h-auto w-full"
            />
          </div>

          {isLoading || !profile
            ? [1, 2, 3].map(skeleton => (
                <Skeleton
                  key={`mid-${skeleton}`}
                  className="h-[495px] w-full rounded-xl"
                />
              ))
            : postsMidColumn?.map(post => (
                <Link
                  key={post.id}
                  href={`/projects/${post.id}`}
                  className="flex justify-center"
                >
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={profile.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject?.name}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
                  />
                </Link>
              ))}
        </div>

        <div className="flex flex-col gap-y-4 sm:gap-y-5">
          {isLoading || !profile
            ? [1, 2, 3].map(skeleton => (
                <Skeleton
                  key={`left-${skeleton}`}
                  className="h-[495px] w-full rounded-xl"
                />
              ))
            : postsLeftColumn?.map(post => (
                <Link
                  key={post.id}
                  href={`/projects/${post.id}`}
                  className="flex justify-center"
                >
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={profile.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject?.name}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
                  />
                </Link>
              ))}
        </div>
      </div>
    </div>
  )
}

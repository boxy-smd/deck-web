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
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 bg-deck-bg py-5">
      <div className="col-span-3 flex w-full justify-between">
        <div className="flex gap-5">
          <div className="flex flex-col gap-y-5">
            {isLoading || !profile ? (
              <Skeleton className="h-[496px] w-[332px]" />
            ) : (
              <ProfileCard {...profile} />
            )}
          </div>

          <div className="flex flex-col gap-y-5">
            <div className="h-[201px] w-[332px] rounded-xl">
              <Image
                src={homeWidget}
                width={332}
                height={201}
                alt="Home Widget"
              />
            </div>

            {isLoading || !profile
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                ))
              : postsMidColumn?.map(post => (
                  <Link key={post.id} href={`/projects/${post.id}`}>
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

          <div className="flex flex-col gap-y-5">
            {isLoading || !profile
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                ))
              : postsLeftColumn?.map(post => (
                  <Link key={post.id} href={`/projects/${post.id}`}>
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
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'
import { Skeleton } from '@/components/ui/skeleton'
import { getStudentProfile } from '@/functions/students'

import homeWidget from '@/assets/homeWidget.svg'
import Image from 'next/image'

export default function ProfilePage() {
  const { username } = useParams<{
    username: string
  }>()

  const getProfile = useCallback(async () => {
    try {
      const profile = await getStudentProfile(username)
      return profile
    } catch (error) {
      console.error('Failed to get profile:', error)
      return undefined
    }
  }, [username])

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: getProfile,
    enabled: Boolean(username),
  })

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
              <ProfileCard
                id={profile.id}
                name={profile.name}
                username={profile.username}
                semester={profile.semester}
                about={profile.about}
                profileUrl={profile.profileUrl}
                trails={profile.trails}
              />
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
                  <Link key={post.id} href={`/project/${post.id}`}>
                    <ProjectCard
                      bannerUrl={post.bannerUrl}
                      title={post.title}
                      author={profile.name}
                      publishedYear={post.publishedYear}
                      semester={post.semester}
                      subject={post.subject}
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
                  <Link key={post.id} href={`/project/${post.id}`}>
                    <ProjectCard
                      bannerUrl={post.bannerUrl}
                      title={post.title}
                      author={profile.name}
                      publishedYear={post.publishedYear}
                      semester={post.semester}
                      subject={post.subject}
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

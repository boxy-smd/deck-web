'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'
import { getStudentProfile } from '@/functions/students'

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

  const { data: profile } = useQuery({
    queryKey: ['profile', username],
    queryFn: getProfile,
    enabled: Boolean(username),
  })

  const postsMidColumn = profile?.posts.filter((_, index) => index % 2 === 0)
  const postsLeftColumn = profile?.posts.filter((_, index) => index % 2 === 1)

  return (
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5">
      <div className="col-span-3 flex w-full justify-between">
        {profile ? (
          <>
            <div className="flex gap-5">
              <div className="flex flex-col gap-y-5">
                <ProfileCard
                  id={profile.id}
                  name={profile.name}
                  username={profile.username}
                  semester={profile.semester}
                  about={profile.about}
                  profileUrl={profile.profileUrl}
                  trails={profile.trails}
                />
              </div>

              <div className="flex flex-col gap-y-5">
                <div className="h-[201px] w-[332px] bg-slate-500" />
                {postsMidColumn?.map(post => (
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
                    />
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-y-5">
                {postsLeftColumn?.map(post => (
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
                    />
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>Carregando...</div>
        )}
      </div>
    </div>
  )
}

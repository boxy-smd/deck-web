'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'
import type { Profile } from '@/entities/profile'
import { instance } from '@/lib/axios'

export default function ProfilePage() {
  const { username } = useParams<{
    username: string
  }>()

  const getProfile = useCallback(async () => {
    try {
      const { data } = await instance.get<{
        profile: Profile
      }>(`/profiles/${username}`)

      return data.profile
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

  const col1Projects = profile?.posts.filter((_, index) => index % 2 === 0)
  const col2Projects = profile?.posts.filter((_, index) => index % 2 === 1)

  return (
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5">
      <div className="col-span-3 flex w-full justify-between">
        {profile ? (
          <>
            <div className="flex gap-5">
              {/* Coluna 1 */}
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
                {col1Projects?.map(project => (
                  <ProjectCard
                    key={project.id}
                    bannerUrl={project.bannerUrl}
                    title={project.title}
                    author={profile.name}
                    publishedYear={project.publishedYear}
                    semester={project.semester}
                    subject={project.subject}
                    description={project.description}
                    professors={project.professors}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-y-5">
                {col2Projects?.map(project => (
                  <ProjectCard
                    key={project.id}
                    bannerUrl={project.bannerUrl}
                    title={project.title}
                    author={profile.name}
                    publishedYear={project.publishedYear}
                    semester={project.semester}
                    subject={project.subject}
                    description={project.description}
                    professors={project.professors}
                  />
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

'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback } from 'react'

import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'
import type { Profile } from '@/entities/profile'

export default function ProfilePage() {
  const { username } = useParams<{
    username: string
  }>()

  const getProfile = useCallback(async () => {
    try {
      const response = await fetch(
        `https://deck-api.onrender.com/profiles/${username}`,
      )

      const data = (await response.json()) as {
        profile: Profile
      }

      console.log(data.profile)

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

  return (
    <div className="mx-10 flex">
      {profile ? (
        <>
          <div className="mr-5 flex w-1/3 justify-end">
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

          <div className="flex w-2/3 justify-center">
            <div className="grid grid-cols-2 gap-5">
              {profile.posts.map(post => (
                <ProjectCard
                  key={post.id}
                  id={post.id}
                  bannerUrl={post.bannerUrl}
                  title={post.title}
                  author={profile.name}
                  tags={[post.subject, post.semester, post.publishedYear]}
                  description={post.description}
                  professor={post.professors}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>Carregando...</div>
      )}
    </div>
  )
}

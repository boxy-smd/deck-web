import type { EditProfileModalSchema } from '@/components/profile/profile-card'
import type { Profile } from '@/entities/profile'
import type { RegisterFormSchema } from '@/hooks/auth/use-register'
import { instance } from '@/lib/axios'

export async function getStudentProfile(username: string) {
  const { data } = await instance.get<{
    profile: Profile
  }>(`/profiles/${username}`)

  return data.profile
}

export async function searchStudents(searchQuery: string) {
  const { data } = await instance.get<{
    students: Profile[]
  }>(`/students?${searchQuery}`)

  return data.students
}

export async function uploadProfileImage(file: File, username: string) {
  const formData = new FormData()

  formData.append('file', file)

  const { data } = await instance.postForm<{
    url: string
  }>(`/profile-images/${username}`, {
    formData,
  })

  return data.url
}

export async function register(data: RegisterFormSchema, profileUrl: string) {
  await instance.post('/students', {
    email: data.email,
    password: data.password,
    username: data.username,
    name: String(`${data.firstName} ${data.lastName}`).trim(),
    semester: data.semester,
    trailsIds: data.trails,
    about: data.about,
    profileUrl,
  })
}

export async function editProfile(
  id: string,
  data: EditProfileModalSchema,
  trailsIds: string[],
) {
  await instance.put(`/profiles/${id}`, {
    semester: data.semester,
    trailsIds,
    about: data.about,
  })
}

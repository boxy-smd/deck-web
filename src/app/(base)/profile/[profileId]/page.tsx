'use client'

import { ProfileCard } from '@/components/profile/profile-card'
import { ProjectCard } from '@/components/project-card'

const generateId = () => Math.random().toString(36).substring(2, 9)
    
const projects = [
  {
    id: generateId(),
    title: 'Arte em RA: Interação Imersiva no Ensino de Arte',
    author: 'Alexandre Gomes',
    tags: ['Interação Humano Computador', '3º Sem.', '2024'],
    description:
      'O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico.',
    professor: 'Profa Ticianne D.',
  },
]

const profile = [
  {
    nickname: '@agomes',
    author: 'Alexandre Gomes',
    semester: '3º Semestre',
    tags: ['Design', 'Audiovisual'],
    description:
      'Estudante apaixonado por design e audiovisual, sempre em busca de novas maneiras de conectar a criatividade e a tecnologia em projetos inovadores. Explorando experiências visuais e que possam resolver problemas e impactar positivamente o ambiente universitário.',
  },
]

export default function Home() {
  return (
    <div className="mx-10 flex">
      <div className="mr-5 flex w-1/3 justify-end ">
        <ProfileCard
          nickname={profile[0].nickname}
          semester={profile[0].semester}
          author={profile[0].author}
          tags={profile[0].tags}
          description={profile[0].description}
        />
      </div>
      <div className="flex w-2/3 justify-center">
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: 5 }).map(() => (
            <ProjectCard
              key={`project-${generateId()}`}
              title={projects[0].title}
              author={projects[0].author}
              tags={projects[0].tags}
              description={projects[0].description}
              professor={projects[0].professor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

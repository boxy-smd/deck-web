'use client'
import ProjectView from '@/components/project-view'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProjectPage() {
  const router = useRouter()

  return (
    <div>
      <button
        type="button" onClick={() => router.back()}
        className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200"
      >
        <ChevronLeft size={24} />
      </button>
      <ProjectView
        userName="Alexandre Gomes"
        userHandle="alegomes01"
        projectTitle="Arte em RA: Interação Imersiva no Ensino de Arte"
        projectDescription="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas ao mundo físico, criando uma experiência imersiva. A interface foi projetada para ser intuitiva e acessível, com foco na usabilidade e inclusão."
        tags={['Design', 'Audiovisual']}
        course="Interação Humano-Computador I"
        semester="3º Semestre"
        year="2024"
        teacher="Profª. Ticianne Darin"
        introduction="O projeto 'Realidade Aumentada no Ensino de Arte' visa transformar a forma como a arte é ensinada e vivenciada nas escolas, utilizando a tecnologia de Realidade Aumentada (RA). Através de um aplicativo inovador, o projeto proporciona uma interação imersiva com obras de arte, integrando elementos audiovisuais para criar uma experiência educativa envolvente e acessível."
        objective="O objetivo principal deste projeto é enriquecer o processo de ensino de arte, permitindo que os alunos visualizem e interajam com obras de arte famosas sobrepostas ao ambiente físico. A RA oferece uma maneira única de explorar e entender a arte, proporcionando uma aprendizagem mais dinâmica e significativa."
        expectedResults="Espera-se que o aplicativo proporcione uma experiência educacional enriquecedora, facilitando a compreensão e apreciação da arte de uma maneira envolvente e interativa. O projeto visa também aumentar o interesse dos alunos pela arte, promovendo um aprendizado mais efetivo e acessível."
        conclusion="Este projeto representa uma inovação no campo da educação artística, alavancando a tecnologia de Realidade Aumentada para criar novas oportunidades de aprendizado. A integração do design e audiovisual no aplicativo busca oferecer uma experiência educativa única, alinhada com as necessidades e expectativas dos alunos modernos."
        comments={[
          { userHandle: 'levikbrito', content: 'Achei sensacional! Parabéns pelo projeto, ta bala' },
          { userHandle: 'gabrielsousaql', content: 'Muito bom cara, achei uma pesquisa muito útil e bem feita. Sinto que vc podia elaborar um pouco mais sobre os métodos de avaliação e sobre os testes que foram realizados, mas além disso sinto que foi um trabalho sensacional. Tá de parabéns!!' },
          { userHandle: 'fonsecc', content: 'Arrasou <3' }
        ]}
      />
      
    </div>
  )
}

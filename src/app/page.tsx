import { CardProject } from '@/components/card-project'

export default function Home() {
  return (
    <main className='mt-[10%] flex items-center justify-center gap-8'>
      <CardProject
        title="Arte em RA: Interação Imersiva no Ensino de Arte"
        author="Alexandre Gomes"
        tags={['Interação Humano Computador', '3º Sem.', '2024']}
        description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
        professor="Profa Ticianne D."
      />
      <CardProject
        title="Sistema de Gestão de Estoque"
        author="Maria Silva"
        tags={['Banco de Dados', '3º Sem.', '2024']}
        description="O projeto consiste em um sistema de gestão de estoque para pequenas empresas. A aplicação permite o cadastro de produtos, controle de entrada e saída, além de relatórios gerenciais."
        professor="Prof. João da Silva"
       />
      <CardProject
        title="tste"
        author="teste"
        tags={['teste', '2º Sem.', '2021']}
        description="teste."
        professor="teste"
       />
    </main>
  )
}

'use client'

import { Image, ListFilter } from 'lucide-react'
import { useState } from 'react'

import { CardProject } from '@/components/card-project'
import { FilterButton } from '@/components/filter/filter-button'
import { Filter } from '@/components/filter/filter-projects'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const generateId = () => Math.random().toString(36).substring(2, 9)

const trails = [
  {
    id: generateId(),
    value: 'design',
    label: 'Design',
  },
  {
    id: generateId(),
    value: 'sistemas',
    label: 'Sistemas',
  },
  {
    id: generateId(),
    value: 'audiovisual',
    label: 'Audiovisual',
  },
  {
    id: generateId(),
    value: 'jogos',
    label: 'Jogos',
  },
]

export default function Home() {
  const [selectedTrails, setSelectedTrails] = useState<string[]>([])

  function toggleTrail(trail: string) {
    if (selectedTrails.includes(trail)) {
      setSelectedTrails(selectedTrails.filter(item => item !== trail))
    } else {
      setSelectedTrails([...selectedTrails, trail])
    }
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-slate-50">
      <div className="grid w-fit grid-cols-3 gap-5 px-[200px] py-5">
        <div className="col-span-3 flex w-full justify-between">
          <div className="flex items-start gap-4">
            <ToggleGroup
              className="flex flex-wrap justify-start gap-4"
              value={selectedTrails}
              type="multiple"
            >
              {trails.map(option => (
                <ToggleGroupItem
                  onClick={() => toggleTrail(option.value)}
                  key={option.value}
                  value={option.value}
                  variant={
                    selectedTrails.includes(option.value) ? 'added' : 'default'
                  }
                  className="gap-2"
                >
                  <Image className="size-[18px]" />
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <FilterButton>
                <ListFilter size={18} />
                Filtros
              </FilterButton>
            </PopoverTrigger>

            <PopoverContent className="w-[300px]">
              <Filter />
            </PopoverContent>
          </Popover>
        </div>

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={['Interação Humano Computador', '3º Sem.', '2024']}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={['Interação Humano Computador', '3º Sem.', '2024']}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={['Interação Humano Computador', '3º Sem.', '2024']}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={['Interação Humano Computador', '3º Sem.', '2024']}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={['Interação Humano Computador', '3º Sem.', '2024']}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />
      </div>
    </main>
  )
}

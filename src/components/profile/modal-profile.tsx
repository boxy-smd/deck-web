import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ChevronRight, ImageIcon, Plus, X } from 'lucide-react'
import { useState } from 'react'

const trails = [
  { id: 'design', value: 'design', label: 'Design' },
  { id: 'sistemas', value: 'sistemas', label: 'Sistemas' },
  { id: 'audiovisual', value: 'audiovisual', label: 'Audiovisual' },
  { id: 'jogos', value: 'jogos', label: 'Jogos' },
]

export function Modal() {
  const [selectedSemester, setSelectedSemester] =
    useState<string>('3º Semestre') // Especifica o tipo da variável
  const [selectedTrails, setSelectedTrails] = useState<string[]>([]) // Especifica o tipo correto como array de strings
  const [description, setDescription] = useState<string>('') // Especifica o tipo string

  function toggleTrail(trail: string) {
    setSelectedTrails(prevTrails =>
      prevTrails.includes(trail)
        ? prevTrails.filter(item => item !== trail)
        : [...prevTrails, trail],
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-white px-8 pt-9">
      <div className="mb-6 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-slate-700" />

      <div className="flex w-full flex-col">
        <div className="mb-6">
          <span className="mb-3 block text-sm">Semestre Atual</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex w-full items-center justify-between bg-slate-100"
                variant="dark"
              >
                {selectedSemester}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[355px]">
              <DropdownMenuItem
                onClick={() => setSelectedSemester('1º Semestre')}
              >
                1º Semestre
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSelectedSemester('2º Semestre')}
              >
                2º Semestre
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSelectedSemester('3º Semestre')}
              >
                3º Semestre
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4">
          <span className="mb-3 block text-sm">Trilhas de interesse</span>
          <ToggleGroup
            className="mb-2 w-[350px] flex-wrap justify-start"
            value={selectedTrails}
            type="multiple"
          >
            {trails.map(trail => (
              <ToggleGroupItem
                key={trail.id}
                value={trail.value}
                variant={
                  selectedTrails.includes(trail.value) ? 'added' : 'default'
                }
                onClick={() => toggleTrail(trail.value)}
                className="mr-2 mb-2 flex items-center justify-start transition-all duration-300 ease-in-out"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{trail.label}</span>
                {selectedTrails.includes(trail.value) ? (
                  <X className="ml-2 h-[18px] w-[18px] transition-all duration-300 ease-in-out" />
                ) : (
                  <Plus className="ml-2 h-[18px] w-[18px] transition-all duration-300 ease-in-out" />
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <span className="mb-3 block text-sm">Sobre</span>
          <textarea
            placeholder="Escreva sobre você"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mb-4 h-24 w-full rounded-lg border bg-slate-100 p-2"
          />
        </div>
      </div>
    </div>
  )
}

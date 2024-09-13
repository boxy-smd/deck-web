import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ChevronRight, ImageIcon, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const trails = [
  { id: 'design', value: 'design', label: 'Design' },
  { id: 'sistemas', value: 'sistemas', label: 'Sistemas' },
  { id: 'audiovisual', value: 'audiovisual', label: 'Audiovisual' },
  { id: 'jogos', value: 'jogos', label: 'Jogos' },
]

export function Modal() {
  const [selectedSemester, setSelectedSemester] = useState<string>('3º Semestre') // Especifica o tipo da variável
  const [selectedTrails, setSelectedTrails] = useState<string[]>([]) // Especifica o tipo correto como array de strings
  const [description, setDescription] = useState<string>('') // Especifica o tipo string

  function toggleTrail(trail: string) {
    setSelectedTrails(prevTrails =>
      prevTrails.includes(trail)
        ? prevTrails.filter(item => item !== trail)
        : [...prevTrails, trail]
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg w-full px-8 pt-9 max-w-md bg-white">
      {/* Imagem redonda para o perfil */}
      <div className="h-[100px] w-[100px] rounded-full mb-6 bg-slate-700 flex items-center justify-center" />

      <div className="flex flex-col w-full">

        <div className="mb-6">
          <span className="mb-3 block text-sm">Semestre Atual</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center bg-slate-100">
                {selectedSemester}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[355px]">
              <DropdownMenuItem onClick={() => setSelectedSemester('1º Semestre')}>
                1º Semestre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSemester('2º Semestre')}>
                2º Semestre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedSemester('3º Semestre')}>
                3º Semestre
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4">
          <span className="mb-3 block text-sm">Trilhas de interesse</span>
          <ToggleGroup className="flex-wrap w-[350px] justify-start mb-2" value={selectedTrails} type="multiple">
            {trails.map(trail => (
              <ToggleGroupItem
                key={trail.id}
                value={trail.value}
                variant={selectedTrails.includes(trail.value) ? 'added' : 'default'}
                onClick={() => toggleTrail(trail.value)}
                className="flex justify-start items-center mr-2 mb-2 transition-all duration-300 ease-in-out"
              >
                <ImageIcon className="h-4 w-4" />
                <span>{trail.label}</span>
                {selectedTrails.includes(trail.value) ? (
                  <X className="ml-2 w-[18px] h-[18px] transition-all duration-300 ease-in-out" />
                ) : (
                  <Plus className="ml-2 w-[18px] h-[18px] transition-all duration-300 ease-in-out" />
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
            className="w-full h-24 p-2 border rounded-lg mb-4 bg-slate-100"
          />
        </div>
      </div>
    </div>
  )
}

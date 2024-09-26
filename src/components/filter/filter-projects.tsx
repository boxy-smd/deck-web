import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import { Search } from 'lucide-react'
import { useState } from 'react'

const semesterOptions = [
  { id: '1', label: '1º Semestre' },
  { id: '2', label: '2º Semestre' },
  { id: '3', label: '3º Semestre' },
  { id: '4', label: '4º Semestre' },
  { id: '5', label: '5º Semestre' },
  { id: '6', label: '6º Semestre' },
  { id: '7', label: '7º Semestre' },
  { id: '8', label: '8º Semestre' },
  { id: '9', label: '9º Semestre' },
  { id: '10', label: '10º Semestre' },
  { id: '11', label: '11º Semestre' },
  { id: '12', label: '12º Semestre' },
]

const yearOptions = [
  { id: '2024', label: '2024' },
  { id: '2023', label: '2023' },
  { id: '2022', label: '2022' },
  { id: '2021', label: '2021' },
  { id: '2020', label: '2020' },
  { id: '2019', label: '2019' },
  { id: '2018', label: '2018' },
  { id: '2017', label: '2017' },
]

interface FilterProps {
  onApplyFilters: (filters: {
    semester: number
    publishedYear: number
    subjectId: string
  }) => void
}

export function Filter({ onApplyFilters }: FilterProps) {
  const { subjects } = useTagsDependencies()

  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [showMoreSemesters, setShowMoreSemesters] = useState(false)
  const [showMoreYears, setShowMoreYears] = useState(false)
  const [showMoreSubjects, setShowMoreSubjects] = useState(false)

  const handleShowMoreSemesters = () => setShowMoreSemesters(prev => !prev)
  const handleShowMoreYears = () => setShowMoreYears(prev => !prev)
  const handleShowMoreSubjects = () => setShowMoreSubjects(prev => !prev)

  const filteredSubjects = Array.isArray(subjects.data)
    ? subjects.data.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const visibleSubjects = showMoreSubjects
    ? filteredSubjects
    : filteredSubjects.slice(0, 3)

  return (
    <>
      <div className="flex h-[24px] items-center justify-between">
        <h1 className="font-semibold text-slate-900 text-xl">Filtros</h1>
        <Button
          className="border-none bg-transparent px-0 py-0 font-medium text-slate-700 text-sm underline hover:bg-transparent hover:text-slate-600"
          onClick={() => {
            setSelectedSemester('')
            setSelectedSubject('')
            setSelectedYear('')
            setSearchTerm('')
          }}
        >
          Limpar
        </Button>
      </div>
      {/* Filtro por Semestre */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="mt-2 py-2">Semestre</AccordionTrigger>
          <AccordionContent className="mb-5">
            <RadioGroup
              className="mt-1 ml-[3px]"
              value={selectedSemester}
              onValueChange={value => setSelectedSemester(value)}
            >
              {semesterOptions.slice(0, 3).map(option => (
                <div className="flex items-center space-x-3" key={option.id}>
                  <RadioGroupItem
                    aria-checked={selectedSemester === option.id}
                    id={option.id}
                    value={option.id}
                  />
                  <Label
                    htmlFor={option.id}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
              {showMoreSemesters &&
                semesterOptions.slice(3).map(option => (
                  <div className="flex items-center space-x-3" key={option.id}>
                    <RadioGroupItem id={option.id} value={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              <Button
                className="h-fit w-fit bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                onClick={handleShowMoreSemesters}
              >
                {showMoreSemesters ? 'Ver menos' : 'Ver mais'}
              </Button>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Campo de busca e seleção de Cadeira */}
      <div>
        <Label className="font-medium text-base text-slate-700">Cadeira</Label>
        <div className="relative mt-2 flex items-center justify-center">
          <Search size={18} className="absolute left-3 z-10 text-slate-500" />
          <Input
            onChange={event => setSearchTerm(event.target.value)}
            value={searchTerm}
            className="pl-[42px]"
            placeholder="Pesquisar Cadeira"
            input-size="sm"
            type="text"
          />
        </div>
      </div>
      {/* Filtro por Cadeiras */}
      {searchTerm &&
        (visibleSubjects.length > 0 ? (
          <div>
            <RadioGroup
              value={selectedSubject}
              onValueChange={value => setSelectedSubject(value)}
              className="mt-4 ml-[3px]"
            >
              {visibleSubjects.map(subject => (
                <div className="flex items-center space-x-3" key={subject.id}>
                  <RadioGroupItem
                    checked={selectedSubject === subject.id}
                    id={subject.id}
                    value={subject.id} // Aqui é onde o subjectId é usado
                    className="min-h-4 min-w-4"
                  />
                  <Label
                    htmlFor={subject.id}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subject.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {filteredSubjects.length > 3 && (
              <Button
                className="mt-3 h-fit w-fit bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                onClick={handleShowMoreSubjects}
              >
                {showMoreSubjects ? 'Ver menos' : 'Ver mais'}
              </Button>
            )}
          </div>
        ) : (
          <p className="mt-2 text-red-500 text-sm">
            Nenhuma cadeira encontrada
          </p>
        ))}
      {/* Filtro por Ano */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger className="mt-2 py-2">Ano</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              className="mt-1 ml-[3px]"
              value={selectedYear}
              onValueChange={value => setSelectedYear(value)}
            >
              {yearOptions.slice(0, 3).map(option => (
                <div className="flex items-center space-x-3" key={option.id}>
                  <RadioGroupItem
                    checked={selectedYear === option.id}
                    id={option.id}
                    value={option.id}
                  />
                  <Label
                    htmlFor={option.id}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
              {showMoreYears &&
                yearOptions.slice(3).map(option => (
                  <div className="flex items-center space-x-3" key={option.id}>
                    <RadioGroupItem
                      checked={selectedYear === option.id}
                      id={option.id}
                      value={option.id}
                    />
                    <Label
                      htmlFor={option.id}
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              <Button
                className="h-fit w-fit bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                onClick={handleShowMoreYears}
              >
                {showMoreYears ? 'Ver menos' : 'Ver mais'}
              </Button>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Botão de Aplicar Filtros */}
      <Button
        className="mt-4 w-full"
        onClick={() => {
          onApplyFilters({
            semester: Number(selectedSemester),
            publishedYear: Number(selectedYear),
            subjectId: selectedSubject, // Aqui é enviado o subjectId
          })
        }}
      >
        Aplicar Filtros
      </Button>
    </>
  )
}

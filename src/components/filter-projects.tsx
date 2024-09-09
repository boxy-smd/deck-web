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
]

const courses = [
  { id: '1', label: 'Design de Interfaces Gráficas' },
  { id: '2', label: 'Interação Humano-Computador I' },
  { id: '3', label: 'Autoração Multimídia II' },
  { id: '4', label: 'Introdução à Cibercultura' },
]

const yearOptions = [
  { id: '1', label: '2024' },
  { id: '2', label: '2023' },
  { id: '3', label: '2022' },
  { id: '4', label: '2021' },
  { id: '5', label: '2020' },
  { id: '6', label: '2019' },
  { id: '7', label: '2018' },
  { id: '8', label: '2017' },
]

export function Filter() {
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')

  const [showMoreSemesters, setShowMoreSemesters] = useState(false)
  const [showMoreYears, setShowMoreYears] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleShowMoreSemesters = () => {
    setShowMoreSemesters(prev => !prev)
  }

  const handleShowMoreYears = () => {
    setShowMoreYears(prev => !prev)
  }

  const filteredCourses = courses.filter(course =>
    course.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <div className="flex h-[24px] items-center justify-between">
        <h1 className="text-slate-900 text-xl">Filtros</h1>
        <Button
          className="border-none bg-transparent text-slate-700 text-sm underline hover:bg-transparent"
          onClick={() => {
            setSelectedSemester('')
            setSelectedCourse('')
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
          <AccordionTrigger>Semestre</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={selectedSemester}
              onValueChange={value => setSelectedSemester(value)}
            >
              {semesterOptions.slice(0, 3).map(option => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <RadioGroupItem value={option.id} className="" />
                  <Label
                    htmlFor={option.id}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}

              {!showMoreSemesters && (
                <Button
                  className="mt-3 justify-start bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                  onClick={handleShowMoreSemesters}
                >
                  Mostrar mais
                </Button>
              )}

              {showMoreSemesters &&
                semesterOptions.slice(3).map(option => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem value={option.id} className="" />
                    <Label
                      htmlFor={option.id}
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}

              {showMoreSemesters && (
                <Button
                  className="mt-3 justify-start bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                  onClick={handleShowMoreSemesters}
                >
                  Mostrar menos
                </Button>
              )}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Campo de busca e seleção de Cadeira */}
      <div className="mt-4">
        <Label className="text-base text-slate-700">Cadeira</Label>
        <div className="relative flex items-center">
          <Search size={18} className="absolute top-4 left-3 text-slate-500" />
          <Input
            className="mt-2 h-[35px] border-1 border-slate-300 bg-slate-100 pl-10 text-base placeholder-slate-500"
            type="text"
            placeholder="Pesquisar Cadeira"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtro por Cadeiras */}
      {searchTerm ? (
        filteredCourses.length > 0 ? (
          <RadioGroup
            value={selectedCourse}
            onValueChange={value => setSelectedCourse(value)}
            className="mt-4"
          >
            {filteredCourses.map(course => (
              <div className="flex items-center space-x-2" key={course.id}>
                <RadioGroupItem value={course.id} className="" />
                <Label
                  htmlFor={course.id}
                  className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {course.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="mt-2 text-red-500 text-sm">
            Nenhuma cadeira encontrada
          </p>
        )
      ) : (
        <p className="mt-2 ml-1 text-slate-400 text-xs">
          Digite algo para buscar cadeiras
        </p>
      )}

      {/* Filtro por Ano */}
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="item-2">
          <AccordionTrigger>Ano</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={selectedYear}
              onValueChange={value => setSelectedYear(value)}
            >
              {yearOptions.slice(0, 3).map(option => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <RadioGroupItem value={option.id} className="" />
                  <Label
                    htmlFor={option.id}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}

              {!showMoreYears && (
                <Button
                  className="mt-3 justify-start bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                  onClick={handleShowMoreYears}
                >
                  Mostrar mais
                </Button>
              )}

              {showMoreYears &&
                yearOptions.slice(3).map(option => (
                  <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem value={option.id} className="" />
                    <Label
                      htmlFor={option.id}
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}

              {showMoreYears && (
                <Button
                  className="mt-3 justify-start bg-transparent p-0 text-slate-700 text-sm underline hover:bg-transparent"
                  onClick={handleShowMoreYears}
                >
                  Mostrar menos
                </Button>
              )}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full bg-slate-700 text-slate-100"
        onClick={() => {
          console.log({
            selectedSemester,
            selectedCourse,
            selectedYear,
          })
        }}
      >
        Aplicar Filtros
      </Button>
    </>
  )
}

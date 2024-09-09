"use client";
import { CardProject } from "@/components/card-project";
import { Filter } from "@/components/filter-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Image, ListFilter, Package, Search } from "lucide-react";

import { useRouter } from "next/navigation";

const generateId = () => Math.random().toString(36).substring(2, 9);

const trailsOptions = [
  {
    id: generateId(),
    value: "design",
    label: "Design",
    imageSrc: "designImageSrc",
  },
  {
    id: generateId(),
    value: "sistemas",
    label: "Sistemas",
    imageSrc: "sistemasImageSrc",
  },
  {
    id: generateId(),
    value: "audiovisual",
    label: "Audiovisual",
    imageSrc: "audiovisualImageSrc",
  },
  {
    id: generateId(),
    value: "jogos",
    label: "Jogos",
    imageSrc: "jogosImageSrc",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-slate-50">
      <header className="flex h-20 w-full items-center justify-between px-10">
        <div className="flex gap-10">
          <div className="flex gap-2">
            <Package size={28} className="text-slate-600" />
            <h1 className="font-semibold text-2xl text-slate-600">Deck</h1>
          </div>

          {/* Contêiner para o ícone de pesquisa */}
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute top-[8.5] left-3 text-slate-500"
            />
            <Input
              className="h-[35px] w-[642px] rounded-md border border-slate-300 bg-slate-100 px-4 py-2 pl-10 text-slate-500"
              placeholder="Pesquisar"
              type="text"
            />
          </div>
        </div>

        <Button
          onClick={() => router.push("/login")}
          className="rounded-md bg-slate-200 px-8 py-2 text-base text-slate-600 hover:bg-slate-600 hover:text-slate-50"
        >
          Entrar
        </Button>
      </header>

      {/* Estrutura do grid centralizado */}
      <div className="grid w-fit grid-cols-3 gap-5 px-[200px] py-5">
        <div className="col-span-3 flex w-full justify-between">
          <div className="flex items-start gap-4">
            <ToggleGroup
              className="flex flex-wrap justify-start gap-4"
              type="multiple"
            >
              {trailsOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="flex items-center justify-center gap-2"
                >
                  <Image className="h-[18px] w-[18px]" />
                  <p className="text-sm">{option.label}</p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-[10px] rounded-md bg-slate-200 px-4 py-2 text-slate-900 text-sm hover:bg-slate-600 hover:text-slate-50 ">
                <ListFilter size={18} className="text-slate-900" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Filter />
            </PopoverContent>
          </Popover>
        </div>

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={["Interação Humano Computador", "3º Sem.", "2024"]}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />

        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={["Interação Humano Computador", "3º Sem.", "2024"]}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />
        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={["Interação Humano Computador", "3º Sem.", "2024"]}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />
        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={["Interação Humano Computador", "3º Sem.", "2024"]}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />
        <CardProject
          title="Arte em RA: Interação Imersiva no Ensino de Arte"
          author="Alexandre Gomes"
          tags={["Interação Humano Computador", "3º Sem.", "2024"]}
          description="O projeto explora a Realidade Aumentada para o ensino de arte, utilizando design e audiovisual. A aplicação permite que os alunos interajam com obras de arte sobrepostas no mundo físico."
          professor="Profa Ticianne D."
        />
      </div>
    </main>
  );
}

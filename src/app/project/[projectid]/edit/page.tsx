export default function ProjectPage({
  params,
}: {
  params: {
    projectid: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Editando Projeto: {params.projectid}
    </main>
  );
}

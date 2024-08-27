export default function ProjectPageEdit({
  params,
}: {
  params: {
    projectId: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Editando Projeto: {params.projectId}
    </main>
  );
}

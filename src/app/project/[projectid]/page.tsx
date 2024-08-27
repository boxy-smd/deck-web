export default function ProjectPage({
  params,
}: {
  params: {
    projectId: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Vendo Projeto: {params.projectId}
    </main>
  );
}

export default function ProjectPage({
  params,
}: {
  params: {
    profileid: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Vendo Perfil: {params.profileid}
    </main>
  );
}

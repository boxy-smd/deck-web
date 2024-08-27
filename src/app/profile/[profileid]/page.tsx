export default function Profile({
  params,
}: {
  params: {
    profileId: string;
  };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Vendo Perfil: {params.profileId}
    </main>
  );
}

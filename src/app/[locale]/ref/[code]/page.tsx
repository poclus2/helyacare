import { redirect } from "next/navigation";

export default function RefPage({ params }: { params: { code: string } }) {
  // Rediriger vers la page ambassadeur en passant le code dans l'URL
  redirect(`/ambassadeur?ref=${params.code}`);
}

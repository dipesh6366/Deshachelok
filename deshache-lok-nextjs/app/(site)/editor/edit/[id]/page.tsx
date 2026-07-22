import AuthGate from '@/components/AuthGate';
import EditorForm from '@/components/EditorForm';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AuthGate>
      <EditorForm articleId={id} />
    </AuthGate>
  );
}

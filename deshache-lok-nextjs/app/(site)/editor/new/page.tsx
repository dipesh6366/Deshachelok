import AuthGate from '@/components/AuthGate';
import EditorForm from '@/components/EditorForm';

export default function NewArticlePage() {
  return (
    <AuthGate>
      <EditorForm />
    </AuthGate>
  );
}

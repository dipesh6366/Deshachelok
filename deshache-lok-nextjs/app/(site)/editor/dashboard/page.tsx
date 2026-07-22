import AuthGate from '@/components/AuthGate';
import DashboardView from '@/components/DashboardView';

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardView />
    </AuthGate>
  );
}

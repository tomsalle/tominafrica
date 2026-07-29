import { Container } from '@/components/ui/Container';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-32 pb-28 sm:pt-40">
      <Container>{children}</Container>
    </div>
  );
}

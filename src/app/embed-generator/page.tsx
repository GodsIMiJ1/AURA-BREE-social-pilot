import { EmbedGenerator } from '@/components/dashboard/embed-generator';
import { Header } from '@/components/dashboard/header';

export default function EmbedGeneratorPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <EmbedGenerator />
        </div>
      </main>
    </div>
  );
}

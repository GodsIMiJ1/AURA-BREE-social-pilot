import { EmbedGenerator } from '@/components/dashboard/embed-generator';
import { PostGenerator } from '@/components/dashboard/post-generator';

export default function ContentPage() {
  return (
    <div className="grid flex-1 items-start gap-8">
      <PostGenerator />
      <EmbedGenerator />
    </div>
  );
}

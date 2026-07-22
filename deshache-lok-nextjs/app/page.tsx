import { getPublishedArticles } from '@/lib/articles';
import Homepage from '@/components/home/Homepage';

export const revalidate = 60;

export default async function Home() {
  const articles = await getPublishedArticles();

  return <Homepage articles={articles} />;
}

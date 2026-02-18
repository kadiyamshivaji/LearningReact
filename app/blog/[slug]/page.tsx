'use client'
import { useRouter } from 'next/navigation';
// eslint-disable-next-line @next/next/no-async-client-component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const router = useRouter()
  const { slug } = await params
 
  return (
    <div>
      <h1>{slug}</h1>
       <button type="button" onClick={() => router.push('/blog/kana')}>
      Dashboard
    </button>
    </div>
  )
}
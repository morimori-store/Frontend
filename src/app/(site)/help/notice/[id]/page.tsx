import NoticeDetailClient from '@/components/help/NoticeDetailClient';

type PageParams = {
  id: string;
};

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  return <NoticeDetailClient noticeId={id} />;
}

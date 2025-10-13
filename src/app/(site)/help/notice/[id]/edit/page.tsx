import NoticeEditClient from '@/components/help/NoticeEditClient';

type PageParams = {
  id: string;
};

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = await params;
  return <NoticeEditClient noticeId={id} />;
}

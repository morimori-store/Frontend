'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import NoticeEditor from '@/components/editor/NoticeEditor';
import Button from '@/components/Button';
import Paperclip from '@/assets/icon/paperclip2.svg';
import { useToast } from '@/components/ToastProvider';
import { createNotice } from '@/services/notices';
import { useAuthStore } from '@/stores/authStore';

export default function NoticeCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const role = useAuthStore((store) => store.role);
  const isHydrated = useAuthStore((store) => store.isHydrated);
  const accessToken = useAuthStore((store) => store.accessToken);

  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [priority, setPriority] = useState<'important' | 'normal'>('normal');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAdmin) {
      toast.error('관리자만 공지사항을 작성할 수 있습니다.');
      router.replace('/help/notice');
    }
  }, [isHydrated, isAdmin, router, toast]);

  const fileSummary = useMemo(() => {
    if (files.length === 0) return '';
    if (files.length === 1) return files[0].name;
    return `${files[0].name} 외 ${files.length - 1}개`;
  }, [files]);

  const handleSubmit = async () => {
    if (!isAdmin) return;
    if (!title.trim()) {
      toast.error('제목을 입력해 주세요.');
      return;
    }
    if (!html.trim()) {
      toast.error('내용을 입력해 주세요.');
      return;
    }
    if (!accessToken) {
      toast.error('인증 정보가 만료되었습니다. 다시 로그인해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const uploadedFiles = await Promise.all(files.map((file) => uploadToS3(file)));
      await createNotice(
        {
          title: title.trim(),
          content: html,
          isImportant: priority === 'important',
          files: uploadedFiles,
        },
        { accessToken },
      );
      toast.success('공지사항을 등록했습니다.');
      router.replace('/help/notice');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : '공지사항 등록에 실패했습니다.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mt-[94px] mb-4 flex flex-col">
      <h1 className="mb-[30px] text-2xl font-bold">공지사항 작성</h1>
      <hr />

      <fieldset className="my-[13px] flex items-center gap-6">
        <span>중요도</span>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="priority"
            value="important"
            checked={priority === 'important'}
            onChange={() => setPriority('important')}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>중요</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="priority"
            value="normal"
            checked={priority === 'normal'}
            onChange={() => setPriority('normal')}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          <span>일반</span>
        </label>
      </fieldset>
      <hr />

      <label className="my-[13px] flex items-center gap-6">
        <span className="shrink-0 whitespace-nowrap">제목</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="flex-1 rounded border border-[var(--color-gray-200)] px-3 py-2"
          placeholder="공지 제목을 입력해 주세요"
        />
      </label>
      <hr />

      <div className="my-[13px]">
        <span>내용</span>
        <div className="my-[13px]">
          <NoticeEditor value={html} onChange={setHtml} onUploadImage={uploadToS3} />
        </div>
      </div>
      <hr />

      <div className="my-[13px] flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          <span className="shrink-0">첨부파일</span>
          <Paperclip className="block size-4 shrink-0 text-[var(--color-gray-200)]" />
        </div>
        <div className="relative flex-1">
          <input
            id="fileInput"
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
          <input
            type="text"
            readOnly
            value={fileSummary}
            placeholder="파일을 선택하세요"
            className="w-full rounded border border-[var(--color-gray-200)] px-3 py-2 pr-24 leading-none"
            onClick={() => document.getElementById('fileInput')?.click()}
          />
          {files.length > 0 ? (
            <button
              type="button"
              onClick={() => setFiles([])}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none"
            >
              파일 삭제
            </button>
          ) : (
            <label
              htmlFor="fileInput"
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded border border-[var(--color-primary)] px-3 py-1 text-sm leading-none"
            >
              파일 선택
            </label>
          )}
        </div>
      </div>

      <div className="mt-6 flex self-end gap-2">
        <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
          작성취소
        </Button>
        <Button onClick={handleSubmit} isLoading={submitting} disabled={submitting}>
          작성하기
        </Button>
      </div>
    </main>
  );
}

// S3 프리사인드 URL 업로드
async function uploadToS3(file: File): Promise<string> {
  const res = await fetch('/api/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, type: file.type }),
  });
  if (!res.ok) {
    throw new Error('파일 업로드 URL을 받지 못했습니다.');
  }
  const { url, key } = await res.json();
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  const cdn = process.env.NEXT_PUBLIC_CDN ?? '';
  return cdn ? `${cdn}/${key}` : url;
}

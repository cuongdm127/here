'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [content, setContent] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    router.push('/');
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full h-40 border p-3 rounded-lg mb-4"
        placeholder="Trút bầu tâm sự..."
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-teal-600 text-white rounded">
        Gửi
      </button>
    </div>
  );
}

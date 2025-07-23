'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

export default function SubmitPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Writing');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title || !description) return alert('Please fill out all fields.');
    setLoading(true);

    const { error } = await supabase.from('prompts').insert([
      { title, description, tag },
    ]);

    setLoading(false);
    if (error) return alert('Error submitting prompt.');
    alert('Prompt submitted!');
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Prompt</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white border border-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white border border-gray-700"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white border border-gray-700"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="Writing">Writing</option>
          <option value="Design">Design</option>
          <option value="Dev">Dev</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition"
        >
          {loading ? 'Submitting...' : 'Submit Prompt'}
        </button>
      </div>
    </main>
  );
}
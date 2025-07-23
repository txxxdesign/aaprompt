'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import PromptCard from '@/components/PromptCard';

type Prompt = {
  id: string;
  title: string;
  description: string;
  tag: string;
  likes: number;
};

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'popular' | 'latest'>('latest');
  const [likedMap, setLikedMap] = useState<{ [id: string]: boolean }>({});
  const [visibleCount, setVisibleCount] = useState(6); // ✅ Load more 초기값

  useEffect(() => {
    fetch('/prompts.json')
      .then((res) => res.json())
      .then((data) => setPrompts(data));
  }, []);

  const handleLikeToggle = (id: string, isLiked: boolean) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.likes + (isLiked ? 1 : -1) }
          : p
      )
    );
    setLikedMap((prev) => ({ ...prev, [id]: isLiked }));
  };

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortOrder === 'popular') {
      return b.likes - a.likes;
    } else {
      return Number(b.id) - Number(a.id); // 최신순
    }
  });

  const visiblePrompts = sortedPrompts.slice(0, visibleCount);

  return (
    <>
      <Head>
        <title>AAPrompt</title>
        <meta name="description" content="Explore the best AI prompts by category" />
      </Head>

      <main className="min-h-screen bg-[#0e0e0e] text-white px-6 py-12">
        <section className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Your Prompt Gateway to the World</h1>
          <p className="text-gray-400 text-lg mb-6">
            Discover high-quality prompts tailored for AI creators
          </p>

          {/* 검색창 */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for prompts..."
              className="w-full px-4 py-3 rounded-xl bg-[#1e1e1e] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['All', 'Writing', 'Design', 'Dev'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'text-gray-400 border-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 정렬 필터 */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => setSortOrder('latest')}
              className={`px-4 py-2 rounded-full border ${
                sortOrder === 'latest'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'text-gray-400 border-gray-600'
              }`}
            >
              🕒 최신순
            </button>
            <button
              onClick={() => setSortOrder('popular')}
              className={`px-4 py-2 rounded-full border ${
                sortOrder === 'popular'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'text-gray-400 border-gray-600'
              }`}
            >
              🔥 인기순
            </button>
          </div>
        </section>

        {/* 프롬프트 카드 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">✨ All Prompts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visiblePrompts.map((p) => (
              <PromptCard
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                tag={p.tag}
                likes={p.likes}
                liked={likedMap[p.id] || false}
                onLike={handleLikeToggle}
              />
            ))}
          </div>

          {/* Load more 버튼 */}
          {visibleCount < sortedPrompts.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
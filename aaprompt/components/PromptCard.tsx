'use client';

type PromptCardProps = {
  id: string;
  title: string;
  description: string;
  tag: string;
  likes: number;
  liked: boolean;
  onLike: (id: string, isLiked: boolean) => void;
};

export default function PromptCard({
  id,
  title,
  description,
  tag,
  likes,
  liked,
  onLike,
}: PromptCardProps) {
  const handleLikeClick = () => {
    const newLiked = !liked;
    localStorage.setItem(`liked-${id}`, String(newLiked));
    onLike(id, newLiked);
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 hover:border-orange-500 transition duration-200">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-3">{description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">{tag}</span>
        <button
          onClick={handleLikeClick}
          className="text-white hover:text-orange-400 transition"
          aria-label="Like prompt"
        >
          {liked ? '❤️' : '🤍'} {likes.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
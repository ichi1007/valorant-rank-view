"use client";

interface MobileMenuButtonProps {
  onToggle: () => void;
  isOpen: boolean;
}

export default function MobileMenuButton({
  onToggle,
  isOpen,
}: MobileMenuButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-all"
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      <span className="material-symbols-outlined mr-2">
        {isOpen ? "close" : "menu"}
      </span>
      <span className="text-sm font-medium">メニュー</span>
    </button>
  );
}

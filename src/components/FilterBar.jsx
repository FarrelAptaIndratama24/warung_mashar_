import { Search, X, SlidersHorizontal } from "lucide-react";

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) {
  const activeButton =
    "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/60";

  const inactiveButton =
    "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700";

  return (
    <div className="mb-7 space-y-5">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal size={17} className="text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900">Jelajahi Menu</h2>
          </div>

          <p className="text-xs text-gray-500">
            Temukan hidangan favoritmu hari ini
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm group">
          <Search
            size={19}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"
          />

          <input
            type="text"
            placeholder="Cari cumi, udang, kepiting..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
              title="Hapus pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1 h-4 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Kategori Menu
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* All Category */}
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
              selectedCategory === "all" ? activeButton : inactiveButton
            }`}
          >
            Semua Menu
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedCategory === cat.slug ? activeButton : inactiveButton
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

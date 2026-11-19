import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import MenuCard from "../components/MenuCard";
import AddMenuModal from "../components/AddMenuModal";
import LoginModal from "../components/LoginModal";

export default function CatalogPage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // State status login Admin
  const [session, setSession] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    fetchCatalogData();

    // Cek apakah pemilik warung sedang login
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Dengarkan perubahan status login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchCatalogData() {
    setLoading(true);
    const [catResponse, menuResponse] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase
        .from("menus")
        .select("*, categories(name, slug)")
        .order("created_at", { ascending: true }),
    ]);

    if (catResponse.data) setCategories(catResponse.data);
    if (menuResponse.data) setMenus(menuResponse.data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const filteredMenus = menus.filter((menu) => {
    const matchCategory =
      selectedCategory === "all" || menu.categories?.slug === selectedCategory;
    const matchSearch = menu.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isAdmin={!!session}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-5xl w-full mx-auto px-4 py-8 flex-1">
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Memuat daftar menu...
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Menu tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                isAdmin={!!session}
                onDeleteSuccess={fetchCatalogData}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Publik + Pintu Masuk Admin */}
      <footer className="border-t border-gray-200 bg-white py-6 mt-12 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} Sari Laut Mas Har Suroboyo. Semua hak
          dilindungi.
        </p>
        {!session && (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="mt-2 text-gray-400 hover:text-emerald-600 underline cursor-pointer"
          >
            Login Pengelola
          </button>
        )}
      </footer>

      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onSuccess={fetchCatalogData}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {}}
      />
    </div>
  );
}

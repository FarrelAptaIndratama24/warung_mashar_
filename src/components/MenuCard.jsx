import { useState } from "react";
import { MessageCircle, Utensils, Clock, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

// Nomor WhatsApp warung (format 62)
const WHATSAPP_NUMBER = "6281234567890";
const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x450/eef7f2/6b9e84?text=Belum+Ada+Foto";

const formatPrice = (price) => Number(price ?? 0).toLocaleString("id-ID");

export default function MenuCard({ menu, isAdmin, onDeleteSuccess }) {
  const [deleting, setDeleting] = useState(false);

  const message = encodeURIComponent(
    `Halo Sari Laut Mas Har Suroboyo, saya mau pesan *${menu.name}* (Rp ${formatPrice(menu.price)}). Apakah masih tersedia?`,
  );

  async function handleDelete() {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus menu "${menu.name}"?`,
    );
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      // 1. Hapus file foto dari Supabase Storage jika ada
      if (menu.image_url && menu.image_url.includes("/menu-images/")) {
        const fileName = menu.image_url.split("/menu-images/")[1];
        if (fileName) {
          await supabase.storage.from("menu-images").remove([fileName]);
        }
      }

      // 2. Hapus data menu dari tabel 'menus'
      const { error } = await supabase.from("menus").delete().eq("id", menu.id);

      if (error) throw error;

      // 3. Refresh daftar menu di halaman utama
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (err) {
      alert("Gagal menghapus menu: " + err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="group bg-[#fbfdfc] border border-[#dcece3] rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(45,106,79,0.06)] hover:shadow-[0_14px_30px_-6px_rgba(45,106,79,0.14)] hover:border-[#b7dec9] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Food Image */}
      <div className="relative aspect-[4/3] bg-[#eef6f1] overflow-hidden">
        <img
          src={menu.image_url || PLACEHOLDER_IMAGE}
          alt={menu.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Soft Pastel Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b4332]/15 via-transparent to-transparent pointer-events-none" />

        {/* Category Badge (Pastel Mint Pill) */}
        {menu.categories?.name && (
          <span className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 bg-[#f2f9f5]/95 backdrop-blur-md text-[#2d6a4f] border border-[#cde5d7] text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-2xs">
            <Utensils size={11} className="text-[#52b788]" />
            {menu.categories.name}
          </span>
        )}

        {/* Top Right: Tombol Hapus (Admin) atau Badge Availability (Publik) */}
        {isAdmin ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            title="Hapus Menu"
            className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 bg-rose-500/95 hover:bg-rose-600 active:scale-95 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={12} />
            <span>{deleting ? "Menghapus..." : "Hapus"}</span>
          </button>
        ) : (
          <span
            className={`absolute top-3.5 right-3.5 text-[10px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border shadow-2xs ${
              menu.is_available
                ? "bg-[#d8f3dc]/95 text-[#1b4332] border-[#b7e4c7]"
                : "bg-stone-100/95 text-stone-500 border-stone-200"
            }`}
          >
            {menu.is_available ? "● Tersedia" : "Habis"}
          </span>
        )}
      </div>

      {/* Menu Information */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name & Description */}
        <div className="flex-1">
          <h2 className="text-base sm:text-lg font-bold text-[#1b4332] leading-snug group-hover:text-[#40916c] transition-colors">
            {menu.name}
          </h2>

          {menu.description ? (
            <p className="text-xs sm:text-sm text-[#5c7468] mt-2 leading-relaxed line-clamp-2">
              {menu.description}
            </p>
          ) : (
            <p className="text-xs text-[#8fa69a] mt-2 italic">
              Hidangan lezat khas Sari Laut.
            </p>
          )}
        </div>

        {/* Price & Order */}
        <div className="mt-5 pt-4 border-t border-[#e6f2ec]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-[#849e91] uppercase tracking-wider mb-0.5">
                Harga
              </p>

              <p className="text-lg sm:text-xl font-extrabold text-[#2d6a4f] tracking-tight">
                Rp {formatPrice(menu.price)}
              </p>
            </div>

            {menu.is_available && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#2d6a4f] bg-[#e8f6ef] border border-[#d1ecde] px-2.5 py-1 rounded-full">
                <Clock size={11} className="text-[#52b788]" />
                Siap dipesan
              </div>
            )}
          </div>

          {/* WhatsApp Order Button (Soft Sage-Emerald Pastel) */}
          {menu.is_available ? (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#40916c] hover:bg-[#2d6a4f] active:scale-[0.98] text-white text-sm font-semibold py-3 rounded-2xl shadow-[0_4px_12px_rgba(64,145,108,0.22)] hover:shadow-[0_6px_16px_rgba(45,106,79,0.28)] transition-all duration-200"
            >
              <MessageCircle size={16} />
              Pesan via WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center gap-2 bg-[#eef4f0] text-[#9ab0a4] text-sm font-semibold py-3 rounded-2xl cursor-not-allowed"
            >
              <MessageCircle size={16} />
              Stok Habis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

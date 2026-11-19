import { useState } from "react";
import { X, Upload } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function AddMenuModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let publicImageUrl = null;

      // 1. Jika ada file foto, upload ke Supabase Storage (bucket: menu-images)
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("menu-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Ambil URL publik foto yang baru diupload
        const { data: urlData } = supabase.storage
          .from("menu-images")
          .getPublicUrl(fileName);

        publicImageUrl = urlData.publicUrl;
      }

      // 2. Simpan data menu ke tabel 'menus'
      const { error: insertError } = await supabase.from("menus").insert([
        {
          name,
          category_id: categoryId || null,
          price: parseInt(price, 10) || 0,
          description,
          image_url: publicImageUrl,
          is_available: true,
        },
      ]);

      if (insertError) throw insertError;

      // Reset form & refresh daftar menu
      setName("");
      setCategoryId("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      alert("Gagal menyimpan menu: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Tambah Menu Baru</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Menu *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cumi Goreng Tepung"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- Pilih --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga (Rp) *
              </label>
              <input
                type="number"
                required
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Singkat
            </label>
            <textarea
              rows="2"
              placeholder="Keterangan menu, sambal, atau lalapan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Makanan
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-orange-500 text-sm text-gray-600">
              <Upload size={18} />
              <span>
                {imageFile ? imageFile.name : "Pilih file foto (JPG/PNG)"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Menyimpan..." : "Simpan Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

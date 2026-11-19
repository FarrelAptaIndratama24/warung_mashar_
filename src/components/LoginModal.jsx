import { useState } from "react";
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login gagal: Email atau password salah!");
        return;
      }

      setEmail("");
      setPassword("");
      onLoginSuccess();
      onClose();
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Green Decoration */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-green-600 to-lime-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
        >
          <X size={19} />
        </button>

        <div className="p-7 sm:p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-200 mb-4">
              <UtensilsCrossed size={29} />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-3">
              Administrator Access
            </span>

            <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Selamat Datang!
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Masuk untuk mengelola katalog menu
              <br />
              Sari Laut Mas Har Suroboyo.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Admin
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-emerald-200/70 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={16} />
              {loading ? "Memeriksa..." : "Masuk Mode Admin"}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-gray-100">
            <ShieldCheck size={15} className="text-emerald-600" />
            <p className="text-xs text-gray-400 font-medium">
              Akses khusus pemilik warung
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

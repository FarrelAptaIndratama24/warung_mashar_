import {
  PlusCircle,
  UtensilsCrossed,
  LogOut,
  Sparkles,
  Leaf,
} from "lucide-react";

export default function Navbar({ isAdmin, onOpenAddModal, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-200/70">
            <UtensilsCrossed size={23} strokeWidth={2.1} />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime-400 border-2 border-white" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <Leaf size={10} className="inline mr-1" />
                Digital Menu
              </span>

              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-green-800 bg-green-100 px-2.5 py-1 rounded-full">
                  <Sparkles size={11} />
                  Admin
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Sari Laut Mas Har
              <span className="text-emerald-600"> Suroboyo</span>
            </h1>

            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Cita Rasa Kelezatan Nusantara
            </p>
          </div>
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
            <button
              onClick={onOpenAddModal}
              className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition-all duration-200 cursor-pointer"
            >
              <PlusCircle
                size={17}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
              <span>Tambah Menu</span>
            </button>

            <button
              onClick={onLogout}
              title="Keluar Mode Admin"
              className="flex items-center gap-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-100 text-gray-600 text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut size={17} />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

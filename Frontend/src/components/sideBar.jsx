import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BarChart3,
  Boxes,
  House,
  LifeBuoy,
  PackagePlus,
  ShoppingBag,
  UsersRound,
  X,
} from "lucide-react";
import { isSessionTokenValid } from "../utils/auth";

const linkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-orange-50 text-orange-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function Sidebar({ isOpen, onClose }) {
  const { data, token } = useSelector((state) => state.signin);
  const user = isSessionTokenValid(token) ? data?.user : null;
  const isAdmin = user?.role === "Admin";

  const closeOnMobile = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeOnMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/"
            onClick={closeOnMobile}
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-lg font-black text-white shadow-lg shadow-orange-600/20">
              S
            </span>
            <span>
              <span className="block text-base font-extrabold tracking-tight text-slate-950">
                ShopNest
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Everyday, better
              </span>
            </span>
          </NavLink>
          <button
            type="button"
            onClick={closeOnMobile}
            aria-label="Close navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Store
          </p>
          <NavLink to="/" end onClick={closeOnMobile} className={linkClass}>
            <House size={18} />
            <span>Home</span>
          </NavLink>
          {user && (
            <NavLink to="/myOrders" onClick={closeOnMobile} className={linkClass}>
              <ShoppingBag size={18} />
              <span>My orders</span>
            </NavLink>
          )}
          <NavLink to="/contact" onClick={closeOnMobile} className={linkClass}>
            <LifeBuoy size={18} />
            <span>Contact</span>
          </NavLink>

          {isAdmin && (
            <>
              <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Management
              </p>
              <NavLink to="/admin" onClick={closeOnMobile} className={linkClass}>
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/products" onClick={closeOnMobile} className={linkClass}>
                <Boxes size={18} />
                <span>Products</span>
              </NavLink>
              <NavLink to="/createProducts" onClick={closeOnMobile} className={linkClass}>
                <PackagePlus size={18} />
                <span>Add product</span>
              </NavLink>
              <NavLink to="/orders" onClick={closeOnMobile} className={linkClass}>
                <ShoppingBag size={18} />
                <span>All orders</span>
              </NavLink>
              <NavLink to="/users" onClick={closeOnMobile} className={linkClass}>
                <UsersRound size={18} />
                <span>Customers</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {user ? `Welcome, ${user.name}` : "Find your next favorite"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {user
                ? "Your account and orders are ready when you are."
                : "Explore a curated collection of everyday essentials."}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

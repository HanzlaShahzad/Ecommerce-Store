import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Search, ShoppingBag, LogOut, UserRound } from "lucide-react";
import { logout } from "../Slices/signinSlice";
import { clearCart } from "../Slices/cartSlice";
import { setSearchItem } from "../Slices/getProductSlice";
import { isSessionTokenValid } from "../utils/auth";

export default function Navbar({ onMenuClick }) {
  const { data, token } = useSelector((state) => state.signin);
  const user = isSessionTokenValid(token) ? data?.user : null;
  const searchItem = useSelector((state) => state.getProducts.searchItem);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = cartItems.reduce(
    (count, item) => count + (Number(item.cartQuantity) || 0),
    0,
  );
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    setAccountMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl lg:ml-64">
      <div className="flex h-[70px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="relative hidden w-full max-w-md items-center md:flex">
          <Search size={18} className="pointer-events-none absolute left-3.5 text-slate-400" />
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products"
            value={searchItem || ""}
            onChange={(event) => dispatch(setSearchItem(event.target.value))}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:hidden"
            aria-label="Search products"
          >
            <Search size={18} />
          </button>

          <Link
            to={cartCount > 0 ? "/checkout" : "/"}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-orange-600"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((open) => !open)}
                aria-expanded={accountMenuOpen}
                className="flex h-10 items-center gap-2 rounded-xl px-2 transition hover:bg-slate-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <UserRound size={17} />
                </span>
                <span className="hidden max-w-36 text-left sm:block">
                  <span className="block truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {user.role === "Admin" ? "Administrator" : "Customer"}
                  </span>
                </span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden">
          <input
            type="search"
            autoFocus
            aria-label="Search products"
            placeholder="Search products"
            value={searchItem || ""}
            onChange={(event) => dispatch(setSearchItem(event.target.value))}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>
      )}
    </header>
  );
}

import { Menu } from "@headlessui/react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Slices/signinSlice";
import { persistor } from "../store/store";
import { Link } from "react-router-dom";
import { setSearchItem } from "../Slices/getProductSlice";

export default function Navbar() {
  const user = useSelector((state) => state.signin.data?.user);
  const product = useSelector((state) => state.getProducts.data);
  const searchItem = useSelector((state) => state.getProducts.searchItem);
  const dispatch = useDispatch();
  const [logoutBtn, setLogoutBtn] = useState(false);
  const [logoutUser, setLogoutUser] = useState(false);

  const handleLogout = () => {
    setLogoutUser(true);
  };

  useEffect(() => {
    if (logoutUser) {
      dispatch(logout());
    }
  }, [dispatch, logoutUser]);

  return (
    <header
      className="
        flex
        h-[65px]
        w-full
        shrink-0
        items-center
        border-b
        border-[#e0e4e8]
        bg-[#f8f9fa]/95
        px-3
        backdrop-blur

        sm:px-5

        lg:ml-[260px]
        lg:h-[70px]
        lg:w-[calc(100%-260px)]
        lg:px-7
      "
    >
      {/* Mobile Menu */}
      <button
        type="button"
        className="
          mr-2
          shrink-0
          rounded-lg
          p-2
          transition
          hover:bg-gray-200
          lg:hidden
        "
      >
        <Menu />
      </button>

      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Search
          size={21}
          strokeWidth={1.8}
          className="shrink-0 text-[#60788e]"
        />

        <input
          type="text"
          placeholder="Search..."
          value={searchItem}
          onChange={(e) => dispatch(setSearchItem(e.target.value))}
          className="
            min-w-0
            w-full
            max-w-[400px]
            bg-transparent
            text-[14px]
            text-[#526a80]
            outline-none
            placeholder:text-[#8a9aaa]
            sm:text-[15px]
          "
        />
      </div>

      {/* User */}
      <div className="ml-2 flex shrink-0 items-center">
        <Link
          to="/signin"
          className={`${!user ? "block bg-green-500 rounded-xl text-white px-6 pb-1 py-1 text-center absolute top-6 right-3" : "hidden"}`}
        >
          Signin
        </Link>
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => setLogoutBtn((prev) => !prev)}
        >
          <span
            className="
              max-w-[120px]
              truncate
              text-xs
              font-bold
              text-black
              sm:max-w-[180px]
              sm:text-sm
            "
          >
            {user?.name}
          </span>
          {user && (
            <img
              alt="Profile"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="
              h-8
              w-8
              shrink-0
              rounded-full
              object-cover
              sm:h-9
              sm:w-9
            "
            />
          )}
        </div>

        {user && logoutBtn && (
          <button
            className="bg-red-500 rounded-xl text-white px-6 pb-1 py-1 text-center absolute top-15 right-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

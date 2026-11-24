import { useState } from "react";
import { AiOutlinePhone, AiOutlineProduct } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { useSelector } from "react-redux";
import { ImYelp } from "react-icons/im";
import { BsBorderStyle } from "react-icons/bs";

export default function Sidebar() {
  const user = useSelector((state) => state.signin?.data?.user);
  const [isOpen, setIsOpen] = useState(false);
  console.log("Userr ===>", user);
  const navClass = ({ isActive }) =>
    isActive
      ? "group flex w-full items-center gap-4 rounded-xl bg-[#edf2fb] px-4 py-3 text-left text-[15px] transition hover:bg-[#edf2fb]"
      : "group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-[15px] transition hover:bg-[#edf2fb]";

  return (
    <>
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[260px]
          flex-col
          overflow-y-auto
          border-r
          border-[#d9dee5]
          bg-[#f8f9fa]
          transition-transform
          duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="flex h-[70px] shrink-0 items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-9 w-9 rotate-45 rounded-full border-[7px] border-blue-500 border-l-transparent" />

              <div className="absolute left-0 top-1 h-3 w-3 bg-orange-400" />
            </div>

            <span className="text-[27px] font-bold tracking-tight text-orange-400">
              Ecom
            </span>
          </div>

          {/* Close button - only mobile/tablet */}
          <button
            className="rounded-full text-blue-400 hover:cursor-pointer lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <TiDelete size={28} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="flex-1 px-4 py-4 sm:px-5">
          <div className="space-y-1.5">
            {user?.role === "Admin" && (
              <NavLink to="/admin" className={navClass}>
                <LuLayoutDashboard />
                Dashboard
              </NavLink>
            )}

            <NavLink to="/" className={navClass}>
              <IoHomeOutline />
              Home
            </NavLink>

            {user?.role === "User" && (
              <NavLink to="/myOrders" className={navClass}>
                <ImYelp /> My Orders
              </NavLink>
            )}
            {user?.role === "Admin" && (
              <NavLink to="/users" className={navClass}>
                <LuUsers />
                Users
              </NavLink>
            )}
            {user?.role === "Admin" && (
              <NavLink to="/products" className={navClass}>
                <AiOutlineProduct />
                Products
              </NavLink>
            )}
            {user?.role === "Admin" && (
              <NavLink to="/orders" className={navClass}>
                <BsBorderStyle />
                Orders
              </NavLink>
            )}

            <NavLink to="/contact" className={navClass}>
              <AiOutlinePhone />
              Contact
            </NavLink>
          </div>
        </div>
      </aside>

      {/* ================= OPEN BUTTON ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-20
            left-5
            z-40
            rounded-full
            bg-orange-400
            p-3
            text-white
            shadow-lg
            hover:cursor-pointer

            lg:hidden
          "
        >
          <TbLayoutSidebarLeftExpand size={24} />
        </button>
      )}
    </>
  );
}

import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer className="mt-12 border-t border-slate-200 bg-white lg:ml-64">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
      <div className="sm:col-span-2">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-950">
          ShopNest<span className="text-orange-600">.</span>
        </Link>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Thoughtfully chosen essentials, straightforward shopping, and secure
          checkout from the first click to delivery.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Explore
        </h2>
        <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-600">
          <Link to="/" className="transition hover:text-orange-600">Home</Link>
          <Link to="/contact" className="transition hover:text-orange-600">Contact</Link>
        </nav>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Get in touch
        </h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2"><MapPin size={16} className="text-orange-600" /> Lahore, Pakistan</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-orange-600" /> +92 300 0000000</p>
          <p className="flex items-center gap-2 break-all"><Mail size={16} className="shrink-0 text-orange-600" /> support@shopnest.com</p>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-100 px-5 py-4 text-center text-xs text-slate-400 sm:px-8 lg:px-10">
      © {new Date().getFullYear()} ShopNest. All rights reserved.
    </div>
  </footer>
);

export default Footer;

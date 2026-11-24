import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="
        mt-10
        w-full
        bg-[#f9fafb]
        text-slate-950
        lg:ml-[260px]
        lg:w-[calc(100%-260px)]
      "
    >
      <div className="bg-gray-300 w-full h-[1px]"></div>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-extrabold">
              Ecommerce
              <span className="text-orange-500">Store</span>
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Quality products at amazing prices. Shop easily and securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Quick Links
            </h3>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <a href="/" className="transition hover:text-orange-500">
                Home
              </a>

              <a href="/products" className="transition hover:text-orange-500">
                Products
              </a>

              <a href="/about" className="transition hover:text-orange-500">
                About
              </a>

              <a href="/contact" className="transition hover:text-orange-500">
                Contact
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Contact
            </h3>

            <div className="mt-2 space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="shrink-0 text-orange-500" />
                Lahore, Pakistan
              </p>

              <p className="flex items-center gap-2">
                <FaPhoneAlt className="shrink-0 text-orange-500" />
                +92 300 0000000
              </p>

              <p className="flex items-center gap-2 break-all">
                <FaEnvelope className="shrink-0 text-orange-500" />
                support@shopnest.com
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Follow Us
            </h3>

            <div className="mt-3 flex gap-2">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-xs transition hover:bg-orange-500"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-xs transition hover:bg-orange-500"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-xs transition hover:bg-orange-500"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-xs transition hover:bg-orange-500"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-2
            px-5
            py-3
            text-center
            sm:flex-row
            sm:px-6
            lg:px-8
          "
        >
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} ShopNest. All rights reserved.
          </p>

          <div className="flex gap-2 text-xl text-slate-500">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

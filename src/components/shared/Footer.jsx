import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-14 bg-ink text-[#D9D0C4]">
      <div className="rangva-container px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="font-display text-2xl tracking-[0.16em] text-white">
            RANG<span className="text-terra">VA</span>
          </div>
          <div className="text-[12px] text-[#A99E90] mt-1">فیشن اور خوبصورتی — ایک ہی جگہ</div>
          <p className="text-[12.5px] leading-6 mt-4 max-w-[270px] text-[#A99E90]">
            Pakistani fashion aur clean beauty ka ek curated store. Karachi se
            Pakistan bhar tak deliver karte hain — cash on delivery ke saath.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {["CASH ON DELIVERY", "JAZZCASH", "EASYPAISA", "VISA / MASTERCARD"].map((p) => (
              <span
                key={p}
                className="border border-white/15 rounded-md px-2.5 py-1 text-[9.5px] tracking-[0.08em] text-[#CFC5B8]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[13px] font-semibold text-white mb-4 tracking-[0.1em] uppercase">
            Shop
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li><Link className="hover:text-white" to="/products?category=Women">Women</Link></li>
            <li><Link className="hover:text-white" to="/products?category=Men">Men</Link></li>
            <li><Link className="hover:text-white" to="/products?department=BEAUTY&category=Skincare">Skincare</Link></li>
            <li><Link className="hover:text-white" to="/products?department=BEAUTY&category=Makeup">Makeup</Link></li>
            <li><Link className="hover:text-white" to="/products?category=Footwear">Footwear</Link></li>
            <li><Link className="hover:text-white" to="/products?sortby=asc">Sale</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[13px] font-semibold text-white mb-4 tracking-[0.1em] uppercase">
            Help
          </h4>
          <ul className="space-y-2.5 text-[13px]">
            <li><Link className="hover:text-white" to="/about">About Rangva</Link></li>
            <li><Link className="hover:text-white" to="/contact">Contact us</Link></li>
            <li><Link className="hover:text-white" to="/contact">Track my order</Link></li>
            <li><Link className="hover:text-white" to="/contact">Returns &amp; exchange</Link></li>
            <li><Link className="hover:text-white" to="/contact">Shipping policy</Link></li>
            <li><Link className="hover:text-white" to="/contact">Size guide</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[13px] font-semibold text-white mb-4 tracking-[0.1em] uppercase">
            Contact
          </h4>
          <ul className="space-y-2.5 text-[13px] text-[#A99E90]">
            <li>+92 300 0000000</li>
            <li>hello@rangva.pk</li>
            <li>Mon–Sat, 10am – 7pm (PKT)</li>
            <li>Karachi, Pakistan</li>
          </ul>
          <div className="flex gap-3 mt-5 text-[15px]">
            <a href="#" aria-label="Instagram" className="hover:text-white"><FaInstagram /></a>
            <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" aria-label="TikTok" className="hover:text-white"><FaTiktok /></a>
            <a href="#" aria-label="WhatsApp" className="hover:text-white"><FaWhatsapp /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="rangva-container px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-[#8C8275]">
          <p>© {new Date().getFullYear()} Rangva. All rights reserved.</p>
          <p>Made with ❤️ in Pakistan · Prices in PKR</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

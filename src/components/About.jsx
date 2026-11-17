import { Link } from "react-router-dom";
import { FaLeaf, FaTruck, FaUndoAlt, FaHeart } from "react-icons/fa";

const values = [
  {
    icon: FaHeart,
    title: "Curated, not crowded",
    text: "Har product hum khud chunte hain — trend ke peeche bhaag kar quality se samjhauta nahi karte.",
  },
  {
    icon: FaLeaf,
    title: "Clean beauty first",
    text: "Skincare aur makeup me simple ingredients, honest claims aur dermatologist-tested formulas.",
  },
  {
    icon: FaTruck,
    title: "Pakistan bhar me delivery",
    text: "Karachi se Gilgit tak — cash on delivery, 2–6 working days, Rs. 199 flat.",
  },
  {
    icon: FaUndoAlt,
    title: "7-day easy returns",
    text: "Size galat ho ya pasand na aaye — unused item 7 din me wapas kar sakte hain.",
  },
];

const About = () => {
  const image = `${import.meta.env.VITE_BACK_END_URL}/images/u_1490481651871-ab68de25d43d.jpg`;

  return (
    <div className="rangva-container px-4 lg:px-6 py-10">
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <div className="text-[10px] tracking-[0.26em] uppercase text-terra mb-3">
            Our story
          </div>
          <h1 className="font-display text-[34px] sm:text-[46px] leading-[1.05] text-ink">
            Fashion aur beauty,
            <br />
            ek hi kahani.
          </h1>
          <p className="text-[13.5px] leading-7 text-[#5f544a] mt-5 max-w-[480px]">
            Rangva ek Pakistani store hai jo kapron aur skincare ko ek hi jagah
            laata hai. Humara naam <b>rang</b> se aaya — har din, har mausam,
            har mood ka apna rang hota hai.
          </p>
          <p className="text-[13.5px] leading-7 text-[#5f544a] mt-3 max-w-[480px]">
            Hamari team Karachi me baith kar har product check karti hai — fabric,
            fit, ingredients aur packaging. Jo cheez hum khud nahi pehnte ya
            istemaal nahi karte, wo hum bechte nahi.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              to="/products"
              className="h-11 px-7 inline-flex items-center rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
            >
              Shop now
            </Link>
            <Link
              to="/contact"
              className="h-11 px-7 inline-flex items-center rounded-full border border-line text-ink text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:border-ink transition"
            >
              Contact us
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-sand border border-line">
            <img src={image} alt="Rangva" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-3 sm:left-6 bg-white border border-line rounded-xl px-5 py-3 shadow-sm">
            <div className="font-display text-[22px] leading-none text-ink">2026</div>
            <div className="text-[10.5px] text-muted mt-1">Founded in Karachi</div>
          </div>
        </div>
      </div>

      {/* Values */}
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="font-display text-[28px] sm:text-[34px] text-ink">What we stand for</h2>
          <p className="text-[12.5px] text-muted mt-2">Chaar simple waday</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white border border-line rounded-2xl p-6">
              <div className="w-10 h-10 rounded-full bg-[#f7e6e1] text-terra grid place-items-center mb-4">
                <v.icon size={16} />
              </div>
              <h3 className="text-[14px] font-semibold text-ink mb-1.5">{v.title}</h3>
              <p className="text-[12px] leading-6 text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-14 bg-ink text-[#E8DFD3] rounded-2xl px-6 sm:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[
          ["40+", "Curated products"],
          ["8", "Categories"],
          ["2–4", "Days delivery"],
          ["100%", "COD available"],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="font-display text-[28px] text-white leading-none">{value}</div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-[#A99E90] mt-2">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default About;

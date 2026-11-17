import { Link } from "react-router-dom";
import { bannerLists } from "../../utils";

const HeroBanner = () => {
  return (
    <section className="rangva-container px-4 lg:px-6 mt-5">
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-4">
        {/* Main hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F6EDE3] via-[#F0E1D3] to-[#EFD8CF] px-7 sm:px-10 lg:px-12 py-12 lg:py-16 flex flex-col justify-center min-h-[380px]">
          <div className="absolute -right-24 -bottom-28 w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,rgba(192,91,69,0.28))]" />
          <div className="relative">
            <div className="text-[10.5px] tracking-[0.28em] uppercase text-terra mb-4">
              Autumn / Winter 2026 · Fashion + Beauty
            </div>
            <h1 className="font-display text-[38px] sm:text-[48px] lg:text-[58px] leading-[1.02] max-w-[470px] text-ink">
              Colour your
              <br />
              everyday.
            </h1>
            <p className="mt-4 mb-7 max-w-[400px] text-[13.5px] leading-7 text-[#5f544a]">
              Curated clothing and clean beauty — one store, one checkout,
              delivered anywhere in Pakistan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products?sortby=desc"
                className="px-7 py-3 rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
              >
                Shop new in
              </Link>
              <Link
                to="/products?department=BEAUTY"
                className="px-7 py-3 rounded-full border border-[#cbb9a6] text-ink text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-white transition"
              >
                Explore beauty
              </Link>
            </div>
          </div>
        </div>

        {/* Two promo tiles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4">
          {bannerLists.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative overflow-hidden rounded-2xl min-h-[180px] sm:min-h-[200px] bg-sand"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className="text-[9.5px] tracking-[0.24em] uppercase text-white/75 mb-1.5">
                  {item.title}
                </div>
                <h3 className="font-display text-[24px] leading-tight">{item.subtitle}</h3>
                <p className="text-[11.5px] text-white/85 mt-1.5 max-w-[240px]">{item.description}</p>
                <span className="mt-3 text-[10.5px] tracking-[0.16em] uppercase border-b border-white/70 w-fit pb-0.5">
                  {item.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

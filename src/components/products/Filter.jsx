import { useEffect, useState } from "react";
import { FiRefreshCw, FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { departments, priceBands, sizeFilters } from "../../utils";

const brands = ["Rangva Studio", "Sadaa", "Naya", "Zaitoon", "Kiraan", "Meher"];
const numericSizes = ["30", "32", "34", "36", "38", "40", "41", "42", "43", "44"];

const pillBase =
  "h-9 px-3.5 rounded-full text-[11.5px] font-medium border transition whitespace-nowrap";
const pillOff = "bg-white border-line text-[#5c5349] hover:border-ink";
const pillOn = "bg-ink border-ink text-white";
const selectClass =
  "h-10 w-full rounded-lg border border-line bg-white px-3 text-[12.5px] text-ink outline-none focus:border-ink";

const Filter = ({ categories = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");

  const value = (key, fallback = "all") => searchParams.get(key) || fallback;

  const currentPrice =
    searchParams.get("minPrice") !== null && searchParams.get("maxPrice") !== null
      ? `${searchParams.get("minPrice")}-${searchParams.get("maxPrice")}`
      : "all";

  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, val]) => {
      if (val === undefined || val === null || val === "" || val === "all") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next, { replace: true });
  };

  const setPrice = (bandValue) => {
    const next = new URLSearchParams(searchParams);
    next.delete("minPrice");
    next.delete("maxPrice");
    if (bandValue !== "all") {
      const [min, max] = bandValue.split("-");
      next.set("minPrice", min);
      next.set("maxPrice", max);
    }
    setSearchParams(next, { replace: true });
  };

  // Debounce the search box so we do not refetch on every keystroke
  useEffect(() => {
    const current = searchParams.get("keyword") || "";
    if (searchTerm === current) return undefined;
    const id = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchTerm.trim()) next.set("keyword", searchTerm.trim());
      else next.delete("keyword");
      setSearchParams(next, { replace: true });
    }, 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Keep the box in sync when the URL changes from outside (e.g. navbar search)
  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("keyword")]);

  const clearAll = () => {
    setSearchTerm("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const activeCount = [
    "keyword",
    "category",
    "department",
    "brand",
    "size",
    "minPrice",
  ].filter((key) => searchParams.get(key)).length;

  return (
    <div className="bg-white border border-line rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Row 1: search + department + sort */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex items-center flex-1">
          <FiSearch className="absolute left-3.5 text-muted" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search kurtas, serums, sneakers…"
            className="h-10 w-full rounded-full border border-line bg-ivory pl-10 pr-4 text-[13px] text-ink outline-none focus:border-ink placeholder:text-muted"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-ivory border border-line rounded-full p-1 self-start lg:self-auto overflow-x-auto scrollbar-hide">
          {departments.map((d) => (
            <button
              key={d.key}
              onClick={() =>
                update({ department: d.key, category: "all" })
              }
              className={`h-8 px-4 rounded-full text-[11.5px] font-semibold tracking-[0.08em] uppercase transition whitespace-nowrap ${
                value("department") === d.key
                  ? "bg-ink text-white"
                  : "text-[#5c5349] hover:text-terra"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <select
          value={value("sortby", "desc")}
          onChange={(e) => update({ sortby: e.target.value })}
          className={`${selectClass} lg:w-[180px]`}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Price: low to high</option>
        </select>

        <button
          onClick={clearAll}
          className="h-10 px-4 rounded-full border border-line text-[11.5px] font-semibold text-ink flex items-center gap-2 hover:border-ink transition whitespace-nowrap"
        >
          <FiRefreshCw size={13} />
          Clear{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      {/* Row 2: category / brand / price */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <div className="text-[10px] tracking-[0.16em] uppercase text-muted mb-1.5">Category</div>
          <select
            value={value("category")}
            onChange={(e) => update({ category: e.target.value })}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryName}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.16em] uppercase text-muted mb-1.5">Brand</div>
          <select
            value={value("brand")}
            onChange={(e) => update({ brand: e.target.value })}
            className={selectClass}
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.16em] uppercase text-muted mb-1.5">Price</div>
          <select
            value={currentPrice}
            onChange={(e) => setPrice(e.target.value)}
            className={selectClass}
          >
            <option value="all">Any price</option>
            {priceBands.map((band) => (
              <option key={band.label} value={`${band.min}-${band.max}`}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: sizes */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 pt-1">
        <div className="text-[10px] tracking-[0.16em] uppercase text-muted shrink-0 sm:pt-2.5">
          Size
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => update({ size: "all" })}
            className={`${pillBase} ${value("size") === "all" ? pillOn : pillOff}`}
          >
            All
          </button>
          {sizeFilters.map((size) => (
            <button
              key={size}
              onClick={() => update({ size })}
              className={`${pillBase} ${value("size") === size ? pillOn : pillOff}`}
            >
              {size}
            </button>
          ))}
          {numericSizes.map((size) => (
            <button
              key={size}
              onClick={() => update({ size })}
              className={`${pillBase} ${value("size") === size ? pillOn : pillOff}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;

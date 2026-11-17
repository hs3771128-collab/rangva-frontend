import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingBag, FaSignInAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import UserMenu from "../UserMenu";
import { fetchWishlist } from "../../store/actions";

const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const { cart } = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);
    const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const currentSearchTerm = searchParams.get("keyword") || "";
        setSearchTerm(currentSearchTerm);
    }, [searchParams]);

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlist());
        }
    }, [user, dispatch]);

    const handleSearchSubmit = () => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm.trim()) {
            params.set("keyword", searchTerm.trim());
            navigate(`/products?${params.toString()}`);
        } else {
            params.delete("keyword");
            navigate(`/products?${params.toString()}`);
        }
        setNavbarOpen(false);
    };

    const navLinks = [
        { label: "New In", to: "/products?sortby=desc" },
        { label: "Women", to: "/products?category=Women" },
        { label: "Men", to: "/products?category=Men" },
        { label: "Beauty", to: "/products?department=BEAUTY" },
        { label: "Sale", to: "/products?sortby=asc" },
    ];

    return (
        <>
            {/* Pakistani announcement bar */}
            <div className="bg-ink text-[#F3E9DC] text-[10.5px] sm:text-[11px] tracking-[0.18em] uppercase">
                <div className="rangva-container px-4 py-2 flex items-center justify-center gap-x-6 gap-y-1 flex-wrap text-center">
                    <span>🚚 Free delivery over <b className="text-gold font-semibold">Rs. 3,000</b></span>
                    <span className="hidden sm:inline">💵 Cash on Delivery all over Pakistan</span>
                    <span>🇵🇰 Proudly Pakistani</span>
                </div>
            </div>

            <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-line">
                <div className="rangva-container px-4 lg:px-6 flex items-center gap-4 lg:gap-7 h-[68px]">
                    {/* Brand */}
                    <Link to="/" className="flex flex-col leading-none shrink-0">
                        <span className="font-display text-[23px] sm:text-[26px] tracking-[0.16em] font-semibold text-ink">
                            RANG<span className="text-terra">VA</span>
                        </span>
                        <span className="text-[10px] text-muted mt-1 tracking-[0.08em]">
                            فیشن اور خوبصورتی
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-[12.5px] tracking-[0.12em] uppercase font-medium text-[#3c352e]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="hover:text-terra transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 ml-auto bg-white border border-line rounded-full px-4 h-10 w-[230px] xl:w-[280px]">
                        <FiSearch className="text-muted shrink-0" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                            placeholder="Search lawn, serums, sneakers…"
                            className="bg-transparent outline-none text-[13px] w-full text-ink placeholder:text-muted"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-auto md:ml-0">
                        <Link
                            to="/wishlist"
                            title="Wishlist"
                            className="relative w-9 h-9 rounded-full bg-white border border-line grid place-items-center text-ink hover:text-terra transition"
                        >
                            {wishlistIds.length > 0 ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                            {wishlistIds.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-terra text-white text-[9px] w-4 h-4 rounded-full grid place-items-center">
                                    {wishlistIds.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/cart"
                            title="Cart"
                            className="relative w-9 h-9 rounded-full bg-white border border-line grid place-items-center text-ink hover:text-terra transition"
                        >
                            <FaShoppingBag size={14} />
                            <span className="absolute -top-1 -right-1 bg-terra text-white text-[9px] w-4 h-4 rounded-full grid place-items-center">
                                {cart?.length || 0}
                            </span>
                        </Link>

                        {user && user.id ? (
                            <div className="text-ink hidden sm:block">
                                <UserMenu />
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2 bg-ink text-white text-[11px] tracking-[0.14em] uppercase font-semibold px-4 h-9 rounded-full hover:bg-terra transition"
                            >
                                <FaSignInAlt size={12} /> Login
                            </Link>
                        )}

                        <button
                            onClick={() => setNavbarOpen(!navbarOpen)}
                            className="lg:hidden w-9 h-9 grid place-items-center text-ink"
                            aria-label="Menu"
                        >
                            {navbarOpen ? <RxCross2 size={24} /> : <IoIosMenu size={26} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-200 bg-ivory border-t border-line ${
                        navbarOpen ? "max-h-[420px]" : "max-h-0"
                    }`}
                >
                    <div className="px-4 py-4 space-y-3">
                        <div className="flex items-center gap-2 bg-white border border-line rounded-full px-4 h-10">
                            <FiSearch className="text-muted" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                                placeholder="Search products"
                                className="bg-transparent outline-none text-sm w-full"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    onClick={() => setNavbarOpen(false)}
                                    className="px-4 py-2.5 rounded-lg bg-white border border-line text-[12px] tracking-[0.1em] uppercase text-ink"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        {!user?.id && (
                            <Link
                                to="/login"
                                onClick={() => setNavbarOpen(false)}
                                className="flex items-center justify-center gap-2 bg-ink text-white text-[12px] tracking-[0.12em] uppercase font-semibold px-4 py-3 rounded-full"
                            >
                                <FaSignInAlt size={13} /> Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;

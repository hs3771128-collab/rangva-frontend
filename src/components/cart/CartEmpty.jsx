import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full bg-[#f7e6e1] text-terra grid place-items-center mb-5">
        <FaShoppingBag size={22} />
      </div>
      <h1 className="font-display text-[28px] text-ink">Aap ka cart khali hai</h1>
      <p className="text-[13px] text-muted mt-2 text-center max-w-[330px]">
        Fashion ya beauty — jo pasand aaye add karein, phir yahan se checkout kar lein.
      </p>
      <Link
        to="/products"
        className="mt-6 inline-flex items-center gap-2 h-11 px-7 rounded-full bg-ink text-white text-[11.5px] tracking-[0.16em] uppercase font-semibold hover:bg-terra transition"
      >
        <FaArrowLeft size={11} />
        Start shopping
      </Link>
    </div>
  );
};

export default CartEmpty;

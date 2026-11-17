import { FaMinus, FaPlus } from "react-icons/fa";

const SetQuantity = ({ quantity, cardCounter, handeQtyIncrease, handleQtyDecrease }) => {
  return (
    <div className="flex gap-8 items-center">
      {cardCounter ? null : (
        <div className="text-[10px] tracking-[0.16em] uppercase text-muted">Quantity</div>
      )}
      <div className="flex items-center border border-line rounded-lg h-9 bg-white">
        <button
          disabled={quantity <= 1}
          className="w-8 h-full grid place-items-center text-ink hover:text-terra disabled:opacity-30"
          onClick={handleQtyDecrease}
          aria-label="Decrease quantity"
        >
          <FaMinus size={9} />
        </button>
        <span className="w-7 text-center text-[12.5px] font-semibold text-ink">{quantity}</span>
        <button
          className="w-8 h-full grid place-items-center text-ink hover:text-terra"
          onClick={handeQtyIncrease}
          aria-label="Increase quantity"
        >
          <FaPlus size={9} />
        </button>
      </div>
    </div>
  );
};

export default SetQuantity;

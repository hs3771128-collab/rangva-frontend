import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi";
import SetQuantity from "./SetQuantity";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  decreaseCartQuantity,
  increaseCartQuantity,
  removeFromCart,
} from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";

const ItemContent = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  cartId,
  variantLabel,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const payload = {
    image,
    productName,
    description,
    specialPrice,
    price,
    productId,
    quantity,
  };

  const handleQtyIncrease = () => {
    dispatch(
      increaseCartQuantity(payload, toast, currentQuantity, setCurrentQuantity),
    );
  };

  const handleQtyDecrease = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      dispatch(decreaseCartQuantity(payload));
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr_90px_130px_100px] gap-4 items-center p-4">
      {/* Product */}
      <div className="flex gap-3 min-w-0">
        <Link to={`/products/${productId}`} className="shrink-0">
          <img
            src={image}
            alt={productName}
            className="w-[70px] h-[88px] object-cover rounded-lg border border-line bg-sand"
          />
        </Link>
        <div className="min-w-0">
          <Link
            to={`/products/${productId}`}
            className="text-[13px] font-semibold text-ink hover:text-terra transition block"
          >
            {truncateText(productName, 42)}
          </Link>
          {variantLabel && (
            <div className="mt-1 text-[10px] inline-block border border-line rounded px-2 py-0.5 text-[#5c5349]">
              {variantLabel}
            </div>
          )}
          <div className="text-[10.5px] text-muted mt-1.5">
            {formatPrice(specialPrice)} each
          </div>
          <button
            onClick={() => dispatch(removeFromCart(payload, toast))}
            className="flex items-center gap-1.5 mt-2 text-[10.5px] text-terra hover:text-terra-dark transition"
          >
            <HiOutlineTrash size={13} /> Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="hidden md:block text-center text-[12.5px] font-semibold text-ink">
        {formatPrice(Number(specialPrice))}
      </div>

      {/* Quantity */}
      <div className="justify-self-start md:justify-self-center">
        <SetQuantity
          quantity={currentQuantity}
          cardCounter={true}
          handeQtyIncrease={handleQtyIncrease}
          handleQtyDecrease={handleQtyDecrease}
        />
      </div>

      {/* Total */}
      <div className="justify-self-start md:justify-self-end text-[13px] font-bold text-ink">
        {formatPrice(Number(currentQuantity) * Number(specialPrice))}
      </div>
    </div>
  );
};

export default ItemContent;

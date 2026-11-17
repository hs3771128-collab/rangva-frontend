import { FaCheckCircle, FaEdit, FaMapMarkerAlt, FaPhoneAlt, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { selectUserCheckoutAddress } from "../../store/actions";

const AddressList = ({ addresses, setSelectedAddress, setOpenAddressModal, setOpenDeleteModal }) => {
  const dispatch = useDispatch();
  const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

  const onEditButtonHandler = (e, address) => {
    e.stopPropagation();
    setSelectedAddress(address);
    setOpenAddressModal(true);
  };

  const onDeleteButtonHandler = (e, address) => {
    e.stopPropagation();
    setSelectedAddress(address);
    setOpenDeleteModal(true);
  };

  return (
    <div className="space-y-3">
      {addresses.map((address) => {
        const active = selectedUserCheckoutAddress?.addressId === address.addressId;
        return (
          <div
            key={address.addressId}
            onClick={() => dispatch(selectUserCheckoutAddress(address))}
            className={`relative p-4 rounded-xl border cursor-pointer transition ${
              active ? "border-terra bg-[#fbf0ec]" : "border-line bg-white hover:border-ink/30"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-semibold text-ink">
                    {address.buildingName || address.area || "Delivery address"}
                  </span>
                  {active && <FaCheckCircle className="text-terra shrink-0" size={13} />}
                </div>

                <p className="text-[12px] text-[#5f544a] mt-1 leading-5">
                  {[address.street, address.area].filter(Boolean).join(", ")}
                </p>
                <p className="text-[12px] text-[#5f544a] leading-5">
                  {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11.5px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <FaPhoneAlt size={10} /> {address.phone || "No phone"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt size={11} /> {address.country || "Pakistan"}
                  </span>
                </div>
              </div>

              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={(e) => onEditButtonHandler(e, address)}
                  className="w-8 h-8 rounded-lg border border-line grid place-items-center text-ink hover:border-ink transition"
                  aria-label="Edit address"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={(e) => onDeleteButtonHandler(e, address)}
                  className="w-8 h-8 rounded-lg border border-line grid place-items-center text-terra hover:bg-[#f7e6e1] transition"
                  aria-label="Delete address"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressList;

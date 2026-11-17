import { useState } from "react";
import Skeleton from "../shared/Skeleton";
import { FaAddressBook, FaPlus } from "react-icons/fa";
import AddressInfoModal from "./AddressInfoModal";
import AddAddressForm from "./AddAddressForm";
import { useDispatch, useSelector } from "react-redux";
import AddressList from "./AddressList";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";
import { deleteUserAddress } from "../../store/actions";

const AddressInfo = ({ address }) => {
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const dispatch = useDispatch();
  const { isLoading, btnLoader } = useSelector((state) => state.errors);

  const addNewAddressHandler = () => {
    setSelectedAddress("");
    setOpenAddressModal(true);
  };

  const deleteAddressHandler = () => {
    dispatch(
      deleteUserAddress(toast, selectedAddress?.addressId, setOpenDeleteModal),
    );
  };

  const noAddressExist = !address || address.length === 0;

  return (
    <div className="max-w-2xl mx-auto px-4">
      {noAddressExist ? (
        <div className="p-10 bg-white border border-line rounded-2xl flex flex-col items-center text-center">
          <FaAddressBook size={44} className="text-[#c6bfb6] mb-4" />
          <h2 className="font-display text-[24px] text-ink mb-1.5">
            Abhi koi address nahi
          </h2>
          <p className="text-[12.5px] text-muted mb-6">
            Delivery address add karein taake order dispatch ho sake.
          </p>
          <button
            onClick={addNewAddressHandler}
            className="flex items-center gap-2 h-11 px-6 rounded-full bg-ink text-white text-[11.5px] tracking-[0.14em] uppercase font-semibold hover:bg-terra transition"
          >
            <FaPlus size={12} /> Add address
          </button>
        </div>
      ) : (
        <div className="bg-white border border-line rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-[24px] text-ink leading-none">
                Delivery address
              </h2>
              <p className="text-[12px] text-muted mt-1.5">
                Select karein ya naya address add karein.
              </p>
            </div>
            <button
              onClick={addNewAddressHandler}
              className="flex items-center gap-2 h-9 px-4 rounded-full border border-ink text-[11px] tracking-[0.12em] uppercase font-semibold hover:bg-ink hover:text-white transition shrink-0"
            >
              <FaPlus size={10} /> New
            </button>
          </div>

          {isLoading ? (
            <div className="py-6">
              <Skeleton />
            </div>
          ) : (
            <AddressList
              addresses={address}
              setSelectedAddress={setSelectedAddress}
              setOpenAddressModal={setOpenAddressModal}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          )}
        </div>
      )}

      <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
        <AddAddressForm
          address={selectedAddress}
          setOpenAddressModal={setOpenAddressModal}
        />
      </AddressInfoModal>

      <DeleteModal
        open={openDeleteModal}
        loader={btnLoader}
        setOpen={setOpenDeleteModal}
        title="Delete Address"
        onDeleteHandler={deleteAddressHandler}
      />
    </div>
  );
};

export default AddressInfo;

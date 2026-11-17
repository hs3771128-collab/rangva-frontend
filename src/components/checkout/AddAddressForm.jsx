import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaAddressCard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";
import { addUpdateUserAddress } from "../../store/actions";
import { cities, provinces } from "../../utils";

const fieldClass = (hasError) =>
  `h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-ink outline-none focus:border-ink ${
    hasError ? "border-red-500" : "border-line"
  }`;

const labelClass = "text-[12px] font-semibold text-ink mb-1 block";

const AddAddressForm = ({ address, setOpenAddressModal }) => {
  const dispatch = useDispatch();
  const { btnLoader } = useSelector((state) => state.errors);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const onSaveAddressHandler = (data) => {
    dispatch(
      addUpdateUserAddress(
        { ...data, country: "Pakistan" },
        toast,
        address?.addressId,
        setOpenAddressModal,
      ),
    );
  };

  useEffect(() => {
    if (address?.addressId) {
      setValue("phone", address?.phone);
      setValue("street", address?.street);
      setValue("area", address?.area);
      setValue("buildingName", address?.buildingName);
      setValue("city", address?.city);
      setValue("state", address?.state);
      setValue("pincode", address?.pincode);
    } else {
      reset();
    }
  }, [address, setValue, reset]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSaveAddressHandler)} className="space-y-3">
        <div className="flex items-center gap-2 mb-1 text-ink">
          <FaAddressCard className="text-terra" />
          <h3 className="font-display text-[20px]">
            {!address?.addressId ? "Add delivery address" : "Update address"}
          </h3>
        </div>
        <p className="text-[11.5px] text-muted !mt-1 mb-3">
          Pakistan bhar me delivery — COD available.
        </p>

        <div>
          <label className={labelClass}>Mobile number *</label>
          <input
            type="tel"
            placeholder="03XX XXXXXXX"
            className={fieldClass(errors.phone)}
            {...register("phone", {
              required: "Mobile number zaroori hai",
              pattern: {
                value: /^(03\d{9}|\+923\d{9}|923\d{9})$/,
                message: "Sahi Pakistani number likhein (03XX XXXXXXX)",
              },
            })}
          />
          {errors.phone && (
            <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Province *</label>
            <select
              className={fieldClass(errors.state)}
              {...register("state", { required: "Province select karein" })}
              defaultValue=""
            >
              <option value="">Select province</option>
              {provinces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.state && (
              <p className="text-[11px] text-red-600 mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>City *</label>
            <input
              list="pk-cities"
              placeholder="Karachi, Lahore…"
              className={fieldClass(errors.city)}
              {...register("city", {
                required: "City zaroori hai",
                minLength: { value: 3, message: "Kam az kam 3 characters" },
              })}
            />
            <datalist id="pk-cities">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {errors.city && (
              <p className="text-[11px] text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Area / neighbourhood</label>
          <input
            type="text"
            placeholder="DHA Phase 5, Block C / Gulberg III"
            className={fieldClass(false)}
            {...register("area")}
          />
        </div>

        <div>
          <label className={labelClass}>House &amp; street *</label>
          <input
            type="text"
            placeholder="House 12, Street 5"
            className={fieldClass(errors.street)}
            {...register("street", {
              required: "Street zaroori hai",
              minLength: { value: 5, message: "Kam az kam 5 characters" },
            })}
          />
          {errors.street && (
            <p className="text-[11px] text-red-600 mt-1">{errors.street.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Building / apartment</label>
            <input
              type="text"
              placeholder="Al-Noor Apartments (optional)"
              className={fieldClass(false)}
              {...register("buildingName")}
            />
          </div>
          <div>
            <label className={labelClass}>Postal code</label>
            <input
              type="text"
              placeholder="75500 (optional)"
              className={fieldClass(false)}
              {...register("pincode")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11.5px] text-muted bg-ivory border border-line rounded-lg px-3 py-2">
          <span className="text-[14px]">🇵🇰</span>
          Country: <b className="text-ink">Pakistan</b>
        </div>

        <button
          disabled={btnLoader}
          className="h-10 px-6 rounded-lg bg-ink text-white text-[11.5px] tracking-[0.14em] uppercase font-semibold hover:bg-terra transition flex items-center gap-2 disabled:opacity-60"
          type="submit"
        >
          {btnLoader ? (
            <>
              <Spinners /> Saving…
            </>
          ) : (
            "Save address"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "../../shared/InputField";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Spinners from "../../shared/Spinners";
import {
  addNewProductFromDashboard,
  fetchCategories,
  updateProductFromDashboard,
} from "../../../store/actions";
import SelectTextField from "../../shared/SelectTextField";
import Skeleton from "../../shared/Skeleton";
import ErrorPage from "../../shared/ErrorPage";

const variantTypes = [
  { value: "SIZE", label: "Size (S, M, L / 40, 42)" },
  { value: "SHADE", label: "Shade (Rosewood, Beige)" },
  { value: "VOLUME", label: "Volume / weight (50ml, 100g)" },
  { value: "ONE", label: "Single option (One Size)" },
];

const fieldClass = "h-10 w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-ink";
const labelClass = "text-[11.5px] font-semibold text-ink mb-1 block";

const AddProductForm = ({ setOpen, product, update = false }) => {
  const [loader, setLoader] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [variantLabels, setVariantLabels] = useState("");
  const [variantType, setVariantType] = useState("SIZE");
  const [variantStock, setVariantStock] = useState(10);

  const { categories } = useSelector((state) => state.products);
  const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { department: "FASHION", discount: 0 },
  });

  const saveProductHandler = (data) => {
    const labels = variantLabels
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean);

    const variants = labels.map((label) => ({
      label,
      variantType,
      stock: Number(variantStock) || 0,
      extraPrice: 0,
    }));

    const sendData = { ...data, variants };

    if (!update) {
      dispatch(
        addNewProductFromDashboard(
          { ...sendData, categoryId: selectedCategory?.categoryId },
          toast,
          reset,
          setLoader,
          setOpen,
          isAdmin,
        ),
      );
    } else {
      dispatch(
        updateProductFromDashboard(
          { ...sendData, id: product?.id },
          toast,
          reset,
          setLoader,
          setOpen,
          isAdmin,
        ),
      );
    }
  };

  useEffect(() => {
    if (update && product) {
      setValue("productName", product?.productName);
      setValue("price", product?.price);
      setValue("quantity", product?.quantity);
      setValue("discount", product?.discount);
      setValue("description", product?.description);
      setValue("brand", product?.brand || "");
      setValue("department", product?.department || "FASHION");

      const variants = product?.variants || [];
      setVariantLabels(variants.map((v) => v.label).join(", "));
      setVariantType(variants[0]?.variantType || "SIZE");
      setVariantStock(variants[0]?.stock ?? 10);
    }
  }, [update, product, setValue]);

  useEffect(() => {
    if (!update) {
      dispatch(fetchCategories());
    }
  }, [dispatch, update]);

  useEffect(() => {
    if (!categoryLoader && categories) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, categoryLoader]);

  if (categoryLoader) return <Skeleton />;
  if (errorMessage) return <ErrorPage message={errorMessage} />;

  return (
    <div className="py-2 relative max-h-[75vh] overflow-y-auto pr-1">
      <form className="space-y-4" onSubmit={handleSubmit(saveProductHandler)}>
        <div className="flex md:flex-row flex-col gap-4 w-full">
          <InputField
            label="Product name"
            required
            id="productName"
            type="text"
            message="Product name is required"
            register={register}
            placeholder="e.g. Handloom Cotton Kurta — Ivory"
            errors={errors}
          />

          {!update && (
            <SelectTextField
              label="Category"
              select={selectedCategory}
              setSelect={setSelectedCategory}
              lists={categories}
            />
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Department *</label>
            <select
              className={fieldClass}
              {...register("department", { required: true })}
            >
              <option value="FASHION">Fashion (clothing, footwear, accessories)</option>
              <option value="BEAUTY">Beauty (skincare, makeup, fragrance)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Brand</label>
            <input
              type="text"
              placeholder="Rangva Studio, Sadaa, Zaitoon…"
              className={fieldClass}
              {...register("brand")}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <InputField
            label="Price (PKR)"
            required
            id="price"
            type="number"
            message="Price is required"
            placeholder="4900"
            register={register}
            errors={errors}
          />
          <InputField
            label="Discount (%)"
            id="discount"
            type="number"
            message="Discount is required"
            placeholder="15"
            register={register}
            errors={errors}
          />
          <InputField
            label="Total stock"
            required
            id="quantity"
            type="number"
            message="Stock is required"
            placeholder="45"
            register={register}
            errors={errors}
          />
        </div>

        {/* Variants */}
        <div className="bg-ivory border border-line rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-[12.5px] font-semibold text-ink">Options / variants</h4>
            <p className="text-[11px] text-muted mt-0.5">
              Comma separated — jaise <b>S, M, L, XL</b> ya <b>Rosewood, Nude, Berry</b>.
              Khali chhornay par product single-option ho ga.
            </p>
          </div>

          <div className="grid sm:grid-cols-[1.4fr_1fr_110px] gap-3">
            <div>
              <label className={labelClass}>Labels</label>
              <input
                type="text"
                value={variantLabels}
                onChange={(e) => setVariantLabels(e.target.value)}
                placeholder="S, M, L, XL"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Option type</label>
              <select
                value={variantType}
                onChange={(e) => setVariantType(e.target.value)}
                className={fieldClass}
              >
                {variantTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Stock / option</label>
              <input
                type="number"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="desc" className="font-semibold text-sm text-ink">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Fabric, fit, ingredients — customer kya jaanna chahega…"
            className={`px-3 py-2 w-full border outline-hidden bg-white text-ink rounded-lg text-[13px] ${
              errors["description"]?.message ? "border-red-500" : "border-line"
            }`}
            maxLength={255}
            {...register("description", {
              required: { value: true, message: "Description is required" },
            })}
          />
          {errors["description"]?.message && (
            <p className="text-[11px] font-semibold text-red-600">
              {errors["description"]?.message}
            </p>
          )}
        </div>

        <div className="flex w-full justify-end items-center gap-3 pt-2">
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={loader}
            type="submit"
            variant="contained"
            className="bg-custom-blue text-white py-[9px] px-5 text-sm font-medium"
          >
            {loader ? (
              <div className="flex gap-2 items-center">
                <Spinners /> Saving…
              </div>
            ) : (
              "Save product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;

import { FaBoxOpen, FaHome, FaShoppingCart, FaStore, FaThList } from "react-icons/fa";

const API = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";
export const imageUrl = (fileName) => `${API}/images/${fileName}`;

/** Three promo tiles shown under the hero on the home page. */
export const bannerLists = [
  {
    id: 1,
    image: imageUrl("u_1490481651871-ab68de25d43d.jpg"),
    title: "The fashion edit",
    subtitle: "Everyday essentials",
    description: "Kurtas, denim and footwear built for Pakistani weather",
    cta: "Shop clothing",
    link: "/products?department=FASHION",
  },
  {
    id: 2,
    image: imageUrl("u_1598440947619-2c35fc9aa908.jpg"),
    title: "Glow week",
    subtitle: "Skin & makeup",
    description: "Up to 40% off skincare, makeup and fragrance",
    cta: "Shop beauty",
    link: "/products?department=BEAUTY",
  },
];

/** Department tiles used across the storefront. */
export const departments = [
  { key: "all", label: "All" },
  { key: "FASHION", label: "Fashion" },
  { key: "BEAUTY", label: "Beauty" },
];

/** Provinces / territories used by the address form. */
export const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu & Kashmir",
];

/** Main delivery cities, with more accepted through the "Other" option. */
export const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Sukkur",
  "Mardan",
];

/** Payment methods supported by the Pakistani checkout. */
export const paymentMethods = [
  {
    value: "CASH_ON_DELIVERY",
    label: "Cash on Delivery",
    description: "Pay the rider when your parcel arrives. No advance needed.",
  },
  {
    value: "JAZZCASH",
    label: "JazzCash",
    description: "Pay with your JazzCash mobile account on the secure JazzCash page.",
    gateway: "jazzcash",
  },
  {
    value: "EASYPAISA",
    label: "Easypaisa",
    description: "Pay with your Easypaisa mobile account on the secure Easypaisa page.",
    gateway: "easypaisa",
  },
  {
    value: "SAFEPAY",
    label: "Debit / Credit Card",
    description: "Visa & Mastercard via Safepay's secure checkout — 3-D Secure supported.",
    gateway: "safepay",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    description: "Transfer to our account and share the receipt — order ships after verification.",
  },
];

export const sizeFilters = ["XS", "S", "M", "L", "XL", "XXL"];

export const priceBands = [
  { label: "Under Rs. 2,000", min: 0, max: 2000 },
  { label: "Rs. 2,000 – 5,000", min: 2000, max: 5000 },
  { label: "Rs. 5,000 – 10,000", min: 5000, max: 10000 },
  { label: "Above Rs. 10,000", min: 10000, max: 999999 },
];

export const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaHome,
    current: true
  }, {
    name: "Orders",
    href: "/admin/orders",
    icon: FaShoppingCart
  }, {
    name: "Products",
    href: "/admin/products",
    icon: FaBoxOpen
  }, {
    name: "Categories",
    href: "/admin/categories",
    icon: FaThList
  }, {
    name: "Sellers",
    href: "/admin/sellers",
    icon: FaStore
  }
];

export const sellerNavigation = [
  {
    name: "Orders",
    href: "/admin/orders",
    icon: FaShoppingCart,
    current: true
  }, {
    name: "Products",
    href: "/admin/products",
    icon: FaBoxOpen
  }
];

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [productsUrl, setProductsUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [saved, setSaved] = useState(false);

  // Read current values from localStorage on mount
  useEffect(() => {
    try {
      const lsProducts =
        window.localStorage.getItem("eshop_products_url") || "";
      const lsProduct = window.localStorage.getItem("eshop_product_url") || "";
      setProductsUrl(lsProducts);
      setProductUrl(lsProduct);
    } catch (_) {
      // no-op
    }
  }, []);

  const envHints = useMemo(() => {
    let envProducts = "";
    let envProduct = "";
    try {
      envProducts = import.meta?.env?.VITE_PRODUCTS_URL || "";
      envProduct = import.meta?.env?.VITE_PRODUCT_URL || "";
    } catch (_) {
      // no-op
    }
    return { envProducts, envProduct };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (productsUrl)
        window.localStorage.setItem("eshop_products_url", productsUrl.trim());
      else window.localStorage.removeItem("eshop_products_url");
      if (productUrl)
        window.localStorage.setItem("eshop_product_url", productUrl.trim());
      else window.localStorage.removeItem("eshop_product_url");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_) {
      // no-op
    }
  };

  const handleClear = () => {
    try {
      window.localStorage.removeItem("eshop_products_url");
      window.localStorage.removeItem("eshop_product_url");
      setProductsUrl("");
      setProductUrl("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_) {
      // no-op
    }
  };

  return (
    <section className="bg-gray-50 py-10 px-4 pt-28">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Settings</h2>
          <p className="text-gray-600">
            Configure product feed links used by the app. Values are stored
            locally in your browser and applied immediately for new fetches.
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="rounded-2xl bg-white p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Catalogue link (VITE_PRODUCTS_URL)
            </label>
            <input
              value={productsUrl}
              onChange={(e) => setProductsUrl(e.target.value)}
              placeholder={
                envHints.envProducts ||
                "https://your-domain.example.com/catalog.json"
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring focus:ring-gray-200"
            />
            <p className="text-xs text-gray-500">
              Accepts an array, an object with a "products" array, or an
              id-keyed object.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Per-product link (VITE_PRODUCT_URL, optional)
            </label>
            <input
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder={
                envHints.envProduct ||
                "https://your-domain.example.com/products/{id}.json"
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring focus:ring-gray-200"
            />
            <p className="text-xs text-gray-500">
              Must include {`{id}`} placeholder. If omitted, details are looked
              up from the catalogue.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-black">
                Save
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center rounded-md border border-gray-900 px-5 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-100">
                Clear
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-gray-900 transition hover:bg-amber-400">
              Reload app
            </button>
          </div>

          {saved && (
            <p className="rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700">
              Saved
            </p>
          )}
        </form>

        <footer className="flex items-center justify-between text-sm text-gray-500">
          <Link to="/" className="underline">
            Back to Home
          </Link>
          <span>These settings are stored in your browser only.</span>
        </footer>
      </div>
    </section>
  );
}

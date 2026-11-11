import assert from "node:assert/strict";
import test from "node:test";

import {
  filterMarketplaceProducts,
  formatMarketplacePrice,
  getMarketplaceProductBySlug,
} from "./marketplace.ts";

const products = [
  {
    slug: "lampu-botol-senja",
    name: "Lampu Botol Senja",
    category: "Dekorasi",
    material: "Botol plastik PET",
    shop: { name: "Ruang Daur", city: "Bandung" },
    price: 189000,
  },
  {
    slug: "pot-gantung-hijau",
    name: "Pot Gantung Hijau",
    category: "Rumah & Taman",
    material: "Botol plastik PET",
    shop: { name: "Kebun Kedua", city: "Bogor" },
    price: 79000,
  },
];

test("memfilter produk berdasarkan kata kunci lintas nama, material, dan toko", () => {
  assert.equal(filterMarketplaceProducts(products, "ruang daur", "Semua").length, 1);
  assert.equal(filterMarketplaceProducts(products, "PET", "Semua").length, 2);
});

test("memfilter produk berdasarkan kategori", () => {
  const result = filterMarketplaceProducts(products, "", "Rumah & Taman");
  assert.deepEqual(result.map((product) => product.slug), ["pot-gantung-hijau"]);
});

test("menemukan produk berdasarkan slug", () => {
  assert.equal(getMarketplaceProductBySlug(products, "lampu-botol-senja")?.name, "Lampu Botol Senja");
  assert.equal(getMarketplaceProductBySlug(products, "tidak-ada"), undefined);
});

test("memformat harga dalam rupiah tanpa angka desimal", () => {
  assert.equal(formatMarketplacePrice(189000), "Rp189.000");
});

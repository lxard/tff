const fs = require("fs");
const path = require("path");

// Lokasi file JSON untuk menyimpan produk
const filePath = path.join(__dirname, "../data/produk.json");

// Fungsi untuk memuat produk dari file
function loadProduk() {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Fungsi untuk menyimpan produk ke file
function simpanProduk(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Fungsi untuk menambahkan produk baru
function tambahProduk(produkBaru) {
  const data = loadProduk();
  data.push(produkBaru);
  simpanProduk(data);
}

// Fungsi untuk mengambil semua kategori unik
function getKategori() {
  const data = loadProduk();
  return [...new Set(data.map(p => p.kategori?.toLowerCase() || "lainnya"))];
}

// Fungsi untuk mengambil produk berdasarkan kategori
function getProdukByKategori(kategori) {
  const data = loadProduk();
  return data.filter(p => p.kategori?.toLowerCase() === kategori.toLowerCase());
}

// Export semua fungsi
module.exports = {
  loadProduk,
  simpanProduk,
  tambahProduk,
  getKategori,
  getProdukByKategori
};

let promoList = [];

/**
 * Tambah promo baru
 */
export function addPromo(code, discount) {
  const exists = promoList.some(p => p.code === code);
  if (exists) {
    return { success: false, message: "Kode promo sudah ada!" };
  }

  promoList.push({
    code,
    discount,
    used: false,
    createdAt: new Date().toISOString()
  });

  return { success: true, message: "Promo berhasil dibuat!" };
}

/**
 * Ambil semua promo
 */
export function getPromos() {
  return promoList;
}

/**
 * Validasi promo
 */
export function validatePromo(code) {
  const promo = promoList.find(p => p.code === code);

  if (!promo) {
    return { success: false, message: "Kode promo tidak ditemukan!" };
  }

  if (promo.used) {
    return { success: false, message: "Kode promo sudah digunakan!" };
  }

  // Tandai promonya digunakan
  promo.used = true;

  return {
    success: true,
    discount: promo.discount,
    message: "Promo valid!"
  };
}

/**
 * Database utility untuk manage promo codes
 * Dengan support: expiry date, usage limit, dan validation
 */

let promoList = [];

/**
 * Tambah promo baru dengan fitur lengkap
 * @param {string} code - Kode promo (e.g., PROMO-ABC123)
 * @param {string} discount - Diskon (e.g., "20%" atau "50000")
 * @param {number} maxUses - Berapa kali bisa dipakai (default: 1)
 * @param {number} expiresAt - Timestamp kapan promo expire (optional)
 */
export function addPromo(code, discount, maxUses = 1, expiresAt = null) {
  // Validasi: promo sudah ada?
  const exists = promoList.some(p => p.code === code);
  if (exists) {
    return { success: false, message: "Kode promo sudah ada!" };
  }

  // Validasi: discount format
  if (!discount || typeof discount !== "string") {
    return { success: false, message: "Format diskon tidak valid!" };
  }

  // Validasi: maxUses
  if (maxUses < 1) {
    return { success: false, message: "Max uses minimal 1!" };
  }

  // Validasi: expiresAt harus di masa depan jika ada
  if (expiresAt && expiresAt < Date.now()) {
    return { success: false, message: "Tanggal expire harus di masa depan!" };
  }

  promoList.push({
    code,
    discount,
    maxUses,
    timesUsed: 0,
    expiresAt,
    active: true,
    createdAt: new Date().toISOString()
  });

  return { 
    success: true, 
    message: "Promo berhasil dibuat!",
    promo: { code, discount, maxUses, expiresAt }
  };
}

/**
 * Ambil semua promo yang aktif
 */
export function getPromos() {
  return promoList.map(promo => ({
    code: promo.code,
    discount: promo.discount,
    maxUses: promo.maxUses,
    timesUsed: promo.timesUsed,
    expiresAt: promo.expiresAt,
    isExpired: promo.expiresAt ? Date.now() > promo.expiresAt : false,
    isExhausted: promo.timesUsed >= promo.maxUses,
    active: promo.active,
    createdAt: promo.createdAt
  }));
}

/**
 * Ambil promo detail by code
 */
export function getPromoByCode(code) {
  return promoList.find(p => p.code === code);
}

/**
 * Validasi promo sebelum digunakan
 */
export function validatePromo(code) {
  const promo = promoList.find(p => p.code === code);

  // Promo tidak ditemukan
  if (!promo) {
    return { success: false, message: "Kode promo tidak ditemukan!" };
  }

  // Promo tidak aktif
  if (!promo.active) {
    return { success: false, message: "Kode promo tidak aktif!" };
  }

  // Cek expiry date
  if (promo.expiresAt && Date.now() > promo.expiresAt) {
    promo.active = false;
    return { success: false, message: "Kode promo sudah expired!" };
  }

  // Cek usage limit
  if (promo.timesUsed >= promo.maxUses) {
    promo.active = false;
    return { success: false, message: "Kode promo sudah habis digunakan!" };
  }

  return {
    success: true,
    discount: promo.discount,
    timesUsed: promo.timesUsed,
    maxUses: promo.maxUses,
    message: "Promo valid!"
  };
}

/**
 * Gunakan promo code (increment usage)
 */
export function usePromo(code) {
  const validation = validatePromo(code);

  if (!validation.success) {
    return validation;
  }

  const promo = promoList.find(p => p.code === code);
  
  // Increment usage
  promo.timesUsed += 1;

  // Auto disable jika habis
  if (promo.timesUsed >= promo.maxUses) {
    promo.active = false;
  }

  return {
    success: true,
    discount: promo.discount,
    timesUsed: promo.timesUsed,
    maxUses: promo.maxUses,
    message: "Promo berhasil digunakan!"
  };
}

/**
 * Deactivate promo manual
 */
export function deactivatePromo(code) {
  const promo = promoList.find(p => p.code === code);
  
  if (!promo) {
    return { success: false, message: "Promo tidak ditemukan!" };
  }

  promo.active = false;
  return { success: true, message: "Promo berhasil dinonaktifkan!" };
}

/**
 * Edit promo
 */
export function editPromo(code, updates) {
  const promo = promoList.find(p => p.code === code);

  if (!promo) {
    return { success: false, message: "Promo tidak ditemukan!" };
  }

  // Update fields yang diizinkan
  if (updates.maxUses !== undefined && updates.maxUses < 1) {
    return { success: false, message: "Max uses minimal 1!" };
  }

  if (updates.expiresAt !== undefined && updates.expiresAt < Date.now()) {
    return { success: false, message: "Tanggal expire harus di masa depan!" };
  }

  if (updates.discount) promo.discount = updates.discount;
  if (updates.maxUses) promo.maxUses = updates.maxUses;
  if (updates.expiresAt) promo.expiresAt = updates.expiresAt;
  if (updates.active !== undefined) promo.active = updates.active;

  return { 
    success: true, 
    message: "Promo berhasil diupdate!",
    promo
  };
}

/**
 * Delete promo
 */
export function deletePromo(code) {
  const index = promoList.findIndex(p => p.code === code);

  if (index === -1) {
    return { success: false, message: "Promo tidak ditemukan!" };
  }

  promoList.splice(index, 1);
  return { success: true, message: "Promo berhasil dihapus!" };
}

/**
 * Clear all promos (untuk testing)
 */
export function clearAllPromos() {
  promoList = [];
  return { success: true, message: "Semua promo dihapus!" };
}

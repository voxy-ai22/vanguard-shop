let promoList = [];

/**
 * Tambah promo baru
 */
export function addPromo(code, discount, type = "percentage") {
  // Validasi input
  if (!code || !discount) {
    return { success: false, message: "Code and discount are required!" };
  }

  const exists = promoList.some(p => p.code === code);
  if (exists) {
    return { success: false, message: "Promo code already exists!" };
  }

  // Validasi tipe discount
  if (type === "percentage" && (discount < 1 || discount > 100)) {
    return { success: false, message: "Percentage discount must be between 1-100!" };
  }

  if (type === "fixed" && discount < 1) {
    return { success: false, message: "Fixed discount must be greater than 0!" };
  }

  const newPromo = {
    code,
    discount: type === "percentage" ? `${discount}%` : `Rp${discount}`,
    type: type,
    value: discount,
    status: "active",
    used: false,
    createdAt: new Date().toISOString(),
    usedAt: null
  };

  promoList.push(newPromo);
  return { success: true, message: "Promo created successfully!", promo: newPromo };
}

/**
 * Ambil semua promo
 */
export function getPromos() {
  return promoList.map(promo => ({
    code: promo.code,
    type: promo.type,
    value: promo.discount,
    status: promo.used ? "used" : "active",
    createdAt: promo.createdAt
  }));
}

/**
 * Validasi promo
 */
export function validatePromo(code) {
  if (!code) {
    return { success: false, message: "Promo code is required!" };
  }

  const promo = promoList.find(p => p.code === code.toUpperCase());

  if (!promo) {
    return { success: false, message: "Promo code not found!" };
  }

  if (promo.used) {
    return { success: false, message: "Promo code already used!" };
  }

  if (promo.status !== "active") {
    return { success: false, message: "Promo code is not active!" };
  }

  // Tandai sebagai digunakan
  promo.used = true;
  promo.usedAt = new Date().toISOString();
  promo.status = "used";

  return {
    success: true,
    discount: promo.discount,
    type: promo.type,
    value: promo.value,
    message: "Promo applied successfully!"
  };
}

/**
 * Hapus promo (opsional)
 */
export function deletePromo(code) {
  const index = promoList.findIndex(p => p.code === code);
  if (index === -1) {
    return { success: false, message: "Promo code not found!" };
  }
  
  promoList.splice(index, 1);
  return { success: true, message: "Promo deleted successfully!" };
}

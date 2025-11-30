let promoList = [];

/**
 * Tambah promo baru dengan expiry date
 */
export function addPromo(code, discount, type = "percentage", expiryDate) {
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

  // Validasi expiry date
  const now = new Date();
  const expiresAt = new Date(expiryDate);
  
  if (expiresAt <= now) {
    return { success: false, message: "Expiry date must be in the future!" };
  }

  const newPromo = {
    code,
    discount: type === "percentage" ? `${discount}%` : `Rp${discount}`,
    type: type,
    value: discount,
    status: "active",
    used: false,
    usedBy: null,
    usedAt: null,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };

  promoList.push(newPromo);
  return { 
    success: true, 
    message: "Promo created successfully!", 
    promo: newPromo 
  };
}

/**
 * Ambil semua promo dengan status expiry
 */
export function getPromos() {
  const now = new Date();
  
  return promoList.map(promo => {
    const isExpired = new Date(promo.expiresAt) < now;
    const status = promo.used ? "used" : isExpired ? "expired" : "active";
    
    return {
      code: promo.code,
      type: promo.type,
      value: promo.discount,
      status: status,
      createdAt: promo.createdAt,
      expiresAt: promo.expiresAt,
      usedBy: promo.usedBy,
      usedAt: promo.usedAt
    };
  });
}

/**
 * Validasi promo dengan cek expiry dan single use
 */
export function validatePromo(code, username = null) {
  if (!code) {
    return { success: false, message: "Promo code is required!" };
  }

  const promo = promoList.find(p => p.code === code.toUpperCase());
  const now = new Date();

  if (!promo) {
    return { success: false, message: "Promo code not found!" };
  }

  // Cek apakah sudah digunakan
  if (promo.used) {
    return { 
      success: false, 
      message: `Promo code already used by ${promo.usedBy || 'another user'}!` 
    };
  }

  // Cek apakah sudah expired
  if (new Date(promo.expiresAt) < now) {
    return { 
      success: false, 
      message: "Promo code has expired!" 
    };
  }

  if (promo.status !== "active") {
    return { success: false, message: "Promo code is not active!" };
  }

  // Tandai sebagai digunakan
  promo.used = true;
  promo.usedBy = username || "Unknown";
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
 * Hapus promo
 */
export function deletePromo(code) {
  const index = promoList.findIndex(p => p.code === code);
  if (index === -1) {
    return { success: false, message: "Promo code not found!" };
  }
  
  promoList.splice(index, 1);
  return { success: true, message: "Promo deleted successfully!" };
}

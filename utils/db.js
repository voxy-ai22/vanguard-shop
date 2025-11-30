import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "promo.json");

export function addPromo(code, type, value) {
  let promos = readPromos();

  const exists = promos.some(p => p.code === code);
  if (exists) return { success: false, message: "Promo already exists" };

  promos.push({
    code,
    type,
    value,
    used: false,
    createdAt: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(promos, null, 2));

  return { success: true };
}

export function getPromos() {
  return readPromos();
}

export function validatePromo(code) {
  let promos = readPromos();
  const promo = promos.find(p => p.code === code);

  if (!promo) return { success: false, message: "Promo not found" };
  if (promo.used) return { success: false, message: "Promo already used" };

  promo.used = true;
  fs.writeFileSync(filePath, JSON.stringify(promos, null, 2));

  return { success: true, discount: promo.value };
}

function readPromos() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

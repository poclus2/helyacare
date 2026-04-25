/**
 * HelyaCare — Phone Number Utility (Afrique de l'Ouest + Diaspora)
 * Adapté et étendu depuis MakoPay/cameroon-operator.util.ts
 *
 * Pays couverts (marchés HelyaCare) :
 *   🇸🇳 Sénégal (+221)       🇨🇲 Cameroun (+237)
 *   🇨🇮 Côte d'Ivoire (+225) 🇲🇱 Mali (+223)
 *   🇧🇫 Burkina Faso (+226)  🇬🇳 Guinée (+224)
 *   🇲🇦 Maroc (+212)         🇫🇷 France (+33)
 *   🇧🇪 Belgique (+32)
 */

// ─── Codes pays ───────────────────────────────────────────────────────────────

export const COUNTRY_CODES: Record<string, string> = {
  SN: "221", // Sénégal
  CM: "237", // Cameroun
  CI: "225", // Côte d'Ivoire
  ML: "223", // Mali
  BF: "226", // Burkina Faso
  GN: "224", // Guinée
  MA: "212", // Maroc
  FR: "33",  // France
  BE: "32",  // Belgique
};

/** Tous les indicatifs régionaux reconnus */
const ALL_DIAL_CODES = Object.values(COUNTRY_CODES);

// ─── Préfixes opérateurs par pays (pour NEXAH et détection) ─────────────────

/** Opérateurs Cameroun */
const CAMEROON_OPERATORS = {
  ORANGE: ["640", "655", "656", "657", "658", "659", "686", "687", "688", "689", "69"],
  MTN:    ["650", "651", "652", "653", "654", "67", "680", "681", "682", "683"],
};

/** Sender IDs NEXAH par opérateur camerounais */
const NEXAH_SENDER_IDS: Record<string, string> = {
  ORANGE: "Makopay",
  MTN:    "InfoSMS",
  UNKNOWN: "InfoSMS",
};

// ─── Normalisation universelle ────────────────────────────────────────────────

/**
 * Normalise n'importe quel numéro en format E.164 : +CCXXXXXXXXX
 * Accepte : +221771234567, 00221771234567, 0771234567, 771234567
 *
 * @param phone   Numéro brut
 * @param countryCode  Code pays ISO-2 par défaut (ex: "SN") si le numéro est local
 */
export function normalizePhone(phone: string, defaultCountry: keyof typeof COUNTRY_CODES = "SN"): string {
  // 1. Nettoyer : espaces, tirets, parenthèses
  let n = phone.replace(/[\s\-().]/g, "");

  // 2. Convertir 00XXX → +XXX
  if (n.startsWith("00")) {
    n = "+" + n.slice(2);
  }

  // 3. Déjà en format international ?
  if (n.startsWith("+")) {
    return n;
  }

  // 4. Numéro commençant par un code indicatif connu (sans +) ?
  for (const code of ALL_DIAL_CODES) {
    if (n.startsWith(code) && n.length > code.length + 4) {
      return "+" + n;
    }
  }

  // 5. Numéro local → ajouter l'indicatif par défaut
  const defaultCode = COUNTRY_CODES[defaultCountry];
  const stripped = n.startsWith("0") ? n.slice(1) : n;
  return `+${defaultCode}${stripped}`;
}

/**
 * Extrait le code pays d'un numéro E.164 (+221771234567 → "221")
 */
export function getDialCode(phone: string): string | null {
  const n = normalizePhone(phone);
  if (!n.startsWith("+")) return null;

  const digits = n.slice(1);
  // Tester les codes du plus long au plus court (éviter ambiguïtés)
  const sorted = ALL_DIAL_CODES.sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    if (digits.startsWith(code)) return code;
  }
  return null;
}

/**
 * Vérifie si un numéro est camerounais (pour router vers NEXAH)
 */
export function isCameroonNumber(phone: string): boolean {
  return getDialCode(normalizePhone(phone)) === COUNTRY_CODES.CM;
}

/**
 * Détecte l'opérateur camerounais (ORANGE | MTN | UNKNOWN)
 * Utilisé pour choisir le bon Sender ID NEXAH
 */
export function detectCameroonOperator(phone: string): string {
  const normalized = normalizePhone(phone);
  // Retirer +237
  const local = normalized.replace(/^\+237/, "");

  for (const prefix of CAMEROON_OPERATORS.ORANGE) {
    if (local.startsWith(prefix)) return "ORANGE";
  }
  for (const prefix of CAMEROON_OPERATORS.MTN) {
    if (local.startsWith(prefix)) return "MTN";
  }
  return "UNKNOWN";
}

/**
 * Retourne le Sender ID NEXAH approprié pour un numéro camerounais
 */
export function getNexahSenderId(phone: string): string {
  const operator = detectCameroonOperator(phone);
  return NEXAH_SENDER_IDS[operator];
}

/**
 * Vérifie si un numéro appartient à un pays UEMOA/CEMAC (Afrique subsaharienne)
 * Utile pour adapter le format d'affichage
 */
export function isAfricanNumber(phone: string): boolean {
  const code = getDialCode(normalizePhone(phone));
  const africanCodes = [
    COUNTRY_CODES.SN, COUNTRY_CODES.CM, COUNTRY_CODES.CI,
    COUNTRY_CODES.ML, COUNTRY_CODES.BF, COUNTRY_CODES.GN, COUNTRY_CODES.MA,
  ];
  return code !== null && africanCodes.includes(code);
}

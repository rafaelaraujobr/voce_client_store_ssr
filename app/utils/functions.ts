import { useI18n } from "vue-i18n";
export function numberToReal(
  value: string | number,
  currency: string = "BRL",
  locale: string = "pt-BR"
) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : parseFloat(value.toString());
  if (isNaN(num)) return "";
  return num.toLocaleString(locale, { style: "currency", currency });
}

export const formatDiscount = (discount: number): string => {
  if (discount >= 1) return Math.floor(discount).toString();
  else return discount.toFixed(1).replace(".", ",");
};

export function cleanQuery<T extends Record<string, any>>(
  query: T
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(query).filter(
      ([_, value]) =>
        value !== undefined &&
        value !== "" &&
        value !== "undefined" &&
        value !== null
    )
  );
}

export function formatBusinessDays(days: number): string {
  const { t } = useI18n();
  if (isNaN(days)) return "";
  if (days === 0) return "";
  return days > 1
    ? `${days} ${t("businessDays")}`
    : `${days} ${t("businessDay")}`;
}

export function formatValueShipping(value: number): string {
  if (isNaN(value)) return "";
  if (value === 0) return "Grátis";
  return numberToReal(value.toString(), "BRL", "pt-BR");
}

export function formatDescription(desc: string): string {
  if (!desc) return "";
  let clean = desc.replace(/<\/?[^>]+(>|$)/g, "");
  clean = clean.replace(
    /Compre na Gama Italy em até 10x sem juros e 10% OFF na Primeira Compra Cupom: "BEMVINDO"\.?/gi,
    ""
  );
  clean = clean.replace(/\s+/g, " ").trim();
  let formatted = clean.replace(/\. ?(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ0-9])/g, ".</p><p>");
  const maxLen = 300;
  if (!formatted.includes("</p><p>") && formatted.length > maxLen) {
    let result = "";
    let str = formatted;
    while (str.length > maxLen) {
      let idx = str.lastIndexOf(" ", maxLen);
      if (idx === -1) idx = maxLen;
      result += str.slice(0, idx) + "</p><p>";
      str = str.slice(idx + 1);
    }
    result += str;
    formatted = result;
  }
  if (!formatted.startsWith("<p>")) formatted = "<p>" + formatted;
  if (!formatted.endsWith("</p>")) formatted = formatted + "</p>";
  return formatted.trim();
}

export function checkPassword(type: string, password: string): boolean {
  switch (type) {
    case "minLength":
      return password.length >= 8;
    case "number":
      return /\d/.test(password);
    case "uppercase":
      return /[A-Z]/.test(password);
    case "special":
      return /[!@#$%^&*(),.?":{}|<>]/.test(password);
    default:
      return false;
  }
}

export function checkPasswordMatch(
  password: string,
  confirmPassword: string
): boolean {
  return (
    (password === confirmPassword &&
      password.length >= 8 &&
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)) ||
    false
  );
}

export const emailProviders = {
  "gmail.com": "https://mail.google.com",
  "yahoo.com": "https://mail.yahoo.com",
  "outlook.com": "https://outlook.live.com",
  "hotmail.com": "https://outlook.live.com",
  "icloud.com": "https://www.icloud.com/mail",
  "bol.com.br": "https://www.bol.com.br",
  "uol.com.br": "https://www.uol.com.br",
  "terra.com.br": "https://webmail.terra.com.br",
  "ig.com.br": "https://webmail.ig.com.br",
};

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
    : `${days} ${t("businessDay")}`
}

export function formatValueShipping(value: number): string {
  if (isNaN(value)) return "";
  if (value === 0) return "Grátis";
  return numberToReal(value.toString(), "BRL", "pt-BR") ; 
}

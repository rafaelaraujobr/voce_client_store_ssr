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

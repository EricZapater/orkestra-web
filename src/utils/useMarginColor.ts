import { Decimal } from "decimal.js";

type DecimalLike = string | number | Decimal;

export function useMarginColor(
  amount: DecimalLike,
  estimatedCost: DecimalLike
) {
  const toNumber = (val: DecimalLike): number =>
    val instanceof Decimal
      ? val.toNumber()
      : typeof val === "string"
      ? parseFloat(val)
      : val;

  const parsedAmount = toNumber(amount);
  const parsedCost = toNumber(estimatedCost);

  if (isNaN(parsedAmount) || isNaN(parsedCost) || parsedAmount === 0) {
    return {
      marginPercent: null,
      severity: "info",
      label: "N/D",
    };
  }

  const margin = ((parsedAmount - parsedCost) / parsedAmount) * 100;

  let severity: "success" | "warning" | "danger";
  if (margin < 10) {
    severity = "danger";
  } else if (margin < 30) {
    severity = "warning";
  } else {
    severity = "success";
  }

  return {
    marginPercent: margin,
    severity,
    label: `${margin.toFixed(2)} %`,
  };
}

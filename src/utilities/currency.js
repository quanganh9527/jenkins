export const nlFormat = (value) =>
  new Intl.NumberFormat("NL", {
    style: "currency",
    currency: "EUR",
  }).format(value);

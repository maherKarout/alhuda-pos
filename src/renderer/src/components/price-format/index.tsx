import i18next from "i18next";

function PriceFormat({ price }: { price: number }) {
  const formattedPrice = price.toLocaleString(i18next.language, {
    style: "currency",
    currency: "SYP",
    currencyDisplay: "name",
  });

  return <>{formattedPrice}</>;
}

export default PriceFormat;

import i18next from "i18next";

const useGetDirection = () => {
  return i18next.language === "ar" ? "rtl" : "ltr";
};

export default useGetDirection;

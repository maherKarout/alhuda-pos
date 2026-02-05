import moment from "moment";
// import { useTranslation } from "react-i18next";

function DateFormattedCell({
  date,
  format = "YYYY-MM-DD",
}: {
  date: string | null;
  format?: string;
}) {
  // const { t } = useTranslation("translation");
  const validateDate: boolean = date !== null && date !== "";

  return (
    <div dir="ltr">{validateDate ? moment(date).format(format) : `--`}</div>
  );
}

export default DateFormattedCell;

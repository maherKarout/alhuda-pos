import * as yup from "yup";
import "yup-phone-lite";

const idRequired: string = "required";

const passwordMin: string = "password_min";

const passwordConfirmationMatch: string = "password_confirm_match";

const email: string = "invalid_email";

const invalid: string = "invalid";

const isEndDateBeforeStart: string = "isEndDateBeforeStart";

const emptyArray = "not allowed to be empty";
const maxLengthExceeded = "max length exceeded";
const languageRegex = {
  ar: /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF\u0020\u2000-\u206F\p{P}]+$/u,
  en: /^[^\u0600-\u06FF]+$/u,
};

const emailSchema = () => yup.string().email(email).required(idRequired);

const textSchema = (
  { ln, isRequired, max, min }: { ln?: "ar" | "en"; isRequired?: boolean; max?: number; min?: number } = {
    ln: undefined,
    isRequired: false,
    max: undefined,
    min: undefined,
  }
) => {
  const yupSchema = yup
    .string()
    .concat(isRequired ? yup.string().required(idRequired) : yup.string())
    .max(max ?? 50, maxLengthExceeded)
    .min(min ?? 0, idRequired);

  return yupSchema;
};
const latenAlphabet = ({ isRequired }: { isRequired: boolean } = { isRequired: true }) => {
  return textSchema({ isRequired: isRequired, ln: "en" }).matches(/^[^\u0600-\u06FF\s@]+$/, "laten alphabet valid");
};
/**
 * @param countryCode - The country code to validate the phone number for.
 * @default ["SY"]
 * @example
 * phoneNumberSchema(["SY"])
 * phoneNumberSchema(["SY", "SA"])
 * phoneNumberSchema(["SY", "SA", "AE"])
 * phoneNumberSchema(["SY", "SA", "AE", "EG"])
 * phoneNumberSchema(["SY", "SA", "AE", "EG", "BH"])
 * phoneNumberSchema(["SY", "SA", "AE", "EG", "BH", "QA"])
 * @returns A yup schema for validating a phone number.
 */
const phoneNumberSchema = (countryCode: string[] = ["SY"], required: boolean = false) =>
  yup
    .string()
    .phone(countryCode as any[], "invalidPhoneNumber")
    .concat(required ? yup.string().required(idRequired) : yup.string());

export const password = () => {
  return textSchema({ isRequired: true, ln: "en" })
    .matches(
      // /^[a-zA-Z\d\s~`!@#\$%\^&\*\(\)_\-\+={}\[\]\|:;"'<>,.\?\/\\]+$/i,
      /^[^\u0600-\u06FF\s]+$/,
      invalid
    )
    .min(8, passwordMin);
};
const passwordConfirmationSchema = () =>
  textSchema({ isRequired: true, ln: "en" }).oneOf([yup.ref("password")], passwordConfirmationMatch);

const numberSchema = (number = 9) => yup.number().typeError(invalid).required(idRequired).min(number, invalid);

const priceSchema = () => yup.number().typeError(invalid).required(idRequired).min(1, invalid);

const endDateSchema = (key: string) => yup.date().required(idRequired).min(yup.ref(key), isEndDateBeforeStart);

const arraySchema = (limit: number) => yup.array().min(limit, emptyArray);

const usernameSchema = (min: number) =>
  yup
    .string()
    .required(idRequired)
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, invalid)
    .min(min, "too short");
const dateSchema = () => yup.date().required(idRequired);
const languages = ["ar", "en"];
const multiLanguage = (...args: string[]) => {
  const language: { [key: string]: any } = {};
  languages.forEach((ln) => {
    language[ln] = textSchema({
      ln: ln as "en" | "ar",
      isRequired: args.includes(ln),
    });
  });

  return yup.object({ ...language });
};
export default {
  limitedArray: arraySchema,
  multiLanguage,
  latenAlphabet,
  dateRequired: dateSchema,
  email: emailSchema,
  text: textSchema,
  password: password,
  passwordConfirmation: passwordConfirmationSchema,
  phoneNumber: phoneNumberSchema,
  typedNumber: numberSchema,
  price: priceSchema,
  endDate: endDateSchema,
  username: usernameSchema,
  ...yup,
};

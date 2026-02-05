import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import GenerateForm from "src/components/generate-form-component";
import { promiseWrapper } from "src/helpers/promise-wrapper";
import { privilegeFeature } from "src/shared/privileges";
import { DynamicFormTypeFields, FormikOnSubmitType, inputType } from "src/types";
import { Yup } from "src/validation";
import ApproximationExamples from "../components/examples";
import { useEditConfigMutation, useGetConfigQuery } from "../services/api";

function EditConfig() {
  const { t } = useTranslation("translation");
  const { id } = useParams();

  const [editConfig, { isLoading, isError }] = useEditConfigMutation();

  const { data: configData, isLoading: isLoadingData } = useGetConfigQuery();

  const fields: DynamicFormTypeFields = [
    { name: "approximationRatio", label: t("approximationRatio"), inputType: inputType.text, type: "number" },
    { name: "", label: t("approximationRatio"), inputType: inputType.custom, renderComponent: <></>, xs: 12 },
    {
      name: "approximationExamples",
      label: "",
      inputType: inputType.custom,
      md: 6,
      renderComponent: <ApproximationExamples />,
    },
    // { name: "", label: t(""), inputType: inputType.select },
  ];

  const initialValues = {
    approximationRatio: 0,
  };

  const validationSchema = Yup.object({
    approximationRatio: Yup.number(),

  });

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (values, helpers, submitType) => {
    return promiseWrapper({
      fn: editConfig,
      helpers: helpers,
      dataToSend: values,
      isNew: false,
      submitType,
    });
  };

  return (
    <GenerateForm
      title={t("Edit global config")}
      isMultiLanguage={false}
      fields={fields}
      initialValues={configData || initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      isError={false}
      loading={isLoading || isLoadingData}
    />
  );
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.role,
  type: "edit",
})(EditConfig);
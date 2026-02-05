import fs from "fs";
import path from "path";
import readline from "readline";

/**  
  this is custom cli to create feature for this project 
  you can choose what the name of this feateure and type in terminal 
  **npm run generate {feature name}
  it will create folder with feature name and inside it three folders pages ,components and services
*/
function capitalizeFirstLetter(string) {
  if (string.length === 0) {
    return string; // If the string is empty, return it as is
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}
function kebabToCamel(kebabString) {
  return kebabString.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Interactive CLI
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function askQuestion(rl, question, defaultValue = "") {
  return new Promise((resolve) => {
    const fullQuestion = defaultValue ? `${question} (default: ${defaultValue}): ` : `${question}: `;
    rl.question(fullQuestion, (answer) => {
      const trimmedAnswer = answer.trim();
      resolve(trimmedAnswer || defaultValue);
    });
  });
}

async function askYesNo(rl, question, defaultValue = "n") {
  const answer = await askQuestion(rl, `${question} (y/n)`, defaultValue);
  return answer.toLowerCase() === "y";
}

async function getFeatureDetails() {
  const rl = createInterface();

  try {
    console.log("\n🚀 Enhanced Feature Generator\n");

    const featureName = await askQuestion(rl, "Enter feature name (e.g., user-management)");

    if (!featureName) {
      console.error("❌ Feature name is required!");
      process.exit(1);
    }

    // Validate feature name
    if (!/^[a-z][a-z0-9-]*$/.test(featureName)) {
      console.error(
        "❌ Feature name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens!"
      );
      process.exit(1);
    }

    console.log("\n📋 Feature Configuration:");

    const hasDetailsPage = await askYesNo(rl, "Include details page", "y");
    const hasTests = false;
    const hasHooks = await askYesNo(rl, "Include custom hooks", "y");
    const hasUtils = await askYesNo(rl, "Include utility functions", "y");

    console.log("\n🔧 API Configuration:");
    const fields = await askQuestion(
      rl,
      "Enter form fields types (comma-separated, e.g., text,select,checkbox,fileEditor,date)",
      "text,select,checkbox,fileEditor,date"
    );
    const endpoint = await askQuestion(rl, "Enter API endpoint function name", `${featureName}EndPoint`);
    const privilegeKey = await askQuestion(
      rl,
      "Enter privilege feature name key",
      featureName.toUpperCase().replace(/-/g, "_")
    );

    console.log("\n🎨 UI Configuration:");
    const iconName = await askQuestion(rl, "Enter icon name for menu", featureName);
    const featureTitle = await askQuestion(
      rl,
      "Enter feature title for UI",
      capitalizeFirstLetter(featureName.replace(/-/g, " "))
    );

    rl.close();

    return {
      featureName,
      hasDetailsPage,
      hasTests,
      hasHooks,
      hasUtils,
      fields: fields
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
      endpoint,
      privilegeKey,
      iconName,
      featureTitle,
    };
  } catch (error) {
    rl.close();
    throw error;
  }
}

// Enhanced template generators
function generateFormFields(fields) {
  if (!fields.length) return "[]";

  return fields
    .map((field) => {
      const fieldName = field.toLowerCase();
      let inputType = "inputType.text";

      if (field.includes("email")) {
        inputType = "inputType.text";
      } else if (field.includes("phone")) {
        inputType = "inputType.text";
      } else if (field.includes("date") || field.includes("birth")) {
        inputType = "inputType.date";
      } else if (field.includes("number") || field.includes("count") || field.includes("age")) {
        inputType = "inputType.text";
      } else if (field.includes("textarea") || field.includes("description") || field.includes("notes")) {
        inputType = "inputType.text";
      } else if (field.includes("select") || field.includes("type") || field.includes("status")) {
        inputType = "inputType.select";
      } else if (field.includes("time")) {
        inputType = "inputType.time";
      } else if (field.includes("multiSelect")) {
        inputType = "inputType.multiSelect";
      } else if (field.includes("checkbox")) {
        inputType = "inputType.checkbox";
      } else if (field.includes("fileEditor")) {
        inputType = "inputType.fileEditor";
      }

      return `{ name: "", label: t(""), inputType: ${inputType} }`;
    })
    .join(",\n    ");
}

function generateInitialValues(fields) {
  return "{}";
}

function generateValidationSchema(fields) {
  if (!fields.length) return "Yup.object({})";

  const validations = fields
    .map((field) => {
      const fieldName = field.toLowerCase();
      let validation = `${fieldName}: Yup.text({isRequired:true})`;

      if (field.includes("email")) {
        validation = `${fieldName}: Yup.email()`;
      } else if (field.includes("phone")) {
        validation = `${fieldName}: Yup.phoneNumber(undefined,true)`;
      } else if (field.includes("number") || field.includes("count") || field.includes("age")) {
        validation = `${fieldName}: Yup.typedNumber(9)`;
      } else if (field.includes("date") || field.includes("birth")) {
        validation = `${fieldName}: Yup.dateRequired()`;
      } else if (field.includes("boolean") || field.includes("is")) {
        validation = `${fieldName}: Yup.boolean()`;
      }

      return validation;
    })
    .join(",\n    ");

  return `Yup.object({\n    ${validations}\n  })`;
}

function generateTypeDefinition(fields) {
  return "id: string;";
}

function generateTableHeaders(fields) {
  if (!fields.length) return "[]";

  return fields
    .map((field) => {
      const fieldName = field.toLowerCase();
      return `{ key: "${fieldName}", value: t("${fieldName}") }`;
    })
    .join(",\n    ");
}

function generateCreateDataFunction(fields) {
  if (!fields.length) {
    return `const createData = (data) => {
    return { ...data };
  };`;
  }

  return `const createData = (data) => {
    return {
      id: data.id,
    };
  };`;
}

// Enhanced template functions
function generateAllPage(featureName, fields, privilegeKey, featureTitle) {
  const tableHeaders = generateTableHeaders(fields);
  const createDataFunction = generateCreateDataFunction(fields);

  return `import { usePaginateData } from "src/hooks/use-paginate-data";
import { useTranslation } from "react-i18next";
import { privilegeFeature } from "src/shared/privileges";
import AuthorizedCheckWrapper, { ComponentPropsType } from "src/components/authorized-check-wrapper";
import { useGetAll${capitalizeFirstLetter(featureName)}Query, useDelete${capitalizeFirstLetter(
    featureName
  )}Mutation } from "../services/api";
import MainTable from "src/components/main-table";
import { navigateTo } from "src/components/navigation-component";

function All${capitalizeFirstLetter(featureName)}({ canEdit, canDelete }: ComponentPropsType) {
  const { t } = useTranslation("translation");
  
  const {
    changePage,
    data,
    isError,
    isFetching,
    limit,
    page,
    changeLimit,
    setSearchValue,
    totalRecords,
    handleDelete,
    refetch,
  } = usePaginateData(useGetAll${capitalizeFirstLetter(featureName)}Query);

  const [delete${capitalizeFirstLetter(featureName)}] = useDelete${capitalizeFirstLetter(featureName)}Mutation();

  const loading = isFetching;
  const headers = [
    ${tableHeaders}
  ];

  ${createDataFunction}

  const onDelete = (id: string) => {
    delete${capitalizeFirstLetter(featureName)}(id)
      .unwrap()
      .then(() => {
        handleDelete();
      });
  };

  const onSearch = (key: string) => setSearchValue(key);
  
  const onAdd = () => navigateTo(\`/${featureName}/add\`);
  const onEdit = (id: string) => navigateTo(\`/${featureName}/edit/\${id}\`);
  const onView = (id: string) => navigateTo(\`/${featureName}/\${id}\`);

  return (
    <MainTable
      feature={privilegeFeature.${privilegeKey}}
      onAdd={canEdit ? onAdd : undefined}
      refetch={refetch}
      handleSearch={onSearch}
      title={t("${featureTitle}")}
      isError={isError}
      header={headers}
      rows={data?.data.map((d) => createData(d)) ?? []}
      totalRecords={totalRecords ?? 0}
      limit={limit}
      page={page}
      onPageChange={changePage}
      onLimitChange={changeLimit}
      loading={loading}
      action={{
        delete: canDelete ? onDelete : undefined,
        update: canEdit ? onEdit : undefined,
        view: onView,
      }}
    />
  );
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.${privilegeKey},
  type: "view",
})(All${capitalizeFirstLetter(featureName)});`;
}

function generateFormPage(featureName, type, fields, privilegeKey, featureTitle) {
  const formFields = generateFormFields(fields);
  const initialValues = generateInitialValues(fields);
  const validationSchema = generateValidationSchema(fields);

  return `import { FormikOnSubmitType, inputType } from "src/types";
import GenerateForm from "src/components/generate-form-component";
import { Yup } from "src/validation";
import { useTranslation } from "react-i18next";
import { DynamicFormTypeFields } from "src/types";
import AuthorizedCheckWrapper from "src/components/authorized-check-wrapper";
import { privilegeFeature, privilegeKeys } from "src/shared/privileges";
import { ${
    type === "add"
      ? `useAdd${capitalizeFirstLetter(featureName)}Mutation`
      : `useEdit${capitalizeFirstLetter(featureName)}Mutation`
  } } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccessToasts } from "src/components/toasts";
import { useEffect } from "react";
import { useGet${capitalizeFirstLetter(featureName)}ByIdQuery } from "../services/api";
import { navigateTo } from "src/components/navigation-component";
import { promiseWrapper } from "src/helpers/promise-wrapper";
${fields.some((f) => f.includes("date")) ? 'import moment from "moment";' : ""}

function ${capitalizeFirstLetter(type)}${capitalizeFirstLetter(featureName)}() {
  const { t } = useTranslation("translation");
  ${type === "edit" ? "const { id } = useParams();" : ""}
  
  const [${type}${capitalizeFirstLetter(featureName)}, { isLoading, isError }] = ${
    type === "add"
      ? `useAdd${capitalizeFirstLetter(featureName)}Mutation()`
      : `useEdit${capitalizeFirstLetter(featureName)}Mutation()`
  };

  ${
    type === "edit"
      ? `const { data: ${featureName}Data, isLoading: isLoadingData } = useGet${capitalizeFirstLetter(
          featureName
        )}ByIdQuery(id ?? "", {
    skip: !id,
  });`
      : ""
  }

  const fields: DynamicFormTypeFields = [
    ${formFields}
  ];

  const initialValues = ${initialValues};

  const validationSchema = ${validationSchema};

  const onSubmit: FormikOnSubmitType<typeof initialValues> = async (values, helpers, submitType) => {
    ${
      type === "add"
        ? `return promiseWrapper({
      fn: ${type}${capitalizeFirstLetter(featureName)},
      helpers: helpers,
      dataToSend: values,
      isNew: true,
      submitType,
    });`
        : `return promiseWrapper({
      fn: ${type}${capitalizeFirstLetter(featureName)},
      helpers: helpers,
      dataToSend: { id, data: values },
      isNew: false,
      submitType,
    });`
    }
  };

  return (
    <GenerateForm
      title={t("${type === "add" ? "Add" : "Edit"} ${featureTitle}")}
      isMultiLanguage={false}
      fields={fields}
      initialValues={${type === "edit" ? `${featureName}Data || ` : ""}initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit }
      isError={isError}
      loading={isLoading${type === "edit" ? " || isLoadingData" : ""}}
    />
  );
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.${privilegeKey},
  type: "${type}",
})(${capitalizeFirstLetter(type)}${capitalizeFirstLetter(featureName)});`;
}

function generateDetailsPage(featureName, fields, privilegeKey, featureTitle) {
  const displayFields = fields
    .map((field) => {
      const fieldName = field.toLowerCase();
      return `        <div className="detail-item">
          <span className="label">{t("${fieldName}")}:</span>
          <span className="value">{${featureName}Data?.${fieldName}}</span>
        </div>`;
    })
    .join("\n");

  return `import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import AuthorizedCheckWrapper, { ComponentPropsType } from "src/components/authorized-check-wrapper";
import { privilegeFeature, privilegeKeys } from "src/shared/privileges";
import { useGet${capitalizeFirstLetter(featureName)}ByIdQuery } from "../services/api";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";

function ${capitalizeFirstLetter(featureName)}Details({ canEdit }: ComponentPropsType) {
  const { t } = useTranslation("translation");
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: ${featureName}Data,
    isLoading,
    isError,
  } = useGet${capitalizeFirstLetter(featureName)}ByIdQuery(id ?? "", {
    skip: !id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !${featureName}Data) {
    return <div>Error loading ${featureTitle} details</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(\`/${featureName}\`)} sx={{ mr: 2 }}>
          {t("Back")}
        </Button>
        {canEdit && (
          <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(\`/${featureName}/edit/\${id}\`)}>
            {t("Edit")}
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t("${featureTitle} Details")}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
${displayFields}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthorizedCheckWrapper({
  feature: privilegeFeature.${privilegeKey},
  type: "view",
})(${capitalizeFirstLetter(featureName)}Details);`;
}

function generateApiService(featureName, fields, endpoint, privilegeKey) {
  const typeDefinition = generateTypeDefinition(fields);
  const camelFeatureName = kebabToCamel(featureName);

  return `import { setSearchParams } from "src/helpers/set-search-params";
import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";
import { ArgsType } from "src/types";

export type ${camelFeatureName}Type = {
  ${typeDefinition}
};

type ResType = {
  totalRecords?: number;
  data: ${camelFeatureName}Type[];
};

type ${camelFeatureName}ById = ${camelFeatureName}Type;

const apiService = api.enhanceEndpoints({ 
  addTagTypes: ["${capitalizeFirstLetter(featureName)}"] 
}).injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAll${capitalizeFirstLetter(featureName)}: query<ResType, ArgsType>({
      providesTags: ["${capitalizeFirstLetter(featureName)}"],
      query: (props) => {
        const url = setSearchParams(endPoints.${endpoint}Endpoint(), props);
        return { url: url.pathname + url.search };
      },
    }),
    get${capitalizeFirstLetter(featureName)}ById: query<${camelFeatureName}ById, string>({
      providesTags: (result, error, id) => [{ type: "${capitalizeFirstLetter(featureName)}", id }],
      query: (id) => ({
        url: \`\${endPoints.${endpoint}Endpoint()}/\${id}\`,
      }),
    }),
    add${capitalizeFirstLetter(featureName)}: mutation<void, Partial<${camelFeatureName}Type>>({
      invalidatesTags: ["${capitalizeFirstLetter(featureName)}"],
      query: (data) => ({ 
        url: endPoints.${endpoint}Endpoint(), 
        method: "POST", 
        data 
      }),
    }),
    edit${capitalizeFirstLetter(featureName)}: mutation<void, { id: string; data: Partial<${camelFeatureName}Type> }>({
      invalidatesTags: (result, error, { id }) => [
        { type: "${capitalizeFirstLetter(featureName)}", id },
        "${capitalizeFirstLetter(featureName)}"
      ],
      query: ({ data, id }) => ({
        url: \`\${endPoints.${endpoint}Endpoint()}/\${id}\`,
        method: "PATCH",
        data,
      }),
    }),
    delete${capitalizeFirstLetter(featureName)}: mutation<void, string>({
      invalidatesTags: ["${capitalizeFirstLetter(featureName)}"],
      query: (id) => ({ 
        url: \`\${endPoints.${endpoint}Endpoint()}/\${id}\`, 
        method: "DELETE" 
      }),
    }),
  }),
});

export const { 
  useAdd${capitalizeFirstLetter(featureName)}Mutation,
  useDelete${capitalizeFirstLetter(featureName)}Mutation,
  useGetAll${capitalizeFirstLetter(featureName)}Query,
  useGet${capitalizeFirstLetter(featureName)}ByIdQuery,
  useEdit${capitalizeFirstLetter(featureName)}Mutation,
} = apiService;`;
}

function generateRoutes(featureName, hasDetailsPage) {
  const detailsImport = hasDetailsPage
    ? `const ${capitalizeFirstLetter(
        featureName
      )}Details = SuspenseWrapper(lazy(() => import("src/app/${featureName}/pages/${featureName}-details")));`
    : "";

  const detailsRoute = hasDetailsPage
    ? `{
    path: "/${featureName}/:id",
    element: <${capitalizeFirstLetter(featureName)}Details />,
  },`
    : "";

  return `import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import SuspenseWrapper from "src/components/suspenseWrapper";

const Edit${capitalizeFirstLetter(
    featureName
  )} = SuspenseWrapper(lazy(() => import("src/app/${featureName}/pages/edit-${featureName}")));
const All${capitalizeFirstLetter(
    featureName
  )} = SuspenseWrapper(lazy(() => import("src/app/${featureName}/pages/all-${featureName}")));
const Add${capitalizeFirstLetter(
    featureName
  )} = SuspenseWrapper(lazy(() => import("src/app/${featureName}/pages/add-${featureName}")));
${detailsImport}

const routes: RouteObject[] = [
  {
    path: "/${featureName}",
    element: <All${capitalizeFirstLetter(featureName)} />,
  },
  {
    path: "/${featureName}/add",
    element: <Add${capitalizeFirstLetter(featureName)} />,
  },
  {
    path: "/${featureName}/edit/:id",
    element: <Edit${capitalizeFirstLetter(featureName)} />,
  },
  ${detailsRoute}
];

export default routes;`;
}

function generateMenuItem(featureName, privilegeKey, iconName, featureTitle) {
  return `import { privilegeKeys } from "src/shared/privileges";
import { menuItemType } from "src/types";

export default [
  {
    id: "${featureName}",
    title: "${featureTitle}",
    privileges: [privilegeKeys.view${capitalizeFirstLetter(featureName)}, privilegeKeys.add${capitalizeFirstLetter(
    featureName
  )}, privilegeKeys.edit${capitalizeFirstLetter(featureName)}, privilegeKeys.delete${capitalizeFirstLetter(
    featureName
  )}],
    caption: "${featureTitle} management",
    type: "item",
    url: "/${featureName}",
    icon: "${iconName}",
  },
] as menuItemType[];`;
}

function generateIndexFile(featureName, hasDetailsPage) {
  const detailsExport = hasDetailsPage
    ? `export { default as ${capitalizeFirstLetter(featureName)}Details } from "./pages/${featureName}-details";`
    : "";

  return `// ${capitalizeFirstLetter(featureName)} Feature
export { default as All${capitalizeFirstLetter(featureName)} } from "./pages/all-${featureName}";
export { default as Add${capitalizeFirstLetter(featureName)} } from "./pages/add-${featureName}";
export { default as Edit${capitalizeFirstLetter(featureName)} } from "./pages/edit-${featureName}";
${detailsExport}
export { default as ${capitalizeFirstLetter(featureName)}Routes } from "./services/routes";
export { default as ${capitalizeFirstLetter(featureName)}MenuItem } from "./services/menu-item";
export * from "./services/api";`;
}

function generateTestFile(featureName, type) {
  return `import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'src/redux-config/store';
import ${capitalizeFirstLetter(type)}${capitalizeFirstLetter(featureName)} from './${type}-${featureName}';

const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('${capitalizeFirstLetter(featureName)} ${capitalizeFirstLetter(type)} Page', () => {
  it('renders without crashing', () => {
    renderWithProviders(<${capitalizeFirstLetter(type)}${capitalizeFirstLetter(featureName)} />);
    expect(screen.getByText('${capitalizeFirstLetter(type)} ${capitalizeFirstLetter(
    featureName
  )}')).toBeInTheDocument();
  });
});`;
}

function generateHookFile(featureName) {
  return `import { useState, useEffect } from 'react';
import { useGetAll${capitalizeFirstLetter(featureName)}Query } from '../services/api';

export const use${capitalizeFirstLetter(featureName)}Data = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error, refetch } = useGetAll${capitalizeFirstLetter(featureName)}Query({
    search: searchTerm,
  });

  const filteredData = data?.data?.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return {
    data: filteredData,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch,
  };
};`;
}

function generateUtilsFile(featureName) {
  return `export const format${capitalizeFirstLetter(featureName)}Data = (data) => {
  return {
    ...data,
    createdAt: new Date(data.createdAt).toLocaleDateString(),
    updatedAt: new Date(data.updatedAt).toLocaleDateString(),
  };
};

export const validate${capitalizeFirstLetter(featureName)}Data = (data) => {
  const errors = {};
  
  if (!data.name) {
    errors.name = 'Name is required';
  }
  
  return errors;
};`;
}

// Main generation function
async function generateFeature() {
  try {
    const config = await getFeatureDetails();

    const featureDir = path.join("src", "app", config.featureName);
    const pages = path.join(featureDir, "pages");
    const services = path.join(featureDir, "services");
    const api = path.join(services, "api");
    const routes = path.join(services, "routes");
    const menuItem = path.join(services, "menu-item");
    const components = path.join(featureDir, "components");
    const hooks = path.join(featureDir, "hooks");
    const utils = path.join(featureDir, "utils");
    const tests = path.join(featureDir, "__tests__");

    // Create directories
    const dirs = [featureDir, pages, services, api, routes, menuItem, components];

    if (config.hasHooks) dirs.push(hooks);
    if (config.hasUtils) dirs.push(utils);
    if (config.hasTests) dirs.push(tests);

    dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

    // Generate files
    const files = [
      {
        path: path.join(api, "index.ts"),
        content: generateApiService(config.featureName, config.fields, config.endpoint, config.privilegeKey),
      },
      {
        path: path.join(pages, `all-${config.featureName}.tsx`),
        content: generateAllPage(config.featureName, config.fields, config.privilegeKey, config.featureTitle),
      },
      {
        path: path.join(pages, `add-${config.featureName}.tsx`),
        content: generateFormPage(config.featureName, "add", config.fields, config.privilegeKey, config.featureTitle),
      },
      {
        path: path.join(pages, `edit-${config.featureName}.tsx`),
        content: generateFormPage(config.featureName, "edit", config.fields, config.privilegeKey, config.featureTitle),
      },
      { path: path.join(routes, "index.tsx"), content: generateRoutes(config.featureName, config.hasDetailsPage) },
      {
        path: path.join(menuItem, "index.ts"),
        content: generateMenuItem(config.featureName, config.privilegeKey, config.iconName, config.featureTitle),
      },
      {
        path: path.join(featureDir, "index.ts"),
        content: generateIndexFile(config.featureName, config.hasDetailsPage),
      },
    ];

    if (config.hasDetailsPage) {
      files.push({
        path: path.join(pages, `${config.featureName}-details.tsx`),
        content: generateDetailsPage(config.featureName, config.fields, config.privilegeKey, config.featureTitle),
      });
    }

    if (config.hasTests) {
      files.push(
        {
          path: path.join(tests, `add-${config.featureName}.test.tsx`),
          content: generateTestFile(config.featureName, "add"),
        },
        {
          path: path.join(tests, `edit-${config.featureName}.test.tsx`),
          content: generateTestFile(config.featureName, "edit"),
        }
      );
    }

    if (config.hasHooks) {
      files.push({
        path: path.join(hooks, `use-${config.featureName}-data.ts`),
        content: generateHookFile(config.featureName),
      });
    }

    if (config.hasUtils) {
      files.push({
        path: path.join(utils, `${config.featureName}-utils.ts`),
        content: generateUtilsFile(config.featureName),
      });
    }

    // Write files
    files.forEach(({ path: filePath, content }) => {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${filePath}`);
    });

    console.log(`\n🎉 Feature "${config.featureName}" generated successfully!`);
    console.log(`\n📁 Generated structure:`);
    console.log(`   src/app/${config.featureName}/`);
    console.log(`   ├── pages/`);
    console.log(`   ├── services/`);
    console.log(`   ├── components/`);
    if (config.hasHooks) console.log(`   ├── hooks/`);
    if (config.hasUtils) console.log(`   ├── utils/`);
    if (config.hasTests) console.log(`   └── __tests__/`);

    console.log(`\n📝 Next steps:`);
    console.log(`   1. Add routes to your main router`);
    console.log(`   2. Add menu items to your navigation`);
    console.log(`   3. Update privilege keys in src/shared/privileges`);
    console.log(`   4. Add API endpoints to src/shared/end-points`);
    console.log(`   5. Customize form fields and validation`);
    console.log(`   6. Add translations to public/locales/`);
  } catch (error) {
    console.error("❌ Error generating feature:", error.message);
    process.exit(1);
  }
}

// Run the generator
generateFeature();

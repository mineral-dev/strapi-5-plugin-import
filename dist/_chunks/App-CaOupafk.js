"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const reactRouterDom = require("react-router-dom");
const designSystem = require("@strapi/design-system");
const reactIntl = require("react-intl");
const icons = require("@strapi/icons");
const react = require("react");
const HomePage = () => {
  const { formatMessage } = reactIntl.useIntl();
  const [file, setFile] = react.useState(null);
  const [uploading, setUploading] = react.useState(false);
  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    console.log({ formData });
    try {
      const res = await fetch("/api/strapi-5-plugin-import/import-orders", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      alert(result.message || "Import selesai");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Gagal mengimport file.");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { paddingLeft: 6, paddingRight: 6, paddingTop: 6, paddingBottom: 6, style: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", justifyContent: "center", alignItems: "center", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "alpha", children: "Import Orders" }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", paddingTop: 4, justifyContent: "center", alignItems: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { paddingBottom: 4, justifyContent: "center", alignItems: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { style: { width: "50%" }, htmlFor: "import-file", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", children: "Upload file (.csv)" }) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            style: { width: "50%" },
            id: "import-file",
            type: "file",
            accept: ".csv",
            onChange: (e) => setFile(e.target.files[0])
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.Button,
        {
          startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Upload, {}),
          disabled: !file || uploading,
          loading: uploading,
          onClick: handleImport,
          size: "L",
          children: "Import File"
        }
      )
    ] })
  ] }) });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Routes, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "*", element: /* @__PURE__ */ jsxRuntime.jsx(admin.Page.Error, {}) })
  ] });
};
exports.App = App;
//# sourceMappingURL=App-CaOupafk.js.map

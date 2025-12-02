import { jsxs, jsx } from "react/jsx-runtime";
import { Page } from "@strapi/strapi/admin";
import { Routes, Route } from "react-router-dom";
import { Main, Flex, Typography, Button } from "@strapi/design-system";
import { useIntl } from "react-intl";
import { Upload } from "@strapi/icons";
import { useState } from "react";
const HomePage = () => {
  const { formatMessage } = useIntl();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUser, setFileUser] = useState(null);
  const [uploadingUser, setUploadingUser] = useState(false);
  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
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
  const handleImportUser = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/strapi-5-plugin-import/import-users", {
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
  return /* @__PURE__ */ jsxs(Main, { paddingLeft: 6, paddingRight: 6, paddingTop: 6, paddingBottom: 6, style: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxs(Flex, { direction: "column", justifyContent: "center", alignItems: "center", marginRight: "100px", children: [
      /* @__PURE__ */ jsx(Typography, { variant: "alpha", children: "Import Orders" }),
      /* @__PURE__ */ jsxs(Flex, { direction: "column", paddingTop: 4, justifyContent: "center", alignItems: "center", children: [
        /* @__PURE__ */ jsxs(Flex, { paddingBottom: 4, justifyContent: "center", alignItems: "center", children: [
          /* @__PURE__ */ jsx("label", { style: { width: "50%" }, htmlFor: "import-file", children: /* @__PURE__ */ jsx(Typography, { variant: "pi", fontWeight: "bold", children: "Upload file (.csv)" }) }),
          /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(
          Button,
          {
            startIcon: /* @__PURE__ */ jsx(Upload, {}),
            disabled: !file || uploading,
            loading: uploading,
            onClick: handleImport,
            size: "L",
            children: "Import File"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Flex, { direction: "column", justifyContent: "center", alignItems: "center", children: [
      /* @__PURE__ */ jsx(Typography, { variant: "alpha", children: "Import User" }),
      /* @__PURE__ */ jsxs(Flex, { direction: "column", paddingTop: 4, justifyContent: "center", alignItems: "center", children: [
        /* @__PURE__ */ jsxs(Flex, { paddingBottom: 4, justifyContent: "center", alignItems: "center", children: [
          /* @__PURE__ */ jsx("label", { style: { width: "50%" }, htmlFor: "import-file", children: /* @__PURE__ */ jsx(Typography, { variant: "pi", fontWeight: "bold", children: "Upload file (.csv)" }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              style: { width: "50%" },
              id: "import-file",
              type: "file",
              accept: ".csv",
              onChange: (e) => setFileUser(e.target.files[0])
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            startIcon: /* @__PURE__ */ jsx(Upload, {}),
            disabled: !fileUser || uploadingUser,
            loading: uploadingUser,
            onClick: handleImportUser,
            size: "L",
            children: "Import File"
          }
        )
      ] })
    ] })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(HomePage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page.Error, {}) })
  ] });
};
export {
  App
};
//# sourceMappingURL=App-CA8adkoe.mjs.map

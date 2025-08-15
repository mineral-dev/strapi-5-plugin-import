"use strict";
const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { generateFromEmail, generateUsername } = require("unique-username-generator");
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-5-plugin-import").service("service").getWelcomeMessage();
  },
  async importOrders(ctx) {
    const { files } = ctx.request;
    if (!files || !files.file) {
      return ctx.badRequest("No file uploaded");
    }
    const uploadedFile = files.file;
    const filePath = uploadedFile.filepath;
    const fileName = uploadedFile.originalFilename;
    path.extname(fileName).toLowerCase();
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const dateFieldsDateOnly = ["fulfilment_at"];
      const dateFieldsDateTime = ["settlement_at", "paid_at", "created_at", "updated_at"];
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataCsv = XLSX.utils.sheet_to_json(sheet, { raw: true });
      let result = [];
      let skus = [];
      const data = dataCsv.map((row) => {
        if (row.uuid) {
          row.uuid = cleanUuid(row.uuid);
        }
        dateFieldsDateOnly.forEach((field) => {
          if (row[field]) {
            const d = parseExcelOrString(row[field]);
            if (d.isValid()) {
              row[field] = d.format("YYYY-MM-DD");
            }
          }
        });
        dateFieldsDateTime.forEach((field) => {
          if (row[field]) {
            const d = parseExcelOrString(row[field]);
            if (d.isValid()) {
              row[field] = d.toISOString();
            }
          }
        });
        return row;
      });
      const entries = await strapi.documents("api::product.product").findMany({
        // where: {
        //   publishedAt: { $notNull: true },
        // },
        populate: { variants: true }
      });
      for (const product of entries) {
        for (const variant of product.variants || []) {
          skus.push({
            ...variant,
            title: product.title,
            slug: product.slug
          });
        }
      }
      if (data && data?.length > 0) {
        for (const order of data) {
          const { order_items, ...props } = order;
          let user_id = null;
          if (order.email) {
            const user = await strapi.db.query("plugin::users-permissions.user").findOne({
              where: { email: order.email }
            });
            if (user) {
              user_id = user.id;
            }
          }
          let data_order = {
            ...props,
            documentId: props.uuid,
            mobile: props.mobile ? props.mobile.toString() : null,
            airwaybill_no: props.airwaybill_no ? props.airwaybill_no.toString() : null,
            va_number: props.va_number ? formatVaNumber(props.va_number) : null,
            order_id: props.order_no,
            user_id: user_id ? user_id : null
          };
          const orderItems = JSON.parse(order_items);
          if (orderItems && orderItems?.length > 0) {
            let variants = [];
            for (const variant of orderItems) {
              const findVariantId = skus.find((item) => item.sku === variant.sku);
              const weightKg = Number(findVariantId?.weight_kg || 0);
              const qty = Number(variant?.qty || 0);
              variants.push({
                product_variant_id: findVariantId ? String(findVariantId.id) : null,
                sku: variant.sku,
                options: findVariantId ? findVariantId.options : null,
                name: findVariantId ? findVariantId.title : null,
                slug: findVariantId ? findVariantId.slug : null,
                regular_price: variant.price_regular,
                sale_price: variant.price_sale,
                qty,
                weight_kg: weightKg * qty,
                subtotal: variant.subtotal
              });
            }
            data_order.order_item = variants;
          }
          try {
            const response = await strapi.documents("api::order.order").create({
              data: data_order,
              populate: {
                order_item: true
              }
            });
            result.push(response);
          } catch (error) {
            console.dir(error, { depth: null });
          }
        }
      }
      return ctx.send({ message: `${result.length} rows imported.` });
    } catch (err) {
      console.error("Import error:", err);
      return ctx.internalServerError("Failed to import.");
    } finally {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
  },
  async importUsers(ctx) {
    const { files } = ctx.request;
    if (!files || !files.file) {
      return ctx.badRequest("No file uploaded");
    }
    const uploadedFile = files.file;
    const filePath = uploadedFile.filepath;
    const fileName = uploadedFile.originalFilename;
    path.extname(fileName).toLowerCase();
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const dateFieldsDateOnly = ["dob"];
      const dateFieldsDateTime = ["created_at", "updated_at"];
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const dataCsv = XLSX.utils.sheet_to_json(sheet, { raw: true });
      let result = [];
      let data_user = [];
      const data = dataCsv.map((row) => {
        if (row.uuid) {
          row.uuid = cleanUuid(row.uuid);
        }
        dateFieldsDateOnly.forEach((field) => {
          if (row[field]) {
            const d = parseExcelOrString(row[field]);
            row[field] = d.isValid() ? d.format("YYYY-MM-DD") : null;
          } else {
            row[field] = null;
          }
        });
        dateFieldsDateTime.forEach((field) => {
          if (row[field]) {
            const d = parseExcelOrString(row[field]);
            row[field] = d.isValid() ? d.toISOString() : null;
          } else {
            row[field] = null;
          }
        });
        return row;
      });
      for (const user of data) {
        let payload = {
          username: generateFromEmail(user.email),
          email: user.email,
          password: user.password,
          confirmed: true,
          blocked: false,
          fullname: user?.name || generateUsername(),
          address: "",
          country: user.country || "",
          province: user.province || "",
          city: user.city || "",
          district: user.district || "",
          postal_code: user.postal_code || "",
          mobile: user?.mobile || "",
          gender: "male",
          member_level: user.member_level || 0,
          meta_data: user.meta || null,
          created_at: user.created_at,
          published_at: user.created_at,
          updated_at: user.updated_at,
          subscribe_newsletters: false
        };
        if (user.dob && /^\d{4}-\d{2}-\d{2}$/.test(user.dob)) {
          payload.dob = user.dob;
        }
        try {
          const response = await strapi.db.query("plugin::users-permissions.user").create({
            data: payload,
            populate: true
          });
          result.push(response);
        } catch (error) {
          console.dir(error, { depth: null });
        }
      }
      return ctx.send({ message: `${result.length} rows imported.` });
    } catch (err) {
      console.error("Import error:", err);
      return ctx.internalServerError("Failed to import.");
    } finally {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
  }
});
function excelSerialToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1e3);
  const fractional_day = serial - Math.floor(serial) + 1e-7;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}
function parseExcelOrString(value) {
  if (typeof value === "number") {
    return dayjs(excelSerialToJSDate(value));
  }
  return dayjs(value);
}
function cleanUuid(value) {
  if (typeof value === "string" && /^X'[0-9A-Fa-f]+'$/.test(value)) {
    return value.replace(/^X'|'/g, "");
  }
  return value;
}
function formatVaNumber(value) {
  if (!value) return null;
  let str = String(value).trim();
  if (/e\+/.test(str.toLowerCase())) {
    let [mantissa, exponent] = str.toLowerCase().split("e+");
    exponent = parseInt(exponent, 10);
    let parts = mantissa.split(".");
    let intPart = parts[0];
    let decPart = parts[1] || "";
    let num = intPart + decPart.padEnd(exponent, "0");
    return num;
  }
  if (str.includes("|")) {
    return str;
  }
  return str;
}
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  },
  {
    method: "POST",
    path: "/import-orders",
    // name of the controller file & the method.
    handler: "controller.importOrders",
    config: {
      policies: [],
      auth: false
    }
  },
  {
    method: "POST",
    path: "/import-users",
    // name of the controller file & the method.
    handler: "controller.importUsers",
    config: {
      policies: [],
      auth: false
    }
  }
];
const routes = {
  "content-api": {
    type: "content-api",
    routes: contentAPIRoutes
  }
};
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  }
});
const services = {
  service
};
const index = {
  bootstrap,
  destroy,
  register,
  config,
  controllers,
  contentTypes,
  middlewares,
  policies,
  routes,
  services
};
module.exports = index;
//# sourceMappingURL=index.js.map

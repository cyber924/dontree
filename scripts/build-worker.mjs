import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const [worker, home, corporate, cardLimit, login, admin, adminJs, contact, contactJs, inquiriesAdmin, inquiriesAdminJs] = await Promise.all([
  readFile(resolve(root, "worker/index.js"), "utf8"),
  readFile(resolve(root, "pages/home.html"), "utf8"),
  readFile(resolve(root, "pages/corporate.html"), "utf8"),
  readFile(resolve(root, "pages/card-limit.html"), "utf8"),
  readFile(resolve(root, "pages/login.html"), "utf8"),
  readFile(resolve(root, "pages/admin.html"), "utf8"),
  readFile(resolve(root, "pages/admin.js"), "utf8"),
  readFile(resolve(root, "pages/contact.html"), "utf8"),
  readFile(resolve(root, "pages/contact.js"), "utf8"),
  readFile(resolve(root, "pages/inquiries-admin.html"), "utf8"),
  readFile(resolve(root, "pages/inquiries-admin.js"), "utf8"),
]);
const output = worker
  .replace("__HOME_JSON__", JSON.stringify(home))
  .replace("__CORPORATE_JSON__", JSON.stringify(corporate))
  .replace("__CARD_LIMIT_JSON__", JSON.stringify(cardLimit))
  .replace("__LOGIN_JSON__", JSON.stringify(login))
  .replace("__ADMIN_JSON__", JSON.stringify(admin))
  .replace("__ADMIN_JS_JSON__", JSON.stringify(adminJs))
  .replace("__CONTACT_JSON__", JSON.stringify(contact))
  .replace("__CONTACT_JS_JSON__", JSON.stringify(contactJs))
  .replace("__INQUIRIES_ADMIN_JSON__", JSON.stringify(inquiriesAdmin))
  .replace("__INQUIRIES_ADMIN_JS_JSON__", JSON.stringify(inquiriesAdminJs));
await writeFile(resolve(root, "dist/server/index.js"), output);

const { contextBridge } = require("electron");
const fs = require("fs").promises;
const path = require("path");

let Store;
let store;

async function initStore() {
  Store = await import("electron-store");
  store = new Store.default();
}

async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function initApp() {
  await initStore();

  const filesDir = path.join(process.cwd(), "files");
  try {
    await ensureDirectory(filesDir);
    await fs.access(filesDir);
  } catch (error) {
    console.error("Files directory could not be created:", error);
  }

  contextBridge.exposeInMainWorld("electronStore", {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
  });

  contextBridge.exposeInMainWorld("fileSystem", {
    saveFile: async (fileName, content) => {
      const filePath = path.join(process.cwd(), "files", `${fileName}.txt`);
      await fs.writeFile(filePath, content, "utf8");
    },
    readFile: async (fileName) => {
      const filePath = path.join(process.cwd(), "files", `${fileName}.txt`);
      try {
        return await fs.readFile(filePath, "utf8");
      } catch {
        return "";
      }
    },
    listFiles: async () => {
      const filesDir = path.join(process.cwd(), "files");
      try {
        const files = await fs.readdir(filesDir);
        return files
          .filter((f) => f.endsWith(".txt"))
          .map((f) => f.slice(0, -4));
      } catch (error) {
        console.error("Error listing files:", error);
        return [];
      }
    },
  });
}

initApp().catch(console.error);

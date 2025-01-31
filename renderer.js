let currentFile = null;
const fileList = document.getElementById("file-list");
const textArea = document.getElementById("text-area");
const newFileInput = document.getElementById("new-file-input");
const addFileBtn = document.getElementById("add-file-btn");
const formatBtn = document.getElementById("format-btn");
const copyBtn = document.getElementById("copy-btn");
const copyMinifiedBtn = document.getElementById("copy-minified-btn");

// DOM yüklendiğinde ve fileSystem API'si hazır olduğunda başlat
function init() {
  if (window.fileSystem) {
    loadFiles().catch(console.error);
  } else {
    // fileSystem API'si henüz hazır değilse, biraz bekle ve tekrar dene
    setTimeout(init, 100);
  }
}

// Kayıtlı dosyaları yükle
async function loadFiles() {
  const files = await window.fileSystem.listFiles();
  fileList.innerHTML = "";
  for (const fileName of files) {
    addFileToList(fileName);
  }
}

// Listeye dosya ekle
function addFileToList(fileName) {
  const div = document.createElement("div");
  div.className = "file-item";
  div.textContent = fileName;
  div.onclick = () => loadFileContent(fileName).catch(console.error);
  fileList.appendChild(div);
}

// Dosya içeriğini yükle
async function loadFileContent(fileName) {
  const content = await window.fileSystem.readFile(fileName);
  currentFile = fileName;
  textArea.value = content;

  // Aktif dosyayı vurgula
  document.querySelectorAll(".file-item").forEach((item) => {
    item.classList.remove("active");
    if (item.textContent === fileName) {
      item.classList.add("active");
    }
  });
}

// Yeni dosya ekle
addFileBtn.onclick = async () => {
  const fileName = newFileInput.value.trim();
  if (fileName) {
    await window.fileSystem.saveFile(fileName, "");
    addFileToList(fileName);
    newFileInput.value = "";
    await loadFileContent(fileName);
  }
};

// Text değişikliklerini kaydet
let saveTimeout;
textArea.oninput = () => {
  if (currentFile) {
    // Debounce the save operation
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await window.fileSystem.saveFile(currentFile, textArea.value);
    }, 500);
  }
};

// JSON formatla
formatBtn.onclick = async () => {
  try {
    const content = textArea.value;
    const parsed = JSON.parse(content);
    textArea.value = JSON.stringify(parsed, null, 2);

    // Formatlanmış içeriği kaydet
    if (currentFile) {
      await window.fileSystem.saveFile(currentFile, textArea.value);
    }
  } catch (e) {
    alert("Geçersiz JSON formatı!");
  }
};

// Panoya kopyalama fonksiyonu
copyBtn.onclick = () => {
  try {
    const content = textArea.value;
    JSON.parse(content);
    navigator.clipboard
      .writeText(JSON.stringify(JSON.parse(content), null, 2))
      .then(() => alert("Formatlı JSON panoya kopyalandı!"))
      .catch(() => alert("Kopyalama işlemi başarısız oldu!"));
  } catch (e) {
    alert("Geçersiz JSON formatı!");
  }
};

// Sıkıştırılmış JSON'ı panoya kopyalama
copyMinifiedBtn.onclick = () => {
  try {
    const content = textArea.value;
    JSON.parse(content);
    navigator.clipboard
      .writeText(JSON.stringify(JSON.parse(content)))
      .then(() => alert("Sıkıştırılmış JSON panoya kopyalandı!"))
      .catch(() => alert("Kopyalama işlemi başarısız oldu!"));
  } catch (e) {
    alert("Geçersiz JSON formatı!");
  }
};

// Uygulamayı başlat
init();

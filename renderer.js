let currentFile = null;
const fileList = document.getElementById("file-list");
const textArea = document.getElementById("text-area");
const newFileInput = document.getElementById("new-file-input");
const addFileBtn = document.getElementById("add-file-btn");
const formatBtn = document.getElementById("format-btn");
const copyBtn = document.getElementById("copy-btn");
const copyMinifiedBtn = document.getElementById("copy-minified-btn");
const saveBtn = document.getElementById("save-btn");
const statusMessage = document.getElementById("status-message");

// Değişiklik yapıldığında kaydet butonunu aktif et
let hasUnsavedChanges = false;
let statusTimeout;

// Durum mesajını göster
function showStatus(message, type = "info") {
  clearTimeout(statusTimeout);
  statusMessage.textContent = message;
  statusMessage.className = type;

  // 3 saniye sonra mesajı temizle
  statusTimeout = setTimeout(() => {
    statusMessage.textContent = "";
    statusMessage.className = "";
  }, 3000);
}

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

  // Eğer dosya varsa, ilk dosyayı seç
  if (files.length > 0) {
    await loadFileContent(files[0]);
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
  // Eğer kaydedilmemiş değişiklikler varsa, önce onları kaydet
  if (currentFile && hasUnsavedChanges) {
    try {
      await window.fileSystem.saveFile(currentFile, textArea.value);
      showStatus("Önceki değişiklikler kaydedildi", "success");
    } catch (error) {
      showStatus("Önceki değişiklikler kaydedilemedi!", "error");
      return;
    }
  }

  const content = await window.fileSystem.readFile(fileName);
  currentFile = fileName;
  textArea.value = content;
  hasUnsavedChanges = false;
  updateSaveButton();

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
    hasUnsavedChanges = false;
    updateSaveButton();
    await loadFileContent(fileName);
  }
};

// Text değişikliklerini takip et
textArea.oninput = () => {
  if (currentFile) {
    hasUnsavedChanges = true;
    updateSaveButton();
  }
};

// Kaydet butonu durumunu güncelle
function updateSaveButton() {
  saveBtn.disabled = !hasUnsavedChanges;
  saveBtn.style.opacity = hasUnsavedChanges ? "1" : "0.5";
}

// Kaydet butonu işlevi
saveBtn.onclick = async () => {
  if (currentFile && hasUnsavedChanges) {
    await window.fileSystem.saveFile(currentFile, textArea.value);
    hasUnsavedChanges = false;
    updateSaveButton();
    showStatus("Değişiklikler kaydedildi", "success");
  }
};

// JSON formatla
formatBtn.onclick = async () => {
  try {
    const content = textArea.value;
    const parsed = JSON.parse(content);
    textArea.value = JSON.stringify(parsed, null, 2);
    hasUnsavedChanges = true;
    updateSaveButton();
    showStatus("JSON formatlandı", "success");
  } catch (e) {
    showStatus("Geçersiz JSON formatı!", "error");
  }
};

// Panoya kopyalama fonksiyonu
copyBtn.onclick = () => {
  try {
    const content = textArea.value;
    JSON.parse(content);
    navigator.clipboard
      .writeText(JSON.stringify(JSON.parse(content), null, 2))
      .then(() => showStatus("Formatlı JSON panoya kopyalandı", "success"))
      .catch(() => showStatus("Kopyalama işlemi başarısız oldu", "error"));
  } catch (e) {
    showStatus("Geçersiz JSON formatı!", "error");
  }
};

// Sıkıştırılmış JSON'ı panoya kopyalama
copyMinifiedBtn.onclick = () => {
  try {
    const content = textArea.value;
    JSON.parse(content);
    navigator.clipboard
      .writeText(JSON.stringify(JSON.parse(content)))
      .then(() => showStatus("Sıkıştırılmış JSON panoya kopyalandı", "success"))
      .catch(() => showStatus("Kopyalama işlemi başarısız oldu", "error"));
  } catch (e) {
    showStatus("Geçersiz JSON formatı!", "error");
  }
};

// Uygulamayı başlat
init();

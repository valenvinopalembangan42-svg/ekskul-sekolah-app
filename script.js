const form = document.getElementById("studentForm");
const messageEl = document.getElementById("message");
const listPeserta = document.getElementById("listPeserta");
const countEl = document.getElementById("count");
const ekskulSelect = document.getElementById("ekskul");
const previewOrb = document.getElementById("previewOrb");
const previewTitle = document.getElementById("previewTitle");
const previewText = document.getElementById("previewText");
const adminLoginSection = document.getElementById("adminLoginSection");
const adminSection = document.getElementById("adminSection");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPassword");
const totalRegisteredEl = document.getElementById("totalRegistered");
const popularEkskulEl = document.getElementById("popularEkskul");
const adminFilterSelect = document.getElementById("adminFilter");
const downloadCsvBtn = document.getElementById("downloadCsv");
const adminTableBody = document.getElementById("adminTableBody");
const logoutBtn = document.getElementById("logoutBtn");

const storageKey = "ekskulRegistrations";
const ADMIN_PASSWORD = "SCHOOLHEROES";

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function loadRegistrations() {
  const data = localStorage.getItem(storageKey);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRegistrations(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function getSelectedGender() {
  const genderInput = document.querySelector('input[name="gender"]:checked');
  return genderInput ? genderInput.value : "";
}

function updateThemePreview() {
  const value = ekskulSelect.value;
  const themeMap = {
    Nari: { icon: "💃", title: "Nari", text: "Goyangkan Langkah, Ekspresikan Jiwa Lewat Tarian." },
    Vokal: { icon: "🎤", title: "Vokal", text: "Suarakan Talentamu dan Bikin Seluruh Sekolah Terpukau." },
    Musik: { icon: "🎵", title: "Musik", text: "Padukan Nada, ciptakan Harmoni Indah Bersama Band." },
    "Marching Band": { icon: "🥁", title: "Marching Band", text: "Ketukan Kompak, Barisan Megah, Tampil Penuh Kebanggaan." },
    Paskibra: { icon: "🎖️", title: "Paskibra", text: "Kedisiplinan, Keteguhan, dan Rasa Bangga Menjaga Sang Saka." },
    Pramuka: { icon: "🏕️", title: "Pramuka", text: "Mandiri, Tangguh, dan Siap Berpetualang Menjelajah Alam." },
    Debat: { icon: "🗣️", title: "Debat", text: "Asah Berpikir Kritis, Bicara Berani, Kuasai Panggung Argumen." },
    Futsal: { icon: "⚽", title: "Futsal", text: "Kecepatan, Strategi, dan Kerjasama Tim di Atas Lapangan." },
    Voli: { icon: "🏐", title: "Voli", text: "Smash Keras, Pertahanan Kuat, Raih Kemenangan Bersama!" },
    Basket: { icon: "🏀", title: "Basket", text: "Tinggi Drible, Tepat Dribble, Ciptakan Poin Kemenangan." }
  };

  document.body.classList.remove(
    "theme-nari",
    "theme-vokal",
    "theme-musik",
    "theme-marching-band",
    "theme-paskibra",
    "theme-pramuka",
    "theme-debat",
    "theme-futsal",
    "theme-voli",
    "theme-basket"
  );

  if (value && themeMap[value]) {
    document.body.classList.add(`theme-${value.toLowerCase().replace(/\s+/g, "-")}`);
    previewOrb.textContent = themeMap[value].icon;
    previewTitle.textContent = themeMap[value].title;
    previewText.textContent = themeMap[value].text;
  } else {
    previewOrb.textContent = "✨";
    previewTitle.textContent = "Pilih ekskul";
    previewText.textContent = "Animasi akan muncul sesuai bidang kegiatan yang kamu pilih.";
  }
}

function renderList() {
  const data = loadRegistrations();

  countEl.textContent = `${data.length} pendaftar`;

  if (data.length === 0) {
    listPeserta.innerHTML = `
      <div class="empty">
        Belum ada pendaftar yang masuk.
      </div>
    `;
    return;
  }

  listPeserta.innerHTML = data
    .map((item, index) => {
      return `
        <div class="item">
          <strong>${escapeHtml(item.nama)}</strong><br>
          Kelas: ${escapeHtml(item.kelas)}<br>
          Kontak WA: ${escapeHtml(item.hp)}<br>
          Gender: ${escapeHtml(item.gender)}<br>
          Ekskul: ${escapeHtml(item.ekskul)}<br>
          Alasan: ${escapeHtml(item.alasan)}<br>
          <button type="button" onclick="hapusPeserta(${index})">
            Hapus
          </button>
        </div>
      `;
    })
    .join("");
}

function getPopularEkskul(data) {
  if (!data.length) return null;
  const counts = data.reduce((acc, item) => {
    acc[item.ekskul] = (acc[item.ekskul] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

function renderAdminStats() {
  const data = loadRegistrations();
  totalRegisteredEl.textContent = data.length;
  popularEkskulEl.textContent = getPopularEkskul(data) || "-";
}

function renderAdminTable(filter = "") {
  const data = loadRegistrations().filter((item) => {
    return filter ? item.ekskul === filter : true;
  });

  if (!data.length) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-row">Tidak ada data yang ditampilkan.</td>
      </tr>
    `;
    return;
  }

  adminTableBody.innerHTML = data
    .map((item, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.nama)}</td>
          <td>${escapeHtml(item.kelas)}</td>
          <td>${escapeHtml(item.hp)}</td>
          <td>${escapeHtml(item.gender)}</td>
          <td>${escapeHtml(item.ekskul)}</td>
          <td>${escapeHtml(item.tanggal)}</td>
        </tr>
      `;
    })
    .join("");
}

function showMessage(text, color) {
  messageEl.textContent = text;
  messageEl.style.color = color;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const peserta = {
    nama: document.getElementById("nama").value.trim(),
    kelas: document.getElementById("kelas").value,
    hp: document.getElementById("hp").value.trim(),
    gender: getSelectedGender(),
    ekskul: document.getElementById("ekskul").value,
    alasan: document.getElementById("alasan").value.trim(),
    tanggal: formatDate(new Date())
  };

  if (!peserta.nama || !peserta.kelas || !peserta.hp || !peserta.gender || !peserta.ekskul || !peserta.alasan) {
    showMessage("Semua data harus diisi!", "red");
    return;
  }

  const data = loadRegistrations();
  data.push(peserta);
  saveRegistrations(data);
  renderList();
  renderAdminStats();
  renderAdminTable(adminFilterSelect.value);
  form.reset();
  updateThemePreview();

  showMessage("Pendaftaran Berhasil! Selamat Bergabung, Tim Ekskul Akan Segera Menghubungimu!", "green");
});

function hapusPeserta(index) {
  const data = loadRegistrations();
  data.splice(index, 1);
  saveRegistrations(data);
  renderList();
  renderAdminStats();
  renderAdminTable(adminFilterSelect.value);
}

adminLoginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    adminLoginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    renderAdminStats();
    renderAdminTable(adminFilterSelect.value);
    showMessage("", "");
    adminPasswordInput.value = "";
  } else {
    showMessage("Kata sandi admin tidak valid.", "red");
  }
});

adminFilterSelect.addEventListener("change", function () {
  renderAdminTable(adminFilterSelect.value);
});

downloadCsvBtn.addEventListener("click", function () {
  const data = loadRegistrations();
  if (!data.length) {
    showMessage("Tidak ada data untuk diunduh.", "red");
    return;
  }

  const rows = [
    ["No.", "Nama Siswa", "Kelas", "Kontak WA", "Gender", "Ekskul Yang Dipilih", "Tanggal Daftar"],
    ...data.map((item, index) => [
      index + 1,
      item.nama,
      item.kelas,
      item.hp,
      item.gender,
      item.ekskul,
      item.tanggal
    ])
  ];

  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rekapan-ekskul.csv";
  link.click();
  URL.revokeObjectURL(url);
});

logoutBtn.addEventListener("click", function () {
  adminSection.classList.add("hidden");
  adminLoginSection.classList.remove("hidden");
  showMessage("", "");
});

ekskulSelect.addEventListener("change", updateThemePreview);
updateThemePreview();
renderList();
renderAdminStats();
renderAdminTable();

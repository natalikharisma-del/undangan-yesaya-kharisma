const SHEET_NAME_RSVP = "RSVP";
const SHEET_NAME_WISHES = "Ucapan";

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet_(ss, SHEET_NAME_RSVP, ["Timestamp","Nama","Kehadiran","Jumlah Tamu"]);
  getOrCreateSheet_(ss, SHEET_NAME_WISHES, ["Timestamp","Nama","Ucapan"]);
}

function getOrCreateSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) sh.appendRow(headers);
  return sh;
}

function doGet(e) {
  const action = String(e?.parameter?.action || "").trim();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "ucapan") {
    const sheet = ss.getSheetByName(SHEET_NAME_WISHES);

    if (!sheet) {
      return json_({
        ok: false,
        message: "Sheet ucapan tidak ditemukan."
      });
    }

    const values = sheet.getDataRange().getValues();

    const data = values.slice(1).map(row => ({
      timestamp: row[0],
      nama: row[1],
      ucapan: row[2]
    }));

    return json_({
      ok: true,
      type: "ucapan",
      data: data
    });
  }

  return json_({
    ok: true,
    message: "Undangan Yesaya & Kharisma API aktif."
  });
}

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const action = String(p.action || "").trim();
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "rsvp") {
      const name = clean_(p.name, 120);
      const attendance = clean_(p.attendance, 30);
      const count = Number(p.count);

      if (!name) throw new Error("Nama wajib diisi.");
      if (!["Hadir","Tidak Hadir"].includes(attendance)) throw new Error("Pilihan kehadiran tidak valid.");
      if (!Number.isInteger(count) || count < 1 || count > 2) {
        throw new Error("Jumlah tamu maksimal 2 orang.");
      }

      const sh = getOrCreateSheet_(ss, SHEET_NAME_RSVP, ["Timestamp","Nama","Kehadiran","Jumlah Tamu"]);
      sh.appendRow([new Date(), name, attendance, count]);
      return json_({ ok:true, type:"rsvp", message:"RSVP berhasil disimpan." });
    }

    if (action === "wish") {
      const name = clean_(p.name, 120);
      const wish = clean_(p.wish, 1000);

      if (!name) throw new Error("Nama wajib diisi.");
      if (!wish) throw new Error("Ucapan wajib diisi.");

      const sh = getOrCreateSheet_(ss, SHEET_NAME_WISHES, ["Timestamp","Nama","Ucapan"]);
      sh.appendRow([new Date(), name, wish]);
      return json_({ ok:true, type:"wish", message:"Ucapan berhasil disimpan." });
    }

    throw new Error("Action tidak dikenali.");
  } catch (err) {
    return json_({ ok:false, message: err.message || "Terjadi kesalahan." });
  }
}

function clean_(value, max) {
  return String(value || "").trim().slice(0, max);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

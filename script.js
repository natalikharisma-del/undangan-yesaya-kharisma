// ===============================
// KONFIGURASI
// ===============================
// Setelah Google Apps Script dideploy sebagai Web App,
// tempel URL-nya di bawah ini.
const API_URL = "https://script.google.com/macros/s/AKfycbx8Sv2Twq5taLZa1f_4wC0GRYc0noZ2Qi7L6j2VKWBAUicgmuCOhSbgdYUZ8Etl19VL/exec";

async function loadWishes() {
  const list = document.getElementById("wishList");
  if (!list) return;

  try {
    const response = await fetch(API_URL + "?action=ucapan");
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.message || "Gagal memuat ucapan.");
    }

    list.innerHTML = "";

    result.data.slice().reverse().forEach(item => {
      const box = document.createElement("div");
      box.className = "wish";

      const name = document.createElement("strong");
      name.textContent = item.nama;

      const message = document.createElement("p");
      message.textContent = item.ucapan;

      box.appendChild(name);
      box.appendChild(message);
      list.appendChild(box);
    });

  } catch (error) {
    list.innerHTML = "<p>Ucapan belum dapat dimuat.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadWishes);

const cover=document.getElementById("cover");
const main=document.getElementById("main");
const music=document.getElementById("bgMusic");
const toggle=document.getElementById("musicToggle");

document.getElementById("openInvitation").addEventListener("click", async()=>{
  cover.classList.add("hidden");
  main.classList.remove("hidden");
  toggle.classList.remove("hidden");
  try { await music.play(); } catch(e) { toggle.textContent="▶"; }
});
toggle.addEventListener("click",async()=>{
  if(music.paused){try{await music.play();toggle.textContent="♫"}catch(e){}}
  else{music.pause();toggle.textContent="▶"}
});

const target=new Date("2026-09-19T09:00:00+07:00").getTime();
setInterval(()=>{
  let d=Math.max(0,target-Date.now());
  let days=Math.floor(d/86400000); d%=86400000;
  let hours=Math.floor(d/3600000); d%=3600000;
  let minutes=Math.floor(d/60000); let seconds=Math.floor((d%60000)/1000);
  document.getElementById("days").textContent=days;
  document.getElementById("hours").textContent=hours;
  document.getElementById("minutes").textContent=minutes;
  document.getElementById("seconds").textContent=seconds;
},1000);

function configured(){
  return API_URL && !API_URL.includes("TEMPEL_URL");
}
async function post(data){
  if(!configured()) throw new Error("Website belum dihubungkan ke Google Sheets.");
  const body=new URLSearchParams(data);
  const res=await fetch(API_URL,{method:"POST",body});
  return await res.json();
}

document.getElementById("rsvpForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const msg=document.getElementById("rsvpMessage");
  const name=document.getElementById("guestName").value.trim();
  const attendance=document.getElementById("attendance").value;
  const count=Number(document.getElementById("guestCount").value);
  if(count>2){msg.textContent="Maksimal 2 orang.";return}
  msg.textContent="Mengirim...";
  try{
    const out=await post({action:"rsvp",name:name,attendance:attendance,count:count});
    msg.textContent=out.ok?"Terima kasih. RSVP Anda sudah tersimpan.":out.message;
    if(out.ok)e.target.reset();
  }catch(err){msg.textContent=err.message}
});

document.getElementById("wishForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const msg=document.getElementById("wishMessage");
  const name=document.getElementById("wishName").value.trim();
  const wish=document.getElementById("wishText").value.trim();
  msg.textContent="Mengirim...";
  try{
    const out=await post({action:"wish",name:name,wish:wish});
    msg.textContent=out.ok?"Terima kasih atas ucapan dan doanya.":out.message;
    if(out.ok)e.target.reset();
  }catch(err){msg.textContent=err.message}
});

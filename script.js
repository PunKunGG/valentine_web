const panel = document.getElementById("panel");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const main = document.getElementById("main");
const result = document.getElementById("result");
const questionText = document.getElementById("questionText");
const bgFloat = document.getElementById("bgFloat");
const FLOAT_IMG_SRC = "./assets/emorizz.png";
const resetBtn = document.getElementById("resetBtn");
const DEFAULT_QUESTION = "Will you be my Valentine?";

let attempts = 0; // นับจำนวนครั้งที่พยายามกด/แตะปุ่มแดงจริงๆ
let yesScale = 1;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function growYesButton() {
  yesScale = clamp(yesScale + 0.08, 1, 1.8);
  yesBtn.style.transform = `scale(${yesScale})`;
}

function moveNoButton() {
  const panelRect = panel.getBoundingClientRect();

  // วัดตำแหน่ง "ฐาน" ของปุ่ม (ก่อนแปะ transform)
  const old = noBtn.style.transform;
  noBtn.style.transform = "translate(0, 0)";
  const baseRect = noBtn.getBoundingClientRect();

  const btnW = baseRect.width;
  const btnH = baseRect.height;

  const padding = 16;

  // สุ่มตำแหน่งปลายทาง (ภายใน panel เท่านั้น)
  const targetX = rand(padding, panelRect.width - btnW - padding);
  const targetY = rand(padding, panelRect.height - btnH - padding);

  // ตำแหน่งฐานของปุ่มภายใน panel
  const baseX = baseRect.left - panelRect.left;
  const baseY = baseRect.top - panelRect.top;

  // แปลงเป็นระยะเลื่อน (dx, dy) เพื่อให้ไปถึง target
  const dx = targetX - baseX;
  const dy = targetY - baseY;

  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
}

function setMessage(n) {
  const messages = [
    "Are you sure? 🙂",
    "Really sure? 😶",
    "Last chance to say yes 😌",
    "Too late… I’m running 😈💨",
    "You’re persistent. I respect that 🫡",
    "You can’t escape destiny 😈💘",
    "Okay… what if I say please? 🥺",
    "I’m just a button, don’t hurt me 😭",
    "Look at the green button… it’s adorable 💚",
    "Okay okay… just press YES 😭",
    "Plot twist: the red button is shy 🙈",
    "You win. I’ll stop running (maybe) 😵‍💫",
    "This is getting dramatic… 🎭",
    "Fine. Press YES and I’ll behave 😤💘",
    "If you press YES, I’ll be your best button 😇",
    "I have no more places to run… send help 🏃‍♂️💨",
  ];

  // นับตั้งแต่ 1 เป็นต้นไป
  const i = Math.min(Math.max(n, 1), messages.length) - 1;
  questionText.textContent = messages[i];

  // หลังจากข้อความหมดแล้ว ให้สุ่มวนต่อแบบไม่ซ้ำเดิมบ่อย
  if (n > messages.length) {
    const extras = [
      "YES is a shortcut to happiness 💘",
      "I’m out of stamina… 💀",
      "Stop chasing meee 😂",
      "Green button is calling your name 📣",
      "Okay, you’re the boss. Press YES 👑",
      "If you can read this, you can press YES 😌",
    ];
    questionText.textContent =
      extras[Math.floor(Math.random() * extras.length)];
  }
}

// คลิก/แตะปุ่มแดง: 3 ครั้งแรกไม่หนี, ครั้งที่ 4+ เริ่มหนี
function onNoAttempt(e) {
  e.preventDefault();

  attempts++;
  growYesButton();
  setMessage(attempts);

  if (attempts <= 3) return; // ไม่ขยับใน 3 รอบแรก

  moveNoButton(); // เริ่มขยับตั้งแต่รอบ 4
}

noBtn.addEventListener("click", onNoAttempt);
noBtn.addEventListener("touchstart", onNoAttempt, { passive: false });

// ถ้ายังอยากให้ "hover แล้วหนี" ให้เปิดบล็อกนี้ได้
// แต่จะทำให้หนีแม้ยังไม่ครบ 3 รอบแรก (ไม่ตรงเงื่อนไข)
// แนะนำให้ปิดไว้ก่อนตามที่คุณขอ
// noBtn.addEventListener("mouseenter", () => {
//   if (attempts >= 4) moveNoButton();
// });

yesBtn.addEventListener("click", () => {
  main.style.display = "none";
  result.style.display = "block";

  noBtn.style.display = "none";
  yesBtn.textContent = "💖 Thank you! 💖";
  yesBtn.disabled = true;
  yesBtn.style.filter = "grayscale(0.2)";

  resetBtn.style.display = "inline-block";
});

function spawnFloatingFace() {
  if (!bgFloat) return;

  const img = document.createElement("img");
  img.src = FLOAT_IMG_SRC;
  img.alt = "";
  img.className = "float-item";

  const size = rand(38, 110); // ขนาดสุ่ม
  const duration = rand(6, 14); // ระยะเวลาลอย
  const x = rand(0, 100); // % ตำแหน่งแกน x เริ่ม
  const x2 = clamp(x + rand(-18, 18), 0, 100); // ลอยเฉไปอีกนิด
  const rot = rand(-25, 25); // องศาเอียง
  const opacity = rand(0.08, 0.22); // ความจางสุ่ม

  img.style.width = `${size}px`;
  img.style.setProperty("--x", `${x}vw`);
  img.style.setProperty("--x2", `${x2}vw`);
  img.style.setProperty("--r", `${rot}deg`);
  img.style.setProperty("--o", opacity);
  img.style.animationDuration = `${duration}s`;

  bgFloat.appendChild(img);

  // ลบทิ้งเมื่อ animation จบ
  img.addEventListener("animationend", () => img.remove());
}

// เริ่มสุ่มลอยเบา ๆ (ปรับความถี่ได้)
setInterval(() => {
  // สุ่มบางครั้ง เพื่อไม่ให้เยอะเกิน
  if (Math.random() < 0.65) spawnFloatingFace();
}, 900);

function resetGame() {
  // กลับหน้าหลัก
  main.style.display = "block";
  result.style.display = "none";

  // คืนค่าปุ่ม
  noBtn.style.display = "inline-block";
  noBtn.style.transform = "translate(0, 0)";

  yesBtn.disabled = false;
  yesBtn.textContent = "Yes";
  yesBtn.style.filter = "";
  yesBtn.style.transform = "scale(1)";

  // คืนค่า state
  attempts = 0;
  yesScale = 1;
  questionText.textContent = DEFAULT_QUESTION;

  // ซ่อน reset (ถ้าต้องการให้โผล่เฉพาะหลัง yes)
  resetBtn.style.display = "none";
}

resetBtn.addEventListener("click", resetGame);

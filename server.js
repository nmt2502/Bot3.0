const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const handleStart = require("./chao");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const URL = process.env.RENDER_EXTERNAL_URL;
const PORT = process.env.PORT || 3000;

const ADMIN_ID = 8213006748; // 🔴 đổi thành ID admin của bạn

const userFile = path.join(__dirname, "user.json");

const bot = new TelegramBot(TOKEN);
bot.setWebHook(`${URL}/bot${TOKEN}`);

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log("Bot running on port", PORT);
});

/* ===== /start ===== */
bot.onText(/\/start/, (msg) => {
  handleStart(bot, msg);
});

/* ===== /adminvip ===== */
bot.onText(/\/adminvip/, (msg) => {
  if (msg.from.id !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền sử dụng lệnh này.");
  }

  const adminText =
`👑 Chào Mừng Bạn Tới Admin!

👥 Tổng Thành Viên:
🔑 Tổng Key Còn:
📤 Tổng Key Bán:
💰 Tổng Doanh Thu:
⏳ Tổng Chờ Duyệt Nạp:
🟢 Tổng Api Sống:
🔴 Tổng Api Chết:

Sử Dụng Các Nút Bên Dưới Bàn Phím`;

  const adminKeyboard = {
    reply_markup: {
      keyboard: [
        ["Thành Viên", "Tạo Key"],
        ["Check Api", "Kích Hoạt"],
        ["Duyệt Nạp", "Thông Báo"]
      ],
      resize_keyboard: true
    }
  };

  bot.sendMessage(msg.chat.id, adminText, adminKeyboard);
});

/* ===== NÚT: THÀNH VIÊN ===== */
bot.on("message", (msg) => {
  if (msg.text !== "Thành Viên") return;
  if (msg.from.id !== ADMIN_ID) return;

  if (!fs.existsSync(userFile)) {
    return bot.sendMessage(msg.chat.id, "❌ Không tìm thấy user.json");
  }

  const users = JSON.parse(fs.readFileSync(userFile, "utf8"));
  const ids = Object.keys(users);

  if (ids.length === 0) {
    return bot.sendMessage(msg.chat.id, "👥 Hiện chưa có thành viên nào.");
  }

  let text = `👥 DANH SÁCH THÀNH VIÊN\n`;
  text += `Tổng: ${ids.length}\n\n`;

  ids.forEach((id, i) => {
    const u = users[id];
    text += `${i + 1}. ${u.name}\n`;
    text += `🆔 ID: ${u.id}\n`;
    text += `🔐 Key: ${u.key ? "✅ Đã kích hoạt" : "❌ Chưa kích hoạt"}\n`;
    text += `💵 Số dư: ${u.balance} VND\n\n`;
  });

  bot.sendMessage(msg.chat.id, text);
});
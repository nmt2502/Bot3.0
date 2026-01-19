const fs = require("fs");
const path = require("path");

const userFile = path.join(__dirname, "user.json");

function readUsers() {
  if (!fs.existsSync(userFile)) return {};
  return JSON.parse(fs.readFileSync(userFile, "utf8"));
}

function saveUsers(data) {
  fs.writeFileSync(userFile, JSON.stringify(data, null, 2));
}

module.exports = function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || "User";

  let users = readUsers();

  if (!users[chatId]) {
    users[chatId] = {
      id: chatId,
      name: name,
      key: false,
      balance: 0
    };
    saveUsers(users);
  }

  const text =
`👋 Chào mừng ${name}!

🆔 ID: ${chatId}
🔐 Trạng thái Key: ❌ Chưa Kích Hoạt
💵 Số dư: 0 VND

📝 Để sử dụng bot, vui lòng:
1️⃣ Nạp tiền
2️⃣ Mua key mới
3️⃣ Sử dụng key

Chọn tùy chọn từ menu bên dưới:`;

  const keyboard = {
    reply_markup: {
      keyboard: [
        ["Chạy Tool", "Sử Dụng Key"],
        ["Mua Key", "Nạp Tiền"],
        ["Số Dư", "Lịch Sử Nạp"],
        ["Giftcode", "Liên Hệ Admin"]
      ],
      resize_keyboard: true
    }
  };

  bot.sendMessage(chatId, text, keyboard);
};
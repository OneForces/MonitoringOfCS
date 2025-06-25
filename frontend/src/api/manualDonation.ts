import axios from './axios'; // ✅ используем локальный конфиг, а не глобальный axios

export async function sendManualDonation(amount: number, comment: string) {
  const token = localStorage.getItem('token');

  await axios.post(
    'manual-donation/', // 🔁 относительный путь — базовый URL будет подставлен автоматически
    {
      amount,
      comment,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
}

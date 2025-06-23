import axios from 'axios';

export async function sendExpoPushNotification(tokens: string[], title: string, body: string) {
  const messages = tokens.map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
  }));
  try {
    await axios.post('https://exp.host/--/api/v2/push/send', messages, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Erro ao enviar notificações Expo:', err);
  }
}

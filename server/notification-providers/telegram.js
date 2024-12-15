const NotificationProvider = require("./notification-provider");
const axios = require("axios");

class Telegram extends NotificationProvider {
    name = "telegram";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";
        const url = notification.useCustomAPI
            ? (notification.telegramCustomAPIURL || "").replace(/\/+$/, "")
            : "https://api.telegram.org";

        try {
            let params = {
                chat_id: notification.telegramChatID,
                text: msg,
                disable_notification: notification.telegramSendSilently ?? false,
                protect_content: notification.telegramProtectContent ?? false,
            };
            if (notification.telegramMessageThreadID) {
                params.message_thread_id = notification.telegramMessageThreadID;
            }

            if (notification.useCustomAPI) {
                params.key = notification.telegramBotName;
                params.secret = notification.telegramSecret;
                await axios.get(`${url}/sendMessage`, { params });
            } else {
                await axios.get(`${url}/bot${notification.telegramBotToken}/sendMessage`, { params });
            }

            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = Telegram;

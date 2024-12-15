<template>
    <div class="mb-3">
        <label for="telegram-bot-token" class="form-label">{{ $t("Bot Token") }}</label>
        <HiddenInput id="telegram-bot-token" v-model="$parent.notification.telegramBotToken" :required="!$parent.notification.useCustomAPI" :is-disabled="$parent.notification.useCustomAPI" autocomplete="new-password"></HiddenInput>
        <i18n-t tag="div" keypath="wayToGetTelegramToken" class="form-text">
            <a href="https://t.me/BotFather" target="_blank">https://t.me/BotFather</a>
        </i18n-t>
    </div>

    <div class="mb-3">
        <div class="form-check form-switch">
            <input
                id="use-custom-api"
                v-model="$parent.notification.useCustomAPI"
                type="checkbox"
                class="form-check-input"
            />
            <label class="form-check-label" for="use-custom-api">
                {{ $t("Use Custom API") }}
            </label>
        </div>
    </div>

    <div v-if="$parent.notification.useCustomAPI" class="mb-3">
        <div class="mb-3">
            <label for="telegram-bot-name" class="form-label">{{ $t("Bot Name") }}</label>
            <input
                id="telegram-bot-name"
                v-model="$parent.notification.telegramBotName"
                type="text"
                class="form-control"
            />
        </div>

        <div class="mb-3">
            <label for="telegram-secret" class="form-label">{{ $t("Secret") }}</label>
            <HiddenInput
                id="telegram-secret"
                v-model="$parent.notification.telegramSecret"
                autocomplete="new-password"
            ></HiddenInput>
        </div>

        <div class="mb-3">
            <label for="telegram-api-url" class="form-label">{{ $t("Custom API URL") }}</label>
            <input
                id="telegram-api-url"
                v-model="$parent.notification.telegramCustomAPIURL"
                type="url"
                class="form-control"
                placeholder="https://your-worker-url/bot"
                required
            />
        </div>
    </div>

    <div class="mb-3">
        <label for="telegram-chat-id" class="form-label">{{ $t("Chat ID") }}</label>

        <div class="input-group mb-3">
            <input id="telegram-chat-id" v-model="$parent.notification.telegramChatID" type="text" class="form-control" required>
            <button v-if="$parent.notification.telegramBotToken || $parent.notification.telegramCustomAPIURL" class="btn btn-outline-secondary" type="button" @click="autoGetTelegramChatID">
                {{ $t("Auto Get") }}
            </button>
        </div>

        <div class="form-text">
            {{ $t("supportTelegramChatID") }}

            <p style="margin-top: 8px;">
                {{ $t("wayToGetTelegramChatID") }}
            </p>

            <p style="margin-top: 8px;">
                <a :href="telegramGetUpdatesURL('withToken')" target="_blank" style="word-break: break-word;">{{ telegramGetUpdatesURL("masked") }}</a>
            </p>
        </div>

        <label for="message_thread_id" class="form-label">{{ $t("telegramMessageThreadID") }}</label>
        <input id="message_thread_id" v-model="$parent.notification.telegramMessageThreadID" type="text" class="form-control">
        <p class="form-text">{{ $t("telegramMessageThreadIDDescription") }}</p>

        <div class="form-check form-switch">
            <input v-model="$parent.notification.telegramSendSilently" class="form-check-input" type="checkbox">
            <label class="form-check-label">{{ $t("telegramSendSilently") }}</label>
        </div>

        <div class="form-text">
            {{ $t("telegramSendSilentlyDescription") }}
        </div>
    </div>

    <div class="mb-3">
        <div class="form-check form-switch">
            <input v-model="$parent.notification.telegramProtectContent" class="form-check-input" type="checkbox">
            <label class="form-check-label">{{ $t("telegramProtectContent") }}</label>
        </div>

        <div class="form-text">
            {{ $t("telegramProtectContentDescription") }}
        </div>
    </div>
</template>

<script>
import HiddenInput from "../HiddenInput.vue";
import axios from "axios";

export default {
    components: {
        HiddenInput,
    },
    methods: {
        /**
         * Get the URL for telegram updates
         * @param {string} mode Should the token be masked?
         * @returns {string} formatted URL
         */
        telegramGetUpdatesURL(mode = "masked") {
            if (this.$parent.notification.useCustomAPI) {
                let baseURL = this.$parent.notification.telegramCustomAPIURL || "";
                if (!baseURL) {
                    return "";
                }

                if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
                    baseURL = "https://" + baseURL;
                }

                if (!baseURL.endsWith("/")) {
                    baseURL += "/";
                }
                baseURL += `getUpdates?key=${encodeURIComponent(this.$parent.notification.telegramBotName || "")}`;
                baseURL += `&secret=${encodeURIComponent(this.$parent.notification.telegramSecret || "")}`;
                return baseURL;
            } else {
                let token = `<${this.$t("YOUR BOT TOKEN HERE")}>`;
                if (this.$parent.notification.telegramBotToken) {
                    if (mode === "withToken") {
                        token = this.$parent.notification.telegramBotToken;
                    } else if (mode === "masked") {
                        token = "*".repeat(
                            this.$parent.notification.telegramBotToken.length
                        );
                    }
                }
                return `https://api.telegram.org/bot${token}/getUpdates`;
            }
        },

        /**
         * Get the telegram chat ID
         * @returns {Promise<void>}
         * @throws The chat ID could not be found
         */
        async autoGetTelegramChatID() {
            try {
                let res = await axios.get(this.telegramGetUpdatesURL("withToken"));

                if (res.data.result.length >= 1) {
                    let update = res.data.result[res.data.result.length - 1];

                    if (update.channel_post) {
                        this.$parent.notification.telegramChatID = update.channel_post.chat.id;
                    } else if (update.message) {
                        this.$parent.notification.telegramChatID = update.message.chat.id;
                    } else {
                        throw new Error(this.$t("chatIDNotFound"));
                    }

                } else {
                    throw new Error(this.$t("chatIDNotFound"));
                }

            } catch (error) {
                this.$root.toastError(error.message);
            }

        },
    }
};
</script>

//
//  bark.js
//  UptimeKuma
//
//  Created by Lakr Aream on 2021/10/24.
//  Copyright © 2021 Lakr Aream. All rights reserved.
//

const NotificationProvider = require("./notification-provider");
const { DOWN, UP } = require("../../src/util");
const { default: axios } = require("axios");

// bark is an APN bridge that sends notifications to Apple devices.

const barkNotificationAvatar = "https://github.com/louislam/uptime-kuma/raw/master/public/icon.png";
const successMessage = "Successes!";

class Bark extends NotificationProvider {
    name = "Bark";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let barkEndpoint = notification.barkEndpoint;

        // check if the endpoint has a "/" suffix, if so, delete it first
        if (barkEndpoint.endsWith("/")) {
            barkEndpoint = barkEndpoint.substring(0, barkEndpoint.length - 1);
        }

        if (msg != null && heartbeatJSON != null && heartbeatJSON["status"] === UP) {
            let title = "UptimeKuma Monitor Up";
            return await this.postNotification(notification, title, msg, barkEndpoint);
        }

        if (msg != null && heartbeatJSON != null && heartbeatJSON["status"] === DOWN) {
            let title = "UptimeKuma Monitor Down";
            return await this.postNotification(notification, title, msg, barkEndpoint);
        }

        if (msg != null) {
            let title = "UptimeKuma Message";
            return await this.postNotification(notification, title, msg, barkEndpoint);
        }
    }

    /**
     * Add additional parameter for Bark v1 endpoints.
     * Leads to better on device styles (iOS 15 optimized)
     * @param {BeanModel} notification Notification to send
     * @returns {string} Additional URL parameters
     */
    additionalParameters(notification) {
        // 构建基础参数
        let params = new URLSearchParams();

        // 设置图标
        params.append("icon", notification.barkIconUrl || barkNotificationAvatar);

        // 设置分组
        params.append("group", notification.barkGroup || "UptimeKuma");

        // 设置声音
        // params.append("sound", notification.barkSound || "telegraph");
        if (notification.barkSound) {
            params.append("sound", notification.barkSound);
        }

        // 添加新功能的参数
        if (notification.barkIsArchive) {
            params.append("isArchive", "1");
        }

        if (notification.barkLevel) {
            params.append("level", "critical");
            if (notification.barkVolume !== undefined) {
                params.append("volume", notification.barkVolume.toString());
            }
        }

        if (notification.barkContinuousSound) {
            params.append("call", "1");
        }

        return `?${params.toString()}`;
    }

    /**
     * Check if result is successful
     * @param {object} result Axios response object
     * @returns {void}
     * @throws {Error} The status code is not in range 2xx
     */
    checkResult(result) {
        if (result.status == null) {
            throw new Error("Bark notification failed with invalid response!");
        }
        if (result.status < 200 || result.status >= 300) {
            throw new Error("Bark notification failed with status code " + result.status);
        }
    }

    /**
     * Send the message
     * @param {BeanModel} notification Notification to send
     * @param {string} title Message title
     * @param {string} subtitle Message
     * @param {string} endpoint Endpoint to send request to
     * @returns {Promise<string>} Success message
     */
    async postNotification(notification, title, subtitle, endpoint) {
        let result;

        const headers = {};

        if (notification.barkUsername && notification.barkPassword) {
            const auth = Buffer.from(`${notification.barkUsername}:${notification.barkPassword}`).toString("base64");
            headers.Authorization = `Basic ${auth}`;
        }

        if (notification.apiVersion === "v1" || notification.apiVersion == null) {
            // url encode title and subtitle
            title = encodeURIComponent(title);
            subtitle = encodeURIComponent(subtitle);
            const params = this.additionalParameters(notification);
            result = await axios.get(`${endpoint}/${title}/${subtitle}${params}`, { headers });
        } else {
            const postData = {
                title,
                body: subtitle,
                group: notification.barkGroup || "UptimeKuma",
                icon: notification.barkIconUrl || barkNotificationAvatar,
            };

            if (notification.barkSound) {
                postData.sound = notification.barkSound;
            }

            if (notification.barkIsArchive) {
                postData.isArchive = 1;
            }

            if (notification.barkLevel) {
                postData.level = "critical";
                postData.volume = notification.barkVolume || 5;
            }

            if (notification.barkContinuousSound) {
                postData.call = 1;
            }

            result = await axios.post(`${endpoint}/push`, postData, { headers });
        }

        this.checkResult(result);
        if (result.statusText != null) {
            return "Bark notification succeed: " + result.statusText;
        }
        // because returned in range 200 ..< 300
        return successMessage;
    }
}

module.exports = Bark;

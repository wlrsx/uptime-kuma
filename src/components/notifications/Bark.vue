<template>
    <div class="mb-3">
        <label for="Bark API Version" class="form-label">{{ $t("Bark API Version") }}</label>
        <select id="Bark API Version" v-model="$parent.notification.apiVersion" class="form-select" required>
            <option value="v1">GET</option>
            <option value="v2">POST</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="Bark Endpoint" class="form-label">{{ $t("Bark Endpoint") }}<span style="color: red;"><sup>*</sup></span></label>
        <input id="Bark Endpoint" v-model="$parent.notification.barkEndpoint" type="text" class="form-control" required>
        <i18n-t tag="div" keypath="wayToGetTeamsURL" class="form-text">
            <a
                href="https://github.com/Finb/Bark"
                target="_blank"
            >{{ $t("here") }}</a>
        </i18n-t>
    </div>
    <div class="mb-3">
        <label for="Bark Authorization" class="form-label">{{ $t("Bark Authorization") }}</label>
        <div class="row g-3">
            <div class="col">
                <input id="Bark Username" v-model="$parent.notification.barkUsername" type="text" class="form-control" :placeholder="$t('Username')">
            </div>
            <div class="col">
                <input id="Bark Password" v-model="$parent.notification.barkPassword" type="password" class="form-control" :placeholder="$t('Password')">
            </div>
        </div>
    </div>
    <div class="mb-3">
        <label for="Bark Group" class="form-label">{{ $t("Bark Group") }}</label>
        <input id="Bark Group" v-model="$parent.notification.barkGroup" type="text" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="Bark Sound" class="form-label">{{ $t("Bark Sound") }}</label>
        <select id="Bark Sound" v-model="$parent.notification.barkSound" class="form-select">
            <option value="">{{ $t("Default") }}</option>
            <option value="alarm">alarm</option>
            <option value="anticipate">anticipate</option>
            <option value="bell">bell</option>
            <option value="birdsong">birdsong</option>
            <option value="bloom">bloom</option>
            <option value="calypso">calypso</option>
            <option value="chime">chime</option>
            <option value="choo">choo</option>
            <option value="descent">descent</option>
            <option value="electronic">electronic</option>
            <option value="fanfare">fanfare</option>
            <option value="glass">glass</option>
            <option value="gotosleep">gotosleep</option>
            <option value="healthnotification">healthnotification</option>
            <option value="horn">horn</option>
            <option value="ladder">ladder</option>
            <option value="mailsent">mailsent</option>
            <option value="minuet">minuet</option>
            <option value="multiwayinvitation">multiwayinvitation</option>
            <option value="newmail">newmail</option>
            <option value="newsflash">newsflash</option>
            <option value="noir">noir</option>
            <option value="paymentsuccess">paymentsuccess</option>
            <option value="shake">shake</option>
            <option value="sherwoodforest">sherwoodforest</option>
            <option value="silence">silence</option>
            <option value="spell">spell</option>
            <option value="suspense">suspense</option>
            <option value="telegraph">telegraph</option>
            <option value="tiptoes">tiptoes</option>
            <option value="typewriters">typewriters</option>
            <option value="update">update</option>
        </select>
    </div>
    <div class="mb-3">
        <div class="form-check form-switch">
            <input v-model="$parent.notification.barkIsArchive" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="Bark IsArchive">{{ $t("Auto Save Notification") }}</label>
        </div>

        <div class="form-text">
            {{ $t("Auto Save Notification Description") }}
        </div>
    </div>
    <div class="mb-3">
        <div class="form-check form-switch">
            <input v-model="$parent.notification.barkLevel" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="Bark Level">{{ $t("Important Alert") }}</label>
        </div>

        <div class="form-text">
            {{ $t("Important Alert Description") }}
        </div>

        <div v-if="$parent.notification.barkLevel" class="mt-2">
            <label for="Bark Volume" class="form-label">{{ $t("Alert Volume") }}: {{ $parent.notification.barkVolume ?? 5 }}</label>
            <input
                id="Bark Volume"
                v-model.number="$parent.notification.barkVolume"
                type="range"
                class="form-range"
                min="0"
                max="10"
                step="1"
            >
        </div>
    </div>
    <div class="mb-3">
        <div class="form-check form-switch">
            <input v-model="$parent.notification.barkContinuousSound" class="form-check-input" type="checkbox">
            <label class="form-check-label" for="Bark ContinuousSound">{{ $t("Continuous Ring") }}</label>
        </div>

        <div class="form-text">
            {{ $t("Continuous Ring Description") }}
        </div>
    </div>
    <div class="mb-3">
        <label for="Bark Icon URL" class="form-label">{{ $t("Custom Icon URL") }}</label>
        <input id="Bark Icon URL" v-model="$parent.notification.barkIconUrl" type="url" class="form-control">
    </div>
</template>

<script>
export default {
    created() {
        if (!this.$parent.notification.barkSound) {
            this.$parent.notification.barkSound = "";
        }
    }
};
</script>

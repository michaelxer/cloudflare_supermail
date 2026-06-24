<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useScopedI18n } from '@/i18n/app'

import { useGlobalState } from '../../store'
import { api } from '../../api'
import AddressCredentialModal from '../../components/AddressCredentialModal.vue'

const {
    loading, openSettings,
} = useGlobalState()
const message = useMessage()

const { t } = useScopedI18n('views.admin.CreateAccount')

const enablePrefix = ref(false)
const enableRandomSubdomain = ref(false)
const emailName = ref("")
const emailDomain = ref("")
const showReultModal = ref(false)
const result = ref("")
const addressPassword = ref("")
const createdAddress = ref("")
const generateNameLoading = ref(false)

const addressRegex = computed(() => {
    try {
        if (openSettings.value.addressRegex) {
            return new RegExp(openSettings.value.addressRegex, 'g');
        }
    } catch (e) { /* ignore */ }
    return /[^a-z0-9]/g;
});

const canUseRandomSubdomain = computed(() => {
    if (!emailDomain.value) {
        return false
    }
    return (openSettings.value.randomSubdomainDomains || []).includes(emailDomain.value)
})

watch(canUseRandomSubdomain, (enabled) => {
    if (!enabled) {
        enableRandomSubdomain.value = false
    }
})

const generateName = async () => {
    try {
        generateNameLoading.value = true;
        const { faker } = await import('https://esm.sh/@faker-js/faker');
        const first = faker.person.firstName().toLowerCase();
        const last = faker.person.lastName().toLowerCase();
        let name = (first + last).replace(addressRegex.value, '');
        if (openSettings.value.maxAddressLen && name.length > openSettings.value.maxAddressLen) {
            name = name.slice(0, openSettings.value.maxAddressLen);
        }
        emailName.value = name;
    } catch (error) {
        message.error(error.message || "error");
    } finally {
        generateNameLoading.value = false;
    }
};

const newEmail = async () => {
    if (!emailDomain.value) {
        message.error(t('fillInAllFields'))
        return
    }
    try {
        const res = await api.fetch(`/admin/new_address`, {
            method: 'POST',
            body: JSON.stringify({
                enablePrefix: enablePrefix.value,
                enableRandomSubdomain: enableRandomSubdomain.value,
                name: emailName.value,
                domain: emailDomain.value,
            })
        })
        result.value = res["jwt"];
        addressPassword.value = res["password"] || '';
        createdAddress.value = res["address"] || '';
        message.success(t('successTip'))
        showReultModal.value = true
        emailName.value = ''
    } catch (error) {
        message.error(error.message || "error");
    }
}

onMounted(async () => {
    emailDomain.value = openSettings.value.domains?.[0]?.value || ""
})
</script>

<template>
    <div class="center">
        <AddressCredentialModal v-model:show="showReultModal" :address="createdAddress" :jwt="result"
            :address-password="addressPassword" />
        <n-card :bordered="false" embedded style="max-width: 600px; width: 100%;">
            <div class="form-layout">
                <div class="left-col">
                    <n-form-item-row v-if="openSettings.prefix" :label="t('enablePrefix')">
                        <n-switch v-model:value="enablePrefix" :round="false" />
                    </n-form-item-row>
                    <n-button :loading="generateNameLoading" @click="generateName" style="margin-bottom: 10px;">
                        Generate Fake Name
                    </n-button>
                </div>
                <div class="right-col hint-text">
                    <p>Please input the email you want to use. only allow: [^a-z0-9]</p>
                    <p>Leaving it blank will generate a random email address.</p>
                    <p>You can choose a domain from the dropdown list.</p>
                </div>
            </div>
            <n-form-item-row :label="t('address')">
                <n-input-group>
                    <n-input-group-label v-if="enablePrefix && openSettings.prefix">
                        {{ openSettings.prefix }}
                    </n-input-group-label>
                    <n-input v-model:value="emailName" placeholder="Please Input" />
                    <n-input-group-label>@</n-input-group-label>
                    <n-select v-model:value="emailDomain" :consistent-menu-width="false"
                        :options="openSettings.domains" />
                </n-input-group>
            </n-form-item-row>
            <n-form-item-row v-if="canUseRandomSubdomain">
                <n-checkbox v-model:checked="enableRandomSubdomain">
                    {{ t('enableRandomSubdomain') }}
                </n-checkbox>
                <p style="margin: 8px 0 0; opacity: 0.75;">
                    {{ t('randomSubdomainTip') }}
                </p>
            </n-form-item-row>
            <n-button @click="newEmail" type="primary" block :loading="loading">
                {{ t('creatNewEmail') }}
            </n-button>
        </n-card>
    </div>
</template>

<style scoped>
.center {
    display: flex;
    text-align: left;
    place-items: center;
    justify-content: center;
    margin: 20px;
}

.form-layout {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
    align-items: flex-start;
}

.left-col {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
}

.right-col.hint-text {
    flex: 1;
    font-size: 13px;
    opacity: 0.75;
    line-height: 1.6;
}

.right-col.hint-text p {
    margin: 0 0 4px 0;
}
</style>

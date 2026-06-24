<script setup>
import { computed, onMounted, ref, h } from 'vue';
import { NInput, NSelect, NButton } from 'naive-ui';
import { useGlobalState } from '../../store'
import { api } from '../../api'

const { loading, openSettings } = useGlobalState()
const message = useMessage()

const enablePrefix = ref(false)
const bulkCount = ref(5)
const emailDomain = ref("")
const bulkList = ref([]) // [{ name, domain }]
const creatingProgress = ref(0)
const creatingTotal = ref(0)
const isCreating = ref(false)
const createdResults = ref([]) // [{ address, jwt }]
const showResults = ref(false)
const generateNameLoading = ref(false)

const addressRegex = computed(() => {
    try {
        if (openSettings.value.addressRegex) {
            return new RegExp(openSettings.value.addressRegex, 'g');
        }
    } catch (e) { /* ignore */ }
    return /[^a-z0-9]/g;
});

const domainOptions = computed(() => openSettings.value.domains || [])

// Fetch existing addresses to avoid duplicates
const fetchExistingNames = async () => {
    try {
        const { results } = await api.fetch(`/admin/address?limit=1000&offset=0`)
        return new Set(results.map(r => r.name))
    } catch (e) {
        return new Set()
    }
}

const generateFakeName = (faker, existingNames, usedNames) => {
    let attempts = 0
    while (attempts < 30) {
        const first = faker.person.firstName().toLowerCase()
        const last = faker.person.lastName().toLowerCase()
        let name = (first + last).replace(addressRegex.value, '')
        if (openSettings.value.maxAddressLen && name.length > openSettings.value.maxAddressLen) {
            name = name.slice(0, openSettings.value.maxAddressLen)
        }
        if (name && !existingNames.has(name) && !usedNames.has(name)) {
            return name
        }
        attempts++
    }
    const base = faker.person.firstName().toLowerCase().replace(addressRegex.value, '')
    return base + Math.floor(Math.random() * 9000 + 1000)
}

const generateBulkNames = async () => {
    const count = parseInt(bulkCount.value) || 1
    if (count < 1 || count > 200) {
        message.error('Please enter a number between 1 and 200')
        return
    }
    try {
        generateNameLoading.value = true
        const { faker } = await import('https://esm.sh/@faker-js/faker')
        const existingNames = await fetchExistingNames()
        const usedNames = new Set()
        const domain = emailDomain.value || domainOptions.value?.[0]?.value || ''
        const list = []
        for (let i = 0; i < count; i++) {
            const name = generateFakeName(faker, existingNames, usedNames)
            usedNames.add(name)
            list.push({ name, domain })
        }
        bulkList.value = list
    } catch (error) {
        message.error(error.message || 'error')
    } finally {
        generateNameLoading.value = false
    }
}

const removeBulkRow = (index) => {
    bulkList.value.splice(index, 1)
}

const createBulkEmails = async () => {
    if (bulkList.value.length === 0) {
        message.error('Please generate names first')
        return
    }
    isCreating.value = true
    creatingTotal.value = bulkList.value.length
    creatingProgress.value = 0
    createdResults.value = []

    for (let i = 0; i < bulkList.value.length; i++) {
        const row = bulkList.value[i]
        try {
            const res = await api.fetch(`/admin/new_address`, {
                method: 'POST',
                body: JSON.stringify({
                    enablePrefix: enablePrefix.value,
                    enableRandomSubdomain: false,
                    name: row.name,
                    domain: row.domain,
                })
            })
            createdResults.value.push({
                address: res['address'] || `${row.name}@${row.domain}`,
                jwt: res['jwt'] || ''
            })
        } catch (error) {
            createdResults.value.push({
                address: `${row.name}@${row.domain}`,
                jwt: `ERROR: ${error.message}`
            })
        }
        creatingProgress.value = i + 1
    }

    isCreating.value = false
    bulkList.value = []
    showResults.value = true
    message.success(`Created ${createdResults.value.length} email addresses`)
}

const copyAllWithJwt = () => {
    const lines = createdResults.value.flatMap(r => [r.address, r.jwt])
    navigator.clipboard.writeText(lines.join('\n'))
    message.success('Copied all addresses and JWTs to clipboard')
}

const copyJustEmails = () => {
    const text = createdResults.value.map(r => r.address).join('\n')
    navigator.clipboard.writeText(text)
    message.success('Copied all addresses to clipboard')
}

const copyJustJwts = () => {
    const text = createdResults.value.map(r => r.jwt).join('\n')
    navigator.clipboard.writeText(text)
    message.success('Copied all JWTs to clipboard')
}

const bulkColumns = computed(() => [
    {
        title: '#',
        key: 'index',
        width: 50,
        render: (_, index) => index + 1
    },
    {
        title: 'Name',
        key: 'name',
        render: (row, index) => h(NInput, {
            value: row.name,
            size: 'small',
            onUpdateValue: (val) => {
                bulkList.value[index].name = val.replace(addressRegex.value, '').toLowerCase()
            }
        })
    },
    {
        title: 'Domain',
        key: 'domain',
        width: 220,
        render: (row, index) => h(NSelect, {
            value: row.domain,
            options: domainOptions.value,
            consistentMenuWidth: false,
            size: 'small',
            onUpdateValue: (val) => {
                bulkList.value[index].domain = val
            }
        })
    },
    {
        title: 'Action',
        key: 'action',
        width: 80,
        render: (_, index) => h(NButton, {
            size: 'small',
            tertiary: true,
            type: 'error',
            onClick: () => removeBulkRow(index)
        }, { default: () => 'Remove' })
    }
])

const resultColumns = [
    { title: 'Address', key: 'address', width: 260 },
    { title: 'JWT', key: 'jwt', ellipsis: { tooltip: true } }
]

onMounted(async () => {
    emailDomain.value = domainOptions.value?.[0]?.value || ''
})
</script>

<template>
    <div class="bulk-create">
        <n-card :bordered="false" embedded>
            <!-- Controls row -->
            <n-space align="center" style="margin-bottom: 12px; flex-wrap: wrap;">
                <n-form-item-row v-if="openSettings.prefix" label="If enable Prefix" style="margin-bottom: 0;">
                    <n-switch v-model:value="enablePrefix" :round="false" />
                </n-form-item-row>

                <n-input-number
                    v-model:value="bulkCount"
                    :min="1"
                    :max="200"
                    placeholder="Count"
                    style="width: 120px;"
                />

                <n-button
                    :loading="generateNameLoading"
                    @click="generateBulkNames"
                    type="default"
                >
                    Generate Bulk Fake Names
                </n-button>
            </n-space>

            <!-- Bulk list table -->
            <div v-if="bulkList.length > 0">
                <n-data-table
                    :columns="bulkColumns"
                    :data="bulkList"
                    :bordered="true"
                    size="small"
                    style="margin-bottom: 12px;"
                />
                <n-button
                    type="primary"
                    block
                    :loading="isCreating"
                    @click="createBulkEmails"
                >
                    Create {{ bulkList.length }} New Bulk Email{{ bulkList.length > 1 ? 's' : '' }}
                </n-button>
            </div>

            <!-- Progress -->
            <div v-if="isCreating" style="margin-top: 12px;">
                <n-progress
                    type="line"
                    :percentage="Math.floor(creatingProgress / creatingTotal * 100)"
                    indicator-placement="inside"
                />
                <p style="text-align: center; opacity: 0.75;">{{ creatingProgress }} / {{ creatingTotal }}</p>
            </div>

            <!-- Results -->
            <div v-if="showResults && createdResults.length > 0" style="margin-top: 16px;">
                <n-space justify="space-between" align="center" style="margin-bottom: 8px;">
                    <span style="font-weight: 600;">Created {{ createdResults.length }} addresses</span>
                    <n-space>
                        <n-button size="small" type="default" tertiary @click="copyJustEmails">
                            Copy Emails Only
                        </n-button>
                        <n-button size="small" type="default" tertiary @click="copyJustJwts">
                            Copy JWTs Only
                        </n-button>
                        <n-button size="small" type="info" @click="copyAllWithJwt">
                            Copy All (address + JWT)
                        </n-button>
                    </n-space>
                </n-space>
                <n-data-table
                    :columns="resultColumns"
                    :data="createdResults"
                    :bordered="true"
                    size="small"
                    max-height="400"
                />
            </div>
        </n-card>
    </div>
</template>

<style scoped>
.bulk-create {
    margin: 10px 0;
}
</style>

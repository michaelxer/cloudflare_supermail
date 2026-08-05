<script setup>
import { ref, computed } from 'vue';
import { useScopedI18n } from '@/i18n/app';
import { useGlobalState } from '../../store';

const { t } = useScopedI18n('views.admin.MailApi');

const { adminAuth } = useGlobalState();

// Live endpoints data
const liveEndpoints = computed(() => [
  {
    method: 'POST',
    path: '/admin/new_address',
    status: 'live',
    auth: 'x-admin-auth',
    description: t('endpointCreateDesc'),
    curl: `curl -X POST https://production.supermail-5oe.pages.dev/admin/new_address \\
  -H "x-admin-auth: <ADMIN_PASSWORD>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"grokabc123def","domain":"savelokal.my.id","enablePrefix":false,"enableRandomSubdomain":false}'`,
    request: {
      name: 'grokabc123def',
      domain: 'savelokal.my.id',
      enablePrefix: false,
      enableRandomSubdomain: false,
    },
    response: {
      jwt: 'eyJ...',
      address: 'grokabc123def@savelokal.my.id',
      password: null,
      address_id: 1234,
    },
    notes: t('endpointCreateNotes'),
  },
  {
    method: 'GET',
    path: '/api/parsed_mails?limit=20&offset=0',
    status: 'live',
    auth: 'Bearer JWT',
    description: t('endpointReadDesc'),
    curl: `curl https://production.supermail-5oe.pages.dev/api/parsed_mails?limit=20&offset=0 \\
  -H "Authorization: Bearer <jwt>"`,
    request: null,
    response: {
      results: [
        {
          id: 5678,
          address: 'grokabc123def@savelokal.my.id',
          sender: 'no-reply@x.ai',
          subject: 'Your xAI verification code',
          text: 'Your verification code is 482-915. ...',
          html: '<html>...',
          attachments: [],
          created_at: '2026-08-05T...',
        },
      ],
      count: 1,
    },
    notes: t('endpointReadNotes'),
  },
  {
    method: 'DELETE',
    path: '/admin/delete_address/:id',
    status: 'live',
    auth: 'x-admin-auth',
    description: t('endpointDeleteDesc'),
    curl: `curl -X DELETE https://production.supermail-5oe.pages.dev/admin/delete_address/1234 \\
  -H "x-admin-auth: <ADMIN_PASSWORD>"`,
    request: null,
    response: { success: true },
    notes: t('endpointDeleteNotes'),
  },
]);

const plannedEndpoints = computed(() => [
  {
    priority: 'HIGH',
    name: t('plannedBulkCreate'),
    endpoint: 'POST /admin/bulk_new_address',
    loc: '~40',
    blocks: t('no'),
  },
  {
    priority: 'HIGH',
    name: t('plannedSenderFilter'),
    endpoint: 'GET /api/parsed_mails?sender=x.ai',
    loc: '~10',
    blocks: t('no'),
  },
  {
    priority: 'MEDIUM',
    name: t('plannedWebhookPush'),
    endpoint: 'POST /admin/new_address (accepts webhook_url)',
    loc: '~15',
    blocks: t('no'),
  },
  {
    priority: 'LOW',
    name: t('plannedDeleteByName'),
    endpoint: 'DELETE /admin/delete_address/:idorName',
    loc: '~5',
    blocks: t('no'),
  },
  {
    priority: 'LOW',
    name: t('plannedListDomains'),
    endpoint: 'GET /api/domains',
    loc: '~3',
    blocks: t('no'),
  },
]);

const domains = [
  'savelokal.my.id',
  'belajarbersama.web.id',
  'kitabisama.my.id',
  'andalanusaha.biz.id',
  'worldwide.web.id',
  'beranibelajar.biz.id',
];

const rateLimits = [
  { service: 'Workers', limit: '100,000 requests/day' },
  { service: 'D1 Database', limit: '5 GB storage' },
  { service: 'KV Storage', limit: '1 GB' },
  { service: 'R2 Storage', limit: '10 GB (no egress fees)' },
  { service: 'Email Receiving', limit: 'Unlimited' },
  { service: 'Email Sending', limit: '100/day' },
];

const antiPatterns = computed(() => [
  t('antiPatternTurnstile'),
  t('antiPatternPassword'),
  t('antiPatternJwt'),
  t('antiPatternShape'),
]);

// Snippet tabs
const snippetTab = ref('curl');

const curlSnippet = `# 1. Create address (returns JWT inline)
curl -X POST https://production.supermail-5oe.pages.dev/admin/new_address \\
  -H "x-admin-auth: <ADMIN_PASSWORD>" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"grokabc123def","domain":"savelokal.my.id","enablePrefix":false,"enableRandomSubdomain":false}'

# Response: {"jwt":"eyJ...","address":"grokabc123def@savelokal.my.id","address_id":1234}

# 2. Poll for parsed mails (use JWT from step 1)
curl "https://production.supermail-5oe.pages.dev/api/parsed_mails?limit=20&offset=0" \\
  -H "Authorization: Bearer eyJ..."

# 3. Delete address when done
curl -X DELETE https://production.supermail-5oe.pages.dev/admin/delete_address/1234 \\
  -H "x-admin-auth: <ADMIN_PASSWORD>"`;

const pythonSnippet = `import requests

BASE = "https://production.supermail-5oe.pages.dev"
ADMIN_PASSWORD = "<ADMIN_PASSWORD>"

# 1. Create address
resp = requests.post(
    f"{BASE}/admin/new_address",
    headers={"x-admin-auth": ADMIN_PASSWORD, "Content-Type": "application/json"},
    json={"name": "grokabc123def", "domain": "savelokal.my.id",
          "enablePrefix": False, "enableRandomSubdomain": False},
)
data = resp.json()
jwt = data["jwt"]
address = data["address"]
address_id = data["address_id"]

# 2. Poll for parsed mails
import time
for _ in range(20):
    mails = requests.get(
        f"{BASE}/api/parsed_mails?limit=20&offset=0",
        headers={"Authorization": f"Bearer {jwt}"},
    ).json()
    if mails["results"]:
        # Extract OTP from text field (already MIME-parsed server-side)
        import re
        match = re.search(r"\\b\\d{3}-\\d{3}\\b", mails["results"][0]["text"])
        if match:
            otp = match.group(0)
            print(f"OTP: {otp}")
            break
    time.sleep(3)

# 3. Delete address
requests.delete(
    f"{BASE}/admin/delete_address/{address_id}",
    headers={"x-admin-auth": ADMIN_PASSWORD},
)`;

const jsSnippet = `const BASE = "https://production.supermail-5oe.pages.dev";
const ADMIN_PASSWORD = "<ADMIN_PASSWORD>";

// 1. Create address
const createResp = await fetch(\`\${BASE}/admin/new_address\`, {
  method: "POST",
  headers: {
    "x-admin-auth": ADMIN_PASSWORD,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "grokabc123def",
    domain: "savelokal.my.id",
    enablePrefix: false,
    enableRandomSubdomain: false,
  }),
});
const { jwt, address, address_id } = await createResp.json();

// 2. Poll for parsed mails
for (let i = 0; i < 20; i++) {
  const mailResp = await fetch(
    \`\${BASE}/api/parsed_mails?limit=20&offset=0\`,
    { headers: { Authorization: \`Bearer \${jwt}\` } }
  );
  const { results } = await mailResp.json();
  if (results.length > 0) {
    const match = /\\b\\d{3}-\\d{3}\\b/.exec(results[0].text);
    if (match) {
      console.log("OTP:", match[0]);
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 3000));
}

// 3. Delete address
await fetch(\`\${BASE}/admin/delete_address/\${address_id}\`, {
  method: "DELETE",
  headers: { "x-admin-auth": ADMIN_PASSWORD },
});`;

const snippetMap = computed(() => ({
  curl: curlSnippet,
  python: pythonSnippet,
  javascript: jsSnippet,
}));

// Admin password reveal state
const showAdminPassword = ref(false);
const adminPasswordValue = computed(() => adminAuth.value || t('placeholderPassword'));

// Copy logic
const message = useMessage();
const copyToClipboard = async (text, label = '') => {
  try {
    await navigator.clipboard.writeText(text);
    message.success(label ? `${label} ${t('copySuccess')}` : t('copySuccess'));
  } catch (e) {
    message.error(t('copyFailed'));
  }
};

const copyAllDomains = () => {
  copyToClipboard(domains.join('\n'), t('domains'));
};

// JSON pretty print helper
const formatJson = (obj) => {
  if (obj === null) return 'null';
  return JSON.stringify(obj, null, 2);
};
</script>

<template>
  <div class="mail-api-container">
    <!-- Header / intro -->
    <n-card :bordered="false" embedded class="section-card">
      <n-space align="center" justify="space-between">
        <n-space vertical :size="4">
          <n-text strong style="font-size: 18px">{{ t('title') }}</n-text>
          <n-text depth="3">{{ t('subtitle') }}</n-text>
        </n-space>
        <n-tag type="info" size="large" round>{{ t('versionTag') }}</n-tag>
      </n-space>
      <n-divider />
      <n-text>{{ t('intro') }}</n-text>
    </n-card>

    <!-- Authentication -->
    <n-card :bordered="false" embedded class="section-card" :title="t('authTitle')">
      <n-space vertical :size="16">
        <!-- Admin auth -->
        <div>
          <n-text strong>{{ t('adminAuthLabel') }}</n-text>
          <n-text depth="3" style="margin-left: 8px">{{ t('adminAuthScope') }}</n-text>
          <n-space align="center" style="margin-top: 8px">
            <n-input
              :value="adminPasswordValue"
              :type="showAdminPassword ? 'text' : 'password'"
              readonly
              style="max-width: 320px; font-family: monospace"
            >
              <template #suffix>
                <n-button text @click="showAdminPassword = !showAdminPassword">
                  {{ showAdminPassword ? t('hide') : t('reveal') }}
                </n-button>
              </template>
            </n-input>
            <n-button
              @click="copyToClipboard(adminPasswordValue, t('adminPassword'))"
              size="small"
              type="primary"
              tertiary
            >
              {{ t('copy') }}
            </n-button>
          </n-space>
          <n-text depth="3" style="display: block; margin-top: 4px; font-size: 12px">
            {{ t('adminAuthUsage') }}
          </n-text>
        </div>

        <!-- JWT auth -->
        <div>
          <n-text strong>{{ t('jwtAuthLabel') }}</n-text>
          <n-text depth="3" style="margin-left: 8px">{{ t('jwtAuthScope') }}</n-text>
          <n-text style="display: block; margin-top: 8px; font-family: monospace; font-size: 13px">
            Authorization: Bearer &lt;jwt&gt;
          </n-text>
          <n-alert type="info" :bordered="false" style="margin-top: 8px">
            {{ t('jwtAuthUsage') }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

    <!-- Live endpoints -->
    <n-card :bordered="false" embedded class="section-card" :title="t('liveEndpointsTitle')">
      <n-space vertical :size="20">
        <div v-for="(ep, idx) in liveEndpoints" :key="idx" class="endpoint-block">
          <!-- Method + path + status -->
          <n-space align="center" :size="8">
            <n-tag
              :type="ep.method === 'GET' ? 'success' : ep.method === 'POST' ? 'info' : 'error'"
              size="small"
              style="font-family: monospace; font-weight: 600"
            >
              {{ ep.method }}
            </n-tag>
            <n-text code style="font-size: 13px">{{ ep.path }}</n-text>
            <n-tag type="success" size="small" round>{{ t('statusLive') }}</n-tag>
            <n-text depth="3" style="font-size: 12px">Auth: {{ ep.auth }}</n-text>
          </n-space>
          <n-text style="display: block; margin: 8px 0">{{ ep.description }}</n-text>

          <!-- curl example -->
          <n-space align="center" :size="4" style="margin-top: 4px">
            <n-text depth="3" style="font-size: 12px">{{ t('curlExample') }}</n-text>
            <n-button text size="tiny" @click="copyToClipboard(ep.curl, t('curlExample'))">
              {{ t('copy') }}
            </n-button>
          </n-space>
          <n-code :code="ep.curl" language="bash" word-wrap />

          <!-- Request body -->
          <template v-if="ep.request">
            <n-text depth="3" style="display: block; margin-top: 12px; font-size: 12px">
              {{ t('requestBody') }}
            </n-text>
            <n-code :code="formatJson(ep.request)" language="json" word-wrap />
          </template>

          <!-- Response -->
          <n-text depth="3" style="display: block; margin-top: 12px; font-size: 12px">
            {{ t('responseBody') }}
          </n-text>
          <n-code :code="formatJson(ep.response)" language="json" word-wrap />

          <!-- Notes -->
          <n-alert type="info" :bordered="false" style="margin-top: 8px">
            {{ ep.notes }}
          </n-alert>
        </div>
      </n-space>
    </n-card>

    <!-- Planned endpoints -->
    <n-card :bordered="false" embedded class="section-card" :title="t('plannedEndpointsTitle')">
      <n-text depth="3" style="display: block; margin-bottom: 12px">
        {{ t('plannedEndpointsDesc') }}
      </n-text>
      <n-data-table
        :columns="[
          { title: t('colPriority'), key: 'priority', width: 90 },
          { title: t('colFeature'), key: 'name' },
          { title: t('colEndpoint'), key: 'endpoint' },
          { title: t('colEstLoc'), key: 'loc', width: 80 },
          { title: t('colBlocks'), key: 'blocks', width: 90 },
        ]"
        :data="plannedEndpoints"
        :bordered="false"
        size="small"
      >
        <template #empty>
          <n-text depth="3">{{ t('noData') }}</n-text>
        </template>
      </n-data-table>
    </n-card>

    <!-- Code snippets -->
    <n-card :bordered="false" embedded class="section-card" :title="t('snippetsTitle')">
      <n-text depth="3" style="display: block; margin-bottom: 12px">
        {{ t('snippetsDesc') }}
      </n-text>
      <n-tabs v-model:value="snippetTab" type="bar" justify-content="start" animated>
        <n-tab-pane name="curl" tab="curl">
          <n-space justify="end" style="margin-bottom: 4px">
            <n-button
              size="small"
              tertiary
              @click="copyToClipboard(curlSnippet, 'curl')"
            >
              {{ t('copy') }}
            </n-button>
          </n-space>
          <n-code :code="curlSnippet" language="bash" word-wrap />
        </n-tab-pane>
        <n-tab-pane name="python" tab="Python (requests)">
          <n-space justify="end" style="margin-bottom: 4px">
            <n-button
              size="small"
              tertiary
              @click="copyToClipboard(pythonSnippet, 'Python')"
            >
              {{ t('copy') }}
            </n-button>
          </n-space>
          <n-code :code="pythonSnippet" language="python" word-wrap />
        </n-tab-pane>
        <n-tab-pane name="javascript" tab="JavaScript (fetch)">
          <n-space justify="end" style="margin-bottom: 4px">
            <n-button
              size="small"
              tertiary
              @click="copyToClipboard(jsSnippet, 'JavaScript')"
            >
              {{ t('copy') }}
            </n-button>
          </n-space>
          <n-code :code="jsSnippet" language="javascript" word-wrap />
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- Anti-patterns -->
    <n-card :bordered="false" embedded class="section-card" :title="t('antiPatternsTitle')">
      <n-text depth="3" style="display: block; margin-bottom: 12px">
        {{ t('antiPatternsDesc') }}
      </n-text>
      <n-space vertical :size="8">
        <n-alert
          v-for="(ap, idx) in antiPatterns"
          :key="idx"
          type="warning"
          :bordered="false"
          :show-icon="true"
        >
          {{ ap }}
        </n-alert>
      </n-space>
    </n-card>

    <!-- Active domains -->
    <n-card :bordered="false" embedded class="section-card" :title="t('domainsTitle')">
      <n-space justify="end" style="margin-bottom: 12px">
        <n-button size="small" tertiary @click="copyAllDomains">
          {{ t('copyAll') }}
        </n-button>
      </n-space>
      <n-space vertical :size="6">
        <n-space
          v-for="d in domains"
          :key="d"
          align="center"
          justify="space-between"
        >
          <n-text code style="font-size: 13px">{{ d }}</n-text>
          <n-button text size="tiny" @click="copyToClipboard(d, t('domain'))">
            {{ t('copy') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>

    <!-- Rate limits -->
    <n-card :bordered="false" embedded class="section-card" :title="t('rateLimitsTitle')">
      <n-data-table
        :columns="[
          { title: t('colService'), key: 'service' },
          { title: t('colLimit'), key: 'limit' },
        ]"
        :data="rateLimits"
        :bordered="false"
        size="small"
      />
    </n-card>

    <!-- Integration context -->
    <n-card :bordered="false" embedded class="section-card" :title="t('integrationTitle')">
      <n-descriptions label-placement="left" :column="1" bordered size="small">
        <n-descriptions-item :label="t('intProdUrl')">
          <n-text code>https://production.supermail-5oe.pages.dev</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('intSourcePath')">
          <n-text code>D:\CODING PROJECT\cloudflare email\cloudflare_supermail</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('intVerifiedConfig')">
          <n-space vertical :size="2">
            <n-text>ENABLE_ADDRESS_PASSWORD = false</n-text>
            <n-text>ADMIN_PASSWORDS = ["mike020390"]</n-text>
            <n-text>No Turnstile, No global password</n-text>
            <n-text>6 domains configured</n-text>
          </n-space>
        </n-descriptions-item>
        <n-descriptions-item :label="t('intConsumerProject')">
          <n-text>etteum-pool (private) — Grok/xAI account farmer</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('intSpecDoc')">
          <n-text code>HANDOFF_DOC/SUPERMAIL-API-REQUIREMENTS.md</n-text>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>
  </div>
</template>

<style scoped>
.mail-api-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 0;
}
.section-card {
  margin-bottom: 20px;
}
.endpoint-block {
  padding: 12px;
  border: 1px solid var(--n-border-color, rgba(255, 255, 255, 0.09));
  border-radius: 8px;
}
</style>

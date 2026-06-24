<script setup>
import { GithubAlt } from '@vicons/fa'
import { useGlobalState } from '../../store'
const { announcement } = useGlobalState()
</script>

<template>
    <div class="about-container">
        <n-card :bordered="false" embedded class="about-card">
            <div v-if="announcement" v-html="announcement" class="announcement"></div>
            
            <div class="hero-section">
                <h1 class="hero-title">📧 Cloudflare SuperMail</h1>
                <p class="hero-subtitle">More than just temporary email — your complete privacy-first mail solution</p>
            </div>

            <n-divider />

            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">🚀</div>
                    <div class="feature-title">Lightning Fast</div>
                    <div class="feature-desc">Powered by Cloudflare's global edge network</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🔒</div>
                    <div class="feature-title">Privacy First</div>
                    <div class="feature-desc">No tracking, no ads, your data stays yours</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📤</div>
                    <div class="feature-title">Send & Receive</div>
                    <div class="feature-desc">Full email capabilities, not just receiving</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🤖</div>
                    <div class="feature-title">Telegram Integration</div>
                    <div class="feature-desc">Get instant notifications on your phone</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📦</div>
                    <div class="feature-title">Bulk Operations</div>
                    <div class="feature-desc">Create and manage multiple addresses at once</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💾</div>
                    <div class="feature-title">Export & Backup</div>
                    <div class="feature-desc">Download emails as EML, CSV, or JSON</div>
                </div>
            </div>

            <n-divider />

            <div class="actions">
                <n-button tag="a" target="_blank" href="https://github.com/michaelxer/cloudflare_supermail" type="primary" size="large">
                    <template #icon>
                        <n-icon :component="GithubAlt" />
                    </template>
                    View on GitHub
                </n-button>
            </div>
        </n-card>
    </div>
</template>

<style scoped>
.about-container {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.about-card {
    max-width: 800px;
    width: 100%;
}

.announcement {
    margin-bottom: 20px;
    padding: 12px;
    background: rgba(0, 120, 212, 0.1);
    border-radius: 8px;
}

.hero-section {
    text-align: center;
    padding: 20px 0;
}

.hero-title {
    font-size: 2em;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.1em;
    color: #666;
    margin: 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px 0;
}

.feature-item {
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.02);
    transition: transform 0.2s, box-shadow 0.2s;
}

.feature-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    font-size: 2em;
    margin-bottom: 10px;
}

.feature-title {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 1.1em;
}

.feature-desc {
    font-size: 0.9em;
    color: #666;
}

.actions {
    text-align: center;
    padding: 20px 0;
}
</style>

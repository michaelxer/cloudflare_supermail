<script setup>
import { GithubAlt } from '@vicons/fa'
import { useGlobalState } from '../../store'
const { announcement } = useGlobalState()
</script>

<template>
    <div class="center">
        <n-card :bordered="false" embedded>
            <div v-html="announcement"></div>
            <n-button tag="a" target="_blank" href="https://github.com/michaelxer/cloudflare_supermail">
                <template #icon>
                    <n-icon :component="GithubAlt" />
                </template>
                Github
            </n-button>
        </n-card>
    </div>
</template>

<style scoped>
.center {
    display: flex;
    justify-content: center;
}

.n-card {
    max-width: 800px;
}

.n-button {
    margin-top: 10px;
    margin-left: 10px;
}
</style>

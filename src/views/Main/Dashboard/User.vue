<template>
    <div class="w-full h-full flex items-center justify-center">
        <div>
            user
            <div>
                <button @click="signout">dang xuat</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { signout } from '@/service/helper/oauth'
</script>
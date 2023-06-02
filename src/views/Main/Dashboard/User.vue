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
import { useRouter } from 'vue-router'

const $router = useRouter()
function signout() {
    localStorage.clear()

    $router.push('/oauth')
}
</script>
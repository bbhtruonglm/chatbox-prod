<template>
  <ul>
    <li
      v-for="index in 10"
      class="flex items-center w-full group rounded-xl p-2 gap-3 animate-pulse"
    >
      <div class="relative flex-shrink-0">
        <div class="overflow-hidden bg-slate-200 rounded-oval w-10 h-10"></div>
      </div>
      <div class="flex flex-col gap-1 flex-grow min-w-0">
        <div class="w-24 h-3 rounded-full bg-slate-200"></div>
        <div class="flex justify-between items-end">
          <div class="w-44 h-2 rounded-full bg-slate-200"></div>
          <ul class="flex gap-2">
            <li v-for="index in 3" class="w-3 h-3 rounded-full bg-slate-200"></li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts"></script>

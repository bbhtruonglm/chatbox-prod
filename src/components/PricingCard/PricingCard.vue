<template>
  <div
    class="relative flex flex-col rounded-2xl p-5 gap-3 cursor-pointer transition-all duration-200"
    :class="[
      selected
        ? 'bg-cyan-50 border-cyan-700 border-2 shadow-md'
        : 'bg-white border-gray-300 border-2',
    ]"
    @click="onSelect"
  >
    <div
      v-if="is_popular"
      class="absolute flex justify-center items-center text-sm font-semibold text-white -top-5 left-0 z-10 h-9 rounded-t-lg bg-cyan-700 w-full"
    >
      Most Popular
    </div>
    <div class="pb-10">
      <!-- Title + price -->
      <div class="flex items-center gap-2">
        <div
          class="flex size-6 rounded-full justify-center items-center"
          :class="[selected ? 'bg-green-600' : 'bg-gray-400']"
        >
          <div
            class="flex bg-white rounded-full justify-center items-center"
            :class="[selected ? 'bg-green-600' : 'bg-gray-400']"
          >
            <CheckCircleIcon
              class="size-5 text-green-600"
              :class="[!selected ? 'text-white' : '']"
            />
          </div>
        </div>
        <h2 class="text-4xl font-bold">{{ title }}</h2>
      </div>

      <div class="text-6xl font-bold">{{ price }}</div>
      <p class="text-sm text-gray-800 font-medium">
        {{ subtitle }}
      </p>
    </div>

    <!-- CTA button -->
    <button
      @click="ctaOnClick && ctaOnClick()"
      class="px-4 py-2 text-sm uppercase font-semibold rounded-md border flex items-center justify-center gap-2 w-full"
      :class="[
        selected
          ? 'bg-green-600 hover:bg-green-500 text-white'
          : 'bg-slate-100 hover:bg-slate-200 text-black',
      ]"
    >
      <EnvelopeIcon
        v-if="title === 'Enterprise'"
        class="size-5"
      />
      {{ ctaText }}
      <CheckBadgeIcon
        v-if="title === 'Free'"
        class="size-5"
      />
    </button>

    <hr class="" />

    <p class="text-sm text-gray-800 font-medium py-5">
      {{ description }}
    </p>
    <!-- Sections -->
    <div
      v-for="section in sections"
      :key="section.heading"
      class="flex flex-col gap-3"
    >
      <h3 class="font-bold uppercase text-sm">{{ section.heading }}</h3>
      <ul class="space-y-2">
        <li
          v-for="item in section.items"
          :key="item.text"
          class="flex items-start gap-2 text-sm"
          :class="
            item.enabled ? 'text-gray-800' : 'text-slate-500 line-through'
          "
        >
          <div
            v-if="item.enabled"
            class="flex size-5 bg-green-600 rounded-full justify-center items-center"
          >
            <div
              class="flex size-6.5 bg-white rounded-full justify-center items-center"
            >
              <CheckCircleIcon class="w-4 h-4 text-green-600 shrink-0" />
            </div>
          </div>

          <div
            v-else
            class="flex size-5 bg-gray-400 rounded-full justify-center items-center"
          >
            <div
              class="flex size-5.5 bg-white rounded-full justify-center items-center"
            >
              <CheckCircleIcon class="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          </div>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>

    <!-- AI features -->
    <div
      v-if="aiFeatures.length"
      class="flex flex-col gap-3"
    >
      <h3 class="font-bold uppercase text-sm">AI-Powered</h3>
      <ul class="space-y-2">
        <li
          v-for="item in aiFeatures"
          :key="item.text"
          class="flex items-start gap-2 text-sm"
          :class="item.enabled ? 'text-gray-800' : 'text-gray-400 line-through'"
        >
          <div
            v-if="item.enabled"
            class="flex size-5 bg-slate-800 rounded-full justify-center items-center"
          >
            <div
              class="flex size-6.5 bg-white rounded-full justify-center items-center"
            >
              <CheckCircleIcon class="w-4 h-4 text-slate-800 shrink-0" />
            </div>
          </div>

          <div
            v-else
            class="flex size-5 bg-gray-400 rounded-full justify-center items-center"
          >
            <div
              class="flex size-6.5 bg-white rounded-full justify-center items-center"
            >
              <CheckCircleIcon class="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          </div>
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'
import { CheckBadgeIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

// --- Types ---
type SectionItem = { text: string; enabled: boolean }
type Section = { heading: string; items: SectionItem[] }
type AIFeature = { text: string; enabled: boolean }

// --- Props with types + defaults ---
// withDefaults(defineProps<...>(), { ...defaults })
const props = withDefaults(
  defineProps<{
    title?: string
    price?: string
    subtitle?: string
    description?: string
    ctaText?: string
    ctaOnClick?: (() => void) | undefined
    is_popular?: boolean
    highlight?: boolean
    sections?: Section[]
    aiFeatures?: AIFeature[]
    selected?: boolean
    onSelect?: (() => void) | undefined
  }>(),
  {
    title: '',
    price: '',
    subtitle: '',
    description: '',
    ctaText: 'Get started',
    ctaOnClick: undefined,
    is_popular: false,
    highlight: false,
    sections: () => [],
    aiFeatures: () => [],
    selected: false,
    onSelect: undefined,
  }
)
</script>

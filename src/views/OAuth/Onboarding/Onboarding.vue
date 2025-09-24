<template>
  <div class="h-screen bg-gradient-secondary py-10 px-6 font-sans">
    <div
      class="flex max-full mx-auto shadow-sm overflow-hidden gap-2.5 flex-grow h-full min-h-0"
    >
      <!-- Left panel -->
      <aside
        class="w-96 p-5 gap-10 bg-white flex flex-col justify-between flex-grow min-h-0 h-full rounded-xl"
      >
        <div class="flex flex-col gap-10">
          <div class="flex items-start gap-3">
            <div
              class="size-8 rounded-full bg-black text-white flex items-center justify-center font-bold"
            ></div>
            <div class="text-2xl font-semibold">Retion</div>
          </div>
          <div class="flex flex-col gap-3">
            <h1 class="text-5xl leading-tight font-semibold">
              {{ $t('v1.view.onboarding.personal_experience') }}
            </h1>
            <p class="text-gray-500 text-sm font-medium">
              {{ $t('v1.view.onboarding.two_minutes') }}
            </p>
          </div>
        </div>
      </aside>

      <!-- Right panel -->
      <main
        class="flex w-full flex-grow min-h-0 h-full gap-3 px-3 py-5 rounded-xl bg-white flex-col justify-between"
      >
        <div class="flex flex-col gap-8">
          <!-- Step header -->
          <div class="flex flex-col justify-between gap-3">
            <div
              class="flex w-fit items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {{ current_step + 1 }} {{ $t('v1.view.onboarding.step_of') }}
              {{ total_steps }}
            </div>
            <div>
              <!-- Step title -->
              <h2 class="text-4xl font-bold">{{ step_title }}</h2>
              <p class="font-medium">{{ STEP_DESCRIPTIONS }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-5">
            <!-- Step content -->

            <!-- Step 1: Industry -->
            <div v-if="current_step === 0">
              <div class="grid grid-cols-3 gap-5 px-4">
                <button
                  v-for="option in OPTION_INDUSTRY"
                  :key="option"
                  :class="[
                    'border rounded-md py-3 px-5 text-center font-semibold shadow-sm',
                    SELECTED_INDUSTRY === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-500 bg-white',
                  ]"
                  @click="SELECTED_INDUSTRY = option"
                >
                  {{ option }}
                </button>
              </div>
            </div>

            <!-- Step 2: Role -->
            <div v-if="current_step === 1">
              <div class="grid grid-cols-3 gap-5 px-4">
                <button
                  v-for="option in OPTION_ROLE"
                  :key="option"
                  :class="[
                    'border rounded-md py-3 px-5 text-center font-semibold shadow-sm',
                    SELECTED_ROLE === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-500 bg-white',
                  ]"
                  @click="SELECTED_ROLE = option"
                >
                  {{ option }}
                </button>
              </div>
            </div>

            <!-- Step 3: Company name input -->
            <div
              v-if="current_step === 2"
              class="flex flex-col gap-1 max-w-lg"
            >
              <label class="block text-gray-700 font-medium">
                {{ $t('v1.view.onboarding.company_name') }}
                <span class="text-red-500">*</span></label
              >
              <input
                v-model="COMPANY_DETAILS.name"
                type="text"
                :placeholder="$t('v1.view.onboarding.enter_company_name')"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <!-- Step 4: Preferences -->
            <div v-if="current_step === 3">
              <div class="grid grid-cols-3 gap-4 max-w-3xl">
                <button
                  v-for="option in OPTION_PREFERENCES"
                  :key="option"
                  :class="[
                    'border rounded-md py-3 px-4 text-left font-medium shadow-sm',
                    SELECTED_PREFERENCES === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white',
                  ]"
                  @click="SELECTED_PREFERENCES = option"
                >
                  {{ option }}
                </button>
              </div>
            </div>

            <!-- Step 5: Company details -->
            <div
              v-if="current_step === 4"
              class="max-w-lg space-y-4"
            >
              <div>
                <label class="block text-gray-700 font-medium mb-1"
                  >Tên công ty</label
                >
                <input
                  v-model="COMPANY_DETAILS.name"
                  type="text"
                  placeholder="Nhập tên công ty"
                  class="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1"
                  >Địa chỉ</label
                >
                <input
                  v-model="COMPANY_DETAILS.address"
                  type="text"
                  placeholder="Nhập địa chỉ công ty"
                  class="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1"
                  >Số điện thoại</label
                >
                <input
                  v-model="COMPANY_DETAILS.phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  class="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            class="px-10 py-3 gap-4 rounded-md bg-gray-200 font-medium text-black focus:outline-none"
            :disabled="current_step === 0"
            @click="prevStep"
          >
            {{ $t('v1.view.onboarding.back') }}
          </button>
          <button
            v-if="current_step < total_steps - 1"
            class="px-10 py-3 rounded-md bg-blue-500 text-white font-medium focus:outline-none"
            @click="nextStep"
          >
            {{ $t('v1.view.onboarding.next') }}
          </button>
          <button
            v-else
            class="px-10 py-3 rounded-md bg-green-500 text-white font-medium focus:outline-none"
            @click="submitForm"
          >
            {{ $t('v1.view.onboarding.submit') }}
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
/**Bước hiện tại */
const current_step = ref(0)
/** Tổng số bước */
const total_steps = 5

/** Step 1 */
const OPTION_INDUSTRY = [
  $t('v1.view.onboarding.industry_1'),
  $t('v1.view.onboarding.industry_2'),
  $t('v1.view.onboarding.industry_3'),
  $t('v1.view.onboarding.industry_4'),
  $t('v1.view.onboarding.industry_5'),
  $t('v1.view.onboarding.industry_6'),
  $t('v1.view.onboarding.industry_7'),
  $t('v1.view.onboarding.industry_8'),
  $t('v1.view.onboarding.industry_9'),
]
/** Lựa chọn ngành nghề */
const SELECTED_INDUSTRY = ref<string | null>(null)

/** Step 2 */
const OPTION_ROLE = [
  $t('v1.view.onboarding.role_1'),
  $t('v1.view.onboarding.role_2'),
  $t('v1.view.onboarding.role_3'),
  $t('v1.view.onboarding.role_4'),
  $t('v1.view.onboarding.role_5'),
  $t('v1.view.onboarding.role_6'),
  $t('v1.view.onboarding.role_7'),
  $t('v1.view.onboarding.role_8'),
]
const SELECTED_ROLE = ref<string | null>(null)

/** Step 3 */
const companyName = ref('')

/** Step 4 */
const OPTION_PREFERENCES = ['Owner', 'Manager', 'Employee', 'Intern']
const SELECTED_PREFERENCES = ref<string | null>(null)

/** Step 5 */
const COMPANY_DETAILS = ref({
  name: '',
  address: '',
  phone: '',
})

/** Title + description theo step */
const step_title = computed(() => {
  return [
    $t('v1.view.onboarding.step_industry'),
    $t('v1.view.onboarding.step_role'),
    $t('v1.view.onboarding.company_question'),
    $t('v1.view.onboarding.company_preferences'),
    $t('v1.view.onboarding.company_summary'),
  ][current_step.value]
})

const STEP_DESCRIPTIONS = computed(() => {
  return [
    $t('v1.view.onboarding.step_industry_description'),
    $t('v1.view.onboarding.step_role_description'),
    $t('v1.view.onboarding.company_question_description'),
    $t('v1.view.onboarding.company_preferences_description'),
    $t('v1.view.onboarding.company_summary_description'),
  ][current_step.value]
})

/** Navigation */
const nextStep = () => {
  if (current_step.value < total_steps - 1) current_step.value++
}
/** Previous step */
const prevStep = () => {
  if (current_step.value > 0) current_step.value--
}

/** Submit */
const submitForm = () => {
  console.log('Industry:', SELECTED_INDUSTRY.value)
  console.log('Role:', SELECTED_ROLE.value)
  console.log('Company name step 3:', companyName.value)
  console.log('Preferences:', SELECTED_PREFERENCES.value)
  console.log('Company details step 5:', COMPANY_DETAILS.value)
  alert('Form đã submit!')
}
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
}
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
</style>

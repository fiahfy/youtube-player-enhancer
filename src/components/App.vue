<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '~/store'

const store = useStore()

const seekButtonsEnabled = computed({
  get: () => store.state.settings.seekButtonsEnabled,
  set: (value) =>
    store.commit('settings/setSeekButtonsEnabled', {
      seekButtonsEnabled: value,
    }),
})
const elapsedTime = computed({
  get: () => store.state.settings.elapsedTime,
  set: (value) =>
    store.commit('settings/setElapsedTime', {
      elapsedTime: value,
    }),
})
const timestampAnchor = computed({
  get: () => store.state.settings.timestampAnchor,
  set: (value) =>
    store.commit('settings/setTimestampAnchor', {
      timestampAnchor: value,
    }),
})
</script>

<template>
  <v-app>
    <v-main class="fill-height">
      <v-container fluid>
        <v-subheader>Player</v-subheader>
        <v-switch
          v-model="seekButtonsEnabled"
          color="primary"
          density="compact"
          hide-details
          label="Add Buttons for Seeking Forward and Backward"
        />
        <v-subheader>Info</v-subheader>
        <v-switch
          v-model="elapsedTime"
          color="primary"
          density="compact"
          hide-details
          label="Always Show Elapsed Time"
        />
        <v-subheader>Comments</v-subheader>
        <v-switch
          v-model="timestampAnchor"
          color="primary"
          density="compact"
          hide-details
          label="Donot Scroll on Click Timestamp"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 480px;
}
</style>

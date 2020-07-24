<template>
  <v-app>
    <v-main class="fill-height">
      <v-container fluid pa-0>
        <v-subheader>Player</v-subheader>
        <v-switch
          v-model="seekButtonsEnabled"
          label="Add Buttons for Seeking Forward and Backward"
          dense
          class="px-4 mt-0"
        />
        <!-- <v-switch
          v-model="videoQualityFixed"
          label="Always Play at The Highest Video Quality"
          dense
          class="px-4 mt-0"
        /> -->
        <v-subheader>Info</v-subheader>
        <v-switch
          v-model="elapsedTime"
          label="Always Show Elapsed Time"
          dense
          class="px-4 mt-0"
        />
        <v-subheader>Chat</v-subheader>
        <v-switch
          v-model="reloadButtonEnabled"
          label="Add Button for Reloading Chat Frame"
          dense
          class="px-4 mt-0"
        />
        <v-subheader>Comments</v-subheader>
        <v-switch
          v-model="timestampAnchor"
          label="Donot Scroll on Click Timestamp"
          dense
          class="px-4 mt-0"
        />
        <!-- <v-switch
          v-model="forceScrollButtonEnabled"
          label="Add Button for Enabling Force Scroll"
          class="mt-0 px-4"
          dense
        /> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { settingsStore } from '~/store'

export default defineComponent({
  setup() {
    const seekButtonsEnabled = computed({
      get: () => {
        return settingsStore.seekButtonsEnabled
      },
      set: (value) => {
        settingsStore.setSeekButtonsEnabled({
          seekButtonsEnabled: value,
        })
      },
    })
    const elapsedTime = computed({
      get: () => {
        return settingsStore.elapsedTime
      },
      set: (value) => {
        settingsStore.setElapsedTime({
          elapsedTime: value,
        })
      },
    })
    const timestampAnchor = computed({
      get: () => {
        return settingsStore.timestampAnchor
      },
      set: (value) => {
        settingsStore.setTimestampAnchor({
          timestampAnchor: value,
        })
      },
    })
    const videoQualityFixed = computed({
      get: () => {
        return settingsStore.videoQualityFixed
      },
      set: (value) => {
        settingsStore.setVideoQualityFixed({
          videoQualityFixed: value,
        })
      },
    })
    const reloadButtonEnabled = computed({
      get: () => {
        return settingsStore.reloadButtonEnabled
      },
      set: (value) => {
        settingsStore.setReloadButtonEnabled({
          reloadButtonEnabled: value,
        })
      },
    })
    const forceScrollButtonEnabled = computed({
      get: () => {
        return settingsStore.forceScrollButtonEnabled
      },
      set: (value) => {
        settingsStore.setForceScrollButtonEnabled({
          forceScrollButtonEnabled: value,
        })
      },
    })

    return {
      seekButtonsEnabled,
      elapsedTime,
      timestampAnchor,
      videoQualityFixed,
      reloadButtonEnabled,
      forceScrollButtonEnabled,
    }
  },
})
</script>

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

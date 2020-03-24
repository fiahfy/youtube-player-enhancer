<template>
  <v-app>
    <v-content class="fill-height">
      <v-container ref="container" fluid pa-0>
        <v-subheader>Player</v-subheader>
        <v-switch
          v-model="seekButtonsEnabled"
          label="Add Buttons for Seeking Forward and Backward"
          class="mt-0 px-4"
          dense
        />
        <v-switch
          v-model="videoQualityFixed"
          label="Always Play at The Highest Video Quality"
          class="mt-0 px-4"
          dense
        />
        <v-subheader>Chat</v-subheader>
        <v-switch
          v-model="reloadButtonEnabled"
          label="Add Button for Reloading Chat Frame"
          class="mt-0 px-4"
          dense
        />
        <!-- <v-switch
          v-model="forceScrollButtonEnabled"
          label="Add Button for Enabling Force Scroll"
          class="mt-0 px-4"
          dense
        /> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { settingsStore } from '~/store'

@Component
export default class Popup extends Vue {
  get seekButtonsEnabled() {
    return settingsStore.seekButtonsEnabled
  }
  set seekButtonsEnabled(value) {
    settingsStore.setSeekButtonsEnabled({
      seekButtonsEnabled: value
    })
  }
  get videoQualityFixed() {
    return settingsStore.videoQualityFixed
  }
  set videoQualityFixed(value) {
    settingsStore.setVideoQualityFixed({
      videoQualityFixed: value
    })
  }
  get reloadButtonEnabled() {
    return settingsStore.reloadButtonEnabled
  }
  set reloadButtonEnabled(value) {
    settingsStore.setReloadButtonEnabled({
      reloadButtonEnabled: value
    })
  }
  get forceScrollButtonEnabled() {
    return settingsStore.forceScrollButtonEnabled
  }
  set forceScrollButtonEnabled(value) {
    settingsStore.setForceScrollButtonEnabled({
      forceScrollButtonEnabled: value
    })
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 480px;
  .v-content ::v-deep .v-content__wrap {
    overflow-y: auto;
  }
}
</style>

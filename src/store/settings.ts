import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  seekButtonsEnabled = false
  videoQualityFixed = false
  reloadButtonEnabled = false
  forceScrollButtonEnabled = false

  @Mutation
  setSeekButtonsEnabled({
    seekButtonsEnabled,
  }: {
    seekButtonsEnabled: boolean
  }) {
    this.seekButtonsEnabled = seekButtonsEnabled
  }
  @Mutation
  setVideoQualityFixed({ videoQualityFixed }: { videoQualityFixed: boolean }) {
    this.videoQualityFixed = videoQualityFixed
  }
  @Mutation
  setReloadButtonEnabled({
    reloadButtonEnabled,
  }: {
    reloadButtonEnabled: boolean
  }) {
    this.reloadButtonEnabled = reloadButtonEnabled
  }
  @Mutation
  setForceScrollButtonEnabled({
    forceScrollButtonEnabled,
  }: {
    forceScrollButtonEnabled: boolean
  }) {
    this.forceScrollButtonEnabled = forceScrollButtonEnabled
  }
}

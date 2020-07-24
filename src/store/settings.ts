import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({ name: 'settings' })
export default class SettingsModule extends VuexModule {
  seekButtonsEnabled = false
  elapsedTime = false
  timestampAnchor = false
  videoQualityFixed = false
  reloadButtonEnabled = false
  forceScrollButtonEnabled = false

  @Mutation
  setSeekButtonsEnabled({
    seekButtonsEnabled,
  }: {
    seekButtonsEnabled: boolean
  }): void {
    this.seekButtonsEnabled = seekButtonsEnabled
  }
  @Mutation
  setElapsedTime({ elapsedTime }: { elapsedTime: boolean }): void {
    this.elapsedTime = elapsedTime
  }
  @Mutation
  setTimestampAnchor({ timestampAnchor }: { timestampAnchor: boolean }): void {
    this.timestampAnchor = timestampAnchor
  }
  @Mutation
  setVideoQualityFixed({
    videoQualityFixed,
  }: {
    videoQualityFixed: boolean
  }): void {
    this.videoQualityFixed = videoQualityFixed
  }
  @Mutation
  setReloadButtonEnabled({
    reloadButtonEnabled,
  }: {
    reloadButtonEnabled: boolean
  }): void {
    this.reloadButtonEnabled = reloadButtonEnabled
  }
  @Mutation
  setForceScrollButtonEnabled({
    forceScrollButtonEnabled,
  }: {
    forceScrollButtonEnabled: boolean
  }): void {
    this.forceScrollButtonEnabled = forceScrollButtonEnabled
  }
}

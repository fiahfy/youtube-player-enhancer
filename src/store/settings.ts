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
  }) {
    this.seekButtonsEnabled = seekButtonsEnabled
  }
  @Mutation
  setElapsedTime({ elapsedTime }: { elapsedTime: boolean }) {
    this.elapsedTime = elapsedTime
  }
  @Mutation
  setTimestampAnchor({ timestampAnchor }: { timestampAnchor: boolean }) {
    this.timestampAnchor = timestampAnchor
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

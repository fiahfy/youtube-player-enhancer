import { Module } from 'vuex'
import { Settings } from '~/models'
import { State as RootState } from '~/store'

export type State = Settings

export const module: Module<State, RootState> = {
  namespaced: true,
  state: () => ({
    elapsedTime: false,
    seekButtonsEnabled: false,
    timestampAnchor: false,
  }),
  mutations: {
    setElapsedTime(state, { elapsedTime }: { elapsedTime: boolean }) {
      state.elapsedTime = elapsedTime
    },
    setSeekButtonsEnabled(
      state,
      {
        seekButtonsEnabled,
      }: {
        seekButtonsEnabled: boolean
      }
    ) {
      state.seekButtonsEnabled = seekButtonsEnabled
    },
    setTimestampAnchor(
      state,
      { timestampAnchor }: { timestampAnchor: boolean }
    ) {
      state.timestampAnchor = timestampAnchor
    },
  },
}

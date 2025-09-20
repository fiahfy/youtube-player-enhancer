import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Settings } from '~/models'
import type { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  preventTimestampScroll: false,
  reloadButtonEnabled: false,
  seekButtonsEnabled: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPreventTimestampScroll(state, action: PayloadAction<boolean>) {
      return { ...state, preventTimestampScroll: action.payload }
    },
    setReloadButtonEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, reloadButtonEnabled: action.payload }
    },
    setSeekButtonsEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, seekButtonsEnabled: action.payload }
    },
  },
})

export const {
  setPreventTimestampScroll,
  setReloadButtonEnabled,
  setSeekButtonsEnabled,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectPreventTimestampScroll = createSelector(
  selectSettings,
  (settings) => settings.preventTimestampScroll,
)

export const selectReloadButtonEnabled = createSelector(
  selectSettings,
  (settings) => settings.reloadButtonEnabled,
)

export const selectSeekButtonsEnabled = createSelector(
  selectSettings,
  (settings) => settings.seekButtonsEnabled,
)

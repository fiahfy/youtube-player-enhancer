import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Settings } from '~/models'
import type { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  enableSkipControls: false,
  preventTimestampScroll: false,
  reloadButtonEnabled: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEnableSkipControls(state, action: PayloadAction<boolean>) {
      return { ...state, enableSkipControls: action.payload }
    },
    setPreventTimestampScroll(state, action: PayloadAction<boolean>) {
      return { ...state, preventTimestampScroll: action.payload }
    },
    setReloadButtonEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, reloadButtonEnabled: action.payload }
    },
  },
})

export const {
  setEnableSkipControls,
  setPreventTimestampScroll,
  setReloadButtonEnabled,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectEnableSkipControls = createSelector(
  selectSettings,
  (settings) => settings.enableSkipControls,
)

export const selectPreventTimestampScroll = createSelector(
  selectSettings,
  (settings) => settings.preventTimestampScroll,
)

export const selectReloadButtonEnabled = createSelector(
  selectSettings,
  (settings) => settings.reloadButtonEnabled,
)

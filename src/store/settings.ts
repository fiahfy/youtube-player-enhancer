import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Settings } from '~/models'
import type { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  elapsedTime: false,
  reloadButtonEnabled: false,
  seekButtonsEnabled: false,
  timestampAnchor: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setElapsedTime(state, action: PayloadAction<boolean>) {
      return { ...state, elapsedTime: action.payload }
    },
    setReloadButtonEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, reloadButtonEnabled: action.payload }
    },
    setSeekButtonsEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, seekButtonsEnabled: action.payload }
    },
    setTimestampAnchor(state, action: PayloadAction<boolean>) {
      return { ...state, timestampAnchor: action.payload }
    },
  },
})

export const {
  setElapsedTime,
  setReloadButtonEnabled,
  setSeekButtonsEnabled,
  setTimestampAnchor,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectElapsedTime = createSelector(
  selectSettings,
  (settings) => settings.elapsedTime,
)

export const selectReloadButtonEnabled = createSelector(
  selectSettings,
  (settings) => settings.reloadButtonEnabled,
)

export const selectSeekButtonsEnabled = createSelector(
  selectSettings,
  (settings) => settings.seekButtonsEnabled,
)

export const selectTimestampAnchor = createSelector(
  selectSettings,
  (settings) => settings.timestampAnchor,
)

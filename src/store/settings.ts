import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Settings } from '~/models'
import type { AppState } from '~/store'

type State = Settings

export const initialState: State = {
  autoCloseLiveChatPoll: false,
  autoShowLiveChat: false,
  enableReloadButton: false,
  enableSkipControls: false,
  preventTimestampScroll: false,
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAutoShowLiveChat(state, action: PayloadAction<boolean>) {
      return { ...state, autoShowLiveChat: action.payload }
    },
    setAutoCloseLiveChatPoll(state, action: PayloadAction<boolean>) {
      return { ...state, autoCloseLiveChatPoll: action.payload }
    },
    setEnableReloadButton(state, action: PayloadAction<boolean>) {
      return { ...state, enableReloadButton: action.payload }
    },
    setEnableSkipControls(state, action: PayloadAction<boolean>) {
      return { ...state, enableSkipControls: action.payload }
    },
    setPreventTimestampScroll(state, action: PayloadAction<boolean>) {
      return { ...state, preventTimestampScroll: action.payload }
    },
  },
})

export const {
  setAutoCloseLiveChatPoll,
  setAutoShowLiveChat,
  setEnableReloadButton,
  setEnableSkipControls,
  setPreventTimestampScroll,
} = settingsSlice.actions

export default settingsSlice.reducer

export const selectSettings = (state: AppState) => state.settings

export const selectAutoCloseLiveChatPoll = createSelector(
  selectSettings,
  (settings) => settings.autoCloseLiveChatPoll,
)

export const selectAutoShowLiveChat = createSelector(
  selectSettings,
  (settings) => settings.autoShowLiveChat,
)

export const selectEnableReloadButton = createSelector(
  selectSettings,
  (settings) => settings.enableReloadButton,
)

export const selectEnableSkipControls = createSelector(
  selectSettings,
  (settings) => settings.enableSkipControls,
)

export const selectPreventTimestampScroll = createSelector(
  selectSettings,
  (settings) => settings.preventTimestampScroll,
)

import {
  CssBaseline,
  FormControlLabel,
  FormGroup,
  GlobalStyles,
  Switch,
  Typography,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import StoreProvider from '~/providers/StoreProvider'
import { useAppDispatch, useAppSelector } from '~/store'
import {
  selectElapsedTime,
  selectSeekButtonsEnabled,
  selectTimestampAnchor,
  setElapsedTime,
  setSeekButtonsEnabled,
  setTimestampAnchor,
} from '~/store/settings'

const App = () => {
  const elapsedTime = useAppSelector(selectElapsedTime)
  const seekButtonsEnabled = useAppSelector(selectSeekButtonsEnabled)
  const timestampAnchor = useAppSelector(selectTimestampAnchor)
  const dispatch = useAppDispatch()

  const handleChangeElapsedTime = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setElapsedTime(value))
  }

  const handleChangeSeekButtonsEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setSeekButtonsEnabled(value))
  }

  const handleChangeTimestampAnchor = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setTimestampAnchor(value))
  }

  return (
    <FormGroup sx={{ mx: 2, my: 1 }}>
      <Typography variant="subtitle2">Player</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={seekButtonsEnabled}
            onChange={handleChangeSeekButtonsEnabled}
          />
        }
        label="Add 5-second skip controls"
      />
      <Typography variant="subtitle2">Info</Typography>
      <FormControlLabel
        control={
          <Switch checked={elapsedTime} onChange={handleChangeElapsedTime} />
        }
        label="Always Show Elapsed Time"
      />
      <Typography variant="subtitle2">Comments</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={timestampAnchor}
            onChange={handleChangeTimestampAnchor}
          />
        }
        label="Donot Scroll on Click Timestamp"
      />
    </FormGroup>
  )
}

const Popup = () => {
  return (
    <StoreProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { overflowY: 'hidden', width: 460 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup

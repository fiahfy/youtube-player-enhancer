import {
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  GlobalStyles,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import type { ChangeEvent } from 'react'
import StoreProvider from '~/providers/StoreProvider'
import { useAppDispatch, useAppSelector } from '~/store'
import {
  selectElapsedTime,
  selectReloadButtonEnabled,
  selectSeekButtonsEnabled,
  selectTimestampAnchor,
  setElapsedTime,
  setReloadButtonEnabled,
  setSeekButtonsEnabled,
  setTimestampAnchor,
} from '~/store/settings'

const App = () => {
  const elapsedTime = useAppSelector(selectElapsedTime)
  const reloadButtonEnabled = useAppSelector(selectReloadButtonEnabled)
  const seekButtonsEnabled = useAppSelector(selectSeekButtonsEnabled)
  const timestampAnchor = useAppSelector(selectTimestampAnchor)
  const dispatch = useAppDispatch()

  const handleChangeElapsedTime = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setElapsedTime(value))
  }

  const handleChangeReloadButtonEnabled = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.currentTarget.checked
    dispatch(setReloadButtonEnabled(value))
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
    <Container>
      <Stack spacing={2} sx={{ my: 2, userSelect: 'none' }}>
        <FormControl component="fieldset" size="small">
          <FormLabel component="legend">
            <Typography gutterBottom variant="subtitle2">
              Player
            </Typography>
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={seekButtonsEnabled}
                  onChange={handleChangeSeekButtonsEnabled}
                  size="small"
                />
              }
              label="Add 5-second Skip Controls"
              slotProps={{ typography: { variant: 'body2' } }}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" size="small">
          <FormLabel component="legend">
            <Typography gutterBottom variant="subtitle2">
              Chat
            </Typography>
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={reloadButtonEnabled}
                  onChange={handleChangeReloadButtonEnabled}
                  size="small"
                />
              }
              label="Add Reload Button"
              slotProps={{ typography: { variant: 'body2' } }}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" size="small">
          <FormLabel component="legend">
            <Typography gutterBottom variant="subtitle2">
              Info
            </Typography>
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={elapsedTime}
                  onChange={handleChangeElapsedTime}
                  size="small"
                />
              }
              label="Always Show Elapsed Time"
              slotProps={{ typography: { variant: 'body2' } }}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" size="small">
          <FormLabel component="legend">
            <Typography gutterBottom variant="subtitle2">
              Comments
            </Typography>
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={timestampAnchor}
                  onChange={handleChangeTimestampAnchor}
                  size="small"
                />
              }
              label="Donot Scroll on Click Timestamp"
              slotProps={{ typography: { variant: 'body2' } }}
            />
          </FormGroup>
        </FormControl>
      </Stack>
    </Container>
  )
}

const Popup = () => {
  return (
    <StoreProvider>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { overflowY: 'hidden', width: 300 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup

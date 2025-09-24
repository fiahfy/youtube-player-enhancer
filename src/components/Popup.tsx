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
  selectEnableReloadButton,
  selectEnableSkipControls,
  selectPreventTimestampScroll,
  setEnableReloadButton,
  setEnableSkipControls,
  setPreventTimestampScroll,
} from '~/store/settings'

const App = () => {
  const enableReloadButton = useAppSelector(selectEnableReloadButton)
  const enableSkipControls = useAppSelector(selectEnableSkipControls)
  const preventTimestampScroll = useAppSelector(selectPreventTimestampScroll)
  const dispatch = useAppDispatch()

  const handleChangeEnableReloadButton = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setEnableReloadButton(value))
  }

  const handleChangeEnableSkipControls = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.checked
    dispatch(setEnableSkipControls(value))
  }

  const handleChangePreventTimestampScroll = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.currentTarget.checked
    dispatch(setPreventTimestampScroll(value))
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
                  checked={enableSkipControls}
                  onChange={handleChangeEnableSkipControls}
                  size="small"
                />
              }
              label="Add 5-second skip controls"
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
                  checked={enableReloadButton}
                  onChange={handleChangeEnableReloadButton}
                  size="small"
                />
              }
              label="Add reload button"
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
                  checked={preventTimestampScroll}
                  onChange={handleChangePreventTimestampScroll}
                  size="small"
                />
              }
              label="Prevent scrolling on timestamp click"
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
          html: { overflowY: 'hidden', width: 320 },
        }}
      />
      <App />
    </StoreProvider>
  )
}

export default Popup

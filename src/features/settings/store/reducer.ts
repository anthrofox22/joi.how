import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { events } from '../../gameboard/events'

import {
  HypnoMode,
  PlayerGender,
  PlayerParts,
  PornQuality,
  PornService,
  type Credentials,
  type EventToken,
  type PornList,
} from '../../gameboard/types'

export interface ISettingsState {
  dialogShown: boolean
  pace: {
    min: number
    max: number
  }
  steepness: number
  warmupDuration: number
  duration: number
  credentials: Credentials
  porn: PornList
  pornQuality: PornQuality
  startVideosAtRandomTime: boolean
  videosMuted: boolean
  events: Array<EventToken['id']>
  hypno: HypnoMode
  player: {
    gender: PlayerGender
    parts: PlayerParts
  }
  cum: {
    ejaculateLikelihood: number
    ruinLikelihood: number
  }
  walltaker?: number
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    dialogShown: false,
    pace: {
      min: 0.75,
      max: 5,
    },
    steepness: 0.05,
    warmupDuration: 600,
    duration: 6000,
    credentials: {},
    porn: [],
    pornQuality: PornQuality.LOW,
    startVideosAtRandomTime: true,
    videosMuted: false,
    events: events.map((event) => event.id),
    hypno: HypnoMode.JOI,
    player: { gender: PlayerGender.Male, parts: PlayerParts.Cock },
    cum: {
      ejaculateLikelihood: 100,
      ruinLikelihood: 0,
    },
    walltaker: undefined,
  } as ISettingsState,
  reducers: {
    OpenDialog: (state) => {
      state.dialogShown = true
    },
    CloseDialog: (state) => {
      state.dialogShown = false
    },
    SetMinPace: (state, action: PayloadAction<number>) => {
      state.pace.min = action.payload
    },
    SetMaxPace: (state, action: PayloadAction<number>) => {
      state.pace.max = action.payload
    },
    SetSteepness: (state, action: PayloadAction<number>) => {
      state.steepness = action.payload
    },
    SetWarmupDuration: (state, action: PayloadAction<number>) => {
      state.warmupDuration = action.payload
    },
    SetDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    SetAllCredentials: (state, action: PayloadAction<Credentials>) => {
      state.credentials = action.payload
    },
    SetCredentials: (state, action: PayloadAction<{ service: PornService; credentials: Credentials[PornService] | undefined }>) => {
      if (action.payload.service === PornService.E621) {
        state.credentials[PornService.E621] = action.payload.credentials as Credentials[PornService.E621]
      }
    },
    SetPornList: (state, action: PayloadAction<PornList>) => {
      state.porn = action.payload
    },
    SetPornQuality: (state, action: PayloadAction<PornQuality>) => {
      state.pornQuality = action.payload
    },
    SetStartVideosAtRandomTime: (state, action: PayloadAction<boolean>) => {
      state.startVideosAtRandomTime = action.payload
    },
    SetVideosMuted: (state, action: PayloadAction<boolean>) => {
      state.videosMuted = action.payload
    },
    SetEventList: (state, action: PayloadAction<Array<EventToken['id']>>) => {
      state.events = action.payload
    },
    SetHypnoMode: (state, action: PayloadAction<HypnoMode>) => {
      state.hypno = action.payload
    },
    SetEjaculateLikelihood: (state, action: PayloadAction<number>) => {
      state.cum.ejaculateLikelihood = action.payload
    },
    SetRuinLikelihood: (state, action: PayloadAction<number>) => {
      state.cum.ruinLikelihood = action.payload
    },
    SetWalltakerLink: (state, action: PayloadAction<number | undefined>) => {
      state.walltaker = action.payload
    },
    SetPlayerGender: (state, action: PayloadAction<PlayerGender>) => {
      state.player.gender = action.payload
    },
    SetPlayerParts: (state, action: PayloadAction<PlayerParts>) => {
      state.player.parts = action.payload
    },
  },
})

export const SettingsActions = settingsSlice.actions

export type SettingsAction = (typeof SettingsActions)[keyof typeof SettingsActions]

export const SettingsReducer = settingsSlice.reducer

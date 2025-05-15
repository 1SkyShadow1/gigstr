import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai"

import { type ToastProps } from "@/components/ui/toast"

type Toast = ToastProps & {
  id: string
  open: boolean
}

import * as React from "react"

import { v4 as uuidv4 } from "uuid"

import { type VariantProps } from "class-variance-authority"

import { toastVariants } from "@/components/ui/toast"

export type ToastVariantsProps = VariantProps<typeof toastVariants>

export type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  close?: React.ReactNode
  duration?: number
  /**
   * @default "foreground"
   */
  variant?: ToastVariantsProps["variant"]
}

import { Toast, ToasterToast } from "./toast";

// Use export type to avoid TypeScript error with isolatedModules
export type { Toast, ToasterToast };

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes[keyof typeof actionTypes]

const toastsAtom = atom<Toast[]>([])

const reducer = (state: Toast[], action: { type: ActionType; toast: ToasterToast }): Toast[] => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return [action.toast as Toast, ...state]
    case actionTypes.UPDATE_TOAST:
      return state.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t))
    case actionTypes.DISMISS_TOAST:
      return state.map((t) => (t.id === action.toast.id ? { ...t, open: false } : t))
    case actionTypes.REMOVE_TOAST:
      return state.filter((t) => t.id !== action.toast.id)
  }
  return state
}

type State = {
  toasts: Toast[]
}

type Action = {
  type: ActionType
  toast: ToasterToast
}

const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return { ...state, toasts: [action.toast as Toast, ...state.toasts] }
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }
    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, open: false } : t)),
      }
    case actionTypes.REMOVE_TOAST:
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toast.id) }
  }
  return state
}

const DEFAULT_DURATION = 3000
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type AddToast = Omit<ToasterToast, "id">

function toast(
  { ...props }: AddToast,
) {
  const id = uuidv4()

  const toast = {
    ...props,
    id,
    open: true,
    variant: props.variant || "default",
    duration: props.duration || DEFAULT_DURATION,
  }

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast,
  })
}

function useToast() {
  return {
    toasts: useAtomValue(toastsAtom),
    toast,
    dismiss: (toastId: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toast: { id: toastId } }),
    remove: (toastId: string) => dispatch({ type: actionTypes.REMOVE_TOAST, toast: { id: toastId } }),
  }
}

const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] })

React.useEffect(() => {
  state.toasts
    .filter((t) => t.open)
    .forEach((t) => {
      setTimeout(() => dispatch({ type: actionTypes.DISMISS_TOAST, toast: { id: t.id } }), t.duration)
    })

  state.toasts
    .filter((t) => !t.open)
    .forEach((t) =>
      setTimeout(() => dispatch({ type: actionTypes.REMOVE_TOAST, toast: { id: t.id } }), TOAST_REMOVE_DELAY)
    )
}, [state.toasts])

export { useToast, toast, reducer, toastsAtom }

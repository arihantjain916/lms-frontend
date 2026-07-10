"use client"

import { useSyncExternalStore } from "react"

export const AUTH_STATE_EVENT = "eduportal:auth-state-changed"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(AUTH_STATE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(AUTH_STATE_EVENT, callback)
  }
}

function getSnapshot() {
  return Boolean(window.localStorage.getItem("token"))
}

export function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_EVENT))
}

export function useAuthenticated() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

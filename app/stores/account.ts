import { defineStore } from 'pinia'
import { useTenant } from "~/composables/tenant.composable";

export const useAccountStore = defineStore('account', () => {
  const profile = ref<any>({})
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const slug = ref<string>('')
  const openSignIn = ref<boolean>(false)

  const userItem = localStorage.getItem(`user_${slug.value}`)
  profile.value = userItem ? JSON.parse(userItem) : null

  token.value = localStorage.getItem(`token_${slug.value}`) || ''
  refreshToken.value = localStorage.getItem(`refreshtoken_${slug.value}`) || ''

  function setToken(data: string | null) {
    token.value = data
    if (data === null) localStorage.removeItem(`token_${slug.value}`)
    else localStorage.setItem(`token_${slug.value}`, data || '')
  }
  function setRefreshToken(data: string | null) {
    refreshToken.value = data
    if (data === null) localStorage.removeItem(`refreshtoken_${slug.value}`)
    else localStorage.setItem(`refreshtoken_${slug.value}`, data || '')
  }
  function setProfile(data: any) {
    profile.value = data
    if (!data) localStorage.removeItem(`user_${slug.value}`)
    else localStorage.setItem(`user_${slug.value}`, JSON.stringify(data) || '')
  }
  function setSlug(data: string) {
    slug.value = data
    const userItem = localStorage.getItem(`user_${slug.value}`)
    profile.value = userItem ? JSON.parse(userItem) : {}
    token.value = localStorage.getItem(`token_${slug.value}`) || ''
    refreshToken.value = localStorage.getItem(`refreshtoken_${slug.value}`) || ''
  }
  function setOpenSignIn(data: boolean) {
    openSignIn.value = data
  }
  return {
    profile,
    slug,
    openSignIn,
    token,
    refreshToken,
    setSlug,
    setToken,
    setRefreshToken,
    setProfile,
    setOpenSignIn
  }
})

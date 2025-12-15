import { useAccountService } from '@/services/account.service'
import { useAccountStore } from '@/stores/account'
import { storeToRefs } from 'pinia'

export const useAccountComposable = () => {
  const accountStore = useAccountStore()
  const {setProfile, setSlug, setToken, setRefreshToken } = accountStore
  const { profile, slug, token, refreshToken } = storeToRefs(accountStore)
  const { getProfileUserService } = useAccountService()

  async function getProfile() {
    try {
      const { data, status } = await getProfileUserService()
      if (status === 200) setProfile(data)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    profile,
    slug,
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    getProfile,
    setSlug,
    setProfile
  }
}

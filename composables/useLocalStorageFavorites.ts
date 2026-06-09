const FAVORITES_KEY = 'rinoimob_favorites'
const FAVORITES_STATE_KEY = 'rinoimob_favorites_state'
const FAVORITES_HYDRATED_KEY = 'rinoimob_favorites_hydrated'

export function useLocalStorageFavorites() {
  const favorites = useState<string[]>(FAVORITES_STATE_KEY, () => [])
  const hydrated = useState<boolean>(FAVORITES_HYDRATED_KEY, () => false)

  const initFavorites = () => {
    if (process.server) return
    if (hydrated.value) return

    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      const parsed = stored ? JSON.parse(stored) : []

      favorites.value = Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === 'string')
        : []
    } catch {
      favorites.value = []
    } finally {
      hydrated.value = true
    }
  }

  const getFavorites = (): string[] => {
    if (process.server) return []

    initFavorites()
    return favorites.value
  }

  const isFavorited = (propertyId: string): boolean => {
    return getFavorites().includes(propertyId)
  }

  const addFavorite = (propertyId: string): void => {
    if (process.server) return
    const current = getFavorites()
    if (!current.includes(propertyId)) {
      favorites.value = [...current, propertyId]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
    }
  }

  const removeFavorite = (propertyId: string): void => {
    if (process.server) return
    const current = getFavorites()
    const filtered = current.filter(id => id !== propertyId)
    favorites.value = filtered
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  }

  const toggleFavorite = (propertyId: string): boolean => {
    if (isFavorited(propertyId)) {
      removeFavorite(propertyId)
      return false
    } else {
      addFavorite(propertyId)
      return true
    }
  }

  initFavorites()

  return {
    favorites: readonly(favorites),
    getFavorites,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}

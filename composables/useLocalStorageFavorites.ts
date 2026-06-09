const FAVORITES_KEY = 'rinoimob_favorites'

export function useLocalStorageFavorites() {
  const favorites = ref<string[]>([])

  const initFavorites = () => {
    if (process.server) return
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      favorites.value = stored ? JSON.parse(stored) : []
    } catch {
      favorites.value = []
    }
  }

  const getFavorites = (): string[] => {
    if (process.server) return []
    if (favorites.value.length === 0) {
      initFavorites()
    }
    return favorites.value
  }

  const isFavorited = (propertyId: string): boolean => {
    return getFavorites().includes(propertyId)
  }

  const addFavorite = (propertyId: string): void => {
    if (process.server) return
    const current = getFavorites()
    if (!current.includes(propertyId)) {
      favorites.value.push(propertyId)
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

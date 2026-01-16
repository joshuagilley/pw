export const useDarkMode = () => {
  const isDark = useState('darkMode', () => {
    if (process.client) {
      const saved = localStorage.getItem('darkMode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return saved === 'true' || (!saved && prefersDark)
    }
    return false
  })

  const toggleDarkMode = () => {
    if (process.client) {
      isDark.value = !isDark.value
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }
  }

  // Sync state with DOM on mount
  onMounted(() => {
    if (process.client) {
      const saved = localStorage.getItem('darkMode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldBeDark = saved === 'true' || (!saved && prefersDark)
      
      isDark.value = shouldBeDark
      
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  })

  return {
    isDark: computed(() => isDark.value),
    toggleDarkMode
  }
}

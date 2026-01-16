export const useApi = () => {
  const apiCall = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await $fetch<T>(url, {
      ...options,
      credentials: 'include'
    })
    return response
  }

  return {
    apiCall
  }
}

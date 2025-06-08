import { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
) {
  const [isLoading, setIsLoading] = useState(false)

  const execute = async (...args: Parameters<T>) => {
    setIsLoading(true)
    try {
      await action(...args)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  return { isLoading, execute }
}

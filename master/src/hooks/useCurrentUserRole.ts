import { getCurrentMaster } from '../lib/session'

export type CurrentUserRole = 'master'

export function useCurrentUserRole(): CurrentUserRole | null {
  return getCurrentMaster() ? 'master' : null
}

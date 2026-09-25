import { isFirebaseConfigured } from '@/lib/firebase'
import { createFirestoreRepository } from './firestoreRepository'
import { createLocalRepository } from './localRepository'
import type { TournamentRepository } from './repository'

let instance: TournamentRepository | null = null

export const getRepository = (): TournamentRepository => {
  if (!instance) {
    instance = isFirebaseConfigured ? createFirestoreRepository() : createLocalRepository()
  }
  return instance
}

export type { TournamentRepository } from './repository'

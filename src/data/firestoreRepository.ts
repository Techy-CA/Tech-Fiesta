import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { createId } from '@/lib/format'
import type { Fixture, Team, TeamDraft } from '@/types/tournament'
import { sortFixtures, sortTeams, type TournamentRepository } from './repository'

const TEAMS = 'teams'
const FIXTURES = 'fixtures'

const purge = async (name: string) => {
  const db = getDb()
  const snapshot = await getDocs(collection(db, name))
  if (snapshot.empty) return
  const batch = writeBatch(db)
  snapshot.docs.forEach((entry) => batch.delete(entry.ref))
  await batch.commit()
}

export const createFirestoreRepository = (): TournamentRepository => ({
  backend: 'firestore',

  subscribeTeams(next, fail) {
    return onSnapshot(
      collection(getDb(), TEAMS),
      (snapshot) => {
        next(sortTeams(snapshot.docs.map((entry) => ({ ...(entry.data() as Team), id: entry.id }))))
      },
      (error) => fail(error as Error),
    )
  },

  subscribeFixtures(next, fail) {
    return onSnapshot(
      collection(getDb(), FIXTURES),
      (snapshot) => {
        next(
          sortFixtures(
            snapshot.docs.map((entry) => ({ ...(entry.data() as Fixture), id: entry.id })),
          ),
        )
      },
      (error) => fail(error as Error),
    )
  },

  async createTeam(draft: TeamDraft) {
    const team: Team = { ...draft, id: createId('team'), createdAt: Date.now() }
    const { id, ...payload } = team
    await setDoc(doc(getDb(), TEAMS, id), payload)
    return team
  },

  async deleteTeam(teamId: string) {
    await deleteDoc(doc(getDb(), TEAMS, teamId))
  },

  async replaceFixtures(fixtures: Fixture[]) {
    const db = getDb()
    await purge(FIXTURES)
    const batch = writeBatch(db)
    fixtures.forEach((fixture) => {
      const { id, ...payload } = fixture
      batch.set(doc(db, FIXTURES, id), payload)
    })
    await batch.commit()
  },

  async updateFixture(fixtureId: string, patch: Partial<Fixture>) {
    await updateDoc(doc(getDb(), FIXTURES, fixtureId), patch)
  },

  async clearFixtures() {
    await purge(FIXTURES)
  },

  async resetAll() {
    await Promise.all([purge(FIXTURES), purge(TEAMS)])
  },
})

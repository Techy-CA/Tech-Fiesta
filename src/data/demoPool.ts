import { PLAYER_ROLES, type TeamDraft } from '@/types/tournament'

const source: Array<[string, string, string, string[]]> = [
  ['Iron Serpents', 'IRN', 'School of Engineering', ['Ishaan Malhotra', 'Vivaan Chauhan', 'Nikhil Saxena', 'Manav Trivedi', 'Siddharth Rana']],
  ['Crimson Wolves', 'CRW', 'Institute of Technology', ['Aarav Deshpande', 'Kabir Nair', 'Rohan Iyer', 'Dev Bhatt', 'Arjun Menon']],
  ['Astral Titans', 'AST', 'College of Computing', ['Yash Kulkarni', 'Aryan Ghosh', 'Kunal Sethi', 'Raghav Pillai', 'Om Prakash']],
  ['Quantum Vipers', 'QTV', 'School of Design', ['Tanish Verma', 'Harsh Bedi', 'Naveen Rao', 'Ayush Kapoor', 'Zaid Ahmed']],
  ['Shadow Syndicate', 'SHD', 'Faculty of Science', ['Rishab Jain', 'Pranav Shetty', 'Karan Dutta', 'Imran Shaikh', 'Veer Solanki']],
]

export const demoPool: TeamDraft[] = source.map(([name, tag, institution, players]) => ({
  name,
  tag,
  institution,
  contactEmail: `captain@${tag.toLowerCase()}.edu`,
  players: players.map((player, index) => ({
    id: `${tag.toLowerCase()}-${index}`,
    name: player,
    handle: `${tag.toLowerCase()}.${player.split(' ')[0].toLowerCase()}`,
    role: PLAYER_ROLES[index],
  })),
}))

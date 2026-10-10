import { and, desc, eq, ilike, inArray, ne, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { friendships, likes, posts, user } from '@/lib/db/schema'

export type Relationship = 'self' | 'none' | 'friends' | 'outgoing' | 'incoming'

function postFields(viewerId: string) {
  return {
    id: posts.id,
    content: posts.content,
    createdAt: posts.createdAt,
    author: {
      id: user.id,
      name: user.name,
      username: user.username,
      image: user.image,
    },
    likeCount: sql<number>`(select count(*)::int from ${likes} where ${likes.postId} = ${posts.id})`,
    likedByMe: sql<boolean>`exists(select 1 from ${likes} where ${likes.postId} = ${posts.id} and ${likes.userId} = ${viewerId})`,
  }
}

export type FeedPost = Awaited<ReturnType<typeof getFeed>>[number]

function friendIdsSubquery(userId: string) {
  return sql`(select case when ${friendships.requesterId} = ${userId} then ${friendships.addresseeId} else ${friendships.requesterId} end from ${friendships} where ${friendships.status} = 'accepted' and (${friendships.requesterId} = ${userId} or ${friendships.addresseeId} = ${userId}))`
}

export async function getFeed(viewerId: string, scope: 'friends' | 'everyone') {
  const query = db
    .select(postFields(viewerId))
    .from(posts)
    .innerJoin(user, eq(posts.userId, user.id))
    .orderBy(desc(posts.createdAt))
    .limit(50)

  if (scope === 'everyone') return query

  return query.where(
    sql`(${posts.userId} = ${viewerId} or ${posts.userId} in ${friendIdsSubquery(viewerId)})`,
  )
}

export async function getPostsByUser(authorId: string, viewerId: string) {
  return db
    .select(postFields(viewerId))
    .from(posts)
    .innerJoin(user, eq(posts.userId, user.id))
    .where(eq(posts.userId, authorId))
    .orderBy(desc(posts.createdAt))
    .limit(50)
}

async function getRelationshipMap(viewerId: string) {
  const rows = await db
    .select()
    .from(friendships)
    .where(or(eq(friendships.requesterId, viewerId), eq(friendships.addresseeId, viewerId)))

  const map = new Map<string, Exclude<Relationship, 'self' | 'none'>>()
  for (const row of rows) {
    const otherId = row.requesterId === viewerId ? row.addresseeId : row.requesterId
    if (row.status === 'accepted') map.set(otherId, 'friends')
    else map.set(otherId, row.requesterId === viewerId ? 'outgoing' : 'incoming')
  }
  return map
}

export async function getRelationship(viewerId: string, otherId: string): Promise<Relationship> {
  if (viewerId === otherId) return 'self'
  const map = await getRelationshipMap(viewerId)
  return map.get(otherId) ?? 'none'
}

const personFields = {
  id: user.id,
  name: user.name,
  username: user.username,
  image: user.image,
  bio: user.bio,
}

export type Person = { id: string; name: string; username: string; image: string | null; bio: string }

export async function getPeople(viewerId: string, search: string) {
  const term = search.trim()
  const conditions = [ne(user.id, viewerId)]
  if (term) {
    const pattern = `%${term.replace(/[%_\\]/g, '\\$&')}%`
    const match = or(ilike(user.name, pattern), ilike(user.username, pattern))
    if (match) conditions.push(match)
  }

  const [people, relationships] = await Promise.all([
    db
      .select(personFields)
      .from(user)
      .where(and(...conditions))
      .orderBy(desc(user.createdAt))
      .limit(50),
    getRelationshipMap(viewerId),
  ])

  return people.map((person) => ({
    ...person,
    relationship: (relationships.get(person.id) ?? 'none') as Relationship,
  }))
}

export async function getConnections(viewerId: string) {
  const relationships = await getRelationshipMap(viewerId)
  const ids = [...relationships.keys()]
  if (ids.length === 0) return { friends: [], incoming: [], outgoing: [] }

  const people = await db.select(personFields).from(user).where(inArray(user.id, ids)).orderBy(user.name)
  const withStatus = people.map((person) => ({ ...person, relationship: relationships.get(person.id)! }))

  return {
    friends: withStatus.filter((p) => p.relationship === 'friends'),
    incoming: withStatus.filter((p) => p.relationship === 'incoming'),
    outgoing: withStatus.filter((p) => p.relationship === 'outgoing'),
  }
}

export async function getPendingRequestCount(viewerId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(friendships)
    .where(and(eq(friendships.addresseeId, viewerId), eq(friendships.status, 'pending')))
  return row?.count ?? 0
}

export async function getUserByUsername(username: string) {
  const [row] = await db
    .select({ ...personFields, createdAt: user.createdAt })
    .from(user)
    .where(eq(user.username, username.toLowerCase()))
    .limit(1)
  return row ?? null
}

export async function getProfileStats(userId: string) {
  const [[postCount], [friendCount]] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(posts).where(eq(posts.userId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(friendships)
      .where(
        and(
          eq(friendships.status, 'accepted'),
          or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId)),
        ),
      ),
  ])
  return { posts: postCount?.count ?? 0, friends: friendCount?.count ?? 0 }
}

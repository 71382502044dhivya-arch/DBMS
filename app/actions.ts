'use server'

import { and, eq, ne, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { friendships, likes, posts, user } from '@/lib/db/schema'
import { getSession } from '@/lib/session'
import {
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  POST_MAX_LENGTH,
  USERNAME_PATTERN,
} from '@/lib/validation'

export type FormState = { status: 'idle' | 'success' | 'error'; message?: string; at?: number }

async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserId()
  const content = String(formData.get('content') ?? '').trim()

  if (!content) return { status: 'error', message: 'Write something first.' }
  if (content.length > POST_MAX_LENGTH) {
    return { status: 'error', message: `Posts can be up to ${POST_MAX_LENGTH} characters.` }
  }

  await db.insert(posts).values({ userId, content })
  revalidatePath('/', 'layout')
  return { status: 'success', at: Date.now() }
}

export async function deletePost(postId: number) {
  const userId = await getUserId()
  if (!Number.isInteger(postId)) return

  const deleted = await db
    .delete(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .returning({ id: posts.id })

  if (deleted.length > 0) await db.delete(likes).where(eq(likes.postId, postId))
  revalidatePath('/', 'layout')
}

export async function toggleLike(postId: number) {
  const userId = await getUserId()
  if (!Number.isInteger(postId)) return

  const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId)).limit(1)
  if (!post) return

  const removed = await db
    .delete(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .returning({ id: likes.id })

  if (removed.length === 0) await db.insert(likes).values({ postId, userId })
  revalidatePath('/', 'layout')
}

export type FriendAction = 'add' | 'cancel' | 'accept' | 'decline' | 'remove'

export async function updateFriendship(targetId: string, action: FriendAction) {
  const userId = await getUserId()
  if (typeof targetId !== 'string' || targetId === userId) return

  const [target] = await db.select({ id: user.id }).from(user).where(eq(user.id, targetId)).limit(1)
  if (!target) return

  const sent = and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, targetId))
  const received = and(eq(friendships.requesterId, targetId), eq(friendships.addresseeId, userId))

  const [existing] = await db.select().from(friendships).where(or(sent, received)).limit(1)

  switch (action) {
    case 'add':
      if (!existing) {
        await db.insert(friendships).values({ requesterId: userId, addresseeId: targetId })
      } else if (existing.status === 'pending' && existing.requesterId === targetId) {
        await db.update(friendships).set({ status: 'accepted' }).where(eq(friendships.id, existing.id))
      }
      break
    case 'cancel':
      await db.delete(friendships).where(and(sent, eq(friendships.status, 'pending')))
      break
    case 'accept':
      await db
        .update(friendships)
        .set({ status: 'accepted' })
        .where(and(received, eq(friendships.status, 'pending')))
      break
    case 'decline':
      await db.delete(friendships).where(and(received, eq(friendships.status, 'pending')))
      break
    case 'remove':
      await db.delete(friendships).where(and(or(sent, received), eq(friendships.status, 'accepted')))
      break
  }

  revalidatePath('/', 'layout')
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await getUserId()
  const name = String(formData.get('name') ?? '').trim()
  const username = String(formData.get('username') ?? '')
    .trim()
    .toLowerCase()
  const bio = String(formData.get('bio') ?? '').trim()

  if (!name || name.length > NAME_MAX_LENGTH) {
    return { status: 'error', message: `Name must be 1–${NAME_MAX_LENGTH} characters.` }
  }
  if (!USERNAME_PATTERN.test(username)) {
    return {
      status: 'error',
      message: 'Username must be 3–20 characters: lowercase letters, numbers, or underscores.',
    }
  }
  if (bio.length > BIO_MAX_LENGTH) {
    return { status: 'error', message: `Bio can be up to ${BIO_MAX_LENGTH} characters.` }
  }

  const [taken] = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.username, username), ne(user.id, userId)))
    .limit(1)
  if (taken) return { status: 'error', message: 'That username is already taken.' }

  await db.update(user).set({ name, username, bio, updatedAt: new Date() }).where(eq(user.id, userId))
  revalidatePath('/', 'layout')
  return { status: 'success', message: 'Profile saved.', at: Date.now() }
}

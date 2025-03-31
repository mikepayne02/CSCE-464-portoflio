// src/actions/addComment.ts
import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { drizzle } from 'drizzle-orm/d1'
import { comments } from '@/schema'
import type { TurnstileOutcome } from '@/types'

import { TURNSTILE_SECRET } from 'astro:env/server'

// WARNING: Basic sanitization. Consider a dedicated library for production security.
function sanitize(input: string | undefined | null): string | undefined {
  if (!input) return undefined
  // Strips HTML tags and trims whitespace
  return input.replace(/<[^>]*>?/gm, '').trim()
}

export default defineAction({
  accept: 'form', // Expects FormData from the client-side call
  input: z.object({
    targetUrl: z.string().url({ message: 'Invalid target URL.' }),
    authorName: z
      .string({ required_error: 'Name is required.' })
      .min(1, { message: 'Name cannot be empty.' })
      .max(80, 'Name is too long (max 80 characters).'),
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Please enter a valid email address.' })
      .max(100, 'Email is too long (max 100 characters).'),
    commentText: z
      .string({ required_error: 'Comment is required.' })
      .min(3, { message: 'Comment must be at least 3 characters long.' })
      .max(2000, { message: 'Comment cannot exceed 2000 characters.' }),
    turnstile: z
      .string({ required_error: 'Verification token is missing.' })
      .min(1, { message: 'Verification is required.' })
      .max(2048, 'Verification token is invalid.')
  }),
  handler: async (
    { targetUrl, authorName, email, commentText, turnstile },
    ctx
  ) => {
    // 1. Validate Turnstile Token (Server-Side)
    let turnstileFormData = new FormData()
    turnstileFormData.append('secret', TURNSTILE_SECRET)
    turnstileFormData.append('response', turnstile)
    turnstileFormData.append('remoteip', ctx.clientAddress) // Pass client IP

    const turnstileResult = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        body: turnstileFormData,
        method: 'POST'
      }
    )

    if (!turnstileResult.ok) {
      console.error(
        `Turnstile verification fetch failed with status: ${turnstileResult.status}`
      )
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Could not reach captcha verification service (status ${turnstileResult.status}).`
      })
    }

    const outcome = (await turnstileResult.json()) as TurnstileOutcome
    if (!outcome.success) {
      console.error('Turnstile validation failed:', outcome['error-codes'])
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `Captcha validation failed. Please try again.`
      })
    }

    // 2. Sanitize User Inputs
    const sanitizedName = sanitize(authorName) // Required, so should exist
    const sanitizedComment = sanitize(commentText) // Required, so should exist
    const validatedEmail = email.trim().toLowerCase() // Already validated format

    // 3. Perform Post-Sanitization Validation (optional but good practice)
    if (!sanitizedName || sanitizedName.length > 80) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Name is invalid or too long.'
      })
    }
    if (
      !sanitizedComment ||
      sanitizedComment.length < 3 ||
      sanitizedComment.length > 2000
    ) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Comment length is invalid.'
      })
    }
    // Email format already checked by Zod

    // 4. Prepare Database Client
    const db = drizzle(ctx.locals.runtime.env.DB)

    // 5. Insert Comment into Database
    try {
      const publishedAt = new Date() // Use a consistent timestamp
      const inserted = await db
        .insert(comments)
        .values({
          targetUrl: targetUrl,
          authorName: sanitizedName,
          email: validatedEmail,
          commentText: sanitizedComment,
          publishedAt: publishedAt,
          approved: true, // TODO: Implement moderation system
          ipAddress: ctx.clientAddress
        })
        .returning({ id: comments.id })

      // Check insertion result
      if (!inserted || inserted.length === 0 || !inserted[0]?.id) {
        throw new Error('Database insertion failed or did not return an ID.')
      }

      return { success: true }
    } catch (error: any) {
      // Avoid leaking database-specific errors
      throw new ActionError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Your comment could not be saved due to a server issue.'
      })
    }
  }
})

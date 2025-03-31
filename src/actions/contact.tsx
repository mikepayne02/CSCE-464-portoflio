import Email from '@/emails/Contact.tsx'
import AuthorEmail from '@/emails/ContactAuthor.tsx'
import { siteConfig } from '@/site-config'
import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'
import domains from 'disposable-email-domains'
import type { TurnstileOutcome } from '@/types'

import {
  AUTHOR_EMAIL,
  RESEND_API_KEY,
  TURNSTILE_SECRET
} from 'astro:env/server'

// Contact form action
export default defineAction({
  accept: 'form',
  input: z.object({
    fullName: z
      .string({ message: 'Please enter a name' })
      .min(2, 'Name must be at least two characters long.'),
    email: z
      .string({ message: 'Please enter an email' })
      .email({ message: 'Please enter a valid email' }),
    message: z
      .string({ message: 'Please enter a message.' })
      .min(2, { message: 'Message must be at least two characters long.' }),
    turnstile: z
      .string({ message: 'Please complete verification.' })
      .max(2048, 'Turnstile response is invalid.')
  }),
  handler: async ({ fullName, message, email, turnstile }, ctx) => {
    // Validate the token by calling the
    // "/siteverify" API endpoint.
    let formData = new FormData()
    formData.append('secret', TURNSTILE_SECRET)
    formData.append('response', turnstile)
    formData.append('remoteip', ctx.clientAddress)

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const result = await fetch(url, {
      body: formData,
      method: 'POST'
    })

    const outcome = (await result.json()) as TurnstileOutcome

    if (outcome['error-codes']?.length) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: `Captcha error: ${outcome['error-codes']}`
      })
    }

    if (!outcome.success) {
      throw new ActionError({ code: 'BAD_REQUEST', message: 'Captcha failed' })
    }

    // Check if the email domain is disposable
    const domain = email.split('@')[1]!
    if (domains.includes(domain)) {
      throw new ActionError({
        code: 'BAD_REQUEST',
        message: 'Disposable email addresses are not allowed.'
      })
    }

    const resend = new Resend(RESEND_API_KEY)

    const firstName = fullName.split(' ')[0] ?? fullName

    // Send email to the user
    await resend.emails.send({
      from: siteConfig.contactEmail,
      to: email,
      subject: 'Message Received',
      react: <Email firstName={firstName} />
    })

    // Send email to the author
    await resend.emails.send({
      from: siteConfig.contactEmail,
      to: AUTHOR_EMAIL,
      subject: `Message from ${fullName}`,
      replyTo: email,
      react: <AuthorEmail fullName={fullName} message={message} />
    })

    return { name: firstName }
  }
})

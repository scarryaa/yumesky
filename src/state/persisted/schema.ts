import { z } from 'zod'
import { deviceLocales } from '../../platform/detection'

const externalEmbedOptions = ['show', 'hide'] as const

const accountSchema = z.object({
  service: z.string(),
  did: z.string(),
  handle: z.string(),
  email: z.string().optional(),
  emailConfirmed: z.boolean().optional(),
  refreshJwt: z.string().optional(),
  accessJwt: z.string().optional(),
  deactivated: z.boolean().optional()
})
export type PersistedAccount = z.infer<typeof accountSchema>

export const schema = z.object({
  colorMode: z.object({
    value: z.enum(['system', 'light', 'dim', 'dark', 'custom']),
    primary: z.string()
  }),
  session: z.object({
    accounts: z.array(accountSchema),
    currentAccount: accountSchema.optional()
  }),
  reminders: z.object({
    lastEmailConfirm: z.string().optional()
  }),
  languagePrefs: z.object({
    primaryLanguage: z.string(), // might be moved to server
    contentLanguages: z.array(z.string()), // might be moved to server
    postLanguage: z.string(), // might be moved to server
    postLanguageHistory: z.array(z.string()),
    appLanguage: z.string()
  }),
  requireAltTextEnabled: z.boolean(), // might be moved to server
  externalEmbeds: z
    .object({
      giphy: z.enum(externalEmbedOptions).optional(),
      tenor: z.enum(externalEmbedOptions).optional(),
      youtube: z.enum(externalEmbedOptions).optional(),
      youtubeShorts: z.enum(externalEmbedOptions).optional(),
      twitch: z.enum(externalEmbedOptions).optional(),
      vimeo: z.enum(externalEmbedOptions).optional(),
      spotify: z.enum(externalEmbedOptions).optional(),
      appleMusic: z.enum(externalEmbedOptions).optional(),
      soundcloud: z.enum(externalEmbedOptions).optional()
    })
    .optional(),
  mutedThreads: z.array(z.string()), // might be moved to server
  invites: z.object({
    copiedInvites: z.array(z.string())
  }),
  onboarding: z.object({
    step: z.string()
  }),
  hiddenPosts: z.array(z.string()).optional(), // might be moved to server
  useInAppBrowser: z.boolean().optional(),
  lastSelectedHomeFeed: z.string().optional(),
  pdsAddressHistory: z.array(z.string()).optional()
})
export type Schema = z.infer<typeof schema>

export const defaults: Schema = {
  colorMode: { value: 'system', primary: '#007bff' },
  session: {
    accounts: [],
    currentAccount: undefined
  },
  reminders: {
    lastEmailConfirm: undefined
  },
  languagePrefs: {
    primaryLanguage: deviceLocales()[0] ?? 'en',
    contentLanguages: deviceLocales() ?? [],
    postLanguage: deviceLocales()[0] ?? 'en',
    postLanguageHistory: (deviceLocales() ?? [])
      .concat(['en', 'ja', 'pt', 'de'])
      .slice(0, 6),
    appLanguage: deviceLocales()[0] ?? 'en'
  },
  requireAltTextEnabled: false,
  externalEmbeds: {},
  mutedThreads: [],
  invites: {
    copiedInvites: []
  },
  onboarding: {
    step: 'Home'
  },
  hiddenPosts: [],
  useInAppBrowser: undefined,
  lastSelectedHomeFeed: undefined,
  pdsAddressHistory: []
}

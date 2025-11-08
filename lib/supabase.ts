import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	// Do not throw during build/CI — that would make Actions fail when secrets are not yet set.
	// Log a clear warning so it's obvious in runtime/CI logs that envs are missing.
	// Runtime code should handle `undefined` supabase client accordingly.
	// IMPORTANT: Add these to your GitHub repository secrets for production builds.
	// See README or project maintainer for secret values.
	// eslint-disable-next-line no-console
	console.warn(
		'WARNING: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase client will be undefined. Add secrets in repo settings to enable Supabase features.'
	)
}

// Export client if envs exist, otherwise export undefined so build doesn't fail.
export const supabase: any = (supabaseUrl && supabaseAnonKey)
	? createClient(supabaseUrl, supabaseAnonKey)
	: undefined
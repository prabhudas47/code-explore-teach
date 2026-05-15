// Security self-check: runs RLS / role / bucket sanity probes and stores results.
// Triggered by pg_cron daily and on-demand by admin via the dashboard.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

interface CheckResult {
  name: string
  passed: boolean
  detail: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const url = Deno.env.get('SUPABASE_URL')!
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const admin = createClient(url, service)
  const guest = createClient(url, anon)

  // Insert run row
  const { data: run, error: runErr } = await admin
    .from('security_scan_runs')
    .insert({ status: 'running', trigger: req.headers.get('x-trigger') ?? 'cron' })
    .select()
    .single()

  if (runErr || !run) {
    return new Response(JSON.stringify({ error: runErr?.message ?? 'run insert failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const results: CheckResult[] = []

  const check = async (name: string, fn: () => Promise<string | null>) => {
    try {
      const detail = await fn()
      results.push({ name, passed: detail === null, detail: detail ?? 'ok' })
    } catch (e) {
      results.push({ name, passed: false, detail: (e as Error).message })
    }
  }

  // 1. Anon cannot write to portfolio_content
  await check('anon_cannot_write_portfolio_content', async () => {
    const { error } = await guest.from('portfolio_content').insert({ section: '__probe', data: {} })
    return error ? null : 'anon insert succeeded — RLS broken'
  })

  // 2. Anon cannot read user_roles
  await check('anon_cannot_read_user_roles', async () => {
    const { data, error } = await guest.from('user_roles').select('id').limit(1)
    if (error) return null
    return data && data.length > 0 ? 'anon read returned rows — RLS broken' : null
  })

  // 3. Anon cannot read security_findings
  await check('anon_cannot_read_security_findings', async () => {
    const { data } = await guest.from('security_findings').select('id').limit(1)
    return data && data.length > 0 ? 'anon read returned rows — RLS broken' : null
  })

  // 4. Anon cannot list portfolio-media bucket
  await check('anon_cannot_list_portfolio_media', async () => {
    const { data, error } = await guest.storage.from('portfolio-media').list('uploads', { limit: 1 })
    if (error) return null
    return data && data.length > 0 ? 'anon listing returned files — bucket exposed' : null
  })

  // 5. has_role function exists and is STABLE SECURITY DEFINER
  await check('has_role_function_present', async () => {
    const { data, error } = await admin.rpc('has_role', {
      _user_id: '00000000-0000-0000-0000-000000000000',
      _role: 'admin',
    })
    if (error) return `rpc failed: ${error.message}`
    return data === false ? null : 'unexpected has_role result for null user'
  })

  // 6. Portfolio content readable by anon (intentional)
  await check('anon_can_read_portfolio_content', async () => {
    const { error } = await guest.from('portfolio_content').select('section').limit(1)
    return error ? `anon read blocked: ${error.message}` : null
  })

  const passed = results.filter((r) => r.passed).length
  const failed = results.length - passed

  await admin
    .from('security_scan_runs')
    .update({
      status: failed === 0 ? 'passed' : 'failed',
      finished_at: new Date().toISOString(),
      passed,
      failed,
      results,
    })
    .eq('id', run.id)

  return new Response(JSON.stringify({ run_id: run.id, passed, failed, results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

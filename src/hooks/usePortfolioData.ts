import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const cache: Record<string, any> = {};
const listeners: Record<string, Set<() => void>> = {};

export function usePortfolioData<T>(section: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(cache[section] ?? fallback);
  const [loading, setLoading] = useState(!cache[section]);

  useEffect(() => {
    if (!listeners[section]) listeners[section] = new Set();
    const update = () => setData(cache[section] ?? fallback);
    listeners[section].add(update);

    if (!cache[section]) {
      supabase
        .from('portfolio_content')
        .select('data')
        .eq('section', section)
        .single()
        .then(({ data: row }) => {
          if (row?.data) {
            cache[section] = row.data;
            listeners[section]?.forEach(fn => fn());
          }
          setLoading(false);
        });
    }

    return () => { listeners[section]?.delete(update); };
  }, [section]);

  return { data, loading };
}

export async function updatePortfolioData(section: string, data: any) {
  const { error } = await supabase
    .from('portfolio_content')
    .update({ data, updated_at: new Date().toISOString() })
    .eq('section', section);
  if (error) throw error;
  cache[section] = data;
  listeners[section]?.forEach(fn => fn());
}

export async function fetchAllPortfolioData(): Promise<Record<string, any>> {
  const { data } = await supabase.from('portfolio_content').select('section, data');
  const result: Record<string, any> = {};
  data?.forEach(row => {
    result[row.section] = row.data;
    cache[row.section] = row.data;
  });
  return result;
}

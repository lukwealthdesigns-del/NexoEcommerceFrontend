import { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';

export function useRealtime(table, event, callback, filter = null) {
  const subscriptionRef = useRef(null);

  useEffect(() => {
    let channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: table,
          filter: filter,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [table, event, callback, filter]);
}
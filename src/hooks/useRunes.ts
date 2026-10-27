import { useEffect, useState } from 'react';
import { loadRunes, RiotAssetDictionary } from './runes';

export function useRunes(version: string): RiotAssetDictionary {
    const [runes, setRunes] = useState<RiotAssetDictionary>({});

    useEffect(() => {
        let cancelled = false;
        loadRunes(version)
            .then((dict) => !cancelled && setRunes(dict))
            .catch((e) => console.error('[useRunes] не вдалося завантажити руни', e));
        return () => {
            cancelled = true;
        };
    }, [version]);

    return runes;
}

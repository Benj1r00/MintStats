export type RiotAssetDictionary = Record<number, string | undefined>;

const cache = new Map<string, Promise<RiotAssetDictionary>>();

async function fetchRunes(version: string): Promise<RiotAssetDictionary> {
    const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/runesReforged.json`);
    if (!res.ok) throw new Error(`runesReforged.json: ${res.status}`);

    const styles = await res.json();
    const dict: RiotAssetDictionary = {};

    for (const style of styles) {
        dict[style.id] = style.icon;
        for (const slot of style.slots) {
            for (const rune of slot.runes) dict[rune.id] = rune.icon;
        }
    }
    return dict;
}

export function loadRunes(version: string): Promise<RiotAssetDictionary> {
    let promise = cache.get(version);
    if (!promise) {
        promise = fetchRunes(version).catch(async (err) => {
            cache.delete(version);
            const versions: string[] = await (
                await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
            ).json();
            if (versions[0] === version) throw err;
            return loadRunes(versions[0]);
        });
        cache.set(version, promise);
    }
    return promise;
}

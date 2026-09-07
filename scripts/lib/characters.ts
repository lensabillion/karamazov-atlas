/**
 * The character table: one entry per tracked person, with every name form the
 * Garnett text actually uses for them.
 *
 * This lives in its own module because both builders need it. Previously
 * build-names imported it from build-mentions, which meant build-mentions had
 * to guard against running its own main() on import — and that guard was
 * broken (review finding R4), so `npm run corpus` silently rebuilt nothing.
 * With the shared data extracted, neither builder imports the other and no
 * guard is needed.
 *
 * Every form here is asserted to occur at least once in the text; three real
 * Russian diminutives were removed after they were found to occur zero times
 * in this translation.
 */

export interface CharacterDef {
  id: string;
  name: string;
  /** Short label for graph nodes. */
  short: string;
  group: 'family' | 'women' | 'monastery' | 'boys' | 'court' | 'town';
  aliases: string[];
}

/**
 * Aliases are deliberately conservative: only forms that are unambiguous in this
 * novel. "the elder" (Zossima) and "the captain" (Snegiryov) are omitted because
 * they also refer to other people.
 */
export const CHARACTERS: CharacterDef[] = [
  { id: 'fyodor', name: 'Fyodor Pavlovitch Karamazov', short: 'Fyodor', group: 'family',
    aliases: ['Fyodor Pavlovitch'] },
  { id: 'dmitri', name: 'Dmitri Fyodorovitch Karamazov', short: 'Dmitri', group: 'family',
    aliases: ['Dmitri Fyodorovitch', 'Dmitri', 'Mitya', 'Mityenka'] },
  { id: 'ivan', name: 'Ivan Fyodorovitch Karamazov', short: 'Ivan', group: 'family',
    aliases: ['Ivan Fyodorovitch', 'Ivan'] },
  { id: 'alyosha', name: 'Alexey Fyodorovitch Karamazov', short: 'Alyosha', group: 'family',
    aliases: ['Alexey Fyodorovitch', 'Alyosha', 'Alexey'] },
  { id: 'smerdyakov', name: 'Pavel Smerdyakov', short: 'Smerdyakov', group: 'family',
    aliases: ['Pavel Fyodorovitch', 'Smerdyakov'] },

  { id: 'grushenka', name: 'Agrafena Alexandrovna Svyetlov', short: 'Grushenka', group: 'women',
    aliases: ['Agrafena Alexandrovna', 'Grushenka', 'Grusha'] },
  { id: 'katerina', name: 'Katerina Ivanovna Verhovtsev', short: 'Katerina', group: 'women',
    aliases: ['Katerina Ivanovna', 'Katerina', 'Katya'] },
  { id: 'hohlakov', name: 'Madame Hohlakov', short: 'Hohlakov', group: 'women',
    aliases: ['Madame Hohlakov', 'Hohlakov'] },
  { id: 'lise', name: 'Lise Hohlakov', short: 'Lise', group: 'women', aliases: ['Lise'] },

  { id: 'zossima', name: 'Father Zossima', short: 'Zossima', group: 'monastery',
    aliases: ['Father Zossima', 'Zossima'] },
  { id: 'ferapont', name: 'Father Ferapont', short: 'Ferapont', group: 'monastery',
    aliases: ['Father Ferapont', 'Ferapont'] },
  { id: 'paissy', name: 'Father Paissy', short: 'Paissy', group: 'monastery',
    aliases: ['Father Païssy', 'Païssy'] },
  { id: 'rakitin', name: 'Mihail Rakitin', short: 'Rakitin', group: 'monastery',
    aliases: ['Rakitin'] },

  { id: 'ilusha', name: 'Ilusha Snegiryov', short: 'Ilusha', group: 'boys',
    aliases: ['Ilusha'] },
  { id: 'kolya', name: 'Kolya Krassotkin', short: 'Kolya', group: 'boys',
    aliases: ['Krassotkin', 'Kolya'] },
  { id: 'snegiryov', name: 'Captain Snegiryov', short: 'Snegiryov', group: 'boys',
    aliases: ['Snegiryov'] },
  { id: 'smurov', name: 'Smurov', short: 'Smurov', group: 'boys', aliases: ['Smurov'] },

  { id: 'grigory', name: 'Grigory Kutuzov', short: 'Grigory', group: 'town',
    aliases: ['Grigory'] },
  { id: 'marfa', name: 'Marfa Ignatyevna', short: 'Marfa', group: 'town',
    aliases: ['Marfa Ignatyevna', 'Marfa'] },
  { id: 'samsonov', name: 'Kuzma Samsonov', short: 'Samsonov', group: 'town',
    aliases: ['Kuzma Samsonov', 'Samsonov'] },
  { id: 'lizaveta', name: 'Lizaveta Smerdyastchaya', short: 'Lizaveta', group: 'town',
    aliases: ['Lizaveta Smerdyastchaya', 'Lizaveta'] },
  { id: 'maximov', name: 'Maximov', short: 'Maximov', group: 'town', aliases: ['Maximov'] },
  { id: 'perhotin', name: 'Pyotr Perhotin', short: 'Perhotin', group: 'town',
    aliases: ['Perhotin'] },

  { id: 'prosecutor', name: 'Ippolit Kirillovitch', short: 'Prosecutor', group: 'court',
    aliases: ['Ippolit Kirillovitch'] },
  { id: 'fetyukovitch', name: 'Fetyukovitch', short: 'Fetyukovitch', group: 'court',
    aliases: ['Fetyukovitch'] },
  { id: 'nikolay', name: 'Nikolay Parfenovitch', short: 'Nikolay P.', group: 'court',
    aliases: ['Nikolay Parfenovitch'] },
  { id: 'trifon', name: 'Trifon Borissovitch', short: 'Trifon B.', group: 'court',
    aliases: ['Trifon Borissovitch'] },
];

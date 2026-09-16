import CharacterIllustration from './CharacterIllustration';
import { CHARACTER_ARTWORK } from '@/lib/character-artwork';

/** The generated study is always displayed with its provenance. */
export default function SmerdyakovStudy() {
  return (
    <CharacterIllustration artwork={CHARACTER_ARTWORK.smerdyakov!} eager className="smerdyakov-study" />
  );
}

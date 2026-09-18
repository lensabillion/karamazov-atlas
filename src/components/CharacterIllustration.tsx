import Image from 'next/image';
import type { CharacterArtwork } from '@/lib/character-artwork';
import './character-illustration.css';

/** Keeps each full composition and its attribution together wherever it appears. */
export default function CharacterIllustration({
  artwork,
  eager = false,
  className = '',
}: {
  artwork: CharacterArtwork;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={`character-illustration ${className}`}>
      <Image src={artwork.image} alt={artwork.alt}
        sizes="(max-width: 760px) 90vw, 45vw" loading={eager ? 'eager' : 'lazy'} />
      <figcaption>
        <span className="eyebrow">{artwork.title}</span>
        <span className="meta">
          AI-generated study after{' '}
          <a className="link" href={artwork.source ?? 'https://www.gw2ru.com/arts/1392-karamazov-illustrations-grigoriev'}>Boris Grigoriev’s illustration</a>.
        </span>
      </figcaption>
    </figure>
  );
}

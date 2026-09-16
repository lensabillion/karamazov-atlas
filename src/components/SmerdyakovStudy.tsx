import Image from 'next/image';
import smerdyakovStudy from '@/assets/artwork/smerdyakov-after-grigoriev.png';
import './smerdyakov-study.css';

/** The generated study is always displayed with its provenance. */
export default function SmerdyakovStudy() {
  return (
    <figure className="smerdyakov-study">
      <Image
        src={smerdyakovStudy}
        alt="A drawn study of Smerdyakov seated by a wooden door, turning his sharp, wary face over the shoulder of a heavy olive coat."
        sizes="(max-width: 760px) 90vw, 45vw"
        loading="eager"
      />
      <figcaption>
        <span className="eyebrow">Plate I · Pavel Smerdyakov</span>
        <span className="meta">
          AI-generated study after{' '}
          <a className="link" href="https://www.gw2ru.com/arts/1392-karamazov-illustrations-grigoriev">Boris Grigoriev’s illustration</a>.
        </span>
      </figcaption>
    </figure>
  );
}

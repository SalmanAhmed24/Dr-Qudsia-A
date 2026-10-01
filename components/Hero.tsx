import Image from "next/image";
import portrait from "@/public/qudsia-akram.jpg";
import { EMAIL } from "@/lib/site";
import { FACTS } from "@/lib/data";

function Chars({ word }: { word: string }) {
  return (
    <span className="mask">
      {word.split("").map((ch, i) => (
        <span className="ch" key={i}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="hero-text">
        <p className="hero-kicker reveal">
          <span className="pill">
            <b aria-hidden="true" />
            Kinnaird College for Women, Lahore
          </span>
        </p>
        <h1 id="name" aria-label="Dr Qudsia Akram">
          <span className="l1" aria-hidden="true">
            <Chars word="Dr" /> <Chars word="Qudsia" />
          </span>
          <span className="l2" aria-hidden="true">
            {/* <span className="mask">
              <span className="name-chip">Akram</span>
            </span> */}
            <Chars word="Akram" />
          </span>
        </h1>
        <p className="hero-lede reveal">
          Assistant Professor of International Relations.{" "}
          <span>
            I study how major powers, armed groups and sea lanes reshape the
            Middle East, South Asia and the Indian Ocean, and I teach the
            methods to study them well.
          </span>
        </p>
        <div className="hero-ctas reveal">
          <a className="btn btn-ink magnetic" href="#research">
            Explore the research
          </a>
          <a className="btn btn-soft magnetic" href={`mailto:${EMAIL}`}>
            Email me
          </a>
        </div>
        <ul className="facts reveal" aria-label="At a glance">
          {FACTS.map((f) => (
            <li key={f.label}>
              <strong data-count={f.value}>{f.value}</strong>
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="portrait">
        <span className="portrait-glow" aria-hidden="true" />
        <div className="portrait-frame">
          <Image
            src={portrait}
            alt="Dr Qudsia Akram"
            priority
            placeholder="blur"
            sizes="(max-width: 900px) 70vw, 36vw"
          />
        </div>
        <span className="portrait-ring" aria-hidden="true" />
      </div>
    </header>
  );
}

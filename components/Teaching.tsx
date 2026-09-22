import SplitHeading from "./SplitHeading";
import Marquee from "./Marquee";
import { COURSES, THESES_BS, THESES_MPHIL } from "@/lib/data";

export default function Teaching() {
  return (
    <section className="teach" id="teaching" aria-labelledby="teach-title">
      <div className="sec-head">
        <SplitHeading id="teach-title">Teaching at every level</SplitHeading>
        <p>Research methods sit at the heart of every course, from first-year undergraduates to doctoral candidates.</p>
      </div>
      <ul className="levels">
        {COURSES.map((c) => (
          <li className="level tilt" key={c.level}>
            <h3>
              {c.level} <small>{c.note}</small>
            </h3>
            <ul>
              {c.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Marquee top={THESES_MPHIL} bottom={THESES_BS} />
    </section>
  );
}

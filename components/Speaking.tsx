import SplitHeading from "./SplitHeading";
import Talks from "./Talks";
import { PANELS, TALKS } from "@/lib/data";

export default function Speaking() {
  return (
    <section className="speak" id="speaking" aria-labelledby="speak-title">
      <div className="sec-head">
        <SplitHeading id="speak-title">On stage, on panels, in the room</SplitHeading>
        <p>Nineteen conference papers since 2014, many presented alongside students I supervise.</p>
      </div>
      <div className="speak-grid">
        <Talks talks={TALKS} />
        <aside className="side-card" aria-labelledby="panels-title">
          <h3 id="panels-title">Recent panels and lectures</h3>
          <ul>
            {PANELS.map((p) => (
              <li key={p.title}>
                {p.title}
                <span>{p.where}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

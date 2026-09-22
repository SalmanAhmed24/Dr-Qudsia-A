import SplitHeading from "./SplitHeading";
import { DUTIES } from "@/lib/data";

export default function Service() {
  return (
    <section className="service" aria-labelledby="service-title">
      <div className="sec-head">
        <SplitHeading id="service-title">Behind the department</SplitHeading>
        <p>The quieter work that keeps a department growing.</p>
      </div>
      <ul className="duties">
        {DUTIES.map((d) => (
          <li key={d.title}>
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </li>
        ))}
        <li>
          <h3>Recognised by my alma mater</h3>
          <p>
            Listed among the{" "}
            <a href="https://alumni.lcwu.edu.pk/nalumni.php" rel="noopener noreferrer" target="_blank">
              notable alumni of Lahore College for Women University
            </a>
            .
          </p>
        </li>
      </ul>
    </section>
  );
}

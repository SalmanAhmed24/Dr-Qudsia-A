import SplitHeading from "./SplitHeading";
import { EMAIL } from "@/lib/site";

export default function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <SplitHeading id="contact-title">Let’s talk about the world</SplitHeading>
      <p>For conference invitations, research collaboration, guest lectures or supervision enquiries.</p>
      <a className="btn magnetic" href={`mailto:${EMAIL}`}>
        Email me
      </a>
      <a className="mail" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
    </section>
  );
}

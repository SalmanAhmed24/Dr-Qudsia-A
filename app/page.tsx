import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Atlas from "@/components/Atlas";
import Journey from "@/components/Journey";
import Teaching from "@/components/Teaching";
import Speaking from "@/components/Speaking";
import Service from "@/components/Service";
import Contact from "@/components/Contact";
import Animations from "@/components/Animations";

export default function Home() {
  const year = new Date().getFullYear();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="wash" aria-hidden="true">
        <span className="w1" />
        <span className="w2" />
        <span className="w3" />
      </div>
      <div className="progress" aria-hidden="true">
        <i />
      </div>
      <Nav />
      <main id="main">
        <Atlas hero={<Hero />} />
        <Journey />
        <Teaching />
        <Speaking />
        <Service />
        <Contact />
      </main>
      <footer>
        <p>© {year} Dr Qudsia Akram</p>
        <p>Department of International Relations, Kinnaird College for Women, Lahore</p>
      </footer>
      <Animations />
    </>
  );
}

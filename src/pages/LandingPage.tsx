import { Link } from "react-router-dom";
import { APP_NAME } from "../config";
import { Button } from "../components/Button";

const steps = [
  {
    title: "Last opp",
    description: "Velg filen din, legg til emnekode og sett riktig pris. Alt lagres lokalt."
  },
  {
    title: "Sett pris",
    description: "Du beholder 90 % av salgsprisen. Plattformgebyret er kun 10 %."
  },
  {
    title: "Få utbetalt",
    description:
      "Vipps- og kortbetaling er klar i arkitekturen. I MVP-en simulerer vi transaksjonen."
  }
];

const howItWorks = [
  "Finn dokumenter og notater tilpasset ditt studieprogram i Skandinavia.",
  "Sjekk vurderinger fra andre studenter og se hva som selger best.",
  "Kjøp med simulert Vipps/kort i MVP-en – ekte betaling kobles på i neste versjon.",
  "Selgere får 90 % av inntektene direkte inn på saldoen sin."
];

export const LandingPage = () => (
  <div>
    <section className="landing-hero section">
      <div className="container landing-hero__inner">
        <div className="landing-hero__content">
          <h1>NordNotes – Notatmarkedet der studenten får 90 %</h1>
          <p className="landing-hero__subtitle">
            Kjøp og selg notater, sammendrag og eksamensbesvarelser. Raskt, rettferdig og
            skreddersydd for studenter i Skandinavia.
          </p>
          <div className="landing-hero__actions">
            <Link to="/dokumenter">
              <Button size="lg">Se notater</Button>
            </Link>
            <Link to="/selger">
              <Button size="lg" variant="secondary">
                Selg notater
              </Button>
            </Link>
          </div>
          <p className="landing-hero__note">
            {APP_NAME} tar kun 10 % – sammenlignet med tradisjonelle markedsplasser som tar
            30–35 %.
          </p>
        </div>
        <div className="landing-hero__visual card">
          <h2>Vipps-klar arkitektur</h2>
          <p>
            Betalinger simuleres nå, men koden er klar for Vipps, Stripe eller Nets når vi
            kobler til ekte backend.
          </p>
          <ul>
            <li>• 10 % plattformgebyr</li>
            <li>• 90 % direkte til selgeren</li>
            <li>• Moderne SPA klar for GitHub Pages</li>
            <li>• Lokale universiteter og språkvalg</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="section landing-steps">
      <div className="container">
        <h2>Slik fungerer det</h2>
        <div className="landing-steps__grid">
          {steps.map((step) => (
            <div key={step.title} className="card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section landing-how">
      <div className="container landing-how__inner card">
        <h2>Hvordan fungerer {APP_NAME}?</h2>
        <ul>
          {howItWorks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="section landing-highlight">
      <div className="container landing-highlight__inner card">
        <h2>Bygd for studenter i Norge, Sverige og Danmark</h2>
        <p>
          Vi støtter universiteter, språk og kurskoder fra hele Skandinavia. Når ekte
          betalinger aktiveres, er Vipps og Stripe klar til å plugges inn.
        </p>
        <div className="landing-highlight__flags">
          <span>🇳🇴 Norge</span>
          <span>🇸🇪 Sverige</span>
          <span>🇩🇰 Danmark</span>
        </div>
      </div>
    </section>
  </div>
);


import { useState } from "react";
import { Button } from "../components/Button";
import { Input, TextArea } from "../components/Input";

export const ContactPage = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
  };

  return (
    <div className="section">
      <div className="container card contact-card">
        <h1>Kontakt</h1>
        <p>
          Dette er en demoversjon. Skjemaet under sender ikke ekte e-post, men viser hvordan
          kontaktflyten kan se ut.
        </p>

        {hasSubmitted ? (
          <div className="profile-message">
            Takk! Meldingen er simulert sendt. Vi tar kontakt så snart ekte support er på plass.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <Input label="Navn" required placeholder="Fullt navn" />
            <Input label="E-post" type="email" required placeholder="epost@student.no" />
            <TextArea label="Melding" required placeholder="Hva kan vi hjelpe med?" />
            <Button type="submit">Send (demo)</Button>
          </form>
        )}
      </div>
    </div>
  );
};


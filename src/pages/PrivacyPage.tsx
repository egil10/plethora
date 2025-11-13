export const PrivacyPage = () => (
  <div className="section">
    <div className="container card">
      <h1>Personvern (demo)</h1>
      <p>
        NordNotes lagrer ikke persondata på server i denne MVP-en. All data – brukere,
        dokumenter, kjøp og vurderinger – ligger kun i localStorage på maskinen du bruker.
      </p>
      <h2>Data som lagres lokalt</h2>
      <ul>
        <li>Valgt demobruker</li>
        <li>Fiktive dokumenter, transaksjoner og vurderinger</li>
        <li>Eventuelle dokumenter du legger til i demoen</li>
      </ul>
      <p>
        Når en backend settes opp i neste fase, vil vi implementere full personvernerklæring og
        slettingsrutiner. Inntil videre kan du nullstille all data ved å tømme nettleserens
        localStorage.
      </p>
    </div>
  </div>
);


export const AboutPage = () => (
  <div className="section">
    <div className="container card">
      <h1>Om NordNotes</h1>
      <p>
        NordNotes er bygget for studenter i Norge, Sverige og Danmark som ønsker en rettferdig
        markedsplass for studie­notater. Plattformen viser hva som er mulig med moderne
        frontend-teknologi, selv før en ekte backend er på plass.
      </p>
      <p>
        Denne MVP-en er utviklet som en statisk SPA for GitHub Pages. Alle data lagres lokalt i
        nettleserens localStorage. Betalinger er simulert, men strukturen gjør det enkelt å
        koble på Vipps, Stripe eller Nets i neste versjon.
      </p>
      <p>
        Målet er en plattform med lavt gebyr (10 %) som gir skapere av innhold bedre
        inntjening, og kjøpere trygghet i kvalitetsnotater med vurderinger fra medstudenter.
      </p>
    </div>
  </div>
);


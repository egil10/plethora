import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { BrowseDocumentsPage } from "./pages/BrowseDocumentsPage";
import { DocumentDetailPage } from "./pages/DocumentDetailPage";
import { SellerDashboardPage } from "./pages/SellerDashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dokumenter" element={<BrowseDocumentsPage />} />
      <Route path="/dokument/:id" element={<DocumentDetailPage />} />
      <Route path="/selger" element={<SellerDashboardPage />} />
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/om" element={<AboutPage />} />
      <Route path="/vilkar" element={<TermsPage />} />
      <Route path="/personvern" element={<PrivacyPage />} />
      <Route path="/kontakt" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
);

export default App;


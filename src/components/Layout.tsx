import { Footer } from "./Footer";
import { Header } from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div className="layout">
    <Header />
    <main className="layout__content">{children}</main>
    <Footer />
  </div>
);


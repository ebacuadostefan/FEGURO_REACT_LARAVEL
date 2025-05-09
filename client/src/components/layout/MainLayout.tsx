import { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

interface MainLayoutProps {
  content: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ content }) => {
  return (
    <section className="d-flex flex-row w-100 min-vh-100">
      {/* Sidebar */}
      <Sidebar />

      <div
        className="d-flex flex-column w-100 h-100 bg-light content-area">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <div className="container h-100 overflow-auto p-4 mt-1">{content}</div>
      </div>
    </section>
  );
};

export default MainLayout;
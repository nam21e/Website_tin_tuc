import Navbar from "../components/Navbar";

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
}
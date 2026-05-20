/**
 * Route: * (catch-all)
 * 404 page for unknown routes.
 */
import { useNavigate } from "react-router-dom";
import BrandLayout from "../components/BrandLayout";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <BrandLayout onHome={() => navigate("/")} onLeaderboard={() => navigate("/leaderboard")}>
      <div className="flex items-center justify-center min-h-[calc(100vh-72px)] px-6">
        <div className="brand-card brand-card-accent px-10 py-14 text-center max-w-md w-full">
          <p className="text-[#e91e8c] text-7xl font-extrabold mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-[#8888aa] text-sm mb-8">
            The page you're looking for doesn't exist.
          </p>
          <button onClick={() => navigate("/")} className="btn-pink btn-lg px-10">
            ← Go Home
          </button>
        </div>
      </div>
    </BrandLayout>
  );
}

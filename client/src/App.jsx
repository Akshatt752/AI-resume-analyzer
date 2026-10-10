import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="font-mono text-xs text-accent">404</p>
      <h1 className="mt-4 font-serif text-5xl">This page isn't in the pile.</h1>
      <p className="mt-4 text-ink-2">The link may be old, or the report was deleted.</p>
      <Link to="/" className="btn-primary mt-10">
        Back to the start
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/analysis/:id" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

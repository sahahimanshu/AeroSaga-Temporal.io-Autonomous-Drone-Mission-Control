import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap/LiveMap.jsx";
import MyMissions from "./pages/MyMissions/MyMissions.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="/live-map" element={<LiveMap />} />

        <Route path="/my-missions" element={<MyMissions />} />

        <Route
          path="/"
          element={<Navigate to="/register" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/register" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
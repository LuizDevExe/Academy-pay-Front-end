import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Charge from "./pages/Charge/Charge.jsx";
import ClientPage from "./pages/ClientPage/ClientPage";
import ClientPerfil from "./pages/ClientPerfil/ClientPerfil";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import { retrieveAndDecrypt } from "./utils/storage";

function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = retrieveAndDecrypt("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

  

function MainRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route path="/" element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
      </Route>
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<ProtectedRoutes redirectTo={"/sign-in"} />}>
        <Route path="/home" element={<Navbar />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/clientes" element={<Navbar />}>
          <Route path="/clientes" element={<ClientPage />} />
          <Route path="/clientes/:filter" element={<ClientPage />} />
        </Route>
        <Route path="/clientes/detalhes-do-cliente" element={<Navbar />}>
          <Route
            path="/clientes/detalhes-do-cliente/:client_id"
            element={<ClientPerfil />}
          />
        </Route>
        <Route path="/cobrancas" element={<Navbar />}>
          <Route path="/cobrancas" element={<Charge />} />
          <Route path="/cobrancas:filter" element={<Charge />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default MainRoutes;

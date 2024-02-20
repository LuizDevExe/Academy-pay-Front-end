import { NavLink, Outlet } from "react-router-dom";
import ChargeIcon from "../../assets/ChargeIcon.svg";
import ChargeIconActive from "../../assets/ChargeIconActive.svg";
import ClientIcon from "../../assets/ClientIcon.svg";
import ClientIconActive from "../../assets/ClientIconActive.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import HomeIconActive from "../../assets/HomeIconActive.svg";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="container-navbar">
      <nav>
        <section className="navbar-btns">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive && "navbar-active-btn"
            }
          >
            {({ isActive}) => (
              <div>
                <img src={isActive ? HomeIconActive : HomeIcon } alt="Atalho para página home"/>
                <span>Home</span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              isActive && "navbar-active-btn"
            }
          >
            {({ isActive}) => (
              <div>
                <img src={ isActive ? ClientIconActive : ClientIcon } alt="atalho para página clientes"/>
                <span>Clientes</span>
              </div>
            )}
          </NavLink>
          <NavLink
            to="/cobrancas"
            className={({ isActive }) =>
              isActive && "navbar-active-btn"
            }
          >
            {({ isActive}) => (
              <div>
                <img src={isActive ? ChargeIconActive : ChargeIcon } alt="atalho para página cobranças"/>
                <span>Cobranças</span>
              </div>
            )}
          </NavLink>
        </section>
      </nav>

      <div className="container-outlet-pages">
        <Outlet/>
      </div>
    </div>
  );
}

export default Navbar;

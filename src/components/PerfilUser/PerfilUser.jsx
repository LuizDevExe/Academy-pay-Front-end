import React from "react";
import "./PerfilUser.css";
import { retrieveAndDecrypt } from "../../utils/storage";
import PopOverButton from "../../assets/PopOverButton.svg";

function PerfilUser({ isOpenEditUserPopUp, setIsOpenEditUserPopUp }) {
  function getName() {
    if (localStorage.getItem("token")) {
      return retrieveAndDecrypt("name");
    }
    return;
  }

  const decryptedName = getName();

  function splitName() {
    const treatedName = decryptedName.name.split(" ");
    const firstName = treatedName[0];
    const secondName = treatedName[1];

    return `${firstName} ${secondName}`;
  }

  const treatedName = splitName();

  function generateInitials(name) {
    const localName = name.split(" ");

    const nameInitial = localName[0][0];
    const secondNameInitial = localName[1][0];

    return nameInitial + secondNameInitial;
  }

  const initials = generateInitials(decryptedName.name);

  function handleOpenPopUp() {
    setIsOpenEditUserPopUp(!isOpenEditUserPopUp);
  }

  return (
    <div className="container-user-content">
      <div className="container-user-initial">
        <h2>{initials}</h2>
      </div>
      <div className="container-user-content-data">
        <h3>{treatedName.toLowerCase()}</h3>
        <img
          src={PopOverButton}
          alt="botão com função de mostrar opções para edição de usuário e navegação"
          onClick={handleOpenPopUp}
        />
      </div>
    </div>
  );
}

export default PerfilUser;

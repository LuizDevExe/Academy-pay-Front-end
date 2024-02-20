import React from "react";
import "./SuccessPopUp.css";
import SuccessPopUpImg from "../../assets/SuccessPopUp.svg";
import ClosePopUp from "../../assets/ClosePopUp.svg";

function SuccessPopUp({ setIsOpenSuccessPopUp, SuccessText }) {
  setTimeout(() => {
    setIsOpenSuccessPopUp(false);
  }, 3000);

  return (
    <div className="container-success-popUp">
      <div className="container-succes-popUp-content">
        <img
          src={SuccessPopUpImg}
          alt="ícone indicando que o cadastro de cliente foi concluído"
        />
        <span>{SuccessText}</span>
      </div>
      <img
        src={ClosePopUp}
        alt="Botão para fechamento do PopUp de sucesso"
        onClick={() => setIsOpenSuccessPopUp(false)}
      />
    </div>
  );
}

export default SuccessPopUp;

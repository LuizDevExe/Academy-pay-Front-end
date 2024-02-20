import React from 'react'
import './FailPopUp.css'
import FailPopUpImg from '../../assets/FailPopUp.svg'
import ClosePopUp from '../../assets/ClosePopUp.svg'

export default function FailPopUp({ setIsOpenSuccessPopUp, FailText }) {

  setTimeout(() => {
    setIsOpenSuccessPopUp(false)
  }, 3000);

  return (
    <div className='container-fail-popUp'>
      <div className='container-fail-popUp-content'>
        <img src={FailPopUpImg} alt='Mensagem de erro referente a ultima ação realizada' />
        <span>{FailText}</span>
      </div>
      <img
        src={ClosePopUp} alt='Botão para fechamento do PopUp de sucesso'
        onClick={() => setIsOpenSuccessPopUp(false)}
      />
    </div>
  )
}
import React from 'react';
import './ModalDeleteBilling.css';
import AtentionIcon from '../../assets/atention-icon.svg'
import closeIcon from '../../assets/closeIcon.svg'
import api from '../../services/api';
import { retrieveAndDecrypt, clearAll } from '../../utils/storage';
import { useNavigate } from 'react-router-dom';


export default function ModalDeleteBilling({ setIsOpen, idBill, setIsSucess }) {

    const tokenAPI = retrieveAndDecrypt("token");

    const headersAPI = {
        "Content-Type": "application/json",
        Authorization: tokenAPI.token,
    };

    const navigate = useNavigate();

    async function deleteBill() {
        try {
            await api.delete(`/deleteBill/${idBill}`, { headers: headersAPI })
        } 
        catch (error) {
            if (error.response.data.message === 'usuário não autorizado') {
                clearAll();
                navigate('/sign-in');
              }
        }

        setTimeout(() => {
            setIsOpen(false)
            setIsSucess(true)
        }, 1000);
    }

    return (
        <div className='modal-delete-billing-page'>
            <div className='modal-delete-billing-container'>
                <img
                    className='modal-delete-billing-close-icon'
                    src={closeIcon} alt="botao de fechar"
                    onClick={() => setIsOpen(false)}
                />
                <img className='modal-delete-billing-img-atention' src={AtentionIcon} alt="icone de atencao" />
                <h2>Tem certeza que deseja excluir esta cobrança?</h2>
                <div className='modal-delete-billing-buttons'>
                    <button
                        onClick={() => setIsOpen(false)}
                    >
                        Não
                    </button>
                    <button
                        onClick={() => deleteBill()}
                    >
                        Sim
                    </button>
                </div>
            </div>
        </div>
    );
};
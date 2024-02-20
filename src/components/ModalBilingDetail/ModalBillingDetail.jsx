import React, { useEffect, useState } from "react";
import closeIcon from "../../assets/closeIcon.svg";
import fileIcon from "../../assets/fileIcon.svg";
import loadingImg from "../../assets/loading-icon.svg";
import api from "../../services/api";
import { retrieveAndDecrypt, clearAll} from "../../utils/storage";
import "./ModalBillingDetail.css";
import { formatCurrency, formatDate } from "../../utils/storage";
import PendingTag from "../../assets/tagpendente.svg";
import ExpiredTag from "../../assets/tagVencida.svg";
import PaidTag from "../../assets/tagPaga.svg";
import { useNavigate } from "react-router-dom";

export default function ModalBillingDetail({ setIsOpen, idBill, idClient }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("PAGA");

    const tokenAPI = retrieveAndDecrypt("token");

    const [isLoad, setIsLoad] = useState(false);

    const headersAPI = {
        "Content-Type": "application/json",
        Authorization: tokenAPI.token,
    };

    const navigate = useNavigate();

    async function getBill() {
        if (idBill) {
            try {
                const response = await api.get(`/getBill/${idBill}`, {
                    headers: headersAPI,
                });

                setDescription(response.data.description);
                setExpirationDate(response.data.due_date.substring(0, 10));
                setAmount(`${response.data.value}`);
                setStatus(response.data.status);
            } 
            catch (error) {
                if (error.response.data.message === 'usuário não autorizado') {
                    clearAll();
                    navigate('/sign-in');
                  }
             }
        }

        try {
            const response = await api.get(`/getClient/${idClient}`, {
                headers: headersAPI,
            });

            setName(response.data.name);
            setIsLoad(true);
        } 
        catch (error) { 
            if (error.response.data.message === 'usuário não autorizado') {
                clearAll();
                navigate('/sign-in');
              }
        }
    }

    useEffect(() => {
        getBill();
    });

    function statusTag(status) {
        if (status === "PENDENTE") {
            return PendingTag;
        }
        if (status === "VENCIDA") {
            return ExpiredTag;
        }
        if (status === "PAGA") {
            return PaidTag;
        }
    }

    return (
        <div>
            <div className="billing-detail-modal-page">
                {isLoad ? "" : <img src={loadingImg} alt="Imagem Loading" />}
                <div
                    className="billing-detail-modal-container"
                    style={{ display: isLoad ? "flex" : "none" }}
                >
                    <img
                        className="billing-detail-modal-close-icon"
                        src={closeIcon}
                        alt="Fechar modal"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="billing-detail-modal-header">
                        <img
                            className="billing-detail-modal-file-icon"
                            src={fileIcon}
                            alt="Ícone de arquivo"
                        />
                        <h2>Detalhe da Cobrança</h2>
                    </div>

                    <div className="billing-detail-modal-form">
                        <div>
                            <div className="billing-detail-modal-name-description">
                                <h3>Nome</h3>
                                <p>{name}</p>

                                <h3>Descrição</h3>
                                <p style={{ maxWidth: "525px", overflowY: "auto" }}>
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="billing-detail-modal-maturity-value">
                            <div>
                                <h3>Vencimento</h3>
                                <p>{formatDate(expirationDate)}</p>
                            </div>

                            <div>
                                <h3>Valor</h3>
                                <p>{formatCurrency(amount)}</p>
                            </div>
                        </div>

                        <div className="billing-detail-modal-id-status">
                            <div>
                                <h3>ID cobrança</h3>
                                <p>{idBill}</p>
                            </div>

                            <div>
                                <h3>Status</h3>
                                <p>
                                    <img src={statusTag(status)} alt="" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
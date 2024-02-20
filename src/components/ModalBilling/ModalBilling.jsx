import React, { useEffect } from "react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import "./ModalBilling.css";
import closeIcon from "../../assets/closeIcon.svg";
import api from "../../services/api";
import { retrieveAndDecrypt, clearAll } from "../../utils/storage";
import emptyCheck from "../../assets/empy-circle-checkbox.svg";
import circleCheck from "../../assets/check-circle-checkbox.svg";
import fileIcon from "../../assets/fileIcon.svg";
import loadingImg from "../../assets/loading-icon.svg";
import { useNavigate } from "react-router-dom";

export default function ModalBilling({
  setIsOpen,
  setIsOpenSuccessPopUp,
  idBill,
  idClient,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PAGA");

  const [expirationDateSpan, setExpirationDateSpan] = useState("");
  const [amountSpan, setAmountSpan] = useState("");

  const tokenAPI = retrieveAndDecrypt("token");
  const idUser = retrieveAndDecrypt("id");

  const [isLoad, setIsLoad] = useState(false);

  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  const navigate = useNavigate();

  async function getClient() {
    if (idBill) {
      try {
        const response = await api.get(`/getBill/${idBill}`, {
          headers: headersAPI,
        });

        setDescription(response.data.description);
        setExpirationDate(response.data.due_date.substring(0, 10));
        setAmount(`${response.data.value / 100}`);
        setStatus(response.data.status);
      } catch (error) {
        //add catch
      }
    }

    try {
      const response = await api.get(`/getClient/${idClient}`, {
        headers: headersAPI,
      });

      setName(response.data.name);
      setIsLoad(true);
    } catch (error) {
      //add catch
    }
  }

  useEffect(() => {
    getClient();
  }, []);

  function getCurrentDate() {
    const currentDate = new Date();

    const day = currentDate.getDate();
    const mounth = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    return `${year}-${mounth}-${day}`;
  }

  async function validateSubmit() {
    if (!expirationDate) {
      setExpirationDateSpan("Este campo deve ser preenchido");
      return;
    } else {
      setExpirationDateSpan("");
    }
    if (!amount) {
      setAmountSpan("Este campo deve ser preenchido");
      return;
    } else {
      setAmountSpan("");
    }

    let data = {};
    let value = amount.replace(/[^\d,]/g, "").replace(",", ".") * 100;

    data = {
      description,
      payment_date: status === "PAGA" ? getCurrentDate() : null,
      due_date: expirationDate,
      value,
      status,
    };

    if (idBill) {
      try {
        await api.put(`/editBilling/${idBill}`, data, { headers: headersAPI });
      } catch (error) {
        return;
      }
    } else {
      try {
        await api.post(`/registerBilling/${idUser.id}/${idClient}`, data, {
          headers: headersAPI,
        });
      }
      catch (error) {
        if (error.response.data.message === 'usuário não autorizado') {
          clearAll();
          navigate('/sign-in');
        }
        return;
      }
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsOpenSuccessPopUp(true);
      idClient = null;
    }, 1000);
  }

  return (
    <div>
      <div className="billing-registration-modal-page">
        {isLoad ? "" : <img src={loadingImg} alt="icone de carregamento" />}
        <div
          className="billing-registration-modal-container"
          style={{ display: isLoad ? "flex" : "none" }}
        >
          <img
            className="billing-registration-modal-close-icon"
            src={closeIcon}
            alt="fechar modal"
            onClick={() => setIsOpen(false)}
          />

          <div className="billing-registration-modal-header">
            <img
              className="billing-registration-modal-client-icon"
              src={fileIcon}
              alt="Ícone Cliente"
            />
            <h2>{idBill ? "Editar Cobrança" : "Cadastro de Cobrança"}</h2>
          </div>

          <div className="billing-registration-modal-form">
            <div>
              <label htmlFor="name">Nome</label>
              <input
                disabled
                type="text"
                name="name"
                placeholder="Digite o nome"
                maxLength={40}
                value={name}
              />
            </div>

            <div className="billing-textarea-container">
              <h3 htmlFor="description">Descrição</h3>
              <textarea
                type="textarea"
                name="description"
                placeholder="Digite a descrição"
                maxLength={300}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="billing-registration-modal-cpf-phone">
              <div
                className="billing-registration-modal-cpf"
                style={{ marginBottom: amountSpan ? "23px" : "" }}
              >
                <label htmlFor="expired-date">Vencimento*</label>
                <input
                  type="date"
                  name="expired-date"
                  placeholder="Digite o CPF"
                  maxLength={14}
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  style={{
                    border: expirationDateSpan ? "1px solid #E70000" : "",
                  }}
                />
                <span>{expirationDateSpan}</span>
              </div>
              <div
                className="billing-registration-modal-phone"
                style={{ marginBottom: expirationDateSpan ? "23px" : "" }}
              >
                <label htmlFor="phone">Valor*</label>
                <NumericFormat
                  name="expiration"
                  placeholder="Digite o valor"
                  maxLength={30}
                  value={amount}
                  allowNegative={false}
                  allowLeadingZeros={true}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ border: amountSpan ? "1px solid #E70000" : "" }}
                />
                <span>{amountSpan}</span>
              </div>
            </div>

            <div className="billing-textarea-container">
              <h3 htmlFor="description">Status*</h3>
              <div
                className="billing-modal-checkbox-container"
                onClick={() => setStatus("PAGA")}
              >
                {status === "PAGA" ? (
                  <img src={circleCheck} alt="Paga está selecionada" />
                ) : (
                  <img src={emptyCheck} alt="Paga não está selecionada" />
                )}
                <h3>Cobrança Paga</h3>
              </div>
              <div
                className="billing-modal-checkbox-container"
                onClick={() => setStatus("PENDENTE")}
              >
                {status === "PENDENTE" ? (
                  <img src={circleCheck} alt="Pendente está selecionada" />
                ) : (
                  <img src={emptyCheck} alt="Pendente não está selecionada" />
                )}
                <h3>Cobrança Pendente</h3>
              </div>
            </div>
          </div>

          <div className="billing-registration-modal-buttons">
            <button
              className="billing-registration-modal-button-cancel"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="billing-registration-modal-button-submit"
              onClick={() => validateSubmit()}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

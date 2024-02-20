import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientIcon from "../../assets/ClientIcon.svg";
import closeIcon from "../../assets/closeIcon.svg";
import loadingImg from "../../assets/loading-icon.svg";
import api from "../../services/api";
import { clearAll, cpfMask, phoneMask, retrieveAndDecrypt } from "../../utils/storage";
import "./ModalClientRegister.css";

export default function ModalClientRegister({
  setIsOpen,
  setIsOpenSuccessPopUp,
  idClient,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [complementary_address, setComplementary_address] = useState("");
  const [zip_code, setZip_code] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [nameSpan, setNameSpan] = useState("");
  const [emailSpan, setEmailSpan] = useState("");
  const [cpfSpan, setCpfSpan] = useState("");
  const [phoneSpan, setPhoneSpan] = useState("");

  const [isLoad, setIsLoad] = useState(false);

  const user_id = retrieveAndDecrypt("id");

  const tokenAPI = retrieveAndDecrypt("token");

  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  const navigate = useNavigate();

  async function getClient() {
    if (idClient) {
      try {
        const response = await api.get(`/getClient/${idClient}`, {
          headers: headersAPI,
        });

        setName(response.data.name);
        setEmail(response.data.email);
        setCpf(cpfMask(response.data.cpf));
        setPhone(phoneMask(response.data.phone));
        setAddress(response.data.address);
        setComplementary_address(response.data.complementary_address);
        setZip_code(response.data.zip_code);
        setNeighborhood(response.data.neighborhood);
        setCity(response.data.city);
        setState(response.data.state);
        setIsLoad(true);
      } catch (error) {
        if (error.response.data.message === 'usuário não autorizado') {
          clearAll();
          navigate('/sign-in');
        }
        return;
      }
    } else {
      setIsLoad(true);
    }
  }

  useEffect(() => {
    getClient();
  }, []);

  async function zipCode(e) {
    setZip_code(e);

    const cep = e.replace(/\D/g, "");

    if (cep.length === 8) {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      setCity(data.localidade);
      setState(data.uf);
      setAddress(data.logradouro);
      setNeighborhood(data.bairro);
    }
  }

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");

    setCpf(cpf);

    if (cpf.length !== 11) {
      return false;
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf[i - 1]) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf[9])) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf[i - 1]) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf[10])) {
      return false;
    }

    return true;
  };

  async function validadeSubmit() {
    let isOk = false;

    if (!name) {
      setNameSpan("Esse campo deve ser preenchido");
      isOk = false;
      return;
    } else {
      setNameSpan("");
      isOk = true;
    }

    function validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (!validateEmail(email)) {
      setEmailSpan("Insira um email válido");
      isOk = false;
      return;
    } else {
      setEmailSpan("");
      isOk = true;
    }

    if (!email) {
      setEmailSpan("Esse campo deve ser preenchido");
      isOk = false;
      return;
    } else {
      setEmailSpan("");
      isOk = true;
    }

    if (!cpf) {
      setCpfSpan("Esse campo deve ser preenchido");
      isOk = false;
      return;
    } else {
      setCpfSpan("");
      isOk = true;
    }

    if (!validateCPF(cpf)) {
      setCpfSpan("CPF Inválido");
      isOk = false;
      return;
    } else {
      setCpfSpan("");
      isOk = true;
    }

    if (!phone) {
      setPhoneSpan("Esse campo deve ser preenchido");
      isOk = false;
      return;
    } else {
      setPhoneSpan("");
      isOk = true;
    }

    if (idClient) {
      try {
        const data = {
          id: idClient,
          name,
          email,
          cpf: cpf.replace(/\D/g, ""),
          phone,
          address,
          complementary_address,
          zip_code,
          neighborhood,
          city,
          state,
        };
        await api.put(`/editClient/${user_id.id}`, data, {
          headers: headersAPI,
        });

        if (isOk) {
          setTimeout(() => {
            setIsOpen(false);
            setIsOpenSuccessPopUp(true);
          }, 1000);
        }
      } catch (error) {
        if (
          error.response.data.message ===
          "Erro: CPF já cadastrado para outro cliente"
        ) {
          setCpfSpan("CPF já cadastrado");
        }

        if (
          error.response.data.message ===
          "Erro: E-mail já cadastrado para outro cliente"
        ) {
          setEmailSpan("Email já cadastrado");
        }
        return;
      }
    } else {
      try {
        const data = {
          name,
          email,
          cpf: cpf.replace(/\D/g, ""),
          phone,
          address,
          complementary_address,
          zip_code,
          neighborhood,
          city,
          state,
        };
        await api.post(`/registerClient/${user_id.id}`, data, {
          headers: headersAPI,
        });
      } catch (error) {
        if (
          error.response.data.message === "Erro: Esse CPF ja está cadastrado"
        ) {
          setCpfSpan("CPF já cadastrado");
        }

        console.log(error);
        return;
      }

      if (isOk) {
        setTimeout(() => {
          setIsOpen(false);
          setIsOpenSuccessPopUp(true);
        }, 1000);
      }
    }
  }

  return (
    <div>
      <div className="customer-registration-modal-page">
        {isLoad ? "" : <img src={loadingImg} />}
        <div
          className="customer-registration-modal-container"
          style={{ display: isLoad ? "flex" : "none" }}
        >
          <img
            className="customer-registration-modal-close-icon"
            src={closeIcon}
            alt="fechar modal"
            onClick={() => setIsOpen(false)}
          />

          <div className="customer-registration-modal-header">
            <img
              className="customer-registration-modal-client-icon"
              src={ClientIcon}
              alt="Ícone Cliente"
            />
            <h2>{idClient ? "Editar cliente" : "Cadastro do cliente"}</h2>
          </div>

          <div className="customer-registration-modal-form">
            <div>
              <label htmlFor="name">Nome*</label>
              <input
                type="text"
                name="name"
                placeholder="Digite o nome"
                maxLength={40}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ border: nameSpan ? "1px solid #E70000" : "" }}
              />
              <span>{nameSpan}</span>
            </div>

            <div>
              <label htmlFor="email">E-mail*</label>
              <input
                type="text"
                name="email"
                placeholder="Digite o e-mail"
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: emailSpan ? "1px solid #E70000" : "" }}
              />
              <span>{emailSpan}</span>
            </div>

            <div className="customer-registration-modal-cpf-phone">
              <div className="customer-registration-modal-cpf">
                <label htmlFor="cpf">CPF*</label>
                <input
                  type="text"
                  name="cpf"
                  placeholder="Digite o CPF"
                  maxLength={14}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  style={{ border: cpfSpan ? "1px solid #E70000" : "" }}
                />
                <span>{cpfSpan}</span>
              </div>
              <div className="customer-registration-modal-phone">
                <label htmlFor="phone">Telefone*</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Digite o telefone"
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ border: phoneSpan ? "1px solid #E70000" : "" }}
                />
                <span>{phoneSpan}</span>
              </div>
            </div>

            <div className="customer-registration-modal-cep-neighborhood">
              <div className="customer-registration-modal-cep">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  name="zip_code"
                  placeholder="Digite o CEP"
                  maxLength={9}
                  value={zip_code}
                  onChange={(e) => zipCode(e.target.value)}
                />
              </div>
              <div className="customer-registration-modal-neighborhood">
                <label htmlFor="neighborhood">Bairro</label>
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Digite o bairro"
                  maxLength={30}
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name">Endereço</label>
              <input
                type="text"
                name="address"
                placeholder="Digite o endereço"
                maxLength={100}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="name">Complemento</label>
              <input
                type="text"
                name="complement_address"
                placeholder="Digite o complemento"
                maxLength={100}
                value={complementary_address}
                onChange={(e) => setComplementary_address(e.target.value)}
              />
            </div>

            <div className="customer-registration-modal-city-state">
              <div className="customer-registration-modal-city">
                <label htmlFor="city">Cidade</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Digite a cidade"
                  maxLength={14}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="customer-registration-modal-state">
                <label htmlFor="state">UF</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Digite a UF"
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="customer-registration-modal-buttons">
            <button
              className="customer-registration-modal-button-cancel"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="customer-registration-modal-button-submit"
              onClick={validadeSubmit}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

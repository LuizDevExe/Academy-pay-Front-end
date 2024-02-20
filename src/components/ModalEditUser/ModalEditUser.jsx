import React, { useEffect } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import "./ModalEditUser.css";
import { retrieveAndDecrypt, encryptAndStore, clearAll } from "../../utils/storage";
import loadingImg from "../../assets/loading-icon.svg";

import closeIcon from "../../assets/closeIcon.svg";
import sucessRegister from "../../assets/sucessRegister.svg";
import eye from "../../assets/eye.svg";
import eyeOff from "../../assets/eye-off.svg";
import { useNavigate } from "react-router-dom";

export default function ModalEditUser({ isOpen, setIsOpen }) {
  const [modalOrSucess, setModalOrSucess] = useState("modal");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameSpan, setNameSpan] = useState("");
  const [emailSpan, setEmailSpan] = useState("");
  const [cpfSpan, setCpfSpan] = useState("");
  const [passwordSpan, setPasswordSpan] = useState("");
  const [confirmPasswordSpan, setConfirmPasswordSpan] = useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { id: user_id } = retrieveAndDecrypt("id");

  const [isLoad, setIsLoad] = useState(false);

  const tokenAPI = retrieveAndDecrypt("token");

  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  const navigate = useNavigate();

  async function getUser() {
    try {
      const response = await api.get(`/getUser/${user_id}`, {
        headers: headersAPI,
      });

      const { name, email, cpf, phone } = response.data;

      setName(name);
      setEmail(email);
      setCpf(cpf);
      setPhone(phone);
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
    getUser();
  }, []);

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
    let isOk = true;

    if (!name) {
      setNameSpan("Esse campo deve ser preenchido");
      isOk = false;
    } else {
      setNameSpan("");
      isOk = true;
    }

    function validateEmail(email) {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (!validateEmail(email)) {
      setEmailSpan("Insira um email válido");
      isOk = false;
    } else {
      setEmailSpan("");
      isOk = true;
    }

    if (cpf) {
      if (!validateCPF(cpf)) {
        setCpfSpan("CPF Inválido");
        isOk = false;
        return;
      } else {
        setCpfSpan("");
        isOk = true;
      }
    }

    if (password) {
      if (password.length < 8) {
        setPasswordSpan("A senha deve ter no mínimo 8 caracteres");
        isOk = false;
        return;
      }
      setPasswordSpan("");

      if (password !== confirmPassword) {
        setConfirmPasswordSpan("As senhas não coincidem");
        isOk = false;
        return;
      }
      setConfirmPasswordSpan("");
    }

    if (!password) {
      setConfirmPasswordSpan("");
      setPasswordSpan("");
    }

    if (!isOk) {
      return;
    }

    if (password) {
      const data = {
        name,
        email,
        cpf: cpf.replace(/\D/g, ""),
        phone,
        password,
      };

      try {
        await api.put(`/editUser/${user_id}`, data, { headers: headersAPI });

        isOk = true;
      } catch (error) {
        console.log(error);

        isOk = false;
      }
    } else {
      const data = { name, email, cpf: cpf.replace(/\D/g, ""), phone };

      try {
        await api.put(`/editUser/${user_id}`, data, { headers: headersAPI });

        isOk = true;
      } catch (error) {
        if (error.response.data.message === "Erro! Email ja cadastrado") {
          setEmailSpan("Email já cadastrado");
        }

        if (error.response.data.message === "Erro! CPF ja cadastrado") {
          setCpfSpan("CPF já cadastrado");
        }

        isOk = false;
      }
    }

    if (isOk) {
      setTimeout(() => {
        setModalOrSucess("");
        const dataToEncrypt = { name };
        encryptAndStore("name", dataToEncrypt);

        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      }, 1000);
    }
  }

  return (
    <div>
      {isOpen ? (
        <div className="modal-edit-user-page">
          {isLoad ? "" : <img src={loadingImg} />}
          {modalOrSucess === "modal" ? (
            <div
              className="modal-edit-user-container"
              style={{ display: isLoad ? "flex" : "none" }}
            >
              <img
                className="modal-edit-user-close-icon"
                src={closeIcon}
                alt="fechar modal"
                onClick={() => setIsOpen(false)}
              />
              <h2 id="modal-edit-user-title">Edite seu cadastro</h2>

              <div className="modal-edit-user-form">
                <label htmlFor="name">Nome*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Digite seu nome"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ border: nameSpan ? "1px solid #E70000" : "" }}
                />
                <span>{nameSpan}</span>
              </div>
              <div className="modal-edit-user-form">
                <label htmlFor="email">Email*</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Digite seu e-mail"
                  maxLength={100}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: emailSpan ? "1px solid #E70000" : "" }}
                />
                <span>{emailSpan}</span>
              </div>
              <div className="modal-edit-user-cpf-phone">
                <div className="modal-edit-user-cpf">
                  <label htmlFor="cpf">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    maxLength={14}
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    style={{ border: cpfSpan ? "1px solid #E70000" : "" }}
                  />
                  <span>{cpfSpan}</span>
                </div>
                <div className="modal-edit-user-phone">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Digite seu telefone"
                    maxLength={30}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ marginBottom: cpfSpan ? "23px" : "" }}
                  />
                </div>
              </div>
              <div className="modal-edit-user-form  modal-edit-user-form-password">
                <label htmlFor="password">Senha</label>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    maxLength={20}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ border: passwordSpan ? "1px solid #E70000" : "" }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      backgroundColor="white"
                      marginTop="8px"
                      marginRight="-20px"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <img
                          src={eyeOff}
                          alt="olho"
                          style={{ height: "1.6rem", cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={eye}
                          alt="olho"
                          style={{ height: "1.6rem", cursor: "pointer" }}
                        />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <span>{passwordSpan}</span>
              </div>
              <div className="modal-edit-user-form modal-edit-user-form-password">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    name="password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    maxLength={20}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      border:
                        confirmPasswordSpan || passwordSpan
                          ? "1px solid #E70000"
                          : "",
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      backgroundColor="white"
                      marginTop="8px"
                      marginRight="-20px"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <img
                          src={eyeOff}
                          alt="olho"
                          style={{ height: "1.6rem", cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={eye}
                          alt="olho"
                          style={{ height: "1.6rem", cursor: "pointer" }}
                        />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <span>{confirmPasswordSpan}</span>
              </div>
              <button
                className="modal-edit-user-button-submit"
                onClick={validadeSubmit}
              >
                Aplicar
              </button>
            </div>
          ) : (
            <div className="modal-edit-user-sucess">
              <img src={sucessRegister} alt="sucesso" />
              <h2>Cadastro Alterado com sucesso!</h2>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

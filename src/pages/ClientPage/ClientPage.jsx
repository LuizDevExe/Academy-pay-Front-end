import {
  Box,
  Table,
  FormControl,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ChargeClients from "../../assets/ChargeClients.svg";
import ClientsTitleIcon from "../../assets/ClientsTitleIcon.svg";
import OrderClients from "../../assets/OrderClients.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import TagEmDia from "../../assets/TagEmDia.svg";
import FilterClientsIcon from "../../assets/FilterClients.svg";
import ActiveFilterClientsIcon from '../../assets/active-filter.svg';
import PerfilUser from "../../components/PerfilUser/PerfilUser";
import TagInadimplente from "../../assets/TagInadimplente.svg";
import NoSearchIcon from '../../assets/no-search-icon.svg'
import "./ClientPage.css";
import { useState, useEffect } from "react";
import ModalClientRegister from "../../components/ModalClientRegister/ModalClientRegister";
import api from "../../services/api";
import { retrieveAndDecrypt, cpfMask, phoneMask, clearAll } from "../../utils/storage";
import Loading from "../../components/Loading/Loading";
import SucessPopUp from "../../components/SuccessPopUp/SuccessPopUp";
import PopoverUser from "../../components/PopoverUser/PopoverUser";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import ModalBilling from "../../components/ModalBilling/ModalBilling";
import SuccessPopUp from "../../components/SuccessPopUp/SuccessPopUp";
import FilterClients from "../../components/FilterClients/FilterClients";
import { useNavigate, useParams } from "react-router-dom";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";

function ClientPage() {
  const tokenAPI = retrieveAndDecrypt("token");
  const user_id = retrieveAndDecrypt("id");
  const [clients, setClients] = useState([]);
  const [originalClients, setOriginalClients] = useState([]);
  const [filteredClientsArray, setFilteredClientsArray] = useState([]);
  const [isOpenEditUserPopUp, setIsOpenEditUserPopUp] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [isOpenBillingModal, setIsOpenBillingModal] = useState(false);
  const [isSucessOpenBilling, setIsSucessOpenBilling] = useState(false);
  const [filter, setFilter] = useState('')
  const [isLoad, setIsLoad] = useState(true);
  const [clientId, setClientId] = useState(null);
  const [isAscendingOrder, setIsAscendingOrder] = useState(true);
  const { filter: filterParams } = useParams()
  const [isOpen, setIsOpen] = useState(false);
  const [isSucessOpen, setIsSucessOpen] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const navigate = useNavigate();



  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  async function listClients() {
    try {
      const response = await api.get(`/listClients/${user_id.id}`, {
        headers: headersAPI,
      });

      if (filterParams) {
        if (filterParams === 'emdia' || filterParams === 'inadimplente') {
          setFilter(filterParams);
        } else {
          navigate('/clientes');
        }
      }

      setOriginalClients(response.data.data);
      setIsLoad(false);
    }
    catch (error) {
      if (error.response.data.message === 'usuário não autorizado') {
        clearAll();
        navigate('/sign-in');
      }
    }
  }

  function handleClientDetail(id) {
    navigate(`/clientes/detalhes-do-cliente/${id}`);
  }

  useEffect(() => {
    listClients();
  }, [isSucessOpen, isOpenBillingModal]);

  useEffect(() => {
    filterPage();
  }, [filter, originalClients]);

  function filterPage() {
    if (filter === '') {
      setClients(originalClients);
      setFilteredClientsArray([]);
    }
    if (filter === 'emdia') {
      const filteredClients = originalClients.filter(client => client.status === 'EM DIA');
      setClients(filteredClients);
      setFilteredClientsArray(filteredClients)
    }
    if (filter === 'inadimplente') {
      const filteredClients = originalClients.filter(client => client.status === 'INADIMPLENTE');
      setClients(filteredClients);
      setFilteredClientsArray(filteredClients)
    }
  }


  function handleEditBillind(id) {
    setClientId(id);
    setIsOpenBillingModal(true);
  }

  function handleOrderClients() {
    const sortedClients = [...clients].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      return isAscendingOrder
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setClients(sortedClients);
    setIsAscendingOrder(!isAscendingOrder);
  }

  function removeSpecialCharacters(str) {
    return str.replace(/[^@\w\s]/gi, '');
  }

  function Search(e) {
    const searchTerm = removeSpecialCharacters(e.trim().toLowerCase());

    if (searchTerm === "") {
      setClients(originalClients);
      filterPage();
    } else {
      const isNumeric = !isNaN(searchTerm);

      const arrayFilter = filteredClientsArray.length > 0 ? filteredClientsArray : originalClients

      const filteredClients = arrayFilter.filter((client) => {
        const clientNameLower = removeSpecialCharacters(client.name.toLowerCase());
        const clientEmailLower = removeSpecialCharacters(client.email.toLowerCase());
        const clientCPF = removeSpecialCharacters(client.cpf.toString().toLowerCase());

        if (isNumeric && clientCPF.includes(searchTerm)) {
          return true;
        }

        const nameMatch = clientNameLower.includes(searchTerm);
        const emailMatch = clientEmailLower.includes(searchTerm);
        const cpfMatch = clientCPF.includes(searchTerm);

        return nameMatch || emailMatch || cpfMatch;
      });

      setClients(filteredClients);
    }
  }



  return (
    <div className="container-client-page">
      <header className="clients-page-main-container">
        {isOpenFilter &&
          <FilterClients
            filter={filter}
            setFilter={setFilter}
            setIsOpenFilter={setIsOpenFilter}
          />}
        {isLoad && <Loading />}
        {isOpenEditUserPopUp && (
          <PopoverUser
            setIsOpenEditUser={setIsOpenEditUser}
            setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
          />
        )}
        {isOpenBillingModal && (
          <ModalBilling
            idClient={clientId}
            setIsOpen={setIsOpenBillingModal}
            setIsOpenSuccessPopUp={() => setIsSucessOpenBilling(true)}
          />
        )}
        {isSucessOpenBilling && (
          <SuccessPopUp
            setIsOpenSuccessPopUp={setIsSucessOpenBilling}
            SuccessText={"Cobrança cadastrada com sucesso"}
          />
        )}

        <div className="client-page-title">
          <h1>Clientes</h1>
          <div>
            <PerfilUser
              isOpenEditUserPopUp={isOpenEditUserPopUp}
              setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
            />
          </div>
        </div>
      </header>
      <main className="container-client-page-main">
        {isOpenEditUserPopUp && (
          <PopoverUser
            setIsOpenEditUser={setIsOpenEditUser}
            setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
          />
        )}
        <section className="section-title-icon-client">
          <div className="div-section-icon-client-page">
            <img src={ClientsTitleIcon} alt="ícone de clientes" />
            <h1>Clientes</h1>
          </div>

          <div className="div-title-tools-client-page">
            <button
              type="button"
              className="header-btn-add-charge"
              alt="botão para adicionar cobrança de um cliente"
              onClick={() => setIsOpen(true)}
            >
              + Adicionar Cliente
            </button>

            <button className="header-filter-icon" alt="ícone de filtro"
              onClick={() => setIsOpenFilter(!isOpenFilter)}
            >
              <img
                src={filter ? ActiveFilterClientsIcon : FilterClientsIcon} alt=""
              />
            </button>

            <div className="div-title-tools-search-bar-charges-page">
              <FormControl>
                <InputGroup>
                  <Input
                    onChange={(e) => Search(e.target.value)}
                    type="text"
                    boxShadow="0 6px 6px rgba(218, 1, 117, 0.05)"
                  />
                  <InputRightElement>
                    <img src={SearchIcon} alt="Ícone de pesquisa" />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </div>
          </div>
        </section>

        <Box className="container-client-table">
          <TableContainer padding="1.5rem 0 1.5rem 1.5rem" borderBottom="none">
            {clients.length === 0 && originalClients.length > 0 ?
              <div className="no-search-table">
                <img src={NoSearchIcon} alt="" />
                <h2>Nenhum resultado foi encontrado!</h2>
              </div>
              :
              <Table variant="simple" className="container-table-client-page">
                <Thead>
                  <Th>
                    <div >
                      <img onClick={handleOrderClients} style={{ cursor: 'pointer' }}
                        src={OrderClients}
                        alt="ícone responsável por ordernar os clientes em ordem alfabética "
                      />
                      Clientes
                    </div>
                  </Th>
                  <Th>Cpf</Th>
                  <Th>E-mail</Th>
                  <Th>Telefone</Th>
                  <Th>Status</Th>
                  <Th>Criar Cobrança</Th>
                </Thead>

                <Tbody>
                  {clients.map((client) => (
                    <Tr className="window-header-tr-body" key={client.id}>
                      <Td
                        className="client-detail-redict-button"
                        textTransform="capitalize"
                        onClick={() => handleClientDetail(client.id)}
                      >
                        {client.name.length > 18
                          ? client.name.slice(0, 18) + "..."
                          : client.name}
                      </Td>
                      <Td>{cpfMask(client.cpf)}</Td>
                      <Td>{client.email}</Td>
                      <Td>{phoneMask(client.phone)}</Td>
                      <Td>
                        {client.status === "EM DIA" ? (
                          <img src={TagEmDia} alt="O cliente está em dia" />
                        ) : (
                          <img
                            src={TagInadimplente}
                            alt="O cliente está inadimplente"
                          />
                        )}
                      </Td>
                      <Td>
                        <img
                          src={ChargeClients}
                          alt="Tag de cobrança"
                          onClick={() => handleEditBillind(client.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            }
          </TableContainer>
        </Box>
      </main>
      {isOpenEditUser && (
        <ModalEditUser isOpen={isOpenEditUser} setIsOpen={setIsOpenEditUser} />
      )}
      {isOpen && (
        <ModalClientRegister
          setIsOpen={setIsOpen}
          setIsOpenSuccessPopUp={setIsSucessOpen}
        />
      )}
      {isSucessOpen && (
        <SucessPopUp
          setIsOpenSuccessPopUp={setIsSucessOpen}
          SuccessText={"Cadastro concluído com sucesso"}
        />
      )}
    </div>
  );
}

export default ClientPage;

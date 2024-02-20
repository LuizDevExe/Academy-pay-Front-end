import {
  Box,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import React, { useEffect, useState } from "react";
import ChargeIcon from "../../assets/ChargeIcon.svg";
import EditCharge from "../../assets/EditCharge.svg";
import FilterClientsIcon from "../../assets/FilterClients.svg";
import ActiveFilterClientsIcon from '../../assets/active-filter.svg';
import PendingTag from "../../assets/tagpendente.svg";
import ExpiredTag from "../../assets/tagVencida.svg";
import PaidTag from "../../assets/tagPaga.svg";
import OrderClients from "../../assets/OrderClients.svg";
import NoSearchIcon from '../../assets/no-search-icon.svg'
import SearchIcon from "../../assets/SearchIcon.svg";
import ExcludeCharge from "../../assets/deletIcon.svg";
import PerfilUser from "../../components/PerfilUser/PerfilUser";
import PopoverUser from "../../components/PopoverUser/PopoverUser";
import ModalDeleteBilling from "../../components/ModalDeleteBilling/ModalDeleteBilling";
import Loading from "../../components/Loading/Loading";
import FailPopUp from "../../components/FailPopUp/FailPopUp";
import ModalBillingDetail from "../../components/ModalBilingDetail/ModalBillingDetail"
import api from "../../services/api";
import {
  formatCurrency,
  formatDate,
  retrieveAndDecrypt,
  clearAll
} from "../../utils/storage";
import SuccessPopUp from "../../components/SuccessPopUp/SuccessPopUp";
import ModalBilling from "../../components/ModalBilling/ModalBilling";
import FilterCharges from "../../components/FilterCharges/FilterCharges";
import "./charge.css";
import { useNavigate, useParams } from "react-router-dom";

function ChargePage() {
  const user_id = retrieveAndDecrypt("id");
  const [idBilling, setIdBilling] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [charge, setCharge] = useState([]);
  const [originalCharge, setOriginalCharge] = useState([]);
  const [filteredChargeArray, setFilteredChargeArray] = useState([]);
  const [isOpenEditUserPopUp, setIsOpenEditUserPopUp] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [isOpenBillingEditModal, setIsOpenBillingEditModal] = useState(false);
  const [isSucessOpenEditBilling, setIsSucessOpenEditBilling] = useState(false);
  const [isOpenDeleteBill, setIsOpenDeleteBill] = useState(false);
  const [isSucessOpenDeleteBilling, setIsSucessOpenDeleteBilling] = useState(false);
  const [isOpenFailPopUp, setIsOpenFailPopUp] = useState(false);
  const [isLoad, setIsLoad] = useState(true);
  const [isAscendingOrder, setIsAscendingOrder] = useState(true);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const { filter: filterParams } = useParams()
  const [filter, setFilter] = useState('')
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
  const navigate = useNavigate();

  const tokenAPI = retrieveAndDecrypt("token");

  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  async function getBills() {
    try {
      const response = await api.get(`/listBills/${user_id.id}`, {
        headers: headersAPI,
      });

      if (filterParams) {
        if (filterParams === 'paga' || filterParams === 'vencida' || filterParams === 'pendente') {
          setFilter(filterParams);
        } else {
          navigate('/cobrancas');
        }
      }

      setOriginalCharge(response.data);

      setTimeout(() => {
        setIsLoad(false);
      }, 200);
    }
    catch (error) {
      if (error.response.data.message === 'usuário não autorizado') {
        clearAll();
        navigate('/sign-in');
      }
    }
  }

  useEffect(() => {
    getBills();
  }, [isSucessOpenEditBilling, isSucessOpenDeleteBilling]);

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

  useEffect(() => {
    filterPage();
  }, [filter, originalCharge, filterParams]);

  function filterPage() {
    const filterLower = filter.toUpperCase()

    if (filter === '') {
      setCharge(originalCharge);
      setFilteredChargeArray([]);
    }
    if (filterLower === 'PAGA') {
      const filteredCharge = originalCharge.filter(charge => charge.status === 'PAGA');
      setCharge(filteredCharge);
      setFilteredChargeArray(filteredCharge);
    }
    if (filterLower === 'PENDENTE') {
      const filteredCharge = originalCharge.filter(charge => charge.status === 'PENDENTE');
      setCharge(filteredCharge);
      setFilteredChargeArray(filteredCharge);
    }
    if (filterLower === 'VENCIDA') {
      const filteredCharge = originalCharge.filter(charge => charge.status === 'VENCIDA');
      setCharge(filteredCharge);
      setFilteredChargeArray(filteredCharge);
    }
  }

  function handleDetailBilling(billId, clientId) {
    setIdBilling(billId);
    setClientId(clientId);
    setIsOpenModalDetail(true);
  }

  function handleEditBillind(billId, clientId) {
    setIdBilling(billId);
    setClientId(clientId);
    setIsOpenBillingEditModal(true);
  }

  function handleDeleteBill(billID, billStatus) {
    if (billStatus === "PENDENTE") {
      setIdBilling(billID);
      setIsOpenDeleteBill(true);
    } else {
      setIsOpenFailPopUp(true);
    }
  }
  function handleOrderBill() {
    const sortedCharges = [...charge].sort((a, b) => {
      const nameA = a.client_name ? a.client_name.toUpperCase() : "";
      const nameB = b.client_name ? b.client_name.toUpperCase() : "";
      return isAscendingOrder
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setCharge(sortedCharges);
    setIsAscendingOrder(!isAscendingOrder);
  }

  function handleOrderId() {
    setAscendingOrder((prevOrder) => !prevOrder);
    orderList(ascendingOrder ? "asc" : "desc");
  }

  function orderList(order) {
    if (order === "asc") {
      const orderedList = charge.slice().sort((a, b) => a.id - b.id);
      setCharge(orderedList);
    } else {
      const orderedList = charge.slice().sort((a, b) => b.id - a.id);
      setCharge(orderedList);
    }
  }

  function Search(e) {
    const searchTerm = e.trim().toLowerCase();

    if (searchTerm === "") {
      setCharge(originalCharge);
      filterPage()
    } else {
      const isNumeric = !isNaN(searchTerm);

      const arrayFilter = filteredChargeArray.length > 0 ? filteredChargeArray : originalCharge

      const filteredCharges = arrayFilter.filter((charge) => {
        const clientNameLower = charge.client_name.toLowerCase();
        const clientId = charge.id.toString().toLowerCase();

        return isNumeric
          ? clientId.startsWith(searchTerm)
          : clientNameLower.startsWith(searchTerm);
      });

      setCharge(filteredCharges);
    }
  }


  return (
    <div className="container-charges-page">
      <header className="charges-page-main-container">
        {isLoad && <Loading />}
        {isOpenModalDetail &&
          <ModalBillingDetail
            setIsOpen={setIsOpenModalDetail}
            idBill={idBilling}
            idClient={clientId}
          />
        }
        {isOpenFilter &&
          <FilterCharges
            setIsOpenFilter={setIsOpenFilter}
            filter={filter}
            setFilter={setFilter}
          />
        }
        {isOpenEditUserPopUp && (
          <PopoverUser
            setIsOpenEditUser={setIsOpenEditUser}
            setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
          />
        )}
        {isOpenEditUser && (
          <ModalEditUser
            isOpen={isOpenEditUser}
            setIsOpen={setIsOpenEditUser}
          />
        )}
        {isOpenBillingEditModal && (
          <ModalBilling
            idClient={clientId}
            idBill={idBilling}
            setIsOpen={setIsOpenBillingEditModal}
            setIsOpenSuccessPopUp={setIsSucessOpenEditBilling}
          />
        )}
        {isSucessOpenEditBilling && (
          <SuccessPopUp
            setIsOpenSuccessPopUp={setIsSucessOpenEditBilling}
            SuccessText={"Cobrança editada com sucesso"}
          />
        )}
        {isOpenDeleteBill && (
          <ModalDeleteBilling
            setIsOpen={setIsOpenDeleteBill}
            idBill={idBilling}
            setIsSucess={setIsSucessOpenDeleteBilling}
          />
        )}
        {isOpenFailPopUp && (
          <FailPopUp
            setIsOpenSuccessPopUp={setIsOpenFailPopUp}
            FailText={"Esta cobrança não pode ser excluída!"}
          />
        )}
        {isSucessOpenDeleteBilling && (
          <SuccessPopUp
            setIsOpenSuccessPopUp={setIsSucessOpenDeleteBilling}
            SuccessText={"Cobrança excluída com sucesso!"}
          />
        )}

        <div className="charges-page-title">
          <h1>Cobranças</h1>
          <div>
            <PerfilUser
              isOpenEditUserPopUp={isOpenEditUserPopUp}
              setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
            />
          </div>
        </div>
      </header>
      <main className="container-charges-page-main">
        {isOpenEditUserPopUp && (
          <PopoverUser
            setIsOpenEditUser={setIsOpenEditUser}
            setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
          />
        )}
        <section className="section-title-icon-charges">
          <div className="div-section-icon-charges-page">
            <img src={ChargeIcon} alt="ícone de clientes" />
            <h1>Cobrança</h1>
          </div>

          <div className="div-title-tools-charges-page">
            <img src={filter ? ActiveFilterClientsIcon : FilterClientsIcon} alt=""
              onClick={() => setIsOpenFilter(!isOpenFilter)}
              style={{ cursor: 'pointer' }}
            />
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

        <Box className="container-charge-table">
          <TableContainer padding="1.5rem" borderBottom="none">
            {charge.length === 0 && originalCharge.length > 0 ?
              <div className="no-search-table">
                <img src={NoSearchIcon} alt="" />
                <h2>Nenhum resultado foi encontrado!</h2>
              </div>
              :
              <Table variant="simple" className="container-table-charges-page">
                <Thead>
                  <Th>
                    <div>
                      <img onClick={handleOrderBill} style={{ cursor: 'pointer' }}
                        src={OrderClients}
                        alt="ícone responsável por ordernar os clientes em ordem alfabética "
                      />
                      Cobrança
                    </div>
                  </Th>
                  <Th>
                    <div>
                      <img onClick={handleOrderId} style={{ cursor: 'pointer' }}
                        src={OrderClients}
                        alt="ícone responsável por ordernar os clientes em ordem numérica por ID"
                      />
                      ID Co.
                    </div>
                  </Th>
                  <Th>Valor</Th>
                  <Th>Data de Venc.</Th>
                  <Th>Status</Th>
                  <Th>Descrição</Th>
                  <Th></Th>
                </Thead>

                <Tbody>
                  {charge.map((charge) => (
                    <Tr key={charge.id}>
                      <Td
                        className="charges-detail-redict-button"
                        textTransform="capitalize"
                        onClick={() => handleDetailBilling(charge.id, charge.client_id)}
                      >
                        {charge.client_name
                          ? charge.client_name.length > 22
                            ? charge.client_name.slice(0, 22) + "..."
                            : charge.client_name
                          : ""}
                      </Td>
                      <Td>{charge.id}</Td>
                      <Td>{formatCurrency(charge.value)}</Td>
                      <Td>{formatDate(charge.due_date)}</Td>
                      <Td w="11.21%" borderBottom="none">
                        <img src={statusTag(charge.status)} alt="" />
                      </Td>
                      <Td>
                        {charge.description
                          ? charge.description.length > 25
                            ? charge.description.slice(0, 25) + "..."
                            : charge.description
                          : ""}
                      </Td>
                      <Td className="charge-page-buttons" borderBottom="none">
                        <img
                          src={EditCharge}
                          alt=""
                          onClick={() =>
                            handleEditBillind(charge.id, charge.client_id)
                          }
                        />
                        <img
                          src={ExcludeCharge}
                          alt=""
                          onClick={() =>
                            handleDeleteBill(charge.id, charge.status)
                          }
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
    </div>
  );
}

export default ChargePage;

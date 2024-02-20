import { Box, Table, Tbody, Tr, Td, TableContainer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  retrieveAndDecrypt,
  cpfMask,
  phoneMask,
  formatCurrency,
  clearAll
} from "../../utils/storage";
import PerfilUser from "../../components/PerfilUser/PerfilUser";
import PopoverUser from "../../components/PopoverUser/PopoverUser";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import ModalClientRegister from "../../components/ModalClientRegister/ModalClientRegister";
import ModalBilling from "../../components/ModalBilling/ModalBilling";
import SuccessPopUp from "../../components/SuccessPopUp/SuccessPopUp";
import ClientTittleIcon from "../../assets/ClientsTitleIcon.svg";
import PencilIcon from "../../assets/PencilIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import api from "../../services/api";
import "./ClientPerfil.css";
import Loading from "../../components/Loading/Loading";
import EditCharge from "../../assets/EditCharge.svg";
import ExcludeCharge from "../../assets/deletIcon.svg";
import OrderClients from "../../assets/OrderClients.svg";
import PendingTag from "../../assets/tagpendente.svg";
import ExpiredTag from "../../assets/tagVencida.svg";
import PaidTag from "../../assets/tagPaga.svg";
import ModalDeleteBilling from "../../components/ModalDeleteBilling/ModalDeleteBilling";
import ModalBillingDetail from "../../components/ModalBilingDetail/ModalBillingDetail"
import FailPopUp from "../../components/FailPopUp/FailPopUp";


function ClientPerfil() {
  const [isOpenEditUserPopUp, setIsOpenEditUserPopUp] = useState(false);
  const [isOpenEditUser, setIsOpenEditUser] = useState(false);
  const [isOpenClientEditModal, setIsOpenClientEditModal] = useState(false);
  const [isOpenBillingCreateModal, setIsOpenBillingCreateModal] = useState(false);
  const [isSucessOpenBilling, setIsSucessOpenBilling] = useState(false);
  const [isOpenBillingEditModal, setIsOpenBillingEditModal] = useState(false);
  const [isSucessOpenEditBilling, setIsSucessOpenEditBilling] = useState(false);
  const [isSucessOpen, setIsSucessOpen] = useState(false);
  const [clientBills, setClientBills] = useState([]);
  const [isOpenDeleteBill, setIsOpenDeleteBill] = useState(false);
  const [isSucessOpenDeleteBilling, setIsSucessOpenDeleteBilling] = useState(false);
  const [isOpenFailPopUp, setIsOpenFailPopUp] = useState(false);
  const [idBilling, setIdBilling] = useState(null);
  const { client_id } = useParams();
  const [billId, setBillId] = useState(null);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)

  const [isLoad, setIsLoad] = useState(true);

  const user_id = retrieveAndDecrypt("id");

  const tokenAPI = retrieveAndDecrypt("token");
  const headersAPI = {
    "Content-Type": "application/json",
    Authorization: tokenAPI.token,
  };

  const [clientData, setClientData] = useState({
    address: "",
    city: "",
    complementary_address: "",
    cpf: "",
    email: "",
    id: null,
    name: "",
    neighborhood: "",
    phone: "",
    state: "",
    zip_code: "",
  });

  const navigate = useNavigate();

  async function getClient() {
    try {
      const response = await api.get(`/getClient/${client_id}`, {
        headers: headersAPI,
      });
      const {
        address,
        city,
        complementary_address,
        cpf,
        email,
        id,
        name,
        neighborhood,
        phone,
        state,
        zip_code,
      } = response.data;
      setClientData({
        address,
        city,
        complementary_address,
        cpf,
        email,
        id,
        name,
        neighborhood,
        phone,
        state,
        zip_code,
      });
    }
    catch (error) {
      if (error.response.data.message === 'usuário não autorizado') {
        clearAll();
        navigate('/sign-in');
      }
    }
  }

  async function getClientBills() {
    try {
      const response = await api.get(`/listClientBills/${user_id.id}/${client_id}`, {
        headers: headersAPI,
      });
      setClientBills(response.data);
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

  function handleEditBillind(id) {
    setBillId(id);
    setIsOpenBillingEditModal(true);
  }

  function handleOrderId() {
    setAscendingOrder((prevOrder) => !prevOrder);
    orderList(ascendingOrder ? "asc" : "desc");
  }

  function handleDetailBilling(billId) {
    setIdBilling(billId);
    setIsOpenModalDetail(true);
  }

  function orderList(order) {
    if (order === "asc") {
      const orderedList = clientBills.slice().sort((a, b) => a.id - b.id);
      setClientBills(orderedList);
    } else {
      const orderedList = clientBills.slice().sort((a, b) => b.id - a.id);
      setClientBills(orderedList);
    }
  }

  function handleOrderDate() {
    setAscendingOrder((prevOrder) => !prevOrder);

    const orderedList = clientBills.slice().sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);

      return ascendingOrder ? dateA - dateB : dateB - dateA;
    });

    setClientBills(orderedList);
  }

  useEffect(() => {
    getClient();
    getClientBills();
  }, [
    isSucessOpen,
    isSucessOpenBilling,
    isSucessOpenEditBilling,
    isSucessOpenDeleteBilling,
    isOpenBillingEditModal,
    isOpenBillingCreateModal,
  ]);

  function handleDeleteBill(billID, billStatus) {
    if (billStatus !== "PAGA") {
      setIsOpenFailPopUp(true);
      return;
    }

    setIdBilling(billID);
    setIsOpenDeleteBill(true);
  }

  return (
    <body
      className="container-client-perfil"
      style={isOpenBillingEditModal ? { overflow: "hidden" } : {}}
    >
      {isLoad && <Loading />}
      {isOpenModalDetail &&
        <ModalBillingDetail
          setIsOpen={setIsOpenModalDetail}
          idBill={idBilling}
          idClient={client_id}
        />
      }
      {isOpenClientEditModal && (
        <ModalClientRegister
          idClient={client_id}
          setIsOpen={setIsOpenClientEditModal}
          setIsOpenSuccessPopUp={setIsSucessOpen}
        />
      )}
      {isSucessOpen && (
        <SuccessPopUp
          setIsOpenSuccessPopUp={setIsSucessOpen}
          SuccessText={"Edições do cadastro concluídas com sucesso"}
        />
      )}
      {isOpenBillingCreateModal && (
        <ModalBilling
          idClient={client_id}
          setIsOpen={() => setIsOpenBillingCreateModal()}
          setIsOpenSuccessPopUp={() => setIsSucessOpenBilling(true)}
        />
      )}
      {isSucessOpenBilling && (
        <SuccessPopUp
          setIsOpenSuccessPopUp={setIsSucessOpenBilling}
          SuccessText={"Cobrança cadastrada com sucesso"}
        />
      )}
      {isOpenBillingEditModal && (
        <ModalBilling
          idClient={client_id}
          idBill={billId}
          setIsOpen={setIsOpenBillingEditModal}
          setIsOpenSuccessPopUp={() => setIsSucessOpenEditBilling(true)}
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

      <header className="header-client-perfil">
        <div className="container-header-client-details">
          <h4>
            <Link to={"/clientes"}>Clientes</Link> <span>{`>`}</span> Detalhes
            do cliente
          </h4>
        </div>
        <div className="container-perfil-user-client-details">
          {isOpenEditUserPopUp && (
            <PopoverUser
              setIsOpenEditUser={setIsOpenEditUser}
              setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
            />
          )}

          <PerfilUser
            isOpenEditUserPopUp={isOpenEditUserPopUp}
            setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
          />
        </div>
      </header>
      <main className="container-client-data">
        {isOpenEditUser && (
          <ModalEditUser
            isOpen={isOpenEditUser}
            setIsOpen={setIsOpenEditUser}
          />
        )}
        <div className="div-client-name">
          <img src={ClientTittleIcon} alt="ícone expondo clientes" />
          <h1>{clientData.name.toLowerCase()}</h1>
        </div>
        <section className="section-client-data">
          <article className="article-client-edit">
            <h2>Dados do cliente</h2>
            <button
              onClick={() => setIsOpenClientEditModal(!isOpenClientEditModal)}
            >
              <img
                src={PencilIcon}
                alt="botão para edição de dados do perfil do cliente"
              />
              <p>Editar Cliente</p>
            </button>
          </article>

          <article>
            <div className="article-client-first-row">
              <div>
                <h3>E-mail</h3>
                <p>{clientData.email}</p>
              </div>
              <div>
                <h3>Telefone</h3>
                <p>{phoneMask(clientData.phone)}</p>
              </div>
              <div>
                <h3>CPF</h3>
                <p>{cpfMask(clientData.cpf)}</p>
              </div>
            </div>

            <div className="article-client-second-row">
              <div>
                <h3>Endereço</h3>
                <p>{clientData.address}</p>
              </div>
              <div>
                <h3>Bairro</h3>
                <p>{clientData.neighborhood}</p>
              </div>
              <div>
                <h3>Complemento</h3>
                <p>{clientData.complementary_address}</p>
              </div>
              <div>
                <h3>CEP</h3>
                <p>{clientData.zip_code}</p>
              </div>
              <div>
                <h3>Cidade</h3>
                <p>{clientData.city}</p>
              </div>
              <div className="client-state">
                <h3>UF</h3>
                <p>{clientData.state}</p>
              </div>
            </div>
          </article>
        </section>
        <section className="section-client-charges">
          <article className="article-add-billing">
            <h2>Cobranças do Cliente</h2>
            <button
              onClick={() =>
                setIsOpenBillingCreateModal(!isOpenBillingEditModal)
              }
            >
              <img
                src={AddIcon}
                alt="Botão para adicionar cobrança para o cliente do perfil atual"
              />
              <p>Nova cobrança</p>
            </button>
          </article>
          <Box>
            <TableContainer borderBottom="none">
              <Table variant="simple">
                <Tbody borderBottom="none">
                  <Tr className="client-charges-table-header">
                    <Td w="14.35%">
                      <div
                        className="order-icon-client-perfil"
                      >
                        <img
                          onClick={handleOrderId}
                          style={{ cursor: 'pointer' }}
                          src={OrderClients}
                          alt="filtro para ordenar clientes"
                          className="icon-order-clients-table"
                        />
                        ID Cob.
                      </div>
                    </Td>
                    <Td w="15.96%">
                      <div
                        className="order-icon-client-perfil"
                      >
                        <img
                          onClick={handleOrderDate}
                          style={{ cursor: 'pointer' }}
                          src={OrderClients}
                          alt="filtro para ordenar clientes"
                          className="icon-order-clients-table"
                        />
                        Data de Venc.
                      </div>
                    </Td>
                    <Td w="11.03%">Valor</Td>
                    <Td w="11.21%">Status</Td>
                    <Td w="31.21%">Descrição</Td>
                    <Td></Td>
                  </Tr>

                  {clientBills.map((bill) => (
                    <Tr
                      className="client-charges-table-data"
                      key={bill.id}
                      borderTop="1px solid  #EFF0F6"
                    >
                      <Td w="14.35%" borderBottom="none"
                        onClick={() => handleDetailBilling(bill.id)}
                        className="td-button-detail-billing"
                      >
                        {bill.id}
                      </Td>
                      <Td w="15.96%" borderBottom="none">
                        {new Date(bill.due_date).toLocaleString("pt-br", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </Td>
                      <Td w="11.03%" borderBottom="none">
                        {formatCurrency(bill.value)}
                      </Td>
                      <Td w="11.21%" borderBottom="none">
                        <img src={statusTag(bill.status)} alt="" />
                      </Td>
                      <Td
                        w="31.21%"
                        id="table-perfil-client-bills-description"
                        borderBottom="none"
                      >
                        {bill.description.length > 37
                          ? bill.description.slice(0, 37) + "..."
                          : bill.description}
                      </Td>
                      <Td className="charge-buttons" borderBottom="none">
                        <img
                          src={EditCharge}
                          alt=""
                          onClick={() => handleEditBillind(bill.id)}
                        />
                        <img
                          src={ExcludeCharge}
                          alt=""
                          onClick={() => handleDeleteBill(bill.id, bill.status)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </section>
      </main>
    </body>
  );
}

export default ClientPerfil;
import React, { useEffect, useState } from 'react'
import BillingPaid from '../../assets/BillingPaid.png'
import CustomerUpToDate from '../../assets/CustomerUpToDate.svg'
import DefaultingCustomer from '../../assets/DefaultingCustomer.svg'
import ExpectedCharges from '../../assets/ExpectedCharges.svg'
import OverdueBilling from '../../assets/OverdueBilling.svg'
import ClientsResume from '../../components/ClientsResume/ClientsResume.jsx'
import Loading from '../../components/Loading/Loading.jsx'
import ModalEditUser from '../../components/ModalEditUser/ModalEditUser.jsx'
import PerfilUser from '../../components/PerfilUser/PerfilUser.jsx'
import PopoverUser from '../../components/PopoverUser/PopoverUser.jsx'
import TransactionDetails from '../../components/TransactionDetails/TransactionDetails.jsx'
import TransactionResume from '../../components/TransactionResume/TransactionResume.jsx'
import api from '../../services/api.js'
import { clearAll, retrieveAndDecrypt } from '../../utils/storage.js'
import './Home.css'
import { useNavigate } from 'react-router-dom'


function Home() {

    const [isOpenEditUserPopUp, setIsOpenEditUserPopUp] = useState(false);
    const [isOpenEditUser, setIsOpenEditUser] = useState(false);

    const [isLoad, setIsLoad] = useState(true);

    const [overdueTotalValues, setOverdueTotalValues] = useState(0);
    const [payedTotalValues, setPayedTotalValues] = useState(0);
    const [pendingTotalValues, setPendingTotalValues] = useState(0);

    const [overdueBills, setOverdueBills] = useState([]);
    const [payedBills, setPayBills] = useState([]);
    const [pendingBills, setPendingBills] = useState([]);


    const [overdueClients, setOverdueClients] = useState([]);
    const [payedClients, setPayClients] = useState([]);


    const { id: user_id } = retrieveAndDecrypt('id');
    const tokenAPI = retrieveAndDecrypt('token');

    const headersAPI = {
        'Content-Type': 'application/json',
        'Authorization': tokenAPI.token
    };

    const navigate = useNavigate();

    async function getClientData() {
        try {
            const response = await api.get(`/homepage/${user_id}`, { headers: headersAPI });
            const { payed, pending, overdue } = response.data.bills

            setPayBills(payed.bills);
            setPayedTotalValues(payed.value);

            setPendingBills(pending.bills);
            setPendingTotalValues(pending.value);

            setOverdueBills(overdue.bills);
            setOverdueTotalValues(overdue.value);

            setPayClients(response.data.clients.paying);
            setOverdueClients(response.data.clients.overdue);

            setTimeout(() => {
                setIsLoad(false)
            }, 200);

        } catch (error) {
            if (error.response.data.message === 'usuário não autorizado') {
                clearAll();
                navigate('/sign-in');
            }
        }
    }

    useEffect(() => {
        getClientData();

    }, [])

    return (
        <div className='container-home'>
            {
                isLoad &&
                <Loading />
            }
            {
                isOpenEditUserPopUp &&
                <PopoverUser
                    setIsOpenEditUser={setIsOpenEditUser}
                    setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
                />
            }
            <header>
                <h1>Resumo das cobranças</h1>
                <div>
                    <PerfilUser
                        isOpenEditUserPopUp={isOpenEditUserPopUp}
                        setIsOpenEditUserPopUp={setIsOpenEditUserPopUp}
                    />
                </div>
            </header>

            <main className='container-main-home'>
                <section className='section-transaction-summary'>
                    <TransactionResume
                        imgIcon={BillingPaid}
                        color={'#eef6f6'}
                        description={'Cobraças Pagas'}
                        value={payedTotalValues}
                    />

                    <TransactionResume
                        imgIcon={OverdueBilling}
                        color={'#FFEFEF'}
                        description={'Cobranças Vencidas'}
                        value={overdueTotalValues}
                    />

                    <TransactionResume
                        imgIcon={ExpectedCharges}
                        color={'#FCF6DC'}
                        description={'Cobranças Previstas'}
                        value={pendingTotalValues}
                    />
                </section>
                <div className='container-data'>
                    <section className='section-transactionDetail'>
                        <TransactionDetails
                            array={payedBills}
                            description={"Cobranças Pagas"}
                            billsQuantity={payedBills.length}
                            bgColor={"#EEF6F6"}
                            color={"#1FA7AF"}
                            navigateTo={"/cobrancas/paga"}
                        />

                        <TransactionDetails
                            array={overdueBills}
                            description={"Cobranças Vencidas"}
                            billsQuantity={overdueBills.length}
                            bgColor={"#FFEFEF"}
                            color={"#971D1D"}
                            navigateTo={"/cobrancas/vencida"}
                        />
                        <TransactionDetails
                            array={pendingBills}
                            description={"Cobranças Previstas"}
                            billsQuantity={pendingBills.length}
                            bgColor={"#FCF6DC"}
                            color={"#C5A605"}
                            navigateTo={"/cobrancas/pendente"}
                        />
                    </section>
                    <section className='section-clients-resume'>
                        <ClientsResume
                            array={overdueClients}
                            clientDetailIcon={DefaultingCustomer}
                            description={"Clientes Inadimplentes"}
                            clientQuantity={overdueClients.length}
                            bgColor={"#FFEFEF"}
                            color={"#971D1D"}
                            navigateTo={'/clientes/inadimplente'}
                        />
                        <ClientsResume
                            array={payedClients}
                            clientDetailIcon={CustomerUpToDate}
                            description={"Clientes em dia"}
                            clientQuantity={payedClients.length}
                            bgColor={"#EEF6F6"}
                            color={"#1FA7AF"}
                            navigateTo={'/clientes/emdia'}
                        />
                    </section>
                </div>
            </main>
            {
                isOpenEditUser &&
                <ModalEditUser
                    isOpen={isOpenEditUser}
                    setIsOpen={setIsOpenEditUser}
                />
            }
        </div>
    )
}

export default Home
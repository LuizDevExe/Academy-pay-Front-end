import React from 'react';
import './FilterCharges.css'
import circleCheck from '../../assets/check-circle-checkbox.svg'
import emptyCheck from '../../assets/empy-circle-checkbox.svg'



export default function FilterCharges({ filter, setFilter, setIsOpenFilter }) {

    function handleCheckbox(e) {
        if (e === "paga" && filter === 'paga') {
            setFilter('')
        } else if (e === 'paga') {
            setFilter('paga')
        }

        if (e === "pendente" && filter === 'pendente') {
            setFilter('')
        } else if (e === 'pendente') {
            setFilter('pendente')
        }

        if (e === "vencida" && filter === 'vencida') {
            setFilter('')
        } else if (e === 'vencida') {
            setFilter('vencida')
        }
    }

    return (
        <div className="filter-charges">
            <div className='sqr-filter-client-charge'></div>
            <div>
                <h3 htmlFor="checkbox">Status:</h3>
                <div
                    className="filter-charges-checkbox"
                    onClick={() => handleCheckbox("paga")}
                >
                    {filter === "paga" ? (
                        <img src={circleCheck} alt='campo paga está marcado' />
                    ) : (
                        <img src={emptyCheck} alt='campo paga está desmarcado'/>
                    )}
                    <h3>Paga</h3>
                </div>
                <div
                    className="filter-charges-checkbox"
                    onClick={() => handleCheckbox("pendente")}
                >
                    {filter === "pendente" ? (
                        <img src={circleCheck} alt='campo pendente está marcado'  />
                    ) : (
                        <img src={emptyCheck} alt='campo pendente está desmarcado' />
                    )}
                    <h3>Pendente</h3>
                </div>
                <div
                    className="filter-charges-checkbox"
                    onClick={() => handleCheckbox("vencida")}
                >
                    {filter === "vencida" ? (
                        <img src={circleCheck} alt='campo vencida está marcado'/>
                    ) : (
                        <img src={emptyCheck} alt='campo vencida está desmarcado' />
                    )}
                    <h3>Vencida</h3>
                </div>
            </div>
            <button
                onClick={() => setIsOpenFilter(false)}
            >Fechar</button>
        </div>
    )
};
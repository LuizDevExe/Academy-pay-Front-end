import React from 'react';
import './FilterClients.css'
import circleCheck from '../../assets/check-circle-checkbox.svg'
import emptyCheck from '../../assets/empy-circle-checkbox.svg'



export default function FilterClients({ filter, setFilter, setIsOpenFilter }) {

    function handleCheckbox(e) {
        if (e === "emdia" && filter === 'emdia') {
            setFilter('')
        } else if (e === 'emdia') {
            setFilter('emdia')
        }

        if (e === "inadimplente" && filter === 'inadimplente') {
            setFilter('')
        } else if (e === 'inadimplente') {
            setFilter('inadimplente')
        }
    }

    return (
        <div className="filter-clients">
            <div className='sqr-filter-client-charge'></div>
            <div>
                <h3 htmlFor="checkbox">Status:</h3>
                <div
                    className="filter-clients-checkbox"
                    onClick={() => handleCheckbox("emdia")}
                >
                    {filter === "emdia" ? (
                        <img src={circleCheck} alt='em dia está marcado' />
                    ) : (
                        <img src={emptyCheck}  alt='em dia está desmarcado' />
                    )}
                    <h3>Em dia</h3>
                </div>
                <div
                    className="filter-clients-checkbox"
                    onClick={() => handleCheckbox("inadimplente")}
                >
                    {filter === "inadimplente" ? (
                        <img src={circleCheck}  alt='Inadimplente está marcado'/>
                    ) : (
                        <img src={emptyCheck} alt='Inadimplente está desmarcado'/>
                    )}
                    <h3>Inadimplente</h3>
                </div>
            </div>
            <button
                onClick={() => setIsOpenFilter(false)}
            >Fechar</button>
        </div>
    )
};
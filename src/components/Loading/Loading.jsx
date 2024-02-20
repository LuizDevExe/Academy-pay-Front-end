import React from 'react';
import LoadingIcon from '../../assets/loading-icon.svg'
import './Loading.css'

export default function MyComponent() {
    return (
        <div className='loading-modal-page'>
            <img src={LoadingIcon} alt="Carregando..." />
        </div>
    );
};
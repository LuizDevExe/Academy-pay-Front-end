import React from 'react';
import './PopoverUser.css'

import editIcon from '../../assets/editIcon.svg'
import exitIcon from '../../assets/exitIcon.svg'

import { clearAll } from '../../utils/storage';
import { useNavigate } from 'react-router';

export default function MyComponent({ setIsOpenEditUser, setIsOpenEditUserPopUp }) {
    const navigate = useNavigate();

    function handleLogout() {
        clearAll();
        navigate('/')
    }

    function openModalEditUser() {
        setIsOpenEditUser(true)
        setIsOpenEditUserPopUp(false)
    }
    return (
        <>
            <div className='popover-square'></div>
            <div className='popover-container'>
                <button>
                    <img
                        src={editIcon}
                        alt=""
                        onClick={openModalEditUser}
                    />
                </button>
                <button>
                    <img
                        src={exitIcon}
                        alt=""
                        onClick={handleLogout}
                    />
                </button>
            </div>
        </>
    );
};
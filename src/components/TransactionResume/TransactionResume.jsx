import React from 'react'
import './TransactionResume.css'
import { formatCurrency } from '../../utils/storage'

function TransactionResume({ imgIcon, color, alt, description, value }) {
  return (
    <div className='container-transaction-resume' style={{ background: `${color}` }}>
      <img src={imgIcon} alt={alt} />
      <div>
        <h3>{description}</h3>
        <h2>{formatCurrency(value)}</h2>
      </div>
    </div>
  )
}

export default TransactionResume
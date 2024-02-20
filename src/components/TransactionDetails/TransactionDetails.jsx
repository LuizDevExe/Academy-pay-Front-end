import React from 'react'
import './TransactionDetails.css'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
} from '@chakra-ui/react';
import { formatCurrency } from '../../utils/storage';
import { Link } from 'react-router-dom';


function TransactionDetails({ array, description, billsQuantity, bgColor, color, navigateTo }) {

  return (
    <article className='container-transactionDetails'>
      <Box
        bg='#fff'
        borderRadius='2rem'
        w='100%'
        h='24.8125rem'
        className='container-transactionDetalils-media-query'
        display='flex'
        flexDir='column'
      >
        <div className='window-header'>
          <h3>{description}</h3>
          <h4 style={{ backgroundColor: `${bgColor}`, color: `${color}` }}>
            {billsQuantity.lenght === 2 ? billsQuantity : `0${billsQuantity}`}
          </h4>
        </div>

        <TableContainer
          overflowY={'hidden'}
          overflowX={'hidden'}
          fontFamily={'nunito'}
          h='18rem'
          borderBottom='1px solid #EDF2F7'
        >
          <Table
            variant='simple'
            padding='2rem'

          >
            <Thead h='4.12rem'>
              <Tr className='window-header-tr-header-transaction-details'
              >
                <Th
                  color={'3F3F55'}
                  fontSize={'1rem'}
                  fontWeight={'700'}
                  textTransform={'capitalize'}
                >Cliente</Th>
                <Th
                  color={'3F3F55'}
                  fontSize={'1rem'}
                  fontWeight={'700'}
                  textTransform={'capitalize'}
                >ID da cob.</Th>
                <Th
                  color={'3F3F55'}
                  fontSize={'1rem'}
                  fontWeight={'700'}
                  textTransform={'capitalize'}
                >Valor</Th>
              </Tr>
            </Thead>
            <Tbody
              overflow-x={'hidden'}
            >
              {array.slice(0, 4).map((object) => (
                <Tr className='window-header-tr-body-transaction-details' key={object.id}>
                  <Td
                    borderTop='1px solid #EDF2F7'
                  >
                    {object.client_name
                      ? object.client_name.length > 10
                        ? object.client_name.slice(0, 10) + "..."
                        : object.client_name
                      : ""}
                  </Td>
                  <Td
                    borderTop='1px solid #EDF2F7'
                  >
                    {object.id}
                  </Td>
                  <Td
                    borderTop='1px solid #EDF2F7'
                  >
                    {formatCurrency(object.value)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box className='container-expand-list '>
          <Link to={navigateTo}>
            Ver Todos
          </Link>
        </Box>
      </Box>
    </article>
  )
}

export default TransactionDetails
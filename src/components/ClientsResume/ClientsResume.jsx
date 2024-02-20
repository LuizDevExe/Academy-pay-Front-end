import React from 'react'
import './ClientsResume.css'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

function ClientsResume({ array, description, clientQuantity, bgColor, color, clientDetailIcon, navigateTo }) {
  return (
    <article className='container-clients-resume'>
      <Box
        bg='#fff'
        borderRadius='2rem'
        h='25.8rem'
        display='flex'
        flexDir='column' >
        <div className='window-header-client'>
          <div>
            <img src={clientDetailIcon} alt="ícone referente ao tipo de situação que o cliente se encontra" />
            <h3>{description}</h3>
          </div>
          <h4 style={{ backgroundColor: `${bgColor}`, color: `${color}` }}>
            {clientQuantity.length == 2 ? clientQuantity : `0${clientQuantity}`}
          </h4>
        </div>

        <TableContainer
          overflowY={'hidden'}
          overflowX={'hidden'}
          fontFamily={'nunito'}
          h='19rem'
          borderBottom='1px solid #EDF2F7'
        >
          <Table
            variant='simple'

          >
            <Thead className='container-thead-clients-resume'>
              <Tr className='window-header-tr-header-client-resume'>
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
                  textTransform={'-moz-initial'}
                >ID do clie.</Th>
                <Th
                  color={'3F3F55'}
                  fontSize={'1rem'}
                  fontWeight={'700'}
                  textTransform={'capitalize'}
                >CPF</Th>
              </Tr>
            </Thead>
            <Tbody
              overflow-x={'hidden'}

            >
              {array.slice(0, 4).map((object) => (
                <Tr h='3.5rem' className='window-header-tr-body-client-resume' key={object.id}>
                  <Td>
                    {object.name.length > 20 ? object.name.slice(0, 20) + '...' : object.name}
                  </Td>
                  <Td>{object.id}</Td>
                  <Td>{`${object.cpf}`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box height='2rem' className='container-expand-list-clients '>
          <Link to={navigateTo}>Ver todos</Link>
        </Box>
      </Box>

    </article>
  )
}

export default ClientsResume
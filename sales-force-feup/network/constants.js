import HOST_NAME from './hostname'

export const API_PORT = '1115';
export const PRIMAVERA_PORT = '1117';

export const HOST_FLASK = `${HOST_NAME}:${API_PORT}/`
export const HOST_PRIMAVERA = `${HOST_NAME}:${PRIMAVERA_PORT}/WebApi/`


export const RAW_QUERY_ROUTE = `${HOST_PRIMAVERA}Administrador/Consulta`

export const CUSTOMERS_URL = `${HOST_PRIMAVERA}Base/Clientes/LstClientes`
export const CREATE_CUSTOMER_URL =`${HOST_PRIMAVERA}Base/Clientes/Actualiza`
export const CUSTOMERS_DETAILS_URL = `${HOST_PRIMAVERA}Base/Clientes/Edita/`

export const CREATE_OPPORTUNITY_URL = `${HOST_PRIMAVERA}CRM/OportunidadesVenda/Actualiza/""`
export const CREATE_PROPOSAL_URL = `${HOST_PRIMAVERA}CRM/PropostasOPV/Actualiza/`

export const RETRIEVE_OPPORTUNITY_URL = opportunityCode => `${HOST_PRIMAVERA}CRM/OportunidadesVenda/Edita/${opportunityCode}/`
export const RETRIEVE_PROPOSAL_URL = (opportunityId, proposalNumber) => `${HOST_PRIMAVERA}CRM/PropostasOPV/Edita/${opportunityId}/${proposalNumber}/true`
export const UPDATE_PROPOSAL_URL = CREATE_PROPOSAL_URL
export const OPPORTUNITIES_URL = `${HOST_PRIMAVERA}CRM/OportunidadesVenda/`
export const PROPOSALS_OPV_URL = `${HOST_PRIMAVERA}CRM/PropostasOPV/`

export const CREATE_DOCUMENT = `${HOST_PRIMAVERA}Vendas/Docs/CreateDocument/`
export const DELETE_COSTUMER_URL =`${HOST_PRIMAVERA}Base/Clientes/Remove/`
export const ACTIVIDADES = `${HOST_PRIMAVERA}/CRM/Actividades`;

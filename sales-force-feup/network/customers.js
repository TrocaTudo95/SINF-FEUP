import {fetchRequest,fetchRequestMethod} from '../utils/utils'
import {DELETE_COSTUMER_URL,RAW_QUERY_ROUTE,CUSTOMERS_DETAILS_URL,CREATE_CUSTOMER_URL,CUSTOMERS_URL} from './constants'


export const fetchCustomers = (primaveraToken) => {
    return fetchRequest(fetchRequestMethod.GET, CUSTOMERS_URL,null,primaveraToken);
}

export const fetchNewCustomer= (body,primaveraToken) => {
    return fetchRequest(fetchRequestMethod.POST, CREATE_CUSTOMER_URL, body,primaveraToken);
}

export const getCustomerDetails = (customer,primaveraToken) => {
    return fetchRequest(fetchRequestMethod.GET, CUSTOMERS_DETAILS_URL + customer, null,primaveraToken)
}

export const deleteCostumer = (customer,primaveraToken) => {
    return fetchRequest(fetchRequestMethod.POST, DELETE_COSTUMER_URL + customer, null,primaveraToken)
}

export const getTopProductsFromCostumer = (customer,primaveraToken) => {
    const RAW_QUERY = `"SELECT TOP 5 LD.Descricao, sum(LD.TotalIliquido) as total, sum(LD.Quantidade) as total_quantidade FROM CabecDoc CD INNER JOIN CabecDocStatus CDS ON
    CDS.IdCabecDoc = CD.Id INNER JOIN LinhasDoc LD ON CD.Id=LD.IdCabecDoc  WHERE CD
    .Entidade = '${customer}' AND CD.TipoDoc = 
    'ECL'  GROUP BY LD.Descricao
    ORDER BY total DESC "`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getNegativeCustomerAccount =(customer,primaveraToken) => {
    const RAW_QUERY = `"SELECT CD.Data,LD.TotalIliquido,LD.Descricao,LD.TotalIva FROM CabecDoc CD INNER JOIN CabecDocStatus CDS ON
    CDS.IdCabecDoc = CD.Id INNER JOIN LinhasDoc LD ON CD.Id=LD.IdCabecDoc  WHERE CD.Entidade = '${customer}' AND CD.TipoDoc = 'FA' "`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getPositiveCustomerAccount =(customer,primaveraToken) => {
    const RAW_QUERY = `"select cd.[data], cd.totaldocumento, ld.descricao
    from linhasliq ll
    inner join cabecdoc cd on cd.tipodoc = ll.tipodocorig and cd.serie = ll.serieorig and cd.numdoc = ll.numdocorigint
    inner join linhasdoc ld on ld.idcabecdoc = cd.id
    where ll.tipodoc = 'RE' and ll.entidade = '${customer}'"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getOpenOportunities =(customer,primaveraToken) =>{
    const RAW_QUERY = `"SELECT cov.Oportunidade, cov.Resumo FROM cabecoportunidadesvenda cov WHERE cov.Entidade='${customer}' "`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}
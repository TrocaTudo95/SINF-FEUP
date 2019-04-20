import { fetchRequest, fetchRequestMethod } from '../utils/utils'
import { RAW_QUERY_ROUTE } from './constants'


export const getTotalOrdersMonth = (salesMan, primaveraToken) => {
    // const RAW_QUERY = `"SELECT sum(CD.Totaldocumento) as total FROM CabecDoc CD INNER JOIN CabecDocStatus CDS ON
    // CDS.IdCabecDoc = CD.Id INNER JOIN LinhasDoc LD ON CD.Id=LD.IdCabecDoc INNER JOIN CabecOportunidadesVenda CV ON CV.ID=CD.IdOportunidade WHERE
    // CD.TipoDoc = 'ECL'and MONTH(CD.Data)= ${month} and CV.Vendedor='${salesMan}'"`
    const RAW_QUERY = `"SELECT sum(ValorTotalOV) as total FROM CabecOportunidadesVenda WHERE
        EstadoVenda=1 and MONTH(DataUltimaAct)= MONTH(CURRENT_TIMESTAMP) and Vendedor='${salesMan}'"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getOpenLeads = (salesMan, primaveraToken) => {
    const RAW_QUERY = `"SELECT count(*) AS OpenLeads FROM CabecOportunidadesVenda WHERE EstadoVenda=0 and Vendedor='${salesMan}'"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getNextTask = (salesMan, primaveraToken) => {
    const RAW_QUERY = `"SELECT TOP 1 Estado,Resumo,DataInicio from tarefas where Estado=0 and EntidadePrincipal ='${salesMan}' and DataInicio >= CURRENT_TIMESTAMP  ORDER BY DataInicio "`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getMonthSalesForecast = (salesMan, primaveraToken) => {
    const RAW_QUERY = `"SELECT sum(ValorTotalOV) as total FROM CabecOportunidadesVenda WHERE
    EstadoVenda = 0 and DataCriacao <= CURRENT_TIMESTAMP and DataExpiracao >= CURRENT_TIMESTAMP and Vendedor = '${salesMan}'"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const getOportunitiesStatus = (salesMan, primaveraToken) => {
    const RAW_QUERY = `"SELECT EstadoVenda, count(Id) as Ocorrencias from CabecOportunidadesVenda where Vendedor ='${salesMan}'  GROUP BY EstadoVenda ORDER BY EstadoVenda ASC"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}


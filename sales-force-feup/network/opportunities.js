import {RAW_QUERY_ROUTE, CREATE_OPPORTUNITY_URL, CREATE_PROPOSAL_URL, RETRIEVE_OPPORTUNITY_URL, RETRIEVE_PROPOSAL_URL, UPDATE_PROPOSAL_URL, CREATE_DOCUMENT, OPPORTUNITIES_URL} from './constants'
import {fetchRequest,fetchRequestMethod} from '../utils/utils'


/**
	* 
	* @param {*} primaveraToken 
	* @param {*} salesmanCode 
	* @returns A JSON Array with the following fields:
	* oportunidade: oportunity code
	* descricao: oportunity description
	* linha: pipelineID
	* estado: pipelineState completeness boolean
	* ciclovendacodigo pipelineCodeID
	* ciclovendadescricao pipline state description
	* totalpropostas: 1.5
	* datacriacao: 2018-11-30T00:00:00
	* dataexpiracao: 2018-12-21T00:00:00
	* entidade: C0002
	* nome: TRO Lda
*/
export const fetchOpportunityList = (primaveraToken, salesmanCode) => {

	const RAW_QUERY = `"SELECT 
							cov.id, 
							cov.oportunidade, 
							cov.estadovenda, 
							cov.descricao, 
							sum(coalesce(popv.rentabilidade, 0)) as totalpropostas, 
							cov.datacriacao, 
							cov.dataexpiracao, 
							cov.entidade
						FROM cabecoportunidadesvenda cov
						LEFT JOIN propostasopv popv on popv.idoportunidade = cov.id
						WHERE cov.vendedor = '${salesmanCode}'
						GROUP BY 
							cov.id, 
							cov.oportunidade, 
							cov.estadovenda, 
							cov.descricao, 
							cov.datacriacao, 
							cov.dataexpiracao, 
							cov.entidade
						ORDER BY cov.EstadoVenda ASC, cov.dataexpiracao ASC"`
	

	return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken);
}


export const fetchOpportunityDetails = (primaveraToken, opptyCode) => {

	const RAW_QUERY = `"SELECT 
							cov.Id,
							cov.Oportunidade,
							cov.EstadoVenda,
							cov.Descricao as DescricaoOportunidade,
							cov.Entidade,
							cov.ValorTotalOV,
							cov.DataCriacao,
							cov.DataExpiracao,
							cov.Resumo,
							lpov.Artigo,
							lpov.Descricao as DescricaoArtigo,
							lpov.PrecoVenda,
							lpov.Quantidade, 
							lpov.Unidade,
							lpov.Desconto,
							lpov.ValorDesconto,
							lpov.Rentabilidade,
							art.Iva
							FROM CabecOportunidadesVenda cov
						LEFT JOIN LinhasPropostasOPV lpov ON cov.ID = lpov.IdOportunidade
						LEFT JOIN Artigo art ON art.Artigo = lpov.Artigo 
						WHERE cov.oportunidade = '${opptyCode}'"`
	return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)
}

export const changeOpportunityState = async (primaveraToken, opportunity, state) => {

	const opportunityInfo = await fetchRequest(fetchRequestMethod.GET, `${OPPORTUNITIES_URL}Edita/${opportunity}`, null, primaveraToken)

	let lostOpportunity = opportunityInfo.body;
	lostOpportunity.EstadoVenda = state;

	return fetchRequest(fetchRequestMethod.POST, `${OPPORTUNITIES_URL}Actualiza/""`, lostOpportunity, primaveraToken)
	
}

export const fetchOpportunityTasks = (primaveraToken, opportunityID) => {
	const RAW_QUERY = `"SELECT Id, IdTipoActividade, Estado, Resumo, Descricao, DataInicio, DataFim 
	FROM Tarefas
	WHERE IDCabecOVenda = '${opportunityID}'
	ORDER BY DataInicio"`	
	
	return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken);	
}

export const makeOrder = (primaveraToken, opportunityInfo) => {

	return fetchRequest(fetchRequestMethod.POST, CREATE_DOCUMENT, opportunityInfo, primaveraToken)
}

export const createOpportunity = (primaveraToken, opportunity) => {

    return fetchRequest(fetchRequestMethod.POST, CREATE_OPPORTUNITY_URL, opportunity, primaveraToken)

}

export const createProposal = (primaveraToken, opportunityId, products, proposalNumber) => {

	const lines = products.map((product,line) => ({

		IdOportunidade: opportunityId, 
		NumProposta: proposalNumber,
		Artigo: product.Artigo,
		Quantidade: `${product.quantity}`, 
		PrecoVenda:`${product.PVP1}`, 
		Descricao: product.Descricao,
		Unidade: product.UnidadeBase,
		Linha: line + 1

	}))
	
    const proposal = {
        IdOportunidade: opportunityId,
        NumProposta: proposalNumber,
        Linhas: lines2
    }

    

    return fetchRequest(fetchRequestMethod.POST, CREATE_PROPOSAL_URL, proposal, primaveraToken)

}

export const fetchProposal = (primaveraToken, opportunityId, proposalNumber) => {

    return fetchRequest(fetchRequestMethod.GET, RETRIEVE_PROPOSAL_URL(opportunityId, proposalNumber), null, primaveraToken)

}


export const fetchOpportunity = (primaveraToken, opportunityCode) => {

    return fetchRequest(fetchRequestMethod.GET, RETRIEVE_OPPORTUNITY_URL(opportunityCode), null, primaveraToken)

}

export const addProductsToProposal = (primaveraToken, proposal, productsQuantity) => {
    
    const lines = productsQuantity.map((product) =>  ({IdOportunidade: proposal.IdOportunidade, NumProposta: "1", Artigo: product.Artigo, Quantidade: `${product.quantity}`, PrecoVenda:`${product.PVP1}`, Descricao: product.Descricao}))
    
    proposal.Linhas = lines

    let newProposal = [...proposal]
    newProposal.Linhas = lines

    return fetchRequest(fetchRequestMethod.POST, UPDATE_PROPOSAL_URL, newProposal, primaveraToken)

}

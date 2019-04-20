import {HOST_FLASK, RAW_QUERY_ROUTE} from './constants'
import {fetchRequest,fetchRequestMethod} from '../utils/utils'

export const fetchProducts = (primaveraToken) => {

    const RAW_QUERY = `"SELECT Artigo.Artigo, Artigo.Descricao, Artigo.UnidadeBase, Artigo.Iva, ArtigoMoeda.PVP1, Artigo.StkActual
                        FROM Artigo JOIN ArtigoMoeda ON ArtigoMoeda.Artigo = Artigo.Artigo"`
    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, RAW_QUERY, primaveraToken)

}

export const fetchPicture = (pictureId) => {

    return fetchRequest(fetchRequestMethod.GET, `${HOST_FLASK}products/${pictureId}`)

}
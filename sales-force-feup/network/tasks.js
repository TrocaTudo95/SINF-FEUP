import { HOST_FLASK, RAW_QUERY_ROUTE, ACTIVIDADES } from './constants'
import { fetchRequest, fetchRequestMethod } from '../utils/utils'

export const fetchTasks = (user) => {

    const queryListaTarefas = `"
        SELECT Id, IdTipoActividade, Estado, Resumo, Descricao, DataInicio, DataFim 
        FROM Tarefas 
        WHERE EntidadePrincipal = '${user.salesmanCode}'
        ORDER BY DataInicio
    "`;
    
    // WHERE DATEDIFF(day, DataInicio, current_timestamp) = ${dayOffset}

    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, queryListaTarefas, user.primaveraToken);
}

export const updateTask = async (id, completed, authToken) => {

    let taskInfo = await fetchRequest(fetchRequestMethod.GET, `${ACTIVIDADES}/Edita/${id}`, null, authToken);

    taskInfo.body.Estado = completed.toString();

    return await fetchRequest(fetchRequestMethod.POST, `${ACTIVIDADES}/Actualiza/`, JSON.stringify(taskInfo.body), authToken);
}

export const deleteTask = async (id, authToken) => {
    return await fetchRequest(fetchRequestMethod.POST, `${ACTIVIDADES}/Remove/${id}`, null, authToken);
}

export const fetchTaskType = (user) => {

    let query = `"SELECT Id FROM TiposTarefa"`;

    return fetchRequest(fetchRequestMethod.POST, RAW_QUERY_ROUTE, query, user.primaveraToken);
}

export const fetchNewTask = (body, user) => {

    let primaveraBody = {};
    primaveraBody.Resumo = body.name;
    primaveraBody.DataInicio = body.date;
    primaveraBody.DataFim = body.date;
    primaveraBody.Descricao = body.details;
    primaveraBody.TipoEntidadePrincipal = 'V';
    primaveraBody.EntidadePrincipal = user.salesmanCode;
    primaveraBody.Estado=0;
    // TODO: Escolher Tipo de Actividade
    primaveraBody.IdTipoActividade = body.taskType;

    return fetchRequest(fetchRequestMethod.POST, `${ACTIVIDADES}/Actualiza`, JSON.stringify(primaveraBody), user.primaveraToken)
}

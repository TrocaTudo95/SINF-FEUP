PRIMAVERA_API_URL = 'http://host.docker.internal:1117/WebApi/'
PRIMAVERA_API_URL_RAW_QUERY = 'Administrador/Consulta'
PRIMAVERA_API_URL_CREATE_OPPORTUNITY = 'CRM/OportunidadesVenda/Actualiza/""'


PRIMAVERA_TOKEN_PARAMS = {

    'username': 'FEUP',
    'password': 'qualquer1',
    'grant_type':'password',
    'line':'professional',
    # 'comapny': 'DEMO',
    #'company': 'BELAFLOR',
    'company': 'MFEUPSTD',
    'instance':'DEFAULT'
}

class HTTP_METHODS:
    get = 'GET'
    post = 'POST'
    put = 'PUT'
    delete = 'DELETE'




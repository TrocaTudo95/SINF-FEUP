from flask import current_app, g, Blueprint, request

from sff.constants import PRIMAVERA_TOKEN_PARAMS, PRIMAVERA_API_URL, HTTP_METHODS

from flask import jsonify
import requests

from sff.utils import PrimaveraAsyncRequest, AsyncRequest, PrimaveraSubsequentAsyncRequest

mod_customers = Blueprint('customers', __name__, url_prefix='/customers')

@mod_customers.route('/', methods=['POST'])
def getCustomers():
    requestData = request.get_json()

    if 'primaveraToken' in requestData:
        primaveraToken = requestData['primaveraToken']
        thread = PrimaveraSubsequentAsyncRequest(HTTP_METHODS.get,{}, 'Base/Clientes/LstClientes', primaveraToken)
        thread.start()
        return jsonify(thread.join().json())

    else:
        return ('not authorized', 403)



@mod_customers.route("/", methods=['POST'])
def addCustomer():
    requestData = request.get_json()

    
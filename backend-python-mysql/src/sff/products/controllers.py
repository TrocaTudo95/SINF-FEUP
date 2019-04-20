from flask import current_app, g, Blueprint, request

from sff.constants import PRIMAVERA_TOKEN_PARAMS, PRIMAVERA_API_URL, HTTP_METHODS

from flask import jsonify
import requests
import base64

from sff.utils import PrimaveraAsyncRequest, AsyncRequest, PrimaveraSubsequentAsyncRequest

mod_products = Blueprint('products', __name__, url_prefix='/products')

@mod_products.route('/', methods=['POST'])
def getProducts():
    requestData = request.get_json()

    if 'primaveraToken' in requestData:
        primaveraToken = requestData['primaveraToken']
        thread = PrimaveraSubsequentAsyncRequest(HTTP_METHODS.get,{}, 'Base/Artigos/LstArtigos', primaveraToken)
        thread.start()
        return jsonify(thread.join().json())

    else:
        return ('not authorized', 403)

@mod_products.route('/<productId>')
def getProductImage(productId):
    filePath = 'sff/products/pictures/%s.png' % productId 
    with open(filePath, 'rb') as image_file:
        encoded_pic_bytes = base64.b64encode(image_file.read())
        decoded_pic_string = encoded_pic_bytes.decode('utf-8')
        response = {}
        response['picture'] = decoded_pic_string
        return jsonify(response)

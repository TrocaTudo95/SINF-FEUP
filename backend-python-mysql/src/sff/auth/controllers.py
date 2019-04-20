from flask import current_app, g, Blueprint, request
from sff.db import db

from sff.constants import PRIMAVERA_TOKEN_PARAMS, PRIMAVERA_API_URL, HTTP_METHODS, PRIMAVERA_API_URL_RAW_QUERY, PRIMAVERA_API_URL_CREATE_OPPORTUNITY

from flask import jsonify
import requests

import json
import secrets

from pymysql.cursors import DictCursor

from sff.utils import PrimaveraAsyncRequest, PrimaveraSubsequentAsyncRequest

from werkzeug.security import generate_password_hash, check_password_hash

mod_auth = Blueprint('auth', __name__, url_prefix='/auth')

@mod_auth.route('/primaveraToken', methods=['GET'])
def getToken():
    thread = PrimaveraAsyncRequest(HTTP_METHODS.post,PRIMAVERA_TOKEN_PARAMS, 'token')
    thread.start()
    return jsonify(thread.join().json())

@mod_auth.route('/signup', methods=['POST'])
def signup():

    requestData = request.get_json()
    
    if 'salesmanCode' not in requestData:
        return ('No salesman code', 400)

    if 'password' not in requestData:
        return ('No salesman password', 400)

    salesmanCode = requestData['salesmanCode']
    salesmanPwd = requestData['password']


    if checkIfSalesmanAlreadyRegistered(salesmanCode) is True:
        return ('The code %s was already registered before' % salesmanCode, 400)

    existsInERP = checkIfSalesmanInERP(salesmanCode)
    salesManExists = existsInERP[0]
    
    if salesManExists is False:
        return ('The code %s is not registered in the ERP' % salesmanCode, 400)

    salesmanName = existsInERP[1][0]['Nome']

    finalResult = insertUser(salesmanCode, salesmanName, salesmanPwd)

    if finalResult is False:
        return ('An error ocurred inserting the user',500)

    finalResult = insertDefaultOpportunity(salesmanCode)

    if finalResult is False:
        return ('An error ocurred inserting the user',500)

    return (jsonify({'name': salesmanName, 'salesmanCode': salesmanCode}), 200)
    

def checkIfSalesmanAlreadyRegistered(salesmanCode):
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)
    checkExist = "SELECT Count(*) as total FROM User WHERE salesmanCode = %s"
    cursor.execute(checkExist, (salesmanCode))
    res = cursor.fetchone()['total']
    cursor.close()
    return res > 0

def checkIfSalesmanInERP(salesmanCode):
    token = getToken().get_json()['access_token']
    checkExistPrimaveraQuery = '\"SELECT * FROM Vendedores WHERE Vendedor = \'%s\'\"' % salesmanCode
    checkExistPrimavera = PrimaveraSubsequentAsyncRequest(HTTP_METHODS.post, checkExistPrimaveraQuery, PRIMAVERA_API_URL_RAW_QUERY,  token, True)
    checkExistPrimavera.start()
    responseExistPrimavera = checkExistPrimavera.join().json()['DataSet']['Table']
    return (len(responseExistPrimavera) == 1, responseExistPrimavera)

def insertUser(salesmanCode, salesmanName, salesmanPwd):
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)
    checkExist = "INSERT INTO User(salesmanCode, password, fullname) VALUES(%(code)s, %(pwd)s, %(name)s)"
    res = cursor.execute(checkExist, {'code': salesmanCode, 'name': salesmanName, 'pwd': generate_password_hash(salesmanPwd)})
    dbConn.commit()
    cursor.close()
    return res == 1

def insertDefaultOpportunity(salesmanCode):
    token = getToken().get_json()['access_token']
    body = {
        "Oportunidade": "OPDEF"+salesmanCode,
        "Descricao": "Default Oportunity:"+salesmanCode,
        "DataCriacao": "11/27/2018",
        "DataExpiracao": "12/27/2018",
        "Resumo": "Default Oportunity:"+salesmanCode,
        "Entidade": "VD",
        "TipoEntidade": "C",
        "EstadoVenda": "0",
        "Moeda": "EUR",
        "Vendedor": salesmanCode,
        "CicloVenda": "CICDEF"
    }
    insertOpportunity = PrimaveraSubsequentAsyncRequest(HTTP_METHODS.post, json.dumps(body), PRIMAVERA_API_URL_CREATE_OPPORTUNITY, token, True)
    insertOpportunity.start()
    return insertOpportunity.join()


@mod_auth.route('/login', methods=['POST'])
def login():
    requestData = request.get_json()
    
    if 'salesmanCode' not in requestData or 'password' not in requestData:
        return ('Missing credentials', 400)

    salesmanCode = requestData['salesmanCode']
    salesmanPwd = requestData['password']

    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)

    userQuery = "SELECT id, salesmanCode, fullname, password FROM User WHERE salesmanCode = %(code)s"
    res = cursor.execute(userQuery, {"code": salesmanCode})

    if res == 0:
        cursor.close()
        return("Wrong credentials", 403)
    
    user = cursor.fetchone()

    if check_password_hash(user['password'], salesmanPwd) is False:
        cursor.close()
        return("Wrong credentials", 403)

    sessionToken = getSessionToken(user['id'])
    primaveraToken = getToken().get_json()

    if sessionToken == '':
        cursor.close()
        return ('something went wrong', 500)

    cursor.close()

    return (jsonify({"userId": user['id'], "salesmanCode": salesmanCode, "sessionToken": sessionToken, "username": user['fullname'], "primaveraToken": primaveraToken['access_token']}), 200)


def getSessionToken(userId):

    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)

    sessionQuery = "SELECT session_token FROM Session WHERE user_id = %(id)s"
    res = cursor.execute(sessionQuery, {"id": userId})

    if res == 1:
        cursor.close()
        return cursor.fetchone()['session_token']
    
    newtoken = secrets.token_hex(64)

    insertQuery = "INSERT INTO Session(user_id, session_token) VALUES(%(uid)s, %(st)s)"
    res = cursor.execute(insertQuery, {'uid': userId, 'st': newtoken})
    dbConn.commit()

    if res == 1:
        cursor.close()
        return newtoken

    cursor.close()
    return ''


@mod_auth.route('/loginWithToken', methods=['POST'])
def loginWithToken():
    requestData = request.get_json()
    
    if 'userId' not in requestData or 'sessionToken' not in requestData:
        return ('Missing credentials', 400)

    userId = requestData['userId']
    sessionToken = requestData['sessionToken']

    query = 'SELECT user_id, session_token FROM Session WHERE user_id = %(uid)s AND session_token = %(token)s'
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)


    if cursor.execute(query, {'uid': userId, 'token': sessionToken}) == 0:
        cursor.close()
        return ('Wrong user credentials', 400)

    queryUser = 'SELECT id, salesmanCode, fullname FROM User WHERE id = %(uid)s'
    cursor.execute(queryUser, {'uid': int(userId)})

    user = cursor.fetchone()
    primaveraToken = getToken().get_json()

    if 'error' in primaveraToken:
        cursor.close()
        return ('Company code not found', 400)

    cursor.close()

    return (jsonify({"userId": user['id'], "salesmanCode": user['salesmanCode'], "sessionToken": sessionToken, "username": user['fullname'], "primaveraToken": primaveraToken['access_token']}), 200)



@mod_auth.route('/logout', methods=['POST'])
def logout():
    requestData = request.get_json()
    
    if 'sessionToken' not in requestData or 'userId' not in requestData:
        return ('No session received', 400)

    sessionToken = requestData['sessionToken']
    userId = requestData['userId']

    query = 'SELECT user_id, session_token FROM Session WHERE user_id = %(uid)s AND session_token = %(token)s'
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)

    if cursor.execute(query, {'uid': userId, 'token': sessionToken}) == 0:
        cursor.close()
        return ('No user or wrong user credentials', 400)

    queryDelete = 'DELETE FROM Session WHERE user_id = %(uid)s'
    res = cursor.execute(queryDelete, {'uid': userId})
    dbConn.commit()
    cursor.close()

    if res == 1:
        return ('',200)

    return ('something went wrong', 500)
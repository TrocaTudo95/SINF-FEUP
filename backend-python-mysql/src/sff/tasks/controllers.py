from flask import current_app, g, Blueprint, request, jsonify
from sff.db import db

from pymysql.cursors import DictCursor

mod_tasks = Blueprint('tasks',__name__, url_prefix='/tasks')

@mod_tasks.route('/')
def tasks():
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)
    cursor.execute('''SELECT * FROM 
    Task ORDER by date''')
    res = cursor.fetchall()
    cursor.close()
    return jsonify(res)

@mod_tasks.route('/<taskId>/', methods=['PUT'])
def updateTask(taskId):
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)
    requestData = request.get_json()

    if 'completed' in requestData:

        completed = requestData['completed']
        update_stmt = "UPDATE Task SET completed = %s WHERE id = %s"
        res =  cursor.execute(update_stmt, (completed,taskId))
        dbConn.commit()
        cursor.close()
        return (str(res),200)
    else:
        cursor.close()
        return ('false',400)

@mod_tasks.route("/<taskId>/", methods=['DELETE'])
def deleteTask(taskId):
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)
    delete_stmt = "DELETE FROM Task WHERE id = %s"
    res =  cursor.execute(delete_stmt, (taskId))
    dbConn.commit()
    cursor.close()
    return (str(res),200)

@mod_tasks.route("/", methods=['POST'])
def new_task():
    dbConn = db.get_db()
    cursor = dbConn.cursor(DictCursor)

    data = request.get_json()

    name = data['name']
    date = data['date']
    details = data['details']
    
    cursor.execute("INSERT INTO Task (name, date, details) VALUES ('%s','%s','%s')" % (name, date, details))
    
    dbConn.commit()
    cursor.close()
    return ("")
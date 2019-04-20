from flaskext.mysql import MySQL
from flask import current_app, g
from flask.cli import with_appcontext

from os import system

import click

def get_db():

    if 'db' not in g:
        g.db = current_app.mysql.connect()

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

def init_db():
    executeScript('sff/db/seed.sql')
    
def populateDatabase():
    executeScript('sff/db/populate.sql')


def executeScript(scriptPath):

    user = current_app.config['MYSQL_DATABASE_USER']
    pwd = current_app.config['MYSQL_DATABASE_PASSWORD']
    host = current_app.config['MYSQL_DATABASE_HOST']
    port = current_app.config['MYSQL_DATABASE_PORT']

    command = """mysql --user=%s --password=%s --host=%s --port=%d < %s""" % (user,pwd,host,port, scriptPath)

    system(command)



@click.command('seed')
@with_appcontext
def seed():
    """Reset db"""
    init_db()
    populateDatabase()
    click.echo('Database initialized.')


def init_app(app):
    app.mysql = MySQL()
    app.mysql.init_app(app)
    app.teardown_appcontext(close_db)
    app.cli.add_command(seed)
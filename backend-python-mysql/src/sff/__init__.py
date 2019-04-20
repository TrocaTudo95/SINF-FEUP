import os

from flask import Flask, jsonify, current_app, request
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
from sff.db import db

from sff.auth.controllers import mod_auth
from sff.tasks.controllers import mod_tasks
from sff.products.controllers import mod_products
from sff.customers.controllers import mod_customers


def create_app(test_config=None):
    'create and configure the app'
    app = Flask(__name__, instance_relative_config=True)

    user = 'root'
    pwd = os.environ['MYSQL_ROOT_PASSWORD']
    host = os.environ['MYSQL_HOST']
    port = int(os.environ['MYSQL_PORT'])

    app.config.from_mapping(
        SECRET_KEY='dev',
        MYSQL_DATABASE_USER=user,
        MYSQL_DATABASE_PASSWORD=pwd,
        MYSQL_DATABASE_DB='salesforcefeup',
        MYSQL_DATABASE_HOST=host,
        MYSQL_DATABASE_PORT=port
    )

    db.init_app(app)
    app.register_blueprint(mod_auth)
    app.register_blueprint(mod_tasks)
    app.register_blueprint(mod_products)
    app.register_blueprint(mod_customers)

    if test_config is None:
        'load the instance config, if it exists, when not testing'
        app.config.from_pyfile('config.py', silent=True)
    else:
        'load the test config if passed in'
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)

    except OSError:
        pass


    #########  ROUTES  #########

    @app.route("/")
    def hello():
        resp = {}
        resp['greeting'] = "Hello World from Flask"
        resp['var_env'] = {}
        for var in os.environ:
            resp['var_env'][var] = os.environ[var]
        return jsonify(resp)

    return app


if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("DEBUG", True)
    os.environ["FLASK_APP"] = "sff"
    os.environ["FLASK_ENV"] = "development"
    create_app().run(host='0.0.0.0', port=5000, debug=ENVIRONMENT_DEBUG)
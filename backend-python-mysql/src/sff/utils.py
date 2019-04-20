import requests
from threading import Thread
from sff.constants import HTTP_METHODS, PRIMAVERA_API_URL


class AsyncRequest(Thread):

    def __init__(self, method, params, api, json=False):
        Thread.__init__(self)
        self.params = params
        self.api = api
        self.method = method

        if json is False:
            self.headers = {'Content-type': 'application/x-www-form-urlencoded'}
        else:
            self.headers = {'Content-type': 'application/json'}


    def run(self):

        if self.method == HTTP_METHODS.get:
            self.result = requests.get(self.api, params=self.params, headers=self.headers)
        
        elif self.method == HTTP_METHODS.post:
            self.result = requests.post(self.api, data=self.params, headers=self.headers)

        elif self.method == HTTP_METHODS.put:
            self.result = requests.put(self.api, data=self.params)

        else:
            self.result = requests.delete(self.api)

    def join(self):
        Thread.join(self)
        print("SELF: \n")
        print(self)
        return self.result

class PrimaveraAsyncRequest(AsyncRequest):
    def __init__(self,method,params, api, json=False):
        AsyncRequest.__init__(self,method,params, '%s%s' % (PRIMAVERA_API_URL, api), json)

class PrimaveraSubsequentAsyncRequest(AsyncRequest):
    def __init__(self,method,params,api,token, json=False):
        AsyncRequest.__init__(self,method,params, '%s%s' % (PRIMAVERA_API_URL, api), json)
        self.headers['Authorization'] = 'Bearer %s' % token
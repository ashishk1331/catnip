from flask import Flask, request
import json
from util.main import generate as g

app = Flask(__name__)

@app.route("/id", methods=['POST'])
def hello_world():
    code = json.loads(request.data)['id']
    return g(code)

@app.route("/status")
def getStatus():
    return {
        'status': 'working'
    }

if __name__ == "__main__":
    app.run(debug=True)
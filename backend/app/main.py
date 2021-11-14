import os
import datetime
import re
import requests
import covalent_api
import json
from pprint import pprint
from fastapi import Request, FastAPI, status
from jinja2 import Template
from simpleeval import simple_eval

# configuration
DEBUG = os.environ.get('DEBUG')
PREFIX = "/api"  # defined in the reverse proxy

# instantiate the app
app = FastAPI(debug=DEBUG, title="EtherScore-backend", openapi_prefix=PREFIX)

with open("badges.json") as f:
    badges = json.load(f)
badges_definitions = badges["badges"]

# functon to create a new object from a var classname
def create_class(classname):
    cls = globals()[classname]
    return cls()

# function to use requests.post to make an API call to the subgraph url
def run_query(url, q):
    request = requests.post(url, '', json={'query': q})
    if request.status_code == 200:
        return request.json()
    else:
        raise Exception('Query failed. return code is {}. {}'.format(
            request.status_code, q))


class TheGraph():
    """
    Base class to request TheGraph
    """

    def __init__(self, subgraph_url) -> None:
        self.subgraph_url = subgraph_url
        self.template = ""

    def run(self, values={}):
        query = Template(self.template).render(values)
        return run_query(self.subgraph_url, query)['data']


class Covalent():
    """
    Base class to request Covalent API
    """

    def __init__(self, ckey):
        self.session = covalent_api.Session(api_key=ckey)
        self.a = covalent_api.ClassA(self.session)

    def run(self, wallet_address):
        # check if he holds one of our nfts
        return self.a.get_token_balances_for_address('1', wallet_address, True, True)

    def getTransactions(self, wallet_address):
        # check if he holds one of our nfts
        return self.a.get_transactions('1', wallet_address)


class CovalentHasTokens(Covalent):
    def __init__(self) -> None:
        super().__init__("ckey_2000734ae6334c75b8b44b1466e:")

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb = 0
        res = self.run(address)
        if (res['data'] != None) and (res['data']['items'] != None):
            for item in res['data']['items']:
                if item['balance'] != "0":
                    nb += 1
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb
        #badge_passport["owned"] = get
        return badge_passport


class CovalentAddressUsed(Covalent):
    def __init__(self) -> None:
        super().__init__("ckey_2000734ae6334c75b8b44b1466e:")

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb = 0
        res = self.getTransactions(address)
        if (res['data'] != None) and (res['data']['items'] != None):
            for item in res['data']['items']:
                if int(item['block_signed_at'].split(sep="-")[0]) < 2016:
                    nb += 1
                    break
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb
        #badge_passport["owned"] = get
        return badge_passport


class CovalentGasConsumed(Covalent):
    def __init__(self) -> None:
        super().__init__("ckey_2000734ae6334c75b8b44b1466e:")

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb = 0
        res = self.getTransactions(address)
        if (res['data'] != None) and (res['data']['items'] != None):
            for item in res['data']['items']:
                nb += item['gas_quote']
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb
        #badge_passport["owned"] = get
        return badge_passport


class UniswapTransactions(TheGraph):
    """
    Get Uniswap transactions for a given wallet address
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
        query = '/app/queries/uniswap_transactions.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        number_of_swaps = 0
        res = self.run({'address': address})
        if len(res['swaps']) > 0:
            number_of_swaps = len(res['swaps'])
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = number_of_swaps
        #badge_passport["owned"] = get
        return badge_passport


class UniswapProvider(TheGraph):
    """
    Get Uniswap transactions for a given wallet address
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
        query = '/app/queries/uniswap_provider.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb = 0
        res = self.run({'address': address})
        if len(res['mints']) > 0:
            nb = len(res['mints'])
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb
        #badge_passport["owned"] = get
        return badge_passport


class UniswapMaxSwapAmount(TheGraph):
    """
    Get Uniswap max amount swapped
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
        query = '/app/queries/uniswap_max_value_swap.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        max_amount = 0
        res = self.run({'address': address})
        if len(res['swaps']) > 0:
            max_amount = res['swaps'][0]['amountUSD']
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = max_amount
        #badge_passport["owned"] = get
        return badge_passport


class AaveNeverLiquidated(TheGraph):
    """
    Get Aave user, number of liquidated positions
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2'
        query = '/app/queries/aave_never_liquidated.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb_liquidations = None
        sumBorrowed = None
        res = self.run({'address': address})
        if res['user'] != None:
            nb_liquidations = len(res['user']["liquidationCallHistory"])
            sumBorrowed = len(res['user']["borrowHistory"])
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = sumBorrowed
        badge_passport["conditions"][1]["current"] = nb_liquidations
        #badge_passport["owned"] = get
        return badge_passport


class AaveFlashLoans(TheGraph):
    """
    Get Aave user, number of liquidated positions
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2'
        query = '/app/queries/aave_flash_loan.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb = None
        res = self.run({'address': address})
        if res['flashLoans'] != None:
            nb= len(res['flashLoans'])
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb
        #badge_passport["owned"] = get
        return badge_passport

class ZeExplorer():
    """
    Get Aave user, number of liquidated positions
    """
    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = 0
        badge_passport["conditions"][1]["current"] = 0
        badge_passport["conditions"][2]["current"] = 0
        #badge_passport["owned"] = get
        return badge_passport

class CompoundNeverLiquidated(TheGraph):
    """
    Get compound user, number of liquitated
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/zanepeycke/compound-v2-legacy'
        query = '/app/queries/compound_never_liquidated.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb_liquidations = None
        sumBorrowed = None
        res = self.run({'address': address})
        if res['account'] != None:
            nb_liquidations = res['account']["countLiquidated"]
            hasBorrowed = res['account']["hasBorrowed"]
            sumBorrowed = 100
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = sumBorrowed
        badge_passport["conditions"][1]["current"] = nb_liquidations
        #badge_passport["owned"] = get
        return badge_passport


class CompoundLiquidator(TheGraph):
    """
    Get compound user, number of liquitated
    """

    def __init__(self) -> None:
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/zanepeycke/compound-v2-legacy'
        query = '/app/queries/compound_liquidator.ql'
        super().__init__(subgraph_url)
        with open(query, 'r') as f:
            self.template = f.read()

    def generate_badge_passport(self, address, badge):
        badge_passport = badge.copy()
        nb_liquidations = None
        res = self.run({'address': address})
        if res['account'] != None:
            nb_liquidations = res['account']["countLiquidator"]
        # TODO: replace 0 indice in next line to use multiple conditions
        badge_passport["conditions"][0]["current"] = nb_liquidations
        #badge_passport["owned"] = get
        return badge_passport


######################################
# Define the different app endpoints #
######################################

# API root
@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {"message": "EtherScore backend"}

# Healthcheck route


@app.get("/ping", status_code=status.HTTP_200_OK)
async def ping():
    """
    Endpoint for healthcheck
    """
    return str(datetime.datetime.now())

# Retrieve badges and status for a given address


@app.post(path="/badges", status_code=status.HTTP_200_OK)
async def badges(request: Request):
    """
    Retrieve badges and their status for a given address (ex "0x1F653f9d3dD5a0fc61aFC6969e4f07e32Bf4CDe0")
    """
    content = await request.json()
    try:
        # get the address
        #wallet_address = str(content["wallet_address"])
        wallet_address = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"
    except:
        return "error parsing POST request"
    defs = badges_definitions.copy()
    pat = re.compile(r"^0x[a-fA-F0-9]{40}$")
    if pat.match(wallet_address):
        print("this is an adress")
        print("User address: " + wallet_address)

        badges_passports = []  # a passport is the definition + the customized information
        for badge in defs:
            # for every badge in the definition list
            mytype = badge['type']
            # create the right object (UniswapTransaction) associated to the badge, to set and verify conditions
            current = create_class(mytype)
            # add it to the passports list
            badges_passports.append(
                current.generate_badge_passport(wallet_address, badge))
        return badges_passports

    else:
        print("------ no adress")
        pprint(badges_definitions)
        # return badge definitions
        return badges_definitions


# Retrieve badges held by the address
@app.post(path="/badges-definition", status_code=status.HTTP_200_OK)
async def badges_definition(request: Request):
    """
    Retrieve badges held by the address
    """
    content = await request.json()
    wallet_address = str(content["wallet_address"])
    return badges_definitions


# condition checker (badge.conditions, oracle value) -> bool
@app.post(path="/check", status_code=status.HTTP_200_OK)
async def check_conditions(request: Request):
    """
    Condition checker
    curl -d '{"results":[true,0], "badge_id":"2"}' -X POST localhost/api/check
    """
    content = await request.json()
    results = json.loads(str(content["results"]))
    badge_id = int(content["badge_id"])
    conditions = badges_definitions[badge_id]["conditions"]

    evaluations = []

    for (result, condition) in zip(results, conditions):
        print("result", result)
        print("condition", condition)
        target = condition['target']
        operator = condition['operator']
        expr=str(result)+str(operator)+str(target)
        print(expr)
        eva = simple_eval(expr)
        evaluations.append(eva)
    
    return all(evaluations)

# Get values via Oracle
@app.post(path="/oracle", status_code=status.HTTP_200_OK)
async def answer_request(request: Request):
    """
    Get values via Oracle
    curl -d '{"wallet_address":"0xd465be4e63bd09392bac51fcf04aa13412b552d0", "badge_id":"0"}' -X POST localhost/api/oracle
    """
    content = await request.json()
    wallet_address = str(content["wallet_address"])

    #if wallet_address == "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1":
    wallet_address = "0xd465be4e63bd09392bac51fcf04aa13412b552d0"

    badge_id = int(content["badge_id"])

    conditions = badges_definitions[badge_id]["conditions"]

    retour = []

    for condition in conditions:

        typage, query = str(condition["query"]).split('|')
        indexer = condition["indexer"]
        protocol = condition["protocol"]
    
        subgraph = ""

        if (indexer == "The Graph"):
            if (protocol == "Uniswap"):
                subgraph = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
            elif (protocol == "Compound"):
                subgraph = "https://api.thegraph.com/subgraphs/name/zanepeycke/compound-v2-legacy"
            elif (protocol == "Aave"):
                subgraph = "https://api.thegraph.com/subgraphs/name/aave/protocol-v2"
        elif (indexer == "Covalent"):
            pass
        
        current_query = query.replace("quoted_address", '"'+wallet_address+'"')
        print("subgraph:", subgraph)
        print("query:", current_query)
        res = run_query(subgraph, current_query)

        if str(query).startswith('{swaps'):
            raw = res['data']['swaps']
            print("raw", raw)
            if str(raw).startswith("[{'amountUSD'"):
                value = raw[0]['amountUSD']
                print("value", value)
                retour.append(float(value))
            else:
                retour.append(len(raw))
        elif str(query).startswith('{account'):
            raw = res['data']['account']
            print("raw", raw)
            if typage == "bool":
                value = raw['hasBorrowed']

            if typage == "int":
                value = int(raw['countLiquidated'])
            retour.append(value)
    return retour

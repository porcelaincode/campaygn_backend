from pymongo import MongoClient
from elasticsearch import Elasticsearch, helpers
from dotenv import dotenv_values

config = dotenv_values(".env")

mongo_client = MongoClient(config['MONGO_URI'])
mongo_db = mongo_client[config['DB_NAME']]
mongo_collection = mongo_db["influencers"]

es_client = Elasticsearch(config['ELASTIC_HOST'])

def generate_elasticsearch_docs():
    for doc in mongo_collection.find():
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        yield {
            "_index": "influencers",
            "_id": doc["id"],
            "_source": doc
        }

helpers.bulk(es_client, generate_elasticsearch_docs())

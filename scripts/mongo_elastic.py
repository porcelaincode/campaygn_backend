from pymongo import MongoClient
from elasticsearch import Elasticsearch
from dotenv import dotenv_values

config = dotenv_values(".env")

mongo_client = MongoClient(config['MONGO_URI'])
mongo_db = mongo_client[config['DB_NAME']]
mongo_collection = mongo_db["influencers"]

es_client = Elasticsearch(config['ELASTIC_HOST'])

with mongo_collection.watch() as stream:
    for change in stream:
        document = change['fullDocument']
        document_id = str(document['_id'])
        del document['_id']

        if change['operationType'] == 'insert':
            es_client.index(index='influencers', id=document_id, body=document)
        elif change['operationType'] == 'update':
            es_client.update(index='influencers',
                             id=document_id, body={'doc': document})
        elif change['operationType'] == 'delete':
            es_client.delete(index='influencers', id=document_id)

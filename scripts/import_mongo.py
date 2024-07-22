import pymongo
import random
import uuid
from faker import Faker
import os
from dotenv import dotenv_values

config = dotenv_values(".env")
fake = Faker()

unique_ids = [str(uuid.uuid4()) for _ in range(100000)]


def generate_influencer(influencer_id, all_ids):
    return {
        "_id": influencer_id,
        "name": fake.name(),
        "profilePhoto": fake.image_url(),
        "homeAddress": {
            "street": fake.street_address(),
            "city": fake.city(),
            "state": fake.state(),
            "country": fake.country(),
            "postalCode": fake.postcode()
        },
        "birthday": fake.date_of_birth().isoformat(),
        "gender": random.choice(["Male", "Female", "Non-binary", "Other"]),
        "biography": fake.text(),
        "socialMediaLinks": {
            "facebook": fake.url(),
            "instagram": fake.url(),
            "twitter": fake.url(),
            "youtube": fake.url(),
            "tiktok": fake.url(),
            "linkedin": fake.url(),
            "website": fake.url()
        },
        "ageRangeAppeal": {
            "minAge": random.randint(13, 25),
            "maxAge": random.randint(26, 45)
        },
        "reach": {
            "countries": [
                {
                    "country": fake.country(),
                    "metrics": {
                        "followers": random.randint(1000, 1000000),
                        "engagementRate": random.uniform(0.01, 0.2),
                        "impressions": random.randint(10000, 10000000)
                    }
                } for _ in range(5)
            ],
            "cities": [
                {
                    "city": fake.city(),
                    "metrics": {
                        "followers": random.randint(1000, 1000000),
                        "engagementRate": random.uniform(0.01, 0.2),
                        "impressions": random.randint(10000, 10000000)
                    }
                } for _ in range(5)
            ]
        },
        "topics": [fake.word() for _ in range(5)],
        "photos": [
            {
                "url": fake.image_url(),
                "description": fake.text()
            } for _ in range(5)
        ],
        "keywords": [fake.word() for _ in range(10)],
        "tags": [fake.word() for _ in range(10)],
        "topKeywordsMentionedWith": [fake.word() for _ in range(5)],
        "similarProfiles": random.sample(all_ids, 5)
    }


def insert_data():
    client = pymongo.MongoClient(config['MONGO_URI'])
    database_name = config['DB_NAME']

    db = client[database_name]
    collection = db["influencers"]

    batch_size = 10
    for i in range(0, len(unique_ids), batch_size):
        batch = unique_ids[i:i + batch_size]
        influencers = [generate_influencer(
            influencer_id, unique_ids) for influencer_id in batch]
        collection.insert_many(influencers)


if __name__ == "__main__":
    insert_data()

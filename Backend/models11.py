# models.py

from db import db
from bson import ObjectId

class UserProfile:
    def __init__(self, username, email, age):
        self.username = username
        self.email = email
        self.age = age

    def save(self):
        # Insert the user profile data into the MongoDB collection
        db.user_profiles.insert_one({
            "username": self.username,
            "email": self.email,
            "age": self.age
        })

    @classmethod
    def find_by_email(cls, email):
        # Find a user profile by email in the MongoDB collection
        return db.user_profiles.find_one({"email": email})

class Chat:
    def __init__(self, user_id, data, chat_name=None):  # Optional chat_name field
        self.user_id = user_id
        self.data = data
        self.chat_name = chat_name  # Assign chat_name if provided, otherwise None

    def save(self):
        # Insert the chat data into the MongoDB collection
        chat_document = {
            "user_id": self.user_id,
            "data": self.data
        }
        if self.chat_name is not None:
            chat_document["chat_name"] = self.chat_name  # Include chat_name if provided
        db.chats.insert_one(chat_document)

    @classmethod
    def find_by_user_id(cls, user_id):
        # Find chat data by user_id in the MongoDB collection
        return db.chats.find({"user_id": user_id})

    @classmethod
    def find_by_id(cls, chat_id):
        # Find a chat by its ID in the MongoDB collection
        return db.chats.find_one({"_id": ObjectId(chat_id)})

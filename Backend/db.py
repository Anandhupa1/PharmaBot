# db.py

from pymongo import MongoClient

# Replace the URI with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://Anandhu:anandhu@cluster0.j8dbuza.mongodb.net/MedicineChatBot?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client.get_database()


from flask import Flask,request,jsonify, abort
import os
import openai
app = Flask(__name__)
from model import UserProfile  # Import the UserProfile model
from bson import ObjectId
from model import Chat 
from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route('/',methods=["POST"])
def chat():
    data = request.get_json()
    newMsg = [];
    newMsg.append(data.get("newMsg"))
    chatId = data.get("chatId")
    chat = Chat.find_by_id(chatId)
    updatedChat = chat["data"] + newMsg;
    #print(updatedChat)
    # Chat.update_chat(chat)
    msgs = updatedChat# data from db
    response = openai.ChatCompletion.create(
         model="gpt-3.5-turbo",
         messages=msgs,
         temperature=1.39,
         max_tokens=256,
         top_p=1,
         frequency_penalty=0,
         presence_penalty=0
       )
    output =[];
    content = response.choices[0].message["content"]
    oObj = { "role": "assistant", "content":content}
    output.append(oObj)
    updatedChat = updatedChat + output
    # return response.choices[0].message
    # updatedChatId =ObjectId(chatId)
    Chat.update_chat_data(chatId, updatedChat)
    tchat = Chat.find_by_id(chatId)
    # print(tchat)
    return  response.choices[0].message
    



@app.route('/register', methods=["POST"])
def register():
    try:
        data = request.get_json()

        # Validate required fields
        if "username" not in data:
            abort(400, "Missing username field")
        
        if "email" not in data:
            abort(400, "Missing email field")
        
        if "age" not in data:
            abort(400, "Missing age field")

        # Extract user information from the request body
        username = data.get("username")
        email = data.get("email")
        age = data.get("age")

        # Validate username
        if not username:
            abort(400, "Username cannot be empty")
        
        # Validate email
        if not email:
            abort(400, "Email cannot be empty")
        # Add more email validation logic as needed
        
        # Validate age
        if not (isinstance(age, int) and 0 < age < 150):  # Example age range (adjust as needed)
            abort(400, "Age must be a positive integer within a reasonable range")

        # Create a new user profile
        new_user = UserProfile(username=username, email=email, age=age)

        # Save the user profile to the database
        new_user.save()

        # Return the newly created user profile in the response
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "username": new_user.username,
                "email": new_user.email,
                "id": new_user.age
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/getUserData", methods=["POST"])
def get_user_data():
    try:
        # Extract the email from the request parameters
        data = request.get_json()
        email = data.get("email")

        # Query the database for a user with the specified email
        user = UserProfile.find_by_email(email)

        if user:
            # Get the user's user_id
            user_id = str(user["_id"])

            # Query the chat model to get all chat IDs with the user's user_id
            chat_ids = [str(chat["_id"]) for chat in Chat.find_by_user_id(user_id)]

            # Return only the chat IDs in the response
            return jsonify({
                "message": "User data retrieved successfully",
                "user": {
                    "_id": str(user["_id"]),  # Convert ObjectId to a string
                    "username": user["username"],
                    "email": user["email"],
                    "age": user["age"],
                    "chat_ids": chat_ids  # Include chat IDs
                }
            })
        else:
            # User not found, return an error message
            return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/newChat/<string:user_id>", methods=["POST"])
def new_chat(user_id):
    try:
        # Extract the user_id from the request parameters


        # Define the initial data for the chat document
        initial_data = [
            {
                "role": "system",
                "content": "You are a nice and kind assistant."
            },
            {
                "role": "user",
                "content": "[Act as a senior Doctor named Amruth  ]\nyour task is to answer my queries related to different medicines that I will take like a human , take the name of the medicine from the user, after getting the name of that medicine, respond with 3 major usages of that medicine briefly with simple words. don't include any technical words, output should be in points. \nYour response should be short with all relevant information.\nAt last give a short description in which the age-related usage of that medicine should be shown separately; you should use the current medicine in children, teenagers, adults, and old people. In the table, age should be highlighted.\n\n"
            },
            {
                "role": "assistant",
                "content": "Hello, I am Dr. Amruth, please provide the name of the medicine to know its detailed usage."
            }
        ]

        # Create a new chat document in the chat model
        new_chat = Chat(user_id=user_id, data=initial_data)
        new_chat.save()

        # Return a success message
        return jsonify({
            "message": "New chat created successfully",
        # Convert ObjectId to a string
            "chat_data": new_chat.data
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/getChat/<string:chat_id>", methods=["GET"])
def get_chat(chat_id):
    try:
        # Convert chat_id to ObjectId
        chat_id_obj = ObjectId(chat_id)

        # Find the chat by its ID
        chat = Chat.find_by_id(chat_id_obj)

        if chat:
            # Convert ObjectId to string for JSON serialization
            chat["_id"] = str(chat["_id"])

            return jsonify({"message": "Chat retrieved successfully", "chat": chat}), 200
        else:
            return jsonify({"error": "Chat not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)


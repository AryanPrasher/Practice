from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import nltk
from nltk.chat.util import Chat, reflections
from textblob import TextBlob

# Download NLTK data
nltk.download('punkt')

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Database setup
def init_db():
    conn = sqlite3.connect('learning_platform.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    password TEXT
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
                    user_id INTEGER,
                    topic TEXT,
                    score INTEGER,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                )''')
    conn.commit()
    conn.close()

init_db()

# Dummy learning resources
resources = {
    "Python": ["Python Basics Tutorial", "Advanced Python Programming", "Python for Data Science"],
    "Data Science": ["Introduction to Data Science", "Machine Learning Basics", "Data Visualization"],
    "Web Development": ["HTML & CSS Basics", "JavaScript Fundamentals", "Flask Web Framework"]
}

# Chatbot pairs
chatbot_pairs = [
    ["hi|hello", ["Hello! How can I assist you today?"]],
    ["what is python", ["Python is a high-level programming language known for its simplicity and versatility."]],
    ["what is data science", ["Data science is an interdisciplinary field that uses scientific methods to extract knowledge from data."]],
    ["quit", ["Bye! Happy learning!"]]
]

chatbot = Chat(chatbot_pairs, reflections)

# Jokes, fun facts, and affirmations
jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts!"
]

fun_facts = [
    "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible!",
    "Did you know? Octopuses have three hearts. Two pump blood to the gills, and one pumps it to the rest of the body.",
    "Did you know? Bananas are berries, but strawberries aren't!"
]

positive_affirmations = [
    "You're doing amazing! Keep up the great work!",
    "You have the power to achieve anything you set your mind to!",
    "Every day is a new opportunity to shine. You've got this!"
]

# Function to detect emotion
def detect_emotion(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity < -0.5:
        return "sad"
    elif polarity < 0:
        return "slightly sad"
    elif polarity == 0:
        return "neutral"
    elif polarity < 0.5:
        return "slightly happy"
    else:
        return "happy"

# Function to respond based on emotion
def respond_to_emotion(emotion):
    if emotion == "sad":
        return f"Cheer up! Here's a joke for you: {random.choice(jokes)}"
    elif emotion == "slightly sad":
        return f"Hey, it's okay to feel down sometimes. Remember, you're awesome! {random.choice(positive_affirmations)}"
    elif emotion == "neutral":
        return f"Here's a fun fact to brighten your day: {random.choice(fun_facts)}"
    elif emotion == "slightly happy":
        return f"Glad to see you're doing well! Keep smiling! {random.choice(positive_affirmations)}"
    else:
        return f"Wow, you're in a great mood! Let's keep the positivity going! {random.choice(positive_affirmations)}"

# Recommender function
def recommend_resources(topic, user_progress):
    """Recommend resources based on user's learning progress."""
    available_resources = resources.get(topic, [])
    if available_resources:
        for resource in available_resources:
            if resource not in user_progress:
                return resource
    return available_resources[0] if available_resources else "No resources available"

# Routes
@app.route('/')
def home():
    if 'username' in session:
        return render_template('home.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect('learning_platform.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()        
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = sqlite3.connect('learning_platform.db')
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = c.fetchone()
        conn.close()
        if user:
            session['username'] = username
            session['user_id'] = user[0]
            return redirect(url_for('home'))
        else:
            return "Invalid credentials!"
    return render_template('login.html')

@app.route('/quiz')
def quiz():
    questions = [
        {"question": "What is Python?", "options": ["A snake", "A programming language", "A type of food"], "answer": "A programming language"},
        {"question": "What is Flask?", "options": ["A web framework", "A database", "A programming language"], "answer": "A web framework"}
    ]
    return render_template('quiz.html', questions=questions)

@app.route('/chatbot', methods=['GET', 'POST'])
def chatbot_interaction():
    if request.method == 'POST':
        user_input = request.form['user_input']
        response = chatbot.respond(user_input)
        return render_template('chatbot.html', response=response)
    return render_template('chatbot.html')

@app.route('/recommendations')
def recommendations():
    user_id = session['user_id']
    conn = sqlite3.connect('learning_platform.db')
    c = conn.cursor()
    c.execute("SELECT topic FROM progress WHERE user_id = ?", (user_id,))
    user_progress = [row[0] for row in c.fetchall()]
    conn.close()
    topic = "Python"  # Default topic for demonstration
    recommended_resource = recommend_resources(topic, user_progress)
    return render_template('recommendations.html', resource=recommended_resource)

@app.route('/emotion', methods=['GET', 'POST'])
def emotion_interaction():
    if request.method == 'POST':
        user_input = request.form['user_input']
        emotion = detect_emotion(user_input)
        response = respond_to_emotion(emotion)
        return render_template('emotion.html', response=response, emotion=emotion)
    return render_template('emotion.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
import mysql.connector
from mysql.connector import Error

# Create connection function
def create_connection():
    """Create and return a database connection."""
    try:
        conn = mysql.connector.connect(
            host="localhost",
            username="root",
            port=3305,
            password="Hamna@08",
            database="smart_resume_analyzer"
        )
        if conn.is_connected():
            print("Connected to MySQL Database")
            return conn
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None



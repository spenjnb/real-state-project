import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()

def create_database():
    # Get database connection parameters from environment or use Docker defaults
    db_user = os.getenv("DB_USER", "user")  # Docker default
    db_password = os.getenv("DB_PASSWORD", "pass")  # Docker default
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "realestate")  # Docker default

    print(f"Attempting to connect with user: {db_user}")

    try:
        # First connect to postgres database
        conn = psycopg2.connect(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
            database="postgres"  # Connect to postgres database first
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

        # Create a cursor
        cur = conn.cursor()

        try:
            # Check if database exists
            cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
            exists = cur.fetchone()
            
            if not exists:
                # Create database
                cur.execute(f'CREATE DATABASE {db_name}')
                print(f"Database '{db_name}' created successfully!")
            else:
                print(f"Database '{db_name}' already exists.")
        except Exception as e:
            print(f"Error creating database: {str(e)}")
        finally:
            # Close cursor and connection
            cur.close()
            conn.close()
    except psycopg2.OperationalError as e:
        print(f"Connection error: {str(e)}")
        print("\nTroubleshooting steps:")
        print("1. Make sure Docker containers are running:")
        print("   docker-compose up -d")
        print("2. Verify Docker container is running:")
        print("   docker-compose ps")
        print("3. Check container logs:")
        print("   docker-compose logs db")
        print("4. Try connecting directly to the container:")
        print("   docker-compose exec db psql -U user -d postgres")
        print("\nIf you're still having issues, make sure your .env.development file has these values:")
        print("DB_USER=user")
        print("DB_PASSWORD=pass")
        print("DB_HOST=localhost")
        print("DB_PORT=5432")
        print("DB_NAME=realestate")
        print("DATABASE_URL=postgresql://user:pass@localhost:5432/realestate")

if __name__ == "__main__":
    create_database()
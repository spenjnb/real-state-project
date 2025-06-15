import click
from app.database import SessionLocal
from app.db.seed import seed_database, clear_database

@click.group()
def cli():
    pass

@cli.command()
def seed():
    """Seed the database with test data"""
    db = SessionLocal()
    try:
        seed_database(db)
        click.echo("Database seeded successfully!")
    except Exception as e:
        click.echo(f"Error seeding database: {str(e)}")
    finally:
        db.close()

@cli.command()
def clear():
    """Clear all data from the database"""
    db = SessionLocal()
    try:
        clear_database(db)
        click.echo("Database cleared successfully!")
    except Exception as e:
        click.echo(f"Error clearing database: {str(e)}")
    finally:
        db.close()

if __name__ == '__main__':
    cli() 
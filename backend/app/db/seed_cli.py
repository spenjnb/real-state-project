import click
from app.db.seed import seed_database

@click.group()
def cli():
    pass

@cli.command()
def seed():
    """Seed the database with test data"""
    try:
        seed_database()
        click.echo("Database seeded successfully!")
    except Exception as e:
        click.echo(f"Error seeding database: {str(e)}")

if __name__ == '__main__':
    cli() 
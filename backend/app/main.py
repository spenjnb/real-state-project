from fastapi import FastAPI

app = FastAPI(title="Real Estate API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Real Estate API"}
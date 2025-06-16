FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chmod +x scripts/init_db.sh
ENV PYTHONPATH=/app
CMD ["./scripts/init_db.sh"]
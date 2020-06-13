FROM python:3.7-alpine
EXPOSE 5000
WORKDIR /usr/src/web
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV PYTHONUNBUFFERED 1
RUN apk update && apk add --no-cache gcc libc-dev make git libffi-dev openssl-dev python3-dev libxml2-dev libxslt-dev musl-dev linux-headers
COPY requirements.txt /usr/src/web/requirements.txt
RUN pip install -r requirements.txt
COPY . /usr/src/web
CMD ["flask", "run"]
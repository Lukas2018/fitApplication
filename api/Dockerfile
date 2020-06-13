FROM python:3
ENV PYTHONUNBUFFERED 1
WORKDIR /usr/src/api
COPY requirements.txt /usr/src/api/requirements.txt
RUN apt-get update && apt-get install -y netcat
RUN pip install -r requirements.txt
COPY entrypoint.sh /usr/src/api/entrypoint.sh
COPY . /usr/src/api
RUN chmod 755 entrypoint.sh
ENTRYPOINT ["/usr/src/api/entrypoint.sh"]
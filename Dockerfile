FROM python:3.5
MAINTAINER Claudio <c.pizzolato@griffith.edu.au>

ENV INSTALL_PATH /yabbi
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN pip install --editable .

CMD gunicorn -b 0.0.0.0:8000 --access-logfile - "yabbi.app:create_app()"

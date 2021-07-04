FROM docker.io/python:3.7.11-slim-buster

RUN apt update -y && \
    apt install -y git python3.7-tk && \
    git clone https://github.com/thaalesalves/KoboldAI-Client /opt/koboldai && \
    pip3 install -r /opt/koboldai/requirements.txt

WORKDIR /opt/koboldai
EXPOSE 5000
ENTRYPOINT [ "python3", "/opt/koboldai/aiserver.py" ]

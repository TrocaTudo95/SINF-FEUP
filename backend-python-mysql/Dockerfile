# start from base


FROM ubuntu:18.04

#install system-wide deps for python and node
RUN apt-get -yqq update
RUN apt-get -yqq install python3.7
RUN apt-get -yqq install python3-pip python3-dev curl gnupg
RUN apt-get -yqq install mysql-client
RUN apt-get -yqq install iproute2
#RUN apt-get install -yqq npm

#copy app code
ADD src /opt/sff
WORKDIR /opt/sff

#fetch add specific deps
RUN pip3 install -r "requirements.txt"


COPY hosts_script.sh /usr/local/bin/

#expose port
EXPOSE 5000

#start app
#CMD ["flask", "run"]

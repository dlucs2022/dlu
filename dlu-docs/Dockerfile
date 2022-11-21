FROM python

MAINTAINER dlu

RUN apt update
RUN apt-get -y install python3-sphinx

RUN pip config set --global global.index-url https://pypi.douban.com/simple
RUN pip install sphinx
RUN pip install sphinx-rtd-theme

WORKDIR /docs
ADD . .
CMD sphinx-build -b html source builder




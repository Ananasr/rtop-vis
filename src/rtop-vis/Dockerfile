FROM golang

COPY . /go/src/rtop-vis
WORKDIR /go/src/rtop-vis

RUN go get ./
RUN go build

CMD go get github.com/pilu/fresh && fresh;

EXPOSE 8080

# Welcome to Packetbeat 7.1.0

Packetbeat analyzes network traffic and sends the data to Elasticsearch.

## Getting Started

To get started with Packetbeat, you need to set up Elasticsearch on
your localhost first. After that, start Packetbeat with:

     ./packetbeat -c packetbeat.yml -e

This will start Packetbeat and send the data to your Elasticsearch
instance. To load the dashboards for Packetbeat into Kibana, run:

    ./packetbeat setup -e

For further steps visit the
[Getting started](https://www.elastic.co/guide/en/beats/packetbeat/7.1/packetbeat-getting-started.html) guide.

## Documentation

Visit [Elastic.co Docs](https://www.elastic.co/guide/en/beats/packetbeat/7.1/index.html)
for the full Packetbeat documentation.

## Release notes

https://www.elastic.co/guide/en/beats/libbeat/7.1/release-notes-7.1.0.html

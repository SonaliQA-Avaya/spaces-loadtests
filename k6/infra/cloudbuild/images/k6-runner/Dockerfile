FROM gcr.io/cloud-builders/gcloud

ARG HELM_VERSION=v3.2.0
ENV HELM_VERSION=$HELM_VERSION

ARG TASK_VERSION=v3.9.0
ENV TASK_VERSION=$TASK_VERSION


RUN mkdir -p /builder/helm && \
  apt-get update && \
  apt-get install -y curl && \
  curl -SL https://get.helm.sh/helm-${HELM_VERSION}-linux-amd64.tar.gz -o helm.tar.gz && \
  tar zxvf helm.tar.gz --strip-components=1 -C /builder/helm linux-amd64 && \
  rm helm.tar.gz && \
  apt-get --purge -y autoremove && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

ENV PATH=/builder/helm/:$PATH


RUN mkdir -p /builder/task && \ 
  curl -SL https://github.com/go-task/task/releases/download/${TASK_VERSION}/task_linux_amd64.tar.gz -o task.tar.gz && \
  tar zxvf task.tar.gz -C /builder/task && \
  rm task.tar.gz

ENV PATH=/builder/task/:$PATH


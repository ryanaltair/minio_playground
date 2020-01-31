mkdir -p ${PWD}/data
docker run -p 9000:9000 \
  --user $(id -u):$(id -g) \
  --name minio1 \
  -e "MINIO_ACCESS_KEY=MINIO_ACCESS" \
  -e "MINIO_SECRET_KEY=MINIO_SECRET" \
  -v ${PWD}/data:/data \
  minio/minio server /data
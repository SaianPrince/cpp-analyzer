FROM gcc:latest
WORKDIR /app
COPY . .
# On Linux, we need -lpthread for cpp-httplib
RUN g++ main.cpp -o engine -O3 -lpthread
EXPOSE 8080
CMD ["./engine"]

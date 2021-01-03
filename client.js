const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:4000', grpc.credentials.createInsecure());

client.createTodo(
    {
        id: -1,
        text: 'Do this',
    },
    (error, response) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Received from server', response);

            client.readTodos({}, (error, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Received from server', response);
                }
            });

            const callStream = client.readTodoStream();

            callStream.on('data', (item) => {
                console.log('received data', JSON.stringify(item));
            });

            callStream.on('end', (e) => console.log('stream finished'));
        }
    }
);

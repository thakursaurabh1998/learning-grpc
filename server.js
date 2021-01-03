const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

function createTodoNative(call, callback) {
    console.log(call);
}
function readTodosNative(call, callback) {}

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
    createTodo: createTodoNative,
    readTodos: readTodosNative,
});

server.bind('0.0.0.0:4000', grpc.ServerCredentials.createInsecure());
server.start();

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const todos = [];

function createTodoNative(call, callback) {
    const todoItem = {
        id: todos.length + 1,
        text: call.request.text,
    };
    todos.push(todoItem);
    callback(null, todoItem);
}
function readTodosNative(call, callback) {
    callback(null, { items: todos });
}
function readTodoStreamNative(call, callback) {
    todos.forEach((todo) => {
        call.write(todo);
    });
    call.end();
}

const server = new grpc.Server();
server.addService(todoPackage.Todo.service, {
    createTodo: createTodoNative,
    readTodos: readTodosNative,
    readTodoStream: readTodoStreamNative,
});

server.bind('0.0.0.0:4000', grpc.ServerCredentials.createInsecure());
server.start();

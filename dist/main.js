var UsuarioDAO = /** @class */ (function () {
    function UsuarioDAO() {
        this.window = Window;
        this.indexedDB = window.indexedDB || this.window.mozIndexedDB || this.window.webkitIndexedDB || this.window.msIndexedDB;
        this.IDBTransaction = this.window.IDBTransaction || this.window.webkitIDBTransaction || this.window.msIDBTransaction || { READ_WRITE: "readwrite" };
        this.IDBKeyRange = this.window.IDBKeyRange || this.window.webkitIDBKeyRange || this.window.msIDBKeyRange;
    }
    UsuarioDAO.prototype.openDatabase = function () {
        var request = window.indexedDB.open('store', 1);
        request.onerror = function (event) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };
        return request;
    };
    UsuarioDAO.prototype.populateDataBase = function () {
        var customerData = [
            { id: "1", name: "Bill", age: 35, email: "bill@company.com" },
            { id: "2", name: "Donna", age: 32, email: "donna@home.org" }
        ];
        var request = this.openDatabase();
        request.onsuccess = function (event) {
            this.db = request.result;
            console.log("success: " + this.db);
        };
        request.onerror = function (event) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };
        request.onupgradeneeded = function (event) {
            var _this = this;
            this.db = event.target.result;
            var objectStore = this.db.createObjectStore("clientes", { keyPath: "id" });
            objectStore.transaction.oncomplete = function (event) {
                var customerObjectStore = _this.db.transaction("clientes", "readwrite");
                var objStore = customerObjectStore.objectStore("clientes");
                for (var i = 0; i < customerData.length; i++) {
                    objStore.add(customerData[i]);
                    console.log('populando dados');
                }
            };
        };
    };
    UsuarioDAO.prototype.readUsers = function () {
        var db, transaction, objectStore, request;
        var connection = this.openDatabase();
        connection.onsuccess = function (event) {
            db = connection.result;
            transaction = db.transaction(["clientes"]);
            objectStore = transaction.objectStore("clientes");
            request = objectStore.get("2");
            console.log("success: " + db);
            request.onerror = function (event) {
                // Handle errors!
            };
            request.onsuccess = function (event) {
                console.log("Name of the customer " + request.result.name);
            };
        };
    };
    UsuarioDAO.prototype.readAll = function () {
        var db;
        var connection = this.openDatabase();
        connection.onsuccess = function (event) {
            db = connection.result;
            var objectStore = db.transaction("clientes").objectStore("clientes");
            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                console.log('%c cursor ' + JSON.stringify(cursor), 'background: yellow');
                if (cursor) {
                    console.log("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
                    cursor.continue();
                }
                else {
                    console.log("No more entries!");
                }
            };
        };
    };
    return UsuarioDAO;
}());
var user = new UsuarioDAO();
user.populateDataBase();
// user.readUsers();
user.readAll();
//# sourceMappingURL=main.js.map
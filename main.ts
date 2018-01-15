class UsuarioDAO {
    private window: any = Window;
    private indexedDB = window.indexedDB || this.window.mozIndexedDB || this.window.webkitIndexedDB || this.window.msIndexedDB;
    private IDBTransaction = this.window.IDBTransaction || this.window.webkitIDBTransaction || this.window.msIDBTransaction || { READ_WRITE: "readwrite" };
    private IDBKeyRange = this.window.IDBKeyRange || this.window.webkitIDBKeyRange || this.window.msIDBKeyRange;
    private db;

    openDatabase(): any {
        const request = window.indexedDB.open('store', 1);

        request.onerror = function (event: any) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };

        return request;
    }

    populateDataBase() {
        const customerData: any = [
            { id: "1", name: "Bill", age: 35, email: "bill@company.com" },
            { id: "2", name: "Donna", age: 32, email: "donna@home.org" }
        ];


        const request = this.openDatabase();

        request.onsuccess = function (event) {
            this.db = request.result;
            console.log("success: " + this.db);
        };

        request.onerror = function (event: any) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };

        request.onupgradeneeded = function (event: any) {
            this.db = event.target.result;

            var objectStore = this.db.createObjectStore("clientes", { keyPath: "id" });

            objectStore.transaction.oncomplete = (event) => {
                let customerObjectStore = this.db.transaction("clientes", "readwrite");
                let objStore = customerObjectStore.objectStore("clientes");
                for (let i = 0; i < customerData.length; i++) {
                    objStore.add(customerData[i]);
                    console.log('populando dados')
                }
            };
        }
    }

    readUsers() {
        let db, transaction, objectStore, request;

        const connection = this.openDatabase();

        connection.onsuccess = (event) => {
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
    }

    readAll() {
        let db;
        const connection = this.openDatabase();

        connection.onsuccess = (event) => {
            db = connection.result;
            let objectStore = db.transaction("clientes").objectStore("clientes");

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                console.log('%c cursor ' + JSON.stringify(cursor), 'background: yellow')

                if (cursor) {
                    console.log("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
                    cursor.continue();
                }

                else {
                    console.log("No more entries!");
                }
            };
        }
    }

    updateObject(client, id?) {
        const connection = this.openDatabase()
        console.log('banco ', connection)

        connection.onsuccess = (event) => {
            console.log('target ', event)
            const db = connection.result

            let request = db.transaction('clientes', 'readwrite').objectStore('clientes').put(client, id);

            request.onsuccess = () => {
                console.log("Registro atualizado com sucesso")
            }

            request.onerror = () => {
                console.log(request.error)
            }
        }
    }
}

const user = new UsuarioDAO();

// user.populateDataBase();
// user.readUsers();
user.readAll();

const up = {
    age: 36,
    email: "donna@home.org",
    id: "2",
    name: "Donna Summer Wall"
}

user.updateObject(up);
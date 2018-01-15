export class UsuarioDAO {
    private window: any;
    private indexedDB = window.indexedDB || this.window.mozIndexedDB || this.window.webkitIndexedDB || this.window.msIndexedDB;
    private IDBTransaction = this.window.IDBTransaction || this.window.webkitIDBTransaction || this.window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
    private IDBKeyRange = this.window.IDBKeyRange || this.window.webkitIDBKeyRange || this.window.msIDBKeyRange;

    private customerData = [
        { id: "1", name: "Bill", age: 35, email: "bill@company.com" },
        { id: "2", name: "Donna", age: 32, email: "donna@home.org" }
    ];

    createDatabase(): any {
        const request = window.indexedDB.open('store', 1);

        request.onerror = function (event: any) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };

        return request;
    }

    populateDataBase() {
        const request = this.createDatabase();

        request.onupgradeneeded = function (event) {
            let db = event.target.result;

            // Create an objectStore to hold information about our customers. We're
            // going to use "ssn" as our key path because it's guaranteed to be
            // unique - or at least that's what I was told during the kickoff meeting.
            let objectStore = db.createObjectStore("clientes", { keyPath: "id" });


            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objectStore.transaction.oncomplete = function (event) {
                // Store values in the newly created objectStore.
                let customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
                for (let i in this.customerData) {
                    customerObjectStore.add(this.customerData[i]);
                }
            };
        }
    }

    updateObject(client, id) {
        const db = this.createDatabase()

        db.onupgradeneeded =  (event) => {
            let db = event.target.result;

            let request = db.transaction('clientes', 'readwrite')
                .objectStore('clientes')
                .put(client, id);

            request.onsuccess = () => {
                console.log("Registro atualizado com sucesso")
            }

            request.onerror = () => {
                console.log(request.error)
            }
        }
    }
}

"use strict";
class UsuarioDAO {
    constructor() {
        this.indexedDB = window.indexedDB || this.window.mozIndexedDB || this.window.webkitIndexedDB || this.window.msIndexedDB;
        this.IDBTransaction = this.window.IDBTransaction || this.window.webkitIDBTransaction || this.window.msIDBTransaction || { READ_WRITE: "readwrite" };
        this.IDBKeyRange = this.window.IDBKeyRange || this.window.webkitIDBKeyRange || this.window.msIDBKeyRange;
        this.customerData = [
            { id: "1", name: "Bill", age: 35, email: "bill@company.com" },
            { id: "2", name: "Donna", age: 32, email: "donna@home.org" }
        ];
    }
    createDatabase() {
        const request = window.indexedDB.open('store', 1);
        request.onerror = function (event) {
            alert("Error ao abrir o banco de dados?!" + event.target.errorCode);
        };
        return request;
    }
    populateDataBase() {
        const request = this.createDatabase();
        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("clientes", { keyPath: "id" });
            objectStore.transaction.oncomplete = function (event) {
                var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
                for (var i in this.customerData) {
                    customerObjectStore.add(this.customerData[i]);
                }
            };
        };
    }
}
exports.UsuarioDAO = UsuarioDAO;

// ===========================================
// BANCO DE DADOS - DOM IMPÉRIO
// ===========================================



const DB_NAME = "DomImperioDB";
const DB_VERSION = 5;

let db = null;


// ===========================================
// ABRIR BANCO
// ===========================================

function abrirBanco() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject("Erro ao abrir o banco.");
        };

        request.onsuccess = (event) => {

            db = event.target.result;

            console.log("✅ Banco conectado.");

            resolve(db);
        };

        request.onupgradeneeded = (event) => {

            db = event.target.result;

            console.log("Criando banco...");

            if (!db.objectStoreNames.contains("historico")) {

    const historico = db.createObjectStore("historico", {
        keyPath: "id",
        autoIncrement: true
    });

    historico.createIndex("produto", "produto");
    historico.createIndex("movimento", "movimento");
    historico.createIndex("data", "data");

}


            // ===========================
            // CLIENTES
            // ===========================

            if (!db.objectStoreNames.contains("clientes")) {

                const clientes = db.createObjectStore("clientes", {
                    keyPath: "id",
                    autoIncrement: true
                });

                clientes.createIndex("nome", "nome");
                clientes.createIndex("telefone", "telefone");
                clientes.createIndex("cidade", "cidade");
                clientes.createIndex("status", "status");
            }

            // ===========================
// DESPESAS
// ===========================

if (!db.objectStoreNames.contains("despesas")) {

    const despesas = db.createObjectStore("despesas", {
        keyPath: "id",
        autoIncrement: true
    });

    despesas.createIndex("mes", "mes");
    despesas.createIndex("dataCadastro", "dataCadastro");

}

            // ===========================
            // PRODUTOS
            // ===========================

            if (!db.objectStoreNames.contains("produtos")) {

                const produtos = db.createObjectStore("produtos", {
                    keyPath: "id",
                    autoIncrement: true
                });

                produtos.createIndex("nome", "nome");
                produtos.createIndex("tipo", "tipo");
                produtos.createIndex("cor", "cor");
                produtos.createIndex("tamanho", "tamanho");
            }

            // ===========================
            // PEDIDOS
            // ===========================

            if (!db.objectStoreNames.contains("pedidos")) {

                const pedidos = db.createObjectStore("pedidos", {
                    keyPath: "id",
                    autoIncrement: true
                });

                pedidos.createIndex("clienteId", "clienteId");
                pedidos.createIndex("status", "status");
                pedidos.createIndex("data", "data");
            }

            console.log("✅ Estrutura criada.");
        };

    });

}


// ===========================================
// ADICIONAR
// ===========================================

function adicionar(store, dados) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readwrite");

        const tabela = tx.objectStore(store);

        const req = tabela.add(dados);

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}

// ===========================================
// LISTAR TODOS
// ===========================================

function listar(store) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readonly");

        const tabela = tx.objectStore(store);

        const req = tabela.getAll();

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}

// ===========================================
// BUSCAR POR ID
// ===========================================

function buscar(store, id) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readonly");

        const tabela = tx.objectStore(store);

        const req = tabela.get(id);

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}

// ===========================================
// ATUALIZAR
// ===========================================

function atualizar(store, dados) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readwrite");

        const tabela = tx.objectStore(store);

        const req = tabela.put(dados);

        req.onsuccess = () => resolve();

        req.onerror = () => reject(req.error);

    });

}

// ===========================================
// EXCLUIR
// ===========================================

function excluir(store, id) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readwrite");

        const tabela = tx.objectStore(store);

        const req = tabela.delete(id);

        req.onsuccess = () => resolve();

        req.onerror = () => reject(req.error);

    });

}

// ===========================================
// CONTAR REGISTROS
// ===========================================

function contar(store) {

    return new Promise((resolve, reject) => {

        const tx = db.transaction(store, "readonly");

        const tabela = tx.objectStore(store);

        const req = tabela.count();

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}


// ===========================================
// ABRE O BANCO AUTOMATICAMENTE
// ===========================================

abrirBanco()
    .then(() => {
        console.log("🚀 DomImperioDB pronto.");
    })
    .catch((erro) => {
        console.error(erro);
    });
const idbPromised = idb.open('subs_database', 1, upgradedDb => {
    if (!upgradedDb.objectStoreNames.contains('subs')) {
        upgradedDb.createObjectStore("subs", {keyPath: "id"});
    }
});

const dbGetAllTeam = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("subs", `readonly`);
            return transaction.objectStore("subs").getAll();
        }).then(data => {
            if (data !== undefined) {
                resolve(data)
            } else {
                reject(new Error("Favorite not Found"))
            }
        })
    })
};

const dbInsertTeam = book => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("subs", `readwrite`);
            transaction.objectStore("subs").add(book);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};

const dbDeleteTeam = Id => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const transaction = db.transaction("subs", `readwrite`);
            transaction.objectStore("subs").delete(Id);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};
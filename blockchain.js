const crypto = require('crypto');

class Block {
    constructor(index, previousHash, timestamp, transactions, nonce = 0) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(0, "0", Date.now(), "Genesis Block", 0);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions() {
        let block = new Block(this.chain.length, this.getLatestBlock().hash, Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }
}

// Usage:
let blockchain = new Blockchain();
blockchain.createTransaction({ sender: "Alice", receiver: "Bob", amount: 50 });
blockchain.minePendingTransactions();
console.log(JSON.stringify(blockchain, null, 4));

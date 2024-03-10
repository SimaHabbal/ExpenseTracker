const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
let type=document.getElementById('type');
const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);
const currencyDropdown = document.getElementById('currency-dropdown');

fetch('https://ivory-ostrich-yoke.cyclic.app/students/available')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.code;
            option.textContent = `${currency.name} (${currency.symbol})`;
            currencyDropdown.appendChild(option);
        });
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });



let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            type: type.value,
            
        };
        console.log('Transaction Type:', transaction.type);

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    let item = document.createElement('li');

    if(type.value=='expense'){
        sign='-';
        item.classList.add('minus');
        console.log(type.value);

    }
    else if(type.value=='income'){
        sign='+';
        item.classList.add('plus');
        console.log(type.value);
    }

    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id
        })">x</button>
  `;

    list.appendChild(item);
}

function updateValues() {
    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);

    const expense = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0)
        .toFixed(2);
        const total = income-expense;

    balance.innerText = `$${total}`;

    money_plus.innerText = `$${Math.max(income, 0)}`;

    money_minus.innerText = `$${Math.abs(expense)}`;

    if (total < 0) {
        balance.style.color = 'red'; 
        balance.style.color = 'black';
    }
}




function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction); 
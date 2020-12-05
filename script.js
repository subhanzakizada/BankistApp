'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// displays the movements - deposit, withdrawal etc.
const displayMovements = function(account, sort = false) {
    const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements
    containerMovements.innerHTML = ''
    movs.forEach((movement, ind) => {
        const type = movement > 0 ? 'deposit' : 'withdrawal'
        const html = `
 <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${ind + 1}. ${type}
          </div>
          <div class="movements__value">${movement}€</div>
        </div>
`
            containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}





const createUsernames = function(accounts) {
    accounts.forEach(account => account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join(''))
}

createUsernames(accounts)


// total balance on the right side of the page
const displayBalance = function(account) {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0)

    labelBalance.textContent = `${account.balance}€`
}



// left bottom - "IN", "OUT" and "INTEREST"
const calcAndDisplaySummary = function(account) {
    const balanceIn = account.movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0)
    labelSumIn.textContent = `${balanceIn}€`
    
    const balanceOut = account.movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0)
    labelSumOut.textContent = `${Math.abs(balanceOut)}€`
    
    const interest = account.movements.filter(mov => mov > 0).map(mov => mov * account.interestRate / 100).filter(mov => mov > 1).reduce((acc, curr) => acc + curr, 0)
    labelSumInterest.textContent = `${interest}€`
}


const updateUI = function(account) {
    displayMovements(account)
    displayBalance(account)
    calcAndDisplaySummary(account)
}

let currentAccount

// what happens when you login to an account
btnLogin.addEventListener('click', function(e) {
    e.preventDefault()
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
    
    if(currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        inputLoginUsername.value = inputLoginPin.value = ''
        inputLoginPin.blur() // removes the "focus" to the element
        inputLoginUsername.blur() 
        labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]} `
        updateUI(currentAccount)
        containerApp.style.opacity = 100
    }    
})



// gotta fix the "interest" when the transaction is happening. add a transaction fees or remove the interest because it keeps increasing
btnTransfer.addEventListener('click', function(e) {
    e.preventDefault()
    const receiver = accounts.find(acc => acc.username === inputTransferTo.value)
    const amount = Number(inputTransferAmount.value)
    
    inputTransferAmount.value = inputTransferTo.value = ''
    inputTransferAmount.blur() // removes the "focusing" thing from the element
    inputTransferTo.blur()
    
    if(receiver && receiver !== currentAccount.username && amount > 0 && currentAccount.balance >= amount) {
        currentAccount.movements.push(-amount)
        receiver.movements.push(amount)
        updateUI(currentAccount)  
    }   
})



btnClose.addEventListener('click', function(e) {
    e.preventDefault()
    
    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username) 
        accounts.splice(index, 1)
        containerApp.style.opacity = 0
        
    }
    
})


btnLoan.addEventListener('click', function(e) {
    e.preventDefault()
    const amount = Number(inputLoanAmount.value)
    
    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        currentAccount.movements.push(amount)
        updateUI(currentAccount)
    
       }
    
})

let sorted = false
btnSort.addEventListener('click', function(e) {
    e.preventDefault()
    if(sorted === false) {
        sorted = true
    } else{
        sorted = false
    }
    displayMovements(currentAccount, sorted)
})
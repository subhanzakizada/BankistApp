'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-12-08T14:11:59.604Z',
    '2020-12-27T17:01:17.194Z',
    '2020-12-11T23:36:17.929Z',
    '2020-12-10T10:51:36.790Z',
  ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
    currency: 'USD',
    locale: 'en-US',
};

// test account1
const account3 = {
    owner: 't e s t 1',
    movements: [12000, 800, -210, 50, -1700, -1450, 1500, -2000],
    interestRate: 2.4,
    pin: 3333,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-us'
}

// test account2
const account4 = {
    owner: 't e s t 2',
    movements: [-4000, 500, 850, 1400, -2100, 1245, -1000, 7000],
    interestRate: 2.1,
    pin: 4444,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-us'
}

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

// interval variable
let timer

const startLogout = () => {
    let time = 300
    const timerLogic = () => {
        let min = String(Math.floor(time / 60)).padStart(2, '0')
        let sec = String(time % 60).padStart(2, '0')
        labelTimer.textContent = `${min}:${sec}`

        // logging out when timer hits 00:00
        if (time === 0) {
            labelWelcome.textContent = `Log in to get started`
            containerApp.style.opacity = 0
            clearInterval(timer)
        }
        time--
    }
    timerLogic()

    timer = setInterval(() => timerLogic(), 1000)
}

let settingInt

// internalization the currencies
const formatCurrency = (acc, val) => new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency
}).format(val)

// displays the movements - deposit, withdrawal etc. && the dates
const displayMovementsAndDates = function (account, sort = false) {
    clearInterval(settingInt) // gotta clear the interval every time login to an account from different one or weird bug appears
    // displays the date under the "Current Balance" 
    const date = new Date()
    // ↓ internalization the date by checking obj's locale ↓
    const formatDate = Intl.DateTimeFormat(account.locale).format(date)

    // gives you - hours, minutes, seconds
    const formatHours = () => {
        const date = new Date()
        return Intl.DateTimeFormat(account.locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(date)
    } // live timer ↓ 
    settingInt = setInterval(() => updateDate(), 1000)

    // updating time at first and not after passing 1 sec ↑
    const updateDate = (() => labelDate.textContent = formatDate + ' ' + formatHours())
    updateDate()


    // displaying movements and "calcPassedDays"
    const movements = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements
    containerMovements.innerHTML = ''
    movements.forEach((movement, ind) => {

        // calculates if the transaction happened within a week
        const calcPassedDays = date => {
            const passed = Math.round(Math.abs((date - new Date()) / 1000 / 60 / 60 / 24))
            if (passed === 0) return 'TODAY'
            else if (passed === 1) return 'YESTERDAY'
            else if (passed <= 7) return `${passed} days ago`
        }
        // converting the ${obj.movementsDates[i]} to milliseconds 
        const date = new Date(account.movementsDates[ind])

        const displayingDate = typeof calcPassedDays(date) === 'string' ? calcPassedDays(date) : formatDate
        const type = movement > 0 ? 'deposit' : 'withdrawal'
        const html = `
 <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${ind + 1}. ${type}
          </div>
          <div class="movements__date">${displayingDate}</div>
          <div class="movements__value">${formatCurrency(account, movement)}€</div>
        </div>
`
        containerMovements.insertAdjacentHTML('afterbegin', html)
    })
}

// creates usernames for every account by using their initial
const createUsernames = function (accounts) {
    accounts.forEach(account => account.username = account.owner.toLowerCase().split(' ').map(name => name[0]).join(''))
}

createUsernames(accounts)

// total balance on the right side of the page
const displayBalance = function (account) {
    account.balance = account.movements.reduce((acc, curr) => acc + curr, 0)

    labelBalance.textContent = `${formatCurrency(account, account.balance)}`
}

// left bottom - "IN", "OUT" and "INTEREST"
const calcAndDisplaySummary = function (account) {
    const balanceIn = account.movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0)
    labelSumIn.textContent = `${Math.round(balanceIn)}€`

    const balanceOut = account.movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0)
    labelSumOut.textContent = `${Math.round(Math.abs(balanceOut))}€`

    const interest = account.movements.filter(mov => mov > 0).map(mov => mov * account.interestRate / 100).filter(mov => mov > 1).reduce((acc, curr) => acc + curr, 0)
    labelSumInterest.textContent = `${Math.round(interest)}€`
}

const updateUI = function (account) {
    displayMovementsAndDates(account)
    displayBalance(account)
    calcAndDisplaySummary(account)
}

let currentAccount

// what happens when you login to an account
btnLogin.addEventListener('click', function (e) {
    e.preventDefault()
    clearInterval(timer)
    startLogout()
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

    if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        updateUI(currentAccount)
        inputLoginUsername.value = inputLoginPin.value = ''
        inputLoginPin.blur() // removes the "focus" to the element
        inputLoginUsername.blur()
        if(currentAccount !== account3 && currentAccount !== account4)
        labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]} `
        else labelWelcome.textContent = `Welcome, test account ${currentAccount.username.slice(-1)} `
        containerApp.style.opacity = 100

    }
    checkAccountTest()
})

// gotta fix the "interest" when the transaction is happening. add a transaction fees or remove the interest because it keeps increasing or limit the transactions can happen in a day 
btnTransfer.addEventListener('click', function (e) {
    e.preventDefault()
    const receiver = accounts.find(acc => acc.username === inputTransferTo.value)
    const amount = Number(inputTransferAmount.value)

    inputTransferAmount.value = inputTransferTo.value = ''
    inputTransferAmount.blur() // removes the "focusing" thing from the element
    inputTransferTo.blur()

    if (receiver && receiver !== currentAccount.username && amount > 0 && currentAccount.balance >= amount) {
        currentAccount.movements.push(-amount)
        receiver.movements.push(amount)
        currentAccount.movementsDates.push(new Date())
        clearInterval(timer)
        startLogout()
        updateUI(currentAccount)
    }
})

btnClose.addEventListener('click', function (e) {
    e.preventDefault()

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username)
        accounts.splice(index, 1)
        containerApp.style.opacity = 0
    }
})


btnLoan.addEventListener('click', function (e) {
    e.preventDefault()
    const amount = Number(inputLoanAmount.value)

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        currentAccount.movements.push(Math.floor((amount)))
        currentAccount.movementsDates.push(new Date())
        clearInterval(timer)
        startLogout()
        setTimeout(() => updateUI(currentAccount), 2000)
    }
    inputLoanAmount.value = ''
})

let sorted = false
btnSort.addEventListener('click', function (e) {
    e.preventDefault()
    if (sorted === false) {
        sorted = true
    } else {
        sorted = false
    }
    displayMovementsAndDates(currentAccount, sorted)
})

// initial commits
const initial = () => {
    inputLoginUsername.value = account3.username
    inputLoginPin.value = account3.pin
} 
initial()

// checks if the current account is test and changes the input for "transfer money" , "request loan" amd the login informations 
const checkAccountTest = () => {
    const other = currentAccount.username === 'test1' ? account4 : account3
    const testAccount = () => {
        inputLoginUsername.value = other.username
        inputLoginPin.value = other.pin
        inputTransferTo.value = other.username
    }
    testAccount()
}
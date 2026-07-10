function bankaccount(){       //outer function
let balance =10000

return {
    withdraw(amount){        //1st inner function
        balance-=amount
        console.log(`My Account Balance is ${balance}`)
    },
    deposit(amount){         //2nd inner function
        balance+=amount
        console.log(`My Account Balance is ${balance}`);
    }
}
}

bankaccount().withdraw(3000)




function timer() {
    let time = 0;
    let id;

    return {
        start() {
            id = setInterval(() => {
                time++;
                console.log(time);
            }, 1000);
        },

        stop() {
            clearInterval(id);
        },

        reset() {
            time = 0;
            console.log(time);
        }
    };
}

const t = timer();

t.start();


// Call these whenever you want:
// t.stop();
// t.reset();
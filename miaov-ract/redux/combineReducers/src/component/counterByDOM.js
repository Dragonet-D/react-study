
let $addCounter = $('.counterBox .addCounter'),
    $counterPanel = $('.counterBox .counterPanel'),
    $hasAll = $('.allSel .val'),
    $maximum = $('.maximum .val'),
    $allCount = $('.allCount .val');

const counters = [];

class Counter{

    constructor(counters){
        this.value = 0;
        this.counters = counters;
        this.elt = $('<div class="counter"></div>');

        let incrementBtn = this.incrementBtn = $('<button class="add"></button>');
        let decrementBtn = this.decrementBtn = $('<button class="sub"></button>');
        let oddBtn = this.oddBtn = $(' <button class="addIfOdd"></button> ');
        let asyncBtn = this.asyncBtn = $(' <button class="addAsync"></button> ');
        let num = this.num = $( `<span>${this.value}</span>` );

        this.elt.append(decrementBtn, num, incrementBtn, oddBtn, asyncBtn);

        this.decrement = this.decrement.bind(this);
        this.increment = this.increment.bind(this);
        this.addIfOdd = this.addIfOdd.bind(this);
        this.asyncAdd = this.asyncAdd.bind(this);

        incrementBtn.click( this.increment );
        decrementBtn.click( this.decrement );
        oddBtn.click( this.addIfOdd );
        asyncBtn.click( this.asyncAdd );

    }

    decrement(){
        if( this.value===0 ) return;
        this.num.html(--this.value);
        syncState(this.counters);
    }

    increment(){
        this.num.html(++this.value);
        syncState(this.counters);
    }

    addIfOdd(){

        if( this.value%2 === 0 ) return;
        this.num.html(++this.value);
        syncState(this.counters);
    }
    asyncAdd(){
        setTimeout( ()=>{
            this.num.html(++this.value);
            syncState(this.counters)
        } , 1000);

    }

}

function checkHasAll(counters) {
    let val = counters.every( elt => elt.value !== 0 );

    $hasAll.html(val+'');
}

function calcMax(counters) {
    let val = counters.slice().sort( (a,b)=> b.value-a.value )[0].value;

    $maximum.html(val);

}

function countAll(counters) {
    let val = counters.reduce( (accu, elt)=> accu+elt.value, 0 );

    $allCount.html(val);
}

function syncState(counters) {
    checkHasAll(counters);
    calcMax(counters);
    countAll(counters);
}

$addCounter.click( ev=>{
    let counter = new Counter(counters);
    counters.push(counter);
    $counterPanel.append( counter.elt );
    syncState(counters);
} )

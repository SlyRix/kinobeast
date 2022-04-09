const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const seatsFree = document.querySelectorAll('.row .seat:not(.reserved)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
let moviename = "";
let shownr;
let ticketPrice;
let movienow;
let rowarray =["P","O","N", "M", "L", "K", "J", "I", "H", "G", "A", "B", "C", "D", "E", "F"]

const rows = document.getElementsByClassName("row")
let dbb = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
// init();
populateUI();
const t = function rr() {
};
ticketPrice = +movieSelect.value;
for (const mov of movieSelect) {
    if (mov.selected) {
        moviename = mov.label;
    }
    console.log(moviename);
}


// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const reservedSeats = document.querySelectorAll('.row .seat.reserved');
    const name = document.querySelectorAll('.row .seat');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
    const seatsresIndex = [...reservedSeats].map(seat => [...seats].indexOf(seat));
    const resname = [];
    const shows = [];
    for (x of seatsresIndex) {
        resname.push(seats[x].classList.item(4));
        shows.push(seats[x].classList.item(5));
    }

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
    localStorage.setItem('reservedSeats', JSON.stringify(seatsresIndex));
    localStorage.setItem('reservednameSeats', JSON.stringify(resname));
    if (shows == "Fr_BEAST_(35CHF)") {

    } else if (shows == "Sa_BEAST_(35CHF)") {

    } else if (shows == "So_BEAST_(35CHF)") {

    }
    localStorage.setItem('shows', JSON.stringify(shows));


    dbb.transaction(function (tx) {

        for (i of seatsresIndex) {
            seats[i].classList.item(4)
            let l = seats[i].classList.item(1).split(":")
            tx.executeSql('UPDATE SEAT SET reservation_name = upper(?), status= ? WHERE shows = ? AND seat_nr =? AND row= ?', [seats[i].classList.item(4), "reserved", parseInt(seats[i].classList.item(5)), parseInt(l[1]), l[0]]);

        }
    }, function (x) {
        console.log("SQL ERROR" + x.message);
    }, function () {
        console.log("SQL success");
    });

    dbb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SEAT WHERE status= "reserved"', [], function (tx, results) {
            console.log(results.rows);
        })
    });

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

    setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

function booking() {
    const lname = document.getElementById("lname").value;
    const seatsFree = document.querySelectorAll('.row .seat:not(.reserved)');
    seatsFree.forEach((seat, index) => {
        if (seat.classList.contains('selected')) {
            console.log(seat, index + "RESERVE !")
            seat.classList.toggle("reserved");
            let replaced = lname.replaceAll(' ', '_');
            seat.classList.add(replaced);
            if (moviename == "Fr BEAST (35CHF)") {
                movienow = 1;
            } else if (moviename == "Sa BEAST (35CHF)") {
                movienow = 2;
            } else if (moviename == "So BEAST (35CHF)") {
                movienow = 3;
            }
            seat.classList.add(movieSelect.selectedIndex+1);
            console.log(lname);
        }
        dbb.transaction(function (tx) {
            tx.executeSql('UPDATE SEAT SET ContactName = "Alfred Schmidt", City= "Frankfurt" WHERE CustomerID = 1;');
        }, function () {
            console.log("SQLERROR");
        }, function () {
            console.log("SQLFAIL");
        });
    });
    updateSelectedCount();
}

function namesearch() {

    const resname = document.getElementsByClassName("resname");
    resname[0].innerText = "";
    const searchname = document.getElementById("search");
    const reservedSeats = document.querySelectorAll('.row .seat.reserved');
    let strin = searchname.value + " = "
    let show = "";
    // seatsFree.forEach((seat, index) => {
    //     if (seat.classList.contains(searchname)) {
    //         show = seat.classList.item(5);
    //         console.log(searchname, seat.classList.item(1) + "RESERVE !")
    //         strin = strin  + seat.classList.item(1)+", ";
    //         resname[0].innerText = strin;
    //     }
    // });
    dbb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SEAT WHERE reservation_name= upper(?)', [searchname.value], function (tx, results) {
            console.log(results);
            for(let i of results.rows){
                strin += i.row + ":"+ i.seat_nr+ ", "
                show = i.shows
            }
            if(results.rows.length>0){
                strin += "show: " + show;
                resname[0].innerText = strin;
                searchname.value= "";
            }else{
                resname[0].innerText = "Not Found";
            }

        });
    });


}

// Get data from localstorage and populate UI
function populateUI() {

    /*var stmnt = "SELECT * FROM SEAT";
    var myrows = [];
            dbb.transaction(function(tx){
                tx.executeSql(stmnt, [], function(tx,result){
                    for(var i = 0; i < result.rows.length; i++){
                        var row = result.rows.item(i);
                        myrows.push(row);
                    }
                    console.log(myrows);
                    //return callback_fun(myrows); // <<----- RETURN
                }, function(tx,error){
                    alert('Error: '+error.message);
                    return;
             });
         }); 
    */
    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const reservedSeats = JSON.parse(localStorage.getItem('reservedSeats'));
    const namereservedSeats = JSON.parse(localStorage.getItem('reservednameSeats'));
    const shows = JSON.parse(localStorage.getItem('shows'));
    console.log(selectedSeats);


    const rows = document.getElementsByClassName("row")
    let rownr = 0;
    let seatnr = 0;
    let id = 0;
    for (let row of rows) {
        seatnr = 0;
        rownr++;
        for (let seat of row.children) {
            id++;
            seatnr++;
            seat.classList.add(rowarray[rownr-1] + ":" + seatnr)
        }
    }



    // if (selectedSeats !== null && selectedSeats.length > 0) {
    //     seats.forEach((seat, index) => {
    //         if (selectedSeats.indexOf(index) > -1) {
    //             seat.classList.add('selected');
    //         }
    //         l = seat.classList.item(1).split(":")
    //         // if(results.rows)
    //         // if (reservedSeats.indexOf(index) > -1) {
    //         //     seat.classList.add('reserved');
    //         //     seat.classList.add(namereservedSeats[reservedSeats.indexOf(index)]);
    //         //     seat.classList.add(shows[reservedSeats.indexOf(index)]);
    //         // }
    //     });
    // }


    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
    }
    setMovieData(movieSelect.selectedIndex, movieSelect.value);
    readDB();

}
function init(){
    const rows = document.getElementsByClassName("row")

    dbb.transaction(function s(tx) {
        tx.executeSql('DROP TABLE SEAT');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SEAT ( shows, seat_nr , row,   reservation_name, status)');
        let seatnr = 0;
        let id = 0;

        for (var i = 0; i < 3; i++) {
            let rownr = 0;
            for (let row of rows) {
                seatnr = 0;
                rownr++;
                for (let seat of row.children) {
                    id++;
                    seatnr++;
                    tx.executeSql('INSERT INTO SEAT (shows, seat_nr , row,   reservation_name, status) VALUES (?,?,?,?,? )', [i + 1, seatnr, rowarray[rownr-1], "zz", ""]);
                    // tx.executeSql('INSERT INTO SEAT (shows, seat_nr , row,   reservation_name, status) VALUES (?,?,?,?,? )',[i+1 ,seatnr,rownr, seat.classList.item(4),seat.classList.item(3)] );
                }
            }
        }
    });
}
function readDB() {
    if (moviename == "Fr BEAST (35CHF)") {
        movienow = 1;
    } else if (moviename == "Sa BEAST (35CHF)") {
        movienow = 2;
    } else if (moviename == "So BEAST (35CHF)") {
        movienow = 3;
    }
    let resultsnr;
    dbb.transaction(function (tx) {
        tx.executeSql('SELECT * FROM SEAT WHERE status= "reserved" OR status= "taken"', [], function (tx, results) {
            resultsnr = results.rows;
            console.log(results.rows);
                seats.forEach((seat, index) => {
                    for(let i of resultsnr){
                        let l = seat.classList.item(1).split(":")
                        if( i.seat_nr== l[1] && i.row==l[0] && i.shows == movieSelect.selectedIndex+1){
                            console.log("KKK");
                            seat.classList.add('selected')
                            seat.classList.add('reserved')
                            if(i.status == "taken"){
                                seat.classList.add('taken')
                            }
                            seat.classList.add(i.reservation_name);
                            seat.classList.add(i.shows);
                        }
                    else if (seat.classList.contains('selected') && !seat.classList.contains('reserved')) {
                            seat.classList.toggle('selected')
                        }else if (seat.classList.contains('reserved') && !seat.classList.contains(movieSelect.selectedIndex+1)){
                        let l = seat.classList.item(1).split(":");
                            seat.classList.toggle('selected');
                            seat.classList.toggle('reserved');
                            if(i.status == "taken"){
                                seat.classList.toggle('taken');
                            }
                            seat.classList.toggle(seat.classList.item(2));
                            seat.classList.toggle(seat.classList.item(2));
                        }
                    }
                });
        });
    });
}

// Movie select event
movieSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    for (const mov of movieSelect) {
        if (mov.selected) {
            moviename = mov.label
        }
        console.log(moviename);
    }

    readDB();
    updateSelectedCount();
});

// Seat click event
container.addEventListener('contextmenu', e => {
    console.log("RIGHTCLICKED")
    let l =  e.target.classList.item(1).split(":")
    if (e.target.classList.contains('taken')) {
        e.target.classList.toggle("taken")
        dbb.transaction(function s(tx) {
            tx.executeSql('UPDATE SEAT SET status= ? WHERE shows = ? AND seat_nr =? AND row= ?', ["reserved", parseInt(e.target.classList.item(5)), parseInt(l[1]), l[0]]);
        });
    }else if (e.target.classList.contains('reserved')){
        e.target.classList.add("taken")
        dbb.transaction(function s(tx) {
            tx.executeSql('UPDATE SEAT SET reservation_name = upper(?), status= ? WHERE shows = ? AND seat_nr =? AND row= ?', [e.target.classList.item(4), "taken", parseInt(e.target.classList.item(5)), parseInt(l[1]), l[0]]);
        });
    }
});

container.addEventListener('click', e => {
    if(!e.target.classList.contains("taken")) {
        if (
            e.target.classList.contains('seat') &&
            !e.target.classList.contains('occupied')
        ) {
            e.target.classList.toggle('selected');
            updateSelectedCount();
            console.log("SELECTED!");
        }
        if (
            e.target.classList.contains('reserved')
        ) {
            let l = e.target.classList.item(1).split(":")
            dbb.transaction(function s(tx) {
                tx.executeSql('UPDATE SEAT SET reservation_name ="zz", status= "" WHERE shows = ? AND seat_nr =? AND row= ?', [parseInt(shownr), parseInt(l[1]), l[0]]);
            });
            shownr = e.target.classList.item(4)
            e.target.classList.toggle(e.target.classList.item(3))
            e.target.classList.toggle(e.target.classList.item(3))
            e.target.classList.toggle('reserved');
            updateSelectedCount();
            console.log("Reservation undo!");
        }
    }
});

container.addEventListener('mouseover', e => {
    const tooltiptext = document.getElementsByClassName("tooltiptext");
    const rows = document.getElementsByClassName("row")

    for (let tool of tooltiptext) {
        for (let row of rows) {
        }
        let rownr = 0;
        rownr++;
        if (e.target.classList.length > 4) {
            let l = e.target.classList.item(1).split(":")
            tool.innerText = e.target.classList.item(4) + "  Row:" + l[0] +" Seat:"+l[1];
        } else {
            tool.innerText = "";
        }
        // console.log(e.target.classList.item(3) + "mouseenter");
    }
});

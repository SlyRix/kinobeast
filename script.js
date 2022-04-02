const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const seatsFree = document.querySelectorAll('.row .seat:not(.reserved)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

const rows = document.getElementsByClassName("row")

let dbb = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

dbb.transaction(function (tx) { 
   tx.executeSql('CREATE TABLE IF NOT EXISTS SEAT (seat_nr unique)');
}); 

populateUI();

let ticketPrice = +movieSelect.value;
     
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
  for(x of seatsresIndex){
    resname.push(seats[x].classList.item(4));
}

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
  localStorage.setItem('reservedSeats', JSON.stringify(seatsresIndex));
  localStorage.setItem('reservednameSeats', JSON.stringify(resname));





  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
  
  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}
function booking(){
  const lname =  document.getElementById("lname").value;
  const seatsFree = document.querySelectorAll('.row .seat:not(.reserved)');
  seatsFree.forEach((seat, index) => {
    if (seat.classList.contains('selected')) {
      console.log(seat, index + "RESERVE !")
      seat.classList.toggle("reserved");
      const replaced = lname.replaceAll(' ', '_');
      seat.classList.add(replaced);
      console.log(lname);
    }

  });
  updateSelectedCount();
}
function namesearch(){
  const resname =  document.getElementsByClassName("resname");

  const searchname =  document.getElementById("search").value;
  const reservedSeats = document.querySelectorAll('.row .seat.reserved');
  let strin = ""
  seatsFree.forEach((seat, index) => {
    if (seat.classList.contains(searchname)) {
      console.log(searchname, seat.classList.item(1) + "RESERVE !")
      strin = strin +searchname + ":"+ seat.classList.item(1);
      resname[0].innerText= strin;
    }
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

  console.log(selectedSeats);


  const rows = document.getElementsByClassName("row")
  let rownr = 0;
  let seatnr = 0;
  for (let row of rows){
    seatnr = 0;
    rownr ++;
    for(let seat of row.children){
      seatnr++;
      seat.classList.add("Row:"+rownr +"_SEAT:" + seatnr)
    }
  }

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {

      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
      if (reservedSeats.indexOf(index) > -1) {
        seat.classList.add('reserved');
        seat.classList.add(namereservedSeats[reservedSeats.indexOf(index)])
      }
    });

  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
  setMovieData(movieSelect.selectedIndex, movieSelect.value);


}

// Movie select event
movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Seat click event
container.addEventListener('click', e => {
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
    e.target.classList.toggle(e.target.classList.item(3))
    e.target.classList.toggle('reserved');
    updateSelectedCount();
    console.log("Reservation undo!");
  }
});
container.addEventListener('mouseover', e => {
    const tooltiptext =  document.getElementsByClassName("tooltiptext");
    const rows = document.getElementsByClassName("row")

  for (let tool of tooltiptext) {
      for(let row of rows ){
      }
      let rownr = 0;
      rownr ++;
      if (e.target.classList.length > 4){
      tool.innerText =e.target.classList.item(4) +"__"+e.target.classList.item(1);
    }
      else{
        tool.innerText ="";
      }
    console.log(e.target.classList.item(3) + "mouseenter");

  }
});

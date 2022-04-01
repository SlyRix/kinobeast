const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');

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
    
  

  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

let L1 = 44;
  dbb.transaction(function (tx) { 
    tx.executeSql('DROP TABLE SEAT;');
    tx.executeSql('CREATE TABLE IF NOT EXISTS SEAT (seat_nr unique)');
    seatsIndex.forEach(function (item, index) {
    L1 = item;
    tx.executeSql('INSERT INTO SEAT (seat_nr)  VALUES (' +L1+ ')', []);
    console.log(item, index);
});
});

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
  
  setMovieData(movieSelect.selectedIndex, movieSelect.value);
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
    console.log(selectedSeats);
        

        

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
    

      if (selectedSeats.indexOf(index) > -1) {
          
        seat.classList.add('selected');
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
      console.log("LOL " + e.target.selectedIndex, e.target.value);
  }
});
/**
 * 
 * Code fourni
 */
const app = {
  // just a utility var to remember all the colors
  colors: ['red', 'green', 'blue', 'yellow'],

  // this var will contain the sequence said by Simon
  sequence: [],

  //position du joueur dans la séquence
  indice: 0,

  timer:5,

  isPlayerTurn:false,


  drawCells: function () {
    const playground = document.getElementById('playground');
    for (const color of app.colors) {
      let cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = color;
      cell.style.backgroundColor = color;
      playground.appendChild(cell);
    }
  },

  bumpCell: function (color) {
    // let's modify the syle directly
    document.getElementById(color).style.borderWidth = '45px';
    // and reset the same style, after a small pause (150 ms)
    setTimeout(() => {
      document.getElementById(color).style.borderWidth = '0';
    }, 150);

  },

  newGame: function () {
    app.indice=0;
    clearTimeout(app.timer);
    clearTimeout(app.timer2);
    // start by reseting the sequence 
    app.sequence = [];
    // make it 3 times :
    for (let index = 0; index < 3; index++) {
      // get a random number between 0 and 3
      let random = Math.floor(Math.random() * 4);
      // add the corresponding color to the sequence
      app.sequence.push(app.colors[random]);
    }

    // start the "Simon Says" sequence
    app.simonSays(app.sequence);
    
     
  },

  
  simonSays: function (sequence) {
    
    
    if (sequence && sequence.length) {
      // after 500ms, bump the first cell
      setTimeout(app.bumpCell, 500, sequence[0]);
      // plays the rest of the sequence after a longer pause
      setTimeout(app.simonSays, 850, sequence.slice(1));
      app.showMessage('Mémorisez la séquence');
      app.isPlayerTurn=false;
      
    }
    else {
      app.showMessage('Reproduisez la séquence');
      app.timer = setTimeout(app.endGame, 5000);
      app.isPlayerTurn=true;
    }
    
   
  },

  init: function () {
    console.log('init');
    app.drawCells();

    
    // listen click on the "go" button
    document.getElementById('go').addEventListener('click', app.newGame);

        //Si l'utilisateur clique sur une case
    console.log(app.timer2); 
   
    document.getElementById('playground').addEventListener('click', function (event) {
      console.log('Je supprime les timers');
      clearTimeout(app.timer);

      if(!app.isPlayerTurn){
        return;
      }
  ;
      app.bumpCell(event.target.id);
      if (event.target.id !== app.sequence[app.indice]) {
        app.endGame();
      }
      else {
        if ((app.indice + 1) != app.sequence.length) {
          app.indice++;
          app.timer = setTimeout(app.endGame, 5000);
        }
        else {
          app.nextMove();
        }
      }
    });
  
  },

  /** Fin du code fourni. Après, c'est à toi de jouer! */

  showMessage: function (message) {
    document.getElementById('message').innerHTML = message;
    document.getElementById('go').style.display = 'none';
  },

  unshowMessage: function () {
    document.getElementById('message').innerHTML = '';
    document.getElementById('go').style.display = 'block';
  },

  endGame: function () {
    clearTimeout(app.timer);
    clearTimeout(app.timer2);
    alert(`Partie terminée. Votre score : ${app.sequence.length}`);
    app.unshowMessage();
    app.sequence.forEach(element => {
      console.log(element);
      element = '';
      console.log(element);
    })
  },

  nextMove:function () {
      const random = Math.floor(Math.random() * 4);
      // add the corresponding color to the sequence
      app.sequence.push(app.colors[random]);
      app.simonSays(app.sequence);
      app.indice=0;
      
  }


};


document.addEventListener('DOMContentLoaded', app.init);


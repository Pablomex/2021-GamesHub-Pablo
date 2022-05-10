const app = {
    init: () => {
        app.redrawBoard();
        app.listenKeyboardEvents();
    },
    player: {
        x: 0, // coordonnée x du joueur
        y: 0, // coordonnée y du joueur
        direction: 'down', // sens de direction du joueur : 'left', 'right', 'up ou 'down'
        point: 0 // score ou nombre de déplacements du joueur
    },
    targetCell: {
        x: 15, // coordonnée x de l'arrivée
        y: 10 // coordonnée y de l'arrivée
    },
    backRoadCells: [], // Array de toutes les coordonées [x, y] des cells où le joueur sera passé pour afficher le chemin empreinté
    gameOver: false, // boolean donnant l'état fini ou pas du jeu
    board: document.getElementById('board'), // board = la div contenant tout le plateau de jeu

    /**
   * @description Méthode qui dessine la plateau de jeu avec un player et sa position
   * @param {number} rowsNumber : la quantité de ligne du plateau de jeu
   * @param {number} cellsNumber : la quantité de case par ligne du plateau de jeu
   */
    drawBoard: (rowsNumber = app.targetCell.y + 1, cellsNumber = app.targetCell.x + 1) => {
        for (let rowsNb = 0; rowsNb < rowsNumber; rowsNb++) {

            // Création des lignes 'row' dans la plateau de jeu 'board' et application de la class 'row' sur celles-ci
            const row = document.createElement('div');
            row.classList.add('row');
            app.board.appendChild(row);

            for (let cellsNb = 0; cellsNb < cellsNumber; cellsNb++) {
                // Création des cases dans chaque ligne et application de la class 'cell' sur celles-ci
                const cell = document.createElement('div');
                cell.classList.add('cell');

                // Si la cell en cours de création correspond aux coordonnées de 'app.targetCell' alors class="targetCell"
                if (rowsNb === app.targetCell.y && cellsNb === app.targetCell.x) {
                    cell.classList.add('targetCell');
                }

                // Si la cell en cours de création correspond aux coordonnées du joueur alors class="player" et class=app.player.direction à la cell du joueur ('left', 'right', 'up' ou 'down')
                if (rowsNb === app.player.y && cellsNb === app.player.x) {
                    cell.classList.add('player', app.player.direction);
                }

                // Vérification des coordonnées de la cell en cours de création avec les anciennes coordonnées du joueur pour tracé un chemin
                app.backRoadCells.forEach(i => {
                    if (i[0] === cellsNb && i[1] === rowsNb) {
                        cell.classList.add('backRoadCells');
                    }
                });

                // Insertion des cells dans les row correspondantes
                row.appendChild(cell);
            }
        }

        // Si les coordonnées du joueur sont les mêmes que celles de l'arrivée alors déclenchement de 'isGameOver()' (fin de partie)
        if (app.player.x === app.targetCell.x && app.player.y === app.targetCell.y) {
            app.isGameOver();
        }
    },

    /**
   * @description Méthode qui efface tout le plateau de jeu
   */
    clearBoard: () => app.board.textContent = '',

    /**
   * @description Méthode qui efface et redessine tout le plateau de jeu
   */
    redrawBoard: () => { app.clearBoard(); app.drawBoard();},

    /**
   * @description Méthode qui change la position du player
   * @param {string} position : une chaîne qui indique la position du player : 'right', 'left', 'up' ou 'down'
   */
    turnPlayer: direction => {
        // Changement de la direction du joueur = la valeur de 'app.player.direction'
        app.player.direction = direction;

        // Appel de la méthode pour redessinner le plateau de jeu
        app.redrawBoard();
    },

    /**
   * @description Méthode qui déplace le player 
   * @param {number} maxCell : la valeur maximale horizontale qui empêche le player de sortir du plateau : app.targetCell.x
   * @param {number} maxRow : la valeur maximale verticale qui empêche le player de sortir du plateau : app.targetCell.y
   */
    moveForward: (maxCell = app.targetCell.x, maxRow = app.targetCell.y) => {
        // Si le joueur veut aller vers la droite et que sa coordonnée x n'est pas au maximum du plateau
        if (app.player.direction === 'right' && app.player.x < maxCell) {
            // Appel de la méthode 'traceRoad' pour retenir les coordonnées du joueur afin de tracé son chemin
            app.memorizeRoad(app.player.x, app.player.y);
            app.player.x++;

            // Si le joueur veut aller vers la gauche et que sa coordonnée x n'est pas au minimum du plateau
        } else if (app.player.direction === 'left' && app.player.x > 0) {
            app.memorizeRoad(app.player.x, app.player.y);
            app.player.x--;

            // Si le joueur veut aller vers le bas et que sa coordonnée y n'est pas au maximum du plateau
        } else if (app.player.direction === 'down' && app.player.y < maxRow) {
            app.memorizeRoad(app.player.x, app.player.y);
            app.player.y++;

            // Si le joueur veut aller vers le heut et que sa coordonnée y n'est pas au minimum du plateau
        } else if (app.player.direction === 'up' && app.player.y > 0) {
            app.memorizeRoad(app.player.x, app.player.y);
            app.player.y--;
        }

        // Ajout d'un déplacement dans le décompte de points du joueur
        app.player.point++;

        // Appel de la méthode pour redessinner le plateau de jeu
        app.redrawBoard();
    },

    /**
     * @description Méthode qui inscrit les coordonnées x et y passées en arguments pour les retenir dans le paramètre 'app.backRoadCells' pour tracer le chamein empreinté par le joueur
     * @param {number} x : coordonnée horizontal à inscrire
     * @param {number} y : coordonnée verticale à inscrire
     */
    memorizeRoad: (x, y) => {
        // Ajout des coordonnées du joueur avant son déplacement dans l'Array 'backRoadCells' pour tracer la route empreintée derrière lui
        app.backRoadCells.push([x, y]);
    },

    /**
     * @description Méthode qui écoute les touches flèches haute, bas, droite et gauche et lance les mouvements du player en fonction
     */
    listenKeyboardEvents: () => {
        // Ajout d'un écouteur d'évennement sur le clavier
        document.addEventListener('keyup', function (event) {
            event.stopPropagation;

            // Si le jeu n'est pas fini la touche pressée adapte la direction du joueur
            if (!app.gameOver) {
                switch (event.key.toLowerCase()) {
                case 'arrowup':
                    app.turnPlayer('up');
                    app.moveForward();
                    break;
                case 'arrowdown':
                    app.turnPlayer('down');
                    app.moveForward();
                    break;
                case 'arrowleft':
                    app.turnPlayer('left');
                    app.moveForward();
                    break;
                case 'arrowright':
                    app.turnPlayer('right');
                    app.moveForward();
                    break;
                default:
                    app.turnPlayer('down');
                }
            }
        });
    },

    /**
     * @description Méthode qui réinitialise le jeu pour rejouer
     */
    reset: () => {
        // Reset toutes les valeurs des clés du sous-objet 'player' via une boucle forEach
        Object.keys(app.player).forEach((key) => {
            app.player[key] = 0;
        });

        app.gameOver = false;
        app.backRoadCells = [];

        // Appel de la méthode pour redessinner le plateau de jeu
        app.redrawBoard();
    },

    /**
   * @description Méthode qui change se déclenche quand le joueur à gagner
   */
    isGameOver: () => {
        app.gameOver = true;

        // Appel de la méthode pour afficher le score et rejouer
        app.replayBox();
    },

    /**
     * @description Méthode pour afficher le score et un bouton replay
     */
    replayBox: () => {
        // Création d'une div class="replay" avec un contenu HTML dedans, sur le 'body'
        const gameOverMessage = document.createElement('div');
        gameOverMessage.classList.add('replay');
        gameOverMessage.innerHTML = '<p>Bravo !</p><p>Tu as trouvé la sortie en ' + app.player.point + ' déplacements.</p><p>Souhaites-tu rejouer ?</p><button>Rejouer</button>';

        document.body.insertAdjacentElement('afterbegin', gameOverMessage);

        // Appel de l'écouteur du 'replayButton'
        app.listenReplayButton(gameOverMessage);
    },

    /**
     * @description Méthode pour écouter le clique sur le bouton Replay de la replayBox()
     */
    listenReplayButton: (tagetParent) => {
        // Ecoute du bouton rejouer
        document.getElementsByTagName('button')[0].addEventListener('mouseup', function (event) {
            event.stopPropagation();

            // Appel de la méthode qui reset et relance le jeu
            app.reset();

            // Efface la div 'replayBox'
            tagetParent.remove();
        });
    }
};

// Attend tout le chargement du DOM avant de lancer le jeu
document.addEventListener('DOMContentLoaded', app.init);
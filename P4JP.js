let tableau = document.getElementById("tableau");
let canvas = document.getElementById("structure");
let canvasGame = document.getElementById("jeu");
let context = tableau.getContext('2d');
let contextGame = canvasGame.getContext('2d');

let cellule = 100;
let demiCellule = cellule / 2;
tableau.height = cellule * 7;
tableau.width = cellule * 7;
canvasGame.height = cellule * 7;
canvasGame.width = cellule * 7;

let color;

/** Déclaration de notre matrice **/
let matrice = [];
for(let i = 0; i < 6; i++){
    matrice[i] = [0,0,0,0,0,0,0];
}

class Model {
    constructor(model) {
        this.model = model;
    }

    /** Fait appel à la fonction de vérification de gagnant après l'ajout d'un jeton -> si gagnant PopUp  **/
    movementcheck(colonne){
        for(let i = 5; i >= 0; i--){
            if (matrice[i][colonne] == 0){
                matrice[i][colonne] = this.tour;
                break;
            }
        }
        if(this.checkwinner()){
            if(this.checkwinner() == 1){
                window.alert("Victoire du joueur Jaune !");
            }    else if (this.checkwinner() == 2){
                window.alert ("Victoire du joueur Rouge !");
            }
            else {
                window.alert ("Il n'y a pas de gagnant, recommencez une partie !");
            }
            //Reset la grille pour recommencer une partie
            location.reload();
        }
    }

    /** Fonction qui vérifie un des deux joueur a gagné la partie (vérification ligne, colonne et les 2 diagonales) avec la matrice réel du jeux **/
    checkwinner(){
       let winner = 0;
       let isFull = true;
       for (let i = 0; i < 7; i++) {
        if (matrice[0][i] === 0) {
            isFull = false;
        }
    }
    if (isFull) {
        winner = 3;
    }
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (matrice[i][j] !== 0 && matrice[i][j] === matrice[i][j + 1] && matrice[i][j] === matrice[i][j + 2] && matrice[i][j] === matrice[i][j + 3]) {
                winner = matrice[i][j];
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if (matrice[i][j] !== 0 && matrice[i][j] === matrice[i + 1][j] && matrice[i][j] === matrice[i + 2][j] && matrice[i][j] === matrice[i + 3][j]) {
                winner = matrice[i][j];
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (matrice[i][j] !== 0 && matrice[i][j] === matrice[i + 1][j + 1] && matrice[i][j] === matrice[i + 2][j + 2] && matrice[i][j] === matrice[i + 3][j + 3]) {
                winner = matrice[i][j];
            }
        }
    }
    for (let i = 3; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (matrice[i][j] !== 0 && matrice[i][j] === matrice[i - 1][j + 1] && matrice[i][j] === matrice[i - 2][j + 2] && matrice[i][j] === matrice[i - 3][j + 3]) {
                winner = matrice[i][j];
            }
        }
    }

        // return winner
        return winner;

    }

    /** Recupère le nombre de jeton présent sur une ligne de la grille **/
    getNbJetonsonline(colonne){
        for(let i = 5; i >= 0; i--){
            if (matrice[i][colonne] == 0){
                return (5 - i);
            }
        }
    }

    /** On récupère l'état des boutons radios pour déterminer quel joueur commence **/
    choosePlayer(tour) {
        return parseInt(document.querySelector("input[name=player]:checked").value);
    }

    /** Fonction qui vérifie si le joueur ou l'IA gagne ou égalise. S'appuie sur les matrices copiées ***/
    isgameover(position){
        let winner = 0;
        let isFull = true;
        for (let i = 0; i < 7; i++) {
            if (position[0][i] === 0) {
                isFull = false;
            }
        }
        if (isFull) {
            winner = 3;
        }
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if (position[i][j] !== 0 && position[i][j] === position[i][j + 1] && position[i][j] === position[i][j + 2] && position[i][j] === position[i][j + 3]) {
                    winner = position[i][j];
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 7; j++) {
                if (position[i][j] !== 0 && position[i][j] === position[i + 1][j] && position[i][j] === position[i + 2][j] && position[i][j] === position[i + 3][j]) {
                    winner = position[i][j];
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                if (position[i][j] !== 0 && position[i][j] === position[i + 1][j + 1] && position[i][j] === position[i + 2][j + 2] && position[i][j] === position[i + 3][j + 3]) {
                    winner = position[i][j];
                }
            }
        }
        for (let i = 3; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                if (position[i][j] !== 0 && position[i][j] === position[i - 1][j + 1] && position[i][j] === position[i - 2][j + 2] && position[i][j] === position[i - 3][j + 3]) {
                    winner = position[i][j];
                }
            }

        }
        return winner;
    }

    /** Choisir le meilleur coup en fonction du score en utilisant algo minmax **/
    getBestmove(position, depth, firstplayer){
        position = JSON.parse(JSON.stringify(position))
        let maxScore = -Infinity;
        let move = 0;

        for (let i = 0 ; i < 7; i++){
            if (this.getPositionfromMove(position, i , firstplayer) == false) {
                continue // éviter l'itération de la boucle et éviter d'appeler l'algo (coup impossible)
            }
            let scoretest = this.minimax(this.getPositionfromMove(position, i, firstplayer), depth, -Infinity, +Infinity, false, firstplayer);
            if (scoretest > maxScore){
                maxScore = scoretest
                move = i
            }
        }
        return move
    }

    /** Test d'un coup et renvoie d'un potentiel tableau **/
    getPositionfromMove(position, column, player){
    position = JSON.parse(JSON.stringify(position))
    for (let i = 5 ; i >= 0; i--){
        if (position[i][column] == 0) {
            position[i][column] = player;
            return position;
        }
    }
    return false;
}

/** Fonction du minimax **/
minimax(position, depth, alpha, beta, maximizingPlayer, firstplayer){
        position = JSON.parse(JSON.stringify(position)) //transformation en string du tableau puis retransformation en tableau 
        if (depth == 0 || this.isgameover(position))
            return this.evaluation(position, firstplayer, depth);
        let maxEval = null
        let minEval = null
        let evalu = null

        if (maximizingPlayer) { //Joueur 1
            maxEval = -Infinity
            for (let i=0; i<7 ; i++){ 
                if (this.getPositionfromMove(position, i , 1) == false) {
                continue // éviter l'itération de la boucle et éviter d'appeler l'algo (coup impossible)
            }
            evalu = this.minimax(this.getPositionfromMove(position, i, 1), depth -1, alpha, beta, false)
            maxEval = Math.max (maxEval,evalu)
            alpha = Math.max (alpha,evalu)
            if (beta <= alpha){
                break;
            }
        }
        return maxEval

    }
        else { // Joueur 2
            minEval = +Infinity
            for (let i=0; i<7 ; i++){
                if (this.getPositionfromMove(position, i , 2) == false) {
                continue // éviter l'itération de la boucle et éviter d'appeler l'algo (coup impossible)
            }
            evalu = this.minimax(this.getPositionfromMove(position, i, 2), depth -1, alpha, beta, true)
            minEval = Math.min (minEval, evalu)
            beta = Math.min(beta, evalu)
            if (beta <= alpha){
                break;
            }
        }
        return minEval
    }

}

/** La fonction evaluation renvoie un score pour un joueur en fonction du plateau joué. **/
evaluation(tabgrid, player, depth) {
    let score = 0;
    //évaluation sur une rangée de 2 jetons :
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i][j + 1]) {
                score = tabgrid[i][j] === player ? score + 3 : score - 3;
            }
        }
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j]) {
                score = tabgrid[i][j] === player ? score + 3 : score - 3;
            }
        }
    }
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j + 1]) {
                score = tabgrid[i][j] === player ? score + 3 : score - 3;
            }
        }
    }

    for (let i = 1; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i - 1][j + 1]) {
                score = tabgrid[i][j] === player ? score + 3 : score - 3;
            }
        }
    }

    // évaluation sur une rangée de 3 jetons :
    for (let i = 0; i < 6; i++) {
        for (var j = 0; j < 5; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i][j + 1] && tabgrid[i][j] === tabgrid[i][j + 2]) {
                score = tabgrid[i][j] === player ? score + 10 : score - 10;
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 7; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j] && tabgrid[i][j] === tabgrid[i + 2][j]) {
                score = tabgrid[i][j] === player ? score + 10 : score - 10;
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j + 1] && tabgrid[i][j] === tabgrid[i + 2][j + 2]) {
                score = tabgrid[i][j] === player ? score + 10 : score - 10;
            }
        }
    }
    for (let i = 2; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            if(tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i - 1][j + 1] && tabgrid[i][j] === tabgrid[i - 2][j + 2]) {
                score = tabgrid[i][j] === player ? score + 10 : score - 10;
            }
        }
    }

    // évaluation sur une rangée de 4 jetons :
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i][j + 1] && tabgrid[i][j] === tabgrid[i][j + 2] && tabgrid[i][j] === tabgrid[i][j + 3]) {
                score = tabgrid[i][j] === player ? score + 50*depth : score - 200*depth;
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if (tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j] && tabgrid[i][j] === tabgrid[i + 2][j] && tabgrid[i][j] === tabgrid[i + 3][j]) {
                score = tabgrid[i][j] === player ? score + 50*depth : score - 200*depth;
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i + 1][j + 1] && tabgrid[i][j] === tabgrid[i + 2][j + 2] && tabgrid[i][j] === tabgrid[i + 3][j + 3]) {
                score = tabgrid[i][j] === player ? score + 50*depth : score - 200*depth;
            }
        }
    }
    for (let i = 3; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (tabgrid[i][j] !== 0 && tabgrid[i][j] === tabgrid[i - 1][j + 1] && tabgrid[i][j] === tabgrid[i - 2][j + 2] && tabgrid[i][j] === tabgrid[i - 3][j + 3]) {
                score = tabgrid[i][j] === player ? score + 50*depth : score - 200*depth;
            }
        }
    }
    return score;
}
}

class View {
    constructor() {
        let buttons = document.querySelectorAll('.movebutton');
        buttons.forEach((button) => {
            button.addEventListener('click', ()=> {
                this.callModel(button.id);
            })
        })

        let reset = document.getElementById('reset');
        reset.addEventListener('click', ()=> {
            location.reload();
        })

        this.stop = false;
        this.raf = null;
        this.ball = {
            x: 50,
            y: 0,
            vx: 1,
            vy: 2,
            radius: 35,
            color,
            draw: function() {
                contextGame.beginPath();
                contextGame.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
                contextGame.closePath();
                contextGame.fillStyle = this.color;
                contextGame.fill();
            }
        }
    }

    /** Dessine le tableau **/
    drawTableau() {
        context.fillStyle = "#3867d6";
        context.fillRect(0, cellule, tableau.width, tableau.height);
        context.stroke();
    }

    /** Dessine les cercles de la grille **/
    clearCircle(x, y, rayon) {
        context.globalCompositeOperation = 'destination-out';
        context.arc(x, y, rayon, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }

    /** Fonction qui gère l'affichage et l'animation du jeton **/
    affichage(x, y, yMax, colonne, color, timestamp) {

        //Fonction de gestion du temps de l'animation
        if (this.startTimer === undefined) {
            this.ball.color = color;
            this.ball.x = x;
            this.startTimer = timestamp;
        }
        // Fin de l'animation
        if (this.stop){
            this.stop = false;
            this.animable = true;
            this.startTimer = undefined;
            this.ball.x = 50;
            this.ball.y = 0;
            this.ball.vx = 1;
            this.ball.vy = 2;
            window.cancelAnimationFrame(this.raf);
            this.movementcheck(colonne);
            return;
        }
        if(timestamp - this.startTimer >= 1600) {
            this.stop = true;
            this.ball.y = yMax;
            contextGame.clearRect(0, 0, 1000, yMax + demiCellule);
            contextGame.beginPath();
            this.ball.draw();
            contextGame.fill();
            contextGame.stroke();
            context.beginPath();
            context.arc(x, yMax, 35, 0, Math.PI*2, true);
            context.closePath();
            context.fillStyle = color;
            context.fill();
            this.raf = window.requestAnimationFrame((timestamp)=>this.affichage(x,y,yMax, colonne, color, timestamp));
            return;
        }

        contextGame.clearRect(0 , 0, 1000, yMax + demiCellule);
        contextGame.beginPath();
        this.ball.draw();
        this.ball.y += this.ball.vy;
        this.ball.vy *= .99;
        this.ball.vy += 1.2;
        contextGame.fill();
        contextGame.stroke();
        // Rebond et Perte de vitesse du jeton
        if (this.ball.y + this.ball.vy > yMax || this.ball.y + this.ball.vy < 0) {
            this.ball.vy = -this.ball.vy;
            this.ball.vy *= .3;
        }

        this.raf = window.requestAnimationFrame((timestamp)=>this.affichage(x,y,yMax, colonne, color, timestamp));
        return;
    }

    /** Fonction qui permet de déterminer quel joueur commence **/
    changePlayer(){
        let playertour = document.querySelectorAll("input[name=player]")
        if (playertour[0].checked) {
            playertour[0].checked = false;
            playertour[1].checked = true;
            this.firstplayer = 1;
        }
        else{
            playertour[0].checked = true;
            playertour[1].checked = false;
            this.firstplayer = 2;
        }
    }

    /** Désactive les boutons de choix du joueur **/
    disablechangeplayer(){
        let playertour = document.querySelectorAll("input[name=player]")
        playertour.forEach((player) => {
            player.disabled = true;
        })
        let ia_tour = document.querySelectorAll("input[name=iabtn]")
        ia_tour.forEach((ia) => {
            ia.disabled = true;
        })
    }


    bindModel(callback) {
        this.callModel = callback;
    }

    movementcheck(callback){
        this.movementcheck = callback;
    }

    choosePlayer(callback) {
        this.choosePlayer = callback;
    }
}

class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.drawTableau();
        for (let y = 100; y < 700; y += cellule) {
            for (let x = 0; x < 700; x += cellule) {
                this.view.clearCircle(x + demiCellule, y + demiCellule, 35);
            }
        }
        context.globalCompositeOperation = 'source-over';

        this.bindFunction = this.bindFunction.bind(this);
        this.view.bindModel(this.bindFunction);
        this.view.movementcheck((colonne)=>{this.model.movementcheck(colonne); this.afterMove()}); // appel des deux fonctions
    }

    bindFunction(colonne) {

        if(this.firstmove==undefined){this.firstmove=true}
        if (this.view.animable == false) return;
        this.view.animable = false;
        let x = 50 + (100*colonne);
        let y = 10;
        let yMax = 650 - (100*this.model.getNbJetonsonline(colonne));
        if (this.firstmove) {
            this.model.tour = (this.model.choosePlayer(this.model.tour) == 1 ? 2 : 1);
            this.view.disablechangeplayer();
        }
        else{
            this.model.tour = this.model.tour == 1 ? 2 :1
        }  
        this.firstmove = false;
        this.view.changePlayer();
        this.model.color = (this.model.tour == 1 ? '#f7b731': '#eb3b5a');

        if (document.querySelector("input[name=iabtn]:checked").classList.contains("IA") && this.model.tour == 1){
            this.afterMove();
        }
        this.view.raf = window.requestAnimationFrame(()=>this.view.affichage(x, y, yMax, colonne, this.model.color));
    }
    /** Tour : IA **/
    afterMove(){
        /** Si le bouton de l'IA est checké **/
        if (document.querySelector("input[name=iabtn]:checked").classList.contains("IA") && this.model.tour == 2){
            this.model.tour = this.model.tour == 1 ? 2 : 1 //inverse du tour
            let coup_ia = this.model.getBestmove(matrice, 6, this.view.firstplayer);
            this.view.animable = false;
            let x = 50 + (100*coup_ia);
            let y = 10;
            let yMax = 650 - (100*this.model.getNbJetonsonline(coup_ia));
            this.view.changePlayer();
            this.model.color = (this.model.tour == 1 ? '#f7b731': '#eb3b5a');
            this.view.raf = window.requestAnimationFrame(()=>this.view.affichage(x, y, yMax, coup_ia, this.model.color));
        }
    }

}
const app = new Controller(new Model(), new View('mvc'));

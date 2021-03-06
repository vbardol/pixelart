/* 
    Scripts for apprendre-page & galery-page
*/
/* 
    Created on : déc. 2017
    Author     : Vassilina Bardol
*/

var canvas = document.getElementById("canvas-learn");
var color = 'black';


/**
 * 
 * Class Grid
 * 
 */
function Grid(wc, hc) {
    this.grid = this.init(wc, hc);
    this.wc = wc;
    this.hc = hc;
}

Grid.prototype.init = function (wc, hc) {
    var grid = [];
    for (var i = 0; i < wc; i++) {
        grid[i] = [];
        for (var j = 0; j < hc; j++) {
            grid[i][j] = null;
        }
    }

    return grid;
}

Grid.prototype.setWc = function (wc) {
    this.wc = wc;
}

Grid.prototype.setHc = function (wc) {
    this.hc = hc;
}

Grid.prototype.forEach = function (callback) {
    for (var i = 0; i < this.wc; i++) {
        for (var j = 0; j < this.hc; j++) {
            callback(this.grid[i][j], i, j);
        }
    }
};

Grid.prototype.setColor = function (color, x, y) {
    this.grid[x][y] = color;
}

Grid.prototype.getColor = function (x, y) {
    return this.grid[x][y];
}

Grid.prototype.clearColor = function (x, y) {
    this.grid[x][y] = null;
}

/**
 * 
 * Class Animation
 * 
 */

function Action(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}
var animation = [];


// Adaptation sur le resize
window.onresize = function (event) {
    adaptSize();
};


// DRAW GRID VIDE
//function adaptSize() {
//    canvas.width = canvas.parentElement.clientWidth;
//    canvas.height = canvas.width;
//    drawGrid(grid, canvas);
//}

function adaptSize() {
    canvas.width = canvas.parentElement.clientWidth;
    if (maxX == '') {
        canvas.height = canvas.width;
    } else {
        canvas.height = maxY * (canvas.width / maxX);
    }
    drawGrid(grid, canvas);
}

// DRAW PICTURE
function drawGrid(grid, canvas) {
    var context = canvas.getContext('2d');
    var cellW = canvas.width / grid.wc;
    var cellH = cellW;
    context.clearRect(0, 0, cellW * this.wc, cellH * this.hc);
    context.strokeWidth = '2';
    grid.forEach(function (cell, x, y) {
        if (cell) {
            context.fillStyle = cell;
            context.clearRect(x * cellW, y * cellH, cellW, cellH);
            context.fillRect(x * cellW, y * cellH, cellW, cellH);
        } else {
            context.strokeStyle = 'black';
            context.clearRect(x * cellW, y * cellH, cellW, cellH);
            context.strokeRect(x * cellW, y * cellH, cellW, cellH);
        }
    });
}


// VALEURS UNIQUES dans un array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


// AJAX  - RECUPERATION
function editAjax(id) { // cette fonction est declarée dans apprendre-pixelart.html.twig

    $.ajax({
        url: BASE_URL + 'api/picture/' + id, // page cible avec id récupéré via template twig
        data: 1, // les parametres
        dataType: "json", // le format des données de retour
        success: actionAjax // on lance la fonction en cas de succes de requette ajax
    }); // end $.ajax

}//end function editAjax


// ACTION AJAX
function actionAjax(responseData) {
    var obj = JSON.parse(responseData.canvas);
    animation = obj.data;
    //console.log(animation);
    init();
}

//INIT
function init(){
    
    // On récupère dans les array séparés les X, Y et les Couleurs
    var tabx = [];
    var taby = [];
    var tabColors = [];
    for (var i = 0; i < animation.length; i++) {
        tabx.push(animation[i].x);
        taby.push(animation[i].y);
        tabColors.push(animation[i].color);
    }

    // on récupère les min, les max des x et des y pour définir notre Grid
    var minX = 1 + tabx.reduce(function (a, b) {
        return Math.min(a, b);
    });
    
    maxX = minX + tabx.reduce(function (a, b) {
        return Math.max(a, b);
    });
    //console.log(maxX);

    var minY = 1 + taby.reduce(function (a, b) {
        return Math.min(a, b);
    });
    
    maxY = minY + taby.reduce(function (a, b) {
        return Math.max(a, b);
    });
    //console.log(maxY);    

    // on récupère les couleurs uniques pour les afficher à l'utilisateur
    var uniqueColor = tabColors.filter(onlyUnique);
    console.log(uniqueColor);

    // On affiche les couleurs
    for (var i = 0; i < uniqueColor.length; i++) {
        createColor(uniqueColor[i]);
    }
    
    // on dessine un grid vide
    grid = new Grid(maxX, maxY); 
    adaptSize();
}

//Zoom et dézoom
zoom = document.getElementById("zoom");
zoom.addEventListener("click", function () {
    canvas.width = 1.1 * canvas.width;
    canvas.height = 1.1 * canvas.height;
    drawGrid(grid, canvas);
})

dezoom = document.getElementById("dezoom");
dezoom.addEventListener("click", function () {
    if (canvas.width > 50) {
        canvas.width = 0.9 * canvas.width;
        canvas.height = 0.9 * canvas.height;
        drawGrid(grid, canvas);
    }
})

//VITESSE
speedOfAnimation = 2000; // valeur par default

var speedElts = document.getElementsByClassName('speed');
for (var i = 0; i < speedElts.length; i++) {
    speedElts[i].addEventListener('click', function () {
        //si l'annimation est en cours
        if (typeof (animate) !== 'undefined') {
            clearInterval(animate);// on supprime l'intervale s'il existe
            speedOfAnimation = this.getAttribute("value"); // on definit la nouvelle vitesse
            play();// on reprends l'annimation
            return;
        }
        speedOfAnimation = this.getAttribute("value");
    });
}


// PLAY
var indexAnimation = 0;
var playBtn = document.getElementById('play');
playBtn.addEventListener('click', play);

function play() {
    //console.log(speedOfAnimation);
    console.log('click');

    if (typeof (animate) !== 'undefined') { // en cas de multiple click, on supprime l'intervale s'il existe
        clearInterval(animate);
    }
    animate = setInterval(function () {
        console.log(speedOfAnimation);


        var action = animation[indexAnimation++];

        if (typeof action === 'undefined') {
            clearInterval(animate);
            return;
        }

        grid.setColor(action.color, action.x, action.y);

        drawGrid(grid, canvas);

        createStep(action.x, action.y, action.color);

    }, speedOfAnimation);
}



// PAUSE
var pauseBtn = document.getElementById('pause');
pauseBtn.addEventListener('click', function () {
    if (typeof (animate) !== 'undefined') { // on supprime l'intervale s'il existe
        clearInterval(animate);
    }
});



// REPLAY
var replayBtn = document.getElementById('replay');
replayBtn.addEventListener('click', function () {
    if (typeof (animate) !== 'undefined') { // on supprime l'intervale s'il existe
        clearInterval(animate);
    }
    document.querySelector('#steps').innerHTML = ''; // supprime les étapes
    document.querySelector('#colors').innerHTML = ''; // supprime les couleurs;
    init();
    indexAnimation = 0; // redemarre l'index d'annimation
    play(); // annimation
});



// ETAPES
function createStep(x, y, color) {

    // 1. Je crée un li vide et un span
    var li = document.createElement('li');
    var span = document.createElement('span');

    // 2. J'ajoute les classe et le style a mon span
    span.className = "glyphicon glyphicon-stop";
    span.style.color = color;

    // 3. je creer du texte
    var texte = document.createTextNode(' case : ' + (x + 1) + ' - ' + (y + 1));

    // 4. j'ajoute mon span et texte dans mon li	
    li.appendChild(span);
    li.appendChild(texte);

    // 5. je selectionne un ul existant
    var ul = document.querySelector('#steps');

    // 6. j'ajoute mon span dans li et li dans ul
    ul.appendChild(li);
}



// PALETTE
function createColor(color) {

    // 1. Je crée un li vide et un span
    var li = document.createElement('li');
    var span = document.createElement('span');

    // 2. J'ajoute les classe et le style a mon span
    span.className = "glyphicon glyphicon-stop";
    span.style.color = color;

    // 3. je selectionne un ul existant
    var ul = document.querySelector('#colors');
    

    // 4. j'ajoute mon span dans li et li dans ul
    li.appendChild(span);
    ul.appendChild(li);
}

// SIDEBAR display on scroll
$(document).ready(function(){
    // Condition d'affichage du bouton
    $(window).scroll(function(){
        if ($(this).scrollTop() > 50){
            $('#shareList').fadeIn();
        }
        else{
            $('#shareList').fadeOut();
        }
    });
});

document.querySelectorAll('.speed').forEach(function (element) {
    //console.log(element);
    element.addEventListener('click', function () {

        // On supprime la classe .active-btn sur tous les elements
        document.querySelectorAll('.speed').forEach(function (e) {
            e.classList.remove("active-btn-sideNav");
        });

        // On ajoute la classe  sur l'element cliqué
        this.classList.add("active-btn-sideNav");

    }); // end addEventListener'click'
}); // end forEach

document.querySelectorAll('.sideNav').forEach(function (element) {
    //console.log(element);
    element.addEventListener('click', function () {

        // On supprime la classe .active-btn sur tous les elements
        document.querySelectorAll('.sideNav').forEach(function (e) {
            e.classList.remove("active-btn-sideNav");
        });

        // On ajoute la classe  sur l'element cliqué
        this.classList.add("active-btn-sideNav");

    }); // end addEventListener'click'
}); // end forEach

document.querySelectorAll('.zoom').forEach(function (element) {
    //console.log(element);
    element.addEventListener('click', function () {

        // On supprime la classe .active-btn sur tous les elements
        document.querySelectorAll('.zoom').forEach(function (e) {
            e.classList.remove("active-btn-sideNav");
        });

        // On ajoute la classe  sur l'element cliqué
        this.classList.add("active-btn-sideNav");

    }); // end addEventListener'click'
}); // end forEach




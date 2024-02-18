//initializes global elements
var stage = document.getElementById('stage');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

//sets width and height of canvas to that of the stage
canvas.setAttribute('width', stage.clientWidth);
canvas.setAttribute('height', stage.clientHeight);

const colors = ['#fefefe', '#a3fea3', '#fea3a3', '#a3a3fe', '#ffcf93', '#fefea3']
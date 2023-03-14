//jshint esversion:6


// Using Nodejs Native Modules
const fs = require('fs');
// console.log(fs);
// fs.copyFileSync('file1.txt' , 'file2.txt');


// Using Nodejs External Modules
const superheroes = require('superheroes');
let superHero = superheroes.random();


// CHALLENGE
const supervillains = require('supervillains');
let superVillain = supervillains.random();
console.log(superVillain);


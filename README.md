<h1 align="center" style="color:#FF0"> 2048<h1>

## The Game

2048 is a puzzle game created in 2014 by Gabriele Cirulli. The objective of the game is to reach the tile with number 2048.

The game is played in a 4x4 grid, where each cell of this grid is a tile containing a power of two number. The player can move the tiles in one of the four directions - UP, DOWN, LEFT and RIGHT - using the keyboard arrow keys.

The tiles will move as far as they can, being stopped by another tile or the board edge. If one tile bumps to another with the same number, they will combine into one, where their sum will be the new tile number. The tile can merge only once each turn.

Everytime that a legal move is played, (i.e., at least one tile moves), a new tile is created. This new tile has a 90% chance of being numbered with two(2) and 10% chance of being numbered with four(4).

The game is over when you have no legal moves left.

## Objective

As a programming teacher, I think that the best way to learn how to code is working on projects that have a clear goal.

Games are a really good way of doing that, they are fun and challenging, allowing to quickly visualize what is happening and really **see** a polished and ready product.

## Programming and To-dos

The logic used to replicate the game was quite easy to come up with and worked perfectly so far. The real challenge was to implement the animations in an easy way, and I actually don't know if I managed to do that.

For now it's working and I will leave as it is so I can work on finishing the remaining details.

Some of the stuff that I still need to code are

* Creation of new tiles only when a move is successfully made
* Create a score
* Create buttons to start the game
* Create a game-over overlay
* Create a winning overlay

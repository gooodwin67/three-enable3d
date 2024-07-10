
import { PhysicsLoader } from "@enable3d/ammo-physics";
import { Project, Scene3D } from "enable3d";
import * as THREE from "three";


export class PhysicsTest extends Scene3D {
  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async create() {
    this.warpSpeed('-ground').then(() => {
    });

    // console.log(this);

    //this.physics.debug?.enable();


    this.camera.position.set(-30, 37, 0);

    let ground = this.physics.add.box({ name: 'ground', x: 0, y: -1, z: 0, width: 42, height: 1, depth: 42, mass: 10 }, { lambert: { color: 'white' } })
    ground.body.setBounciness(1.2);
    ground.body.setCollisionFlags(2)

    let wall1 = this.physics.add.box({ name: 'wall', x: 0, y: 4, z: 20, width: 42, height: 25, depth: 0.2, mass: 10 }, { lambert: { color: 'white', opacity: 0.1, transparent: true } })
    wall1.body.setBounciness(1.5);
    wall1.body.setCollisionFlags(2)
    let wall2 = this.physics.add.box({ name: 'wall', x: 0, y: 4, z: -20, width: 42, height: 25, depth: 0.2, mass: 10 }, { lambert: { color: 'white', opacity: 0.1, transparent: true } })
    wall2.body.setBounciness(1.5);
    wall2.body.setCollisionFlags(2)
    let wall3 = this.physics.add.box({ name: 'wall', x: 20, y: 4, z: 0, width: 0.2, height: 25, depth: 42, mass: 10 }, { lambert: { color: 'white', opacity: 0.1, transparent: true } })
    wall3.body.setBounciness(1.5);
    wall3.body.setCollisionFlags(2)
    let wall4 = this.physics.add.box({ name: 'wall', x: -20, y: 4, z: 0, width: 0.2, height: 25, depth: 42, mass: 10 }, { lambert: { color: 'white', opacity: 0.1, transparent: true } })
    wall4.body.setBounciness(1.5);
    wall4.body.setCollisionFlags(2)

    net = this.physics.add.box({ name: 'net', x: 0, y: 1, z: 0, width: 42, height: 5, depth: 0.2, mass: 10 }, { lambert: { color: 'white', opacity: 0.5, transparent: true } })
    net.body.setBounciness(1.5);
    net.body.setCollisionFlags(1)


    ball = this.physics.add.sphere({ name: 'ball', y: 5, z: 5 }, { lambert: { color: 'green' } })

    ball.body.setBounciness(1);
    ball.body.applyForceX(0);
    ball.body.applyForceY(5.9);
    ball.body.applyForceZ(0);


    player = this.physics.add.box({ name: 'player', y: 0, z: 10, width: 3, depth: 3, mass: 10 }, { lambert: { color: 'blue' } })

    player.body.setCollisionFlags(2)
    //player.body.setBounciness(1.4)
    //player.body.setRestitution(2)

    this.camera.lookAt(net.position);


    player2 = this.physics.add.box({ name: 'player2', y: 0, z: -10, width: 3, depth: 3, mass: 10 }, { lambert: { color: 'red' } })
    player2.body.setCollisionFlags(2);

    player.body.on.collision((otherObject, event) => {
      if (otherObject.name == 'ball') {
        if (event == 'end') {
          playerBallCollisions = false
        }
        else if (event == 'start') {
          playerBallCollisions = true
        }
      }
    })
    player2.body.on.collision((otherObject, event) => {
      if (otherObject.name == 'ball') {
        if (event == 'end') {
          player2BallCollisions = false
        }
        else if (event == 'start') {
          player2BallCollisions = true
        }
      }
    })






    setupEventHandlers();




  }





  update() {
    //console.log(playerShoot);

    if (playerBallCollisions && playerShoot) {
      playerBallCollisions = false;
      ball.body.applyForceY(10.9);
      ball.body.applyForceZ(-7);
    }
    if (player2BallCollisions) {
      console.log(123123)
      player2BallCollisions = false;
      ball.body.applyForceY(10.9);
      ball.body.applyForceZ(7);
    }

    if (player2.position.x < ball.position.x) {
      player2.position.x += 0.1;
      player2.body.needUpdate = true;
    }
    else if (player2.position.x > ball.position.x) {
      player2.position.x -= 0.1;
      player2.body.needUpdate = true;
    }
    if (player2.position.z < ball.position.z && ball.position.z < net.position.z) {
      player2.position.z += 0.1;
      player2.body.needUpdate = true;
    }
    else if (player2.position.z > ball.position.z && ball.position.z < net.position.z) {
      player2.position.z -= 0.1;
      player2.body.needUpdate = true;
    }

    movePlayer();



  }
}

const config = { scenes: [PhysicsTest], antialias: true }
PhysicsLoader('/ammo', () => new Project(config));

let ball;
let player;
let player2;
let ballJump = false;
let net;

let playerBallCollisions = false;
let playerShoot = false;
let player2BallCollisions = false;
let player2Shoot = false;

function setupEventHandlers() {

  window.addEventListener('keydown', handleKeyDown, false);
  window.addEventListener('keyup', handleKeyUp, false);

}

let moveDirection = { left: 0, right: 0, forward: 0, back: 0, space: 0, shoot: 0 }

function handleKeyDown(event) {

  let keyCode = event.keyCode;

  switch (keyCode) {

    case 87: //W: FORWARD
      moveDirection.forward = 1
      break;

    case 83: //S: BACK
      moveDirection.back = 1
      break;

    case 65: //A: LEFT
      moveDirection.left = 1
      break;

    case 68: //D: RIGHT
      moveDirection.right = 1
      break;

    case 32: //Пробел
      moveDirection.space = 1
      break;

    case 70: //F
      moveDirection.shoot = 1
      break;

  }
}


function handleKeyUp(event) {
  let keyCode = event.keyCode;

  switch (keyCode) {
    case 87: //FORWARD
      moveDirection.forward = 0
      break;

    case 83: //BACK
      moveDirection.back = 0
      break;

    case 65: //LEFT
      moveDirection.left = 0
      break;

    case 68: //RIGHT
      moveDirection.right = 0
      break;
    case 32: //Пробел
      moveDirection.space = 0
      break;

    case 70: //F
      moveDirection.shoot = 0
      break;

  }

}

function movePlayer() {
  if (moveDirection.forward == 1) {
    player.position.x += 0.2;
    player.body.needUpdate = true
  }
  else if (moveDirection.back == 1) {
    player.position.x -= 0.2;
    player.body.needUpdate = true
  }
  else {
    player.position.x += 0;
    player.body.needUpdate = true
  }

  if (moveDirection.left == 1) {
    player.position.z -= 0.2;
    player.body.needUpdate = true
  }
  else if (moveDirection.right == 1) {
    player.position.z += 0.2;
    player.body.needUpdate = true
  }
  else {
    player.position.z += 0;
    player.body.needUpdate = true
  }

  if (moveDirection.space == 1) {
    player.position.y += 0.1;
    player.body.needUpdate = true

  }

  if (moveDirection.shoot == 1) {
    if (!playerShoot) {
      playerShoot = true;
      setTimeout(() => {
        playerShoot = false;
      }, 1000)
    }
  }
}
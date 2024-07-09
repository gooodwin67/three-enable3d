
import { PhysicsLoader } from "@enable3d/ammo-physics";
import { Project, Scene3D } from "enable3d";
import * as THREE from "three";

export class PhysicsTest extends Scene3D {
  async init() {
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async create() {
    this.warpSpeed();



    this.camera.position.set(10, 10, 10);

    sphere1 = this.physics.add.sphere({ y: 5, z: -3 }, { lambert: { color: 'red' } })

    sphere1.body.setBounciness(0.6);
    sphere1.body.applyForceX(0);
    sphere1.body.applyForceY(5.9);
    sphere1.body.applyForceZ(0);

    plane = this.physics.add.box({ y: 0, z: -3.2 }, { lambert: { color: 'red' } })


    setupEventHandlers();




  }

  update() {
    if (moveDirection.forward == 1) {
      sphere1.body.setVelocityX(10);
    }
    else if (moveDirection.back == 1) {
      sphere1.body.setVelocityX(-10);
    }
    else {
      sphere1.body.setVelocityX(0);
    }

    if (moveDirection.space == 1) {
      sphere1.body.applyForceY(0.5);
      ballJump = false;
    }

    // physics.add.collider(sphere1, redBox, event => {
    //   console.log(`blueBox and redBox: ${event}`)
    // })


  }
}

const config = { scenes: [PhysicsTest], antialias: true }
PhysicsLoader('/ammo', () => new Project(config));

let sphere1;
let plane;
let ballJump = false;

function setupEventHandlers() {

  window.addEventListener('keydown', handleKeyDown, false);
  window.addEventListener('keyup', handleKeyUp, false);

}

let moveDirection = { left: 0, right: 0, forward: 0, back: 0, space: 0 }

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

  }

}
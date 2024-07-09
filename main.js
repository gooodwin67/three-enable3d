import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from "three/addons/controls/OrbitControls";



let scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0xffffff);
//scene.background = new THREE.Color("white");

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff)
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
let stats = new Stats();
document.body.appendChild(stats.dom);

let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 300, 500);
//camera.lookAt(0,0,0);

//var ambient = new THREE.AmbientLight( 0x404040);
var ambient = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(ambient)

// let light = new THREE.PointLight(0xffffff, 1);
// light.position.set(50, 20, 0);
// light.penumbra = 1;
// light.power = 20;
// light.decay = 2;
// light.distance = 100;
//scene.add(light);



let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 5, 0);
var keyboard = new THREEx.KeyboardState();


let clock = new THREE.Clock();


//-------------------//


let physicsWorld;
let rigidBodies = [];
let tmpTrans;

let ballObject;



//-------------------//


function setupPhysicsWorld() {
  let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  physicsWorld.setGravity(new Ammo.btVector3(0, -80, 0));

}


//-------------------//


function createBlock() {
  let pos = { x: 0, y: 0, z: 0 };
  let scale = { x: 200, y: 2, z: 300 };
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 0;

  //threeJS Section
  let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0xa0afa4 }));
  blockPlane.position.set(pos.x, pos.y, pos.z);
  blockPlane.scale.set(scale.x, scale.y, scale.z);
  scene.add(blockPlane);

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btBoxShape(new Ammo.btVector3(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5));
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  body.setFriction(4);
  body.setRollingFriction(10);

  physicsWorld.addRigidBody(body);
}


//-------------------//


function createBall() {
  let pos = { x: 0, y: 40, z: 100 };
  let radius = 4;
  let quat = { x: 0, y: 0, z: 0, w: 1 };
  let mass = 1;

  //threeJS Section
  let ball = ballObject = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({ color: 0xff0505 }));
  ball.position.set(pos.x, pos.y, pos.z);
  scene.add(ball);

  //Ammojs Section
  let transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
  let motionState = new Ammo.btDefaultMotionState(transform);

  let colShape = new Ammo.btSphereShape(radius);
  colShape.setMargin(0.05);

  let localInertia = new Ammo.btVector3(0, 0, 0);
  colShape.calculateLocalInertia(mass, localInertia);

  let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
  let body = new Ammo.btRigidBody(rbInfo);

  body.setFriction(4);
  body.setRollingFriction(10);

  physicsWorld.addRigidBody(body);

  ball.userData.physicsBody = body;
  rigidBodies.push(ball);
}


//-------------------//


function updatePhysics(deltaTime) {
  // Step world
  physicsWorld.stepSimulation(deltaTime, 10);

  // Update rigid bodies
  for (let i = 0; i < rigidBodies.length; i++) {
    let objThree = rigidBodies[i];
    let objAmmo = objThree.userData.physicsBody;
    let ms = objAmmo.getMotionState();
    if (ms) {
      ms.getWorldTransform(tmpTrans);
      let p = tmpTrans.getOrigin();
      let q = tmpTrans.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}


//-------------------//


function init() {

  createBlock();
  createBall();

};


//-------------------//


Ammo().then(AmmoStart);

function AmmoStart() {

  tmpTrans = new Ammo.btTransform();
  setupPhysicsWorld();

  init();

  renderer.setAnimationLoop((_) => {

    let deltaTime = clock.getDelta();
    updatePhysics(deltaTime);

    controls.update();
    stats.update();
    renderer.render(scene, camera);
  });
}
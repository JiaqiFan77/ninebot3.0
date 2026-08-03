
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";

const canvas=document.querySelector("#webgl");
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x000000);

const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
camera.position.z=7;

const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));

const group=new THREE.Group();
scene.add(group);

const files=[
"cover01.jpg","cover02.jpg","cover03.jpg",
"cover04.jpg","cover05.jpg","cover06.jpg"
];

const loader=new THREE.TextureLoader();
const cards=[];

const positions=[
[-1.7,.8,0],[-.9,.45,.1],[-.1,.15,.2],
[.7,-.1,.3],[-.7,-.8,.4],[.8,-.65,.5]
];

files.forEach((file,i)=>{
 loader.load("images/"+file,(texture)=>{

   const ratio=texture.image.width/texture.image.height;

   const height=2.8;
   const width=height*ratio;

   const geo=new THREE.BoxGeometry(width,height,.035);

   const mat=new THREE.MeshBasicMaterial({
     map:texture
   });

   const mesh=new THREE.Mesh(geo,mat);

   mesh.position.set(
    positions[i][0],
    positions[i][1],
    positions[i][2]
   );

   mesh.rotation.z=i%2?0.04:-0.04;
   mesh.userData.issue=i+1;

   group.add(mesh);
   cards.push(mesh);

 });
});

const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

window.addEventListener("click",e=>{
 mouse.x=e.clientX/innerWidth*2-1;
 mouse.y=-(e.clientY/innerHeight*2-1);

 raycaster.setFromCamera(mouse,camera);

 const hit=raycaster.intersectObjects(cards);

 if(hit.length && hit[0].object.userData.issue===6){
   location.href="issue6.html";
 }
});

function animate(){
 requestAnimationFrame(animate);
 group.rotation.y*=.99;
 renderer.render(scene,camera);
}
animate();

addEventListener("resize",()=>{
 camera.aspect=innerWidth/innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize(innerWidth,innerHeight);
});

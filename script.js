import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";


const canvas=document.querySelector("#webgl");


const scene=new THREE.Scene();

scene.background=
new THREE.Color(0x000000);



const camera=
new THREE.PerspectiveCamera(
45,
innerWidth/innerHeight,
0.1,
100
);


camera.position.z=7;



const renderer=
new THREE.WebGLRenderer({
canvas,
antialias:true
});


renderer.setSize(
innerWidth,
innerHeight
);


renderer.setPixelRatio(
Math.min(devicePixelRatio,2)
);



const group=new THREE.Group();

scene.add(group);



const files=[
"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"
];



const positions=[

[-1.7,.8,0],
[-.9,.45,.1],
[-.1,.15,.2],
[.7,-.1,.3],
[-.7,-.8,.4],
[.8,-.65,.5]

];



const loader=
new THREE.TextureLoader();


const cards=[];


const startPositions=[];


let selected=null;



let loaded=0;

let ready=false;



files.forEach((file,index)=>{


loader.load(
"images/"+file,

(texture)=>{


const ratio=
texture.image.width /
texture.image.height;



const height=2.8;

const width=
height*ratio;



const geometry=
new THREE.BoxGeometry(
width,
height,
0.035
);



const material=
new THREE.MeshBasicMaterial({

map:texture,

transparent:true,

opacity:0

});



const mesh=
new THREE.Mesh(
geometry,
material
);



const finalPosition=
new THREE.Vector3(
positions[index][0],
positions[index][1],
positions[index][2]
);



mesh.position.copy(
finalPosition
);


mesh.position.z-=3;



mesh.rotation.z=
index%2?0.04:-0.04;



mesh.scale.set(
0.75,
0.75,
0.75
);



mesh.userData={

issue:index+1,

finalPosition

};



group.add(mesh);


cards.push(mesh);


loaded++;


if(loaded===files.length){

ready=true;

startTime=
performance.now();

}


}

);


});



let startTime=0;



// --------------------
// mouse hover
// --------------------

const raycaster=
new THREE.Raycaster();


const mouse=
new THREE.Vector2();


let hover=null;



window.addEventListener(
"mousemove",
(e)=>{


mouse.x=
e.clientX/innerWidth*2-1;


mouse.y=
-(e.clientY/innerHeight*2-1);



raycaster.setFromCamera(
mouse,
camera
);



const hit=
raycaster.intersectObjects(
cards
);



hover=
hit.length?
hit[0].object:
null;


});





// --------------------
// click
// --------------------

window.addEventListener(
"click",
()=>{


if(!hover)
return;



if(selected===hover){


if(
hover.userData.issue===6
){

location.href=
"issue6.html";

}


return;


}



selected=hover;



cards.forEach(card=>{


if(card!==selected){

card.material.opacity=0.25;

}


});



});






const clock=
new THREE.Clock();



function animate(){


requestAnimationFrame(
animate
);



const t=
clock.getElapsedTime();




// --------------------
// entrance
// --------------------


if(ready){


const elapsed=
(performance.now()-startTime)/1000;



cards.forEach(
(card,index)=>{


const delay=
index*0.18;


const progress=
Math.min(
1,
Math.max(
0,
(elapsed-delay)/1.2
)
);



const ease=
1-
Math.pow(
1-progress,
3
);



card.position.z=
THREE.MathUtils.lerp(
card.position.z,
card.userData.finalPosition.z,
0.08
);



card.position.x=
THREE.MathUtils.lerp(
card.position.x,
card.userData.finalPosition.x,
0.08
);



card.position.y=
THREE.MathUtils.lerp(
card.position.y,
card.userData.finalPosition.y,
0.08
);



card.material.opacity=
ease;



card.scale.lerp(
new THREE.Vector3(1,1,1),
0.08
);



});


}



// --------------------
// hover
// --------------------


cards.forEach(card=>{


let target=1;


if(card===hover){

target=1.08;

}


if(card===selected){

target=1.18;

}



card.scale.lerp(
new THREE.Vector3(
target,
target,
target
),
0.12
);


});




// --------------------
// floating
// --------------------


group.position.y=
Math.sin(t*0.8)*0.05;


group.rotation.y=
Math.sin(t*0.25)*0.025;



renderer.render(
scene,
camera
);


}



animate();





window.addEventListener(
"resize",
()=>{


camera.aspect=
innerWidth/
innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
innerWidth,
innerHeight
);


});

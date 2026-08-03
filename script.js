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


let loaded=0;


let startAnimation=false;


let selected=null;




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

map:texture

});



const mesh=
new THREE.Mesh(
geometry,
material
);



mesh.position.set(

positions[index][0],

positions[index][1],

positions[index][2]-3

);



mesh.rotation.z=
index%2?0.04:-0.04;



mesh.scale.set(
0,0,0
);



mesh.userData={

issue:index+1,

originZ:positions[index][2]

};



group.add(mesh);


cards.push(mesh);



loaded++;



if(loaded===files.length){

startAnimation=true;

}


}

);


});





// 点击检测

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
raycaster.intersectObjects(cards);



hover=
hit.length?
hit[0].object:
null;


});





window.addEventListener(
"click",
()=>{


if(!hover)
return;



if(selected===hover){


if(hover.userData.issue===6){

location.href=
"issue6.html";

}


return;

}



selected=hover;



hover.position.z+=1.5;


hover.scale.set(
1.18,
1.18,
1.18
);



});







const clock=
new THREE.Clock();



function animate(){


requestAnimationFrame(
animate
);



const t=
clock.getElapsedTime();



if(startAnimation){



cards.forEach(
(card,index)=>{


const delay=index*0.18;


const p=
Math.min(
1,
Math.max(
0,
(t-delay)/1
)
);



const ease=
1-Math.pow(
1-p,
3
);



card.scale.setScalar(
ease
);



card.position.z=
card.userData.originZ
-
3+
ease*3;



});



}




// 持续漂浮

group.position.y=
Math.sin(t*0.8)*0.05;


group.rotation.y=
Math.sin(t*0.25)*0.03;



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

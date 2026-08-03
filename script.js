import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js";


const canvas=document.querySelector("#webgl");

const scene=new THREE.Scene();

scene.background=
new THREE.Color(0x000000);



const camera=
new THREE.PerspectiveCamera(
45,
innerWidth/innerHeight,
.1,
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



const group=
new THREE.Group();

scene.add(group);



const files=[
"cover01.jpg",
"cover02.jpg",
"cover03.jpg",
"cover04.jpg",
"cover05.jpg",
"cover06.jpg"
];



const loader=
new THREE.TextureLoader();


const cards=[];



const positions=[

[-1.7,.8,0],
[-.9,.45,.1],
[-.1,.15,.2],
[.7,-.1,.3],
[-.7,-.8,.4],
[.8,-.65,.5]

];




// 创建杂志

files.forEach((file,i)=>{


loader.load(
"images/"+file,
(texture)=>{


texture.colorSpace=
THREE.SRGBColorSpace;



// 保持真实比例

const ratio=
texture.image.width /
texture.image.height;



const height=2.8;

const width=
height*ratio;



const geo=
new THREE.BoxGeometry(
width,
height,
0.035
);



const mat=
new THREE.MeshBasicMaterial({

map:texture

});



const mesh=
new THREE.Mesh(
geo,
mat
);



// 初始动画位置

mesh.position.set(

positions[i][0],

positions[i][1],

positions[i][2]-2

);



mesh.rotation.z=
i%2?0.04:-0.04;



mesh.scale.set(
0.01,
0.01,
0.01
);



mesh.userData={

issue:i+1,

index:i,

show:true

};



group.add(mesh);


cards.push(mesh);



}

);


});





// ====================
// 鼠标检测
// ====================


const raycaster=
new THREE.Raycaster();


const mouse=
new THREE.Vector2();


let hoverCard=null;

let selected=null;



window.addEventListener(
"mousemove",
e=>{


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



cards.forEach(card=>{


if(card!==selected){

card.scale.lerp(
new THREE.Vector3(1,1,1),
0.15
);

}


});



if(hit.length){

hoverCard=
hit[0].object;


if(hoverCard!==selected){


hoverCard.scale.lerp(
new THREE.Vector3(1.08,1.08,1.08),
0.15
);


}


}
else{

hoverCard=null;

}



});





// ====================
// 点击抽出
// ====================


window.addEventListener(
"click",
()=>{


if(!hoverCard)
return;



const card=
hoverCard;



// 已经抽出

if(selected===card){


if(card.userData.issue===6){


setTimeout(()=>{

location.href=
"issue6.html";


},700);


}


return;

}



selected=card;



cards.forEach(item=>{


if(item!==card){

item.material.opacity=.25;

}


});



// 向前跳出

card.position.z+=1.5;


card.scale.set(
1.18,
1.18,
1.18
);



});





// ====================
// 动画
// ====================


const clock=
new THREE.Clock();



function animate(){


requestAnimationFrame(
animate
);



const t=
clock.getElapsedTime();



// 出场动画

cards.forEach(
(card,index)=>{


const delay=
index*0.18;


const progress=
Math.min(
1,
Math.max(
0,
(t-delay)/1.2
)
);



const ease=
1-Math.pow(
1-progress,
3
);



if(progress>0){


card.scale.setScalar(
ease
);


card.position.z=
positions[index][2]
-2+
ease*2;


}


});




// 持续漂浮

group.position.y=
Math.sin(t*0.8)
*
0.04;



group.rotation.y=
Math.sin(t*0.2)
*
0.025;




renderer.render(
scene,
camera
);


}



animate();





// ====================
// resize
// ====================


addEventListener(
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

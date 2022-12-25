
function webglAvailable() {
	//return false;
    try {
        var canvas = document.createElement("canvas");
        return !!
            window.WebGLRenderingContext && 
            (canvas.getContext("webgl") || 
                canvas.getContext("experimental-webgl"));
    } catch(e) { 
        return false;
    }
}

function animate(mainId) {
	
	if(!isScrolling && !isResizing && isRendering) {
		
		delta = clock.getDelta();
		if(delta > 0.2)
			delta = 0.2;
	
	
		DotParticles.rotation.x += delta/30;
		//particles.material.opacity = delta*40 % 1;
		
		targetmove = mousex - initialmouse;
		currentmove += (targetmove - currentmove)/20;
		
		
		cameraangle = 90+currentmove/20;
		camera.position.x = Math.cos(cameraangle *Math.PI/180) *1000
		camera.position.z = Math.sin(cameraangle *Math.PI/180) *1000;
		camera.lookAt(new THREE.Vector3(0,0,-5000));

		if(loadClouds == -1) {
			loadClouds = -0.5;
			setTimeout(function(){
				for ( i = 0; i < Clouds.length; i ++ ) {
					Clouds[i].mesh.position.y +=3000;
				}
				loadClouds = 0;
			},100);
		}

		// change clouds 
		for ( i = 0; i < Clouds.length; i ++ ) {
			Clouds[i].mesh.rotation.z+=delta*Clouds[i].rot/5;
			
			if(mousey <= 150) {
				Clouds[i].mesh.material.opacity = 1;
				Clouds[i].mesh.material.color.setRGB(1,1,1);
			}
			else if(mousey <= 300) {
				Clouds[i].mesh.material.opacity = 1;
				Clouds[i].mesh.material.color.setRGB(
					(255)/256, // 255
					((300-mousey)*2/3+150)/256, // 250 - 150
					((300-mousey)*4/3+55)/256); // 255 - 55
			}
			else if(mousey <= 600) {
				Clouds[i].mesh.material.opacity = 1-((mousey-300)/300)*0.6;				
				Clouds[i].mesh.material.color.setRGB(
					((600-mousey)*230/300+25)/256, // 255 - 25
					((600-mousey)*125/300+25)/256, // 255 - 25
					((600-mousey)*30/300+25)/256); // 255 - 25
			}
			else {
				Clouds[i].mesh.material.opacity = 0.4;
				Clouds[i].mesh.material.color.setRGB(0.1,0.1,0.1);				
			}


		}

		if(loadClouds >= 0 && loadClouds < 1.1) {

			//opacity = 1-Math.sqrt(1-loadClouds);
			opacity = loadClouds-0.1;
			if(opacity < 0) opacity = 0;

			for ( i = 0; i < Clouds.length; i ++ ) {
				if(opacity < Clouds[i].mesh.material.opacity)
				Clouds[i].mesh.material.opacity = opacity;
			}
			
			loadClouds += delta/5;
			if(loadClouds > 1.1) loadClouds = 1.1;


		}
		
		// change stars
		if(mousey <= 300) {
			DotParticles.material.opacity = 0;
		}
		else if(mousey <= 600) {			
			DotParticles.material.opacity = (mousey-300)/300;
		}
		else
			DotParticles.material.opacity = 1;
			
			
		
		
		if(mousey < 0) {
			jQuery("#sunset").css("opacity",0);
			jQuery("#"+mainId).css("background", "#4584b4");
			
		}
		else if(mousey <= 300) {
			jQuery("#sunset").css("opacity", mousey/300);
			jQuery("#"+mainId).css("background", "#4584b4");
			
		}
		else if(mousey <= 600) {
			jQuery("#sunset").css("opacity", (600-mousey)/300);
			jQuery("#"+mainId).css("backgroundColor", "#151a2b");
			
			
		}
		else {
			jQuery("#sunset").css("opacity", 0);
			jQuery("#"+mainId).css("background", "#151a2b");
		}
		
		
		if(mousey < 200) {
			jQuery(".bannercontent1").css("opacity",1);
			jQuery(".bannercontent2").css("opacity",0);			
		}		
		else if(mousey <= 600) {
			jQuery(".bannercontent1").css("opacity",1- (mousey-200)/400);
			jQuery(".bannercontent2").css("opacity",(mousey-200)/400);			
		}
		else {
			jQuery(".bannercontent1").css("opacity",0);
			jQuery(".bannercontent2").css("opacity",1);			
		}
		
		// RENDER
		render();


	}

		if (typeof requestAnimationFrame === "function") {
			requestAnimationFrame(function () {
				animate(mainId);
			});
		}

	
	
}


function render() {
	renderer.render( scene, camera );
}



function onWindowResize(mainId,xheight) {

	
		isRendering = true;
		jQuery("#threeD").show();
	

		height = xheight;
		
	

	
	jQuery("#"+mainId).height(height);
	
	if(typeof camera != "undefined") {
		camera.aspect = window.innerWidth / height;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, height );
		render();
	}
	
	

}

 
function onDocumentMouseMove( event ) {
	
	
	mousex = event.clientX;
	if(initialmouse === false)
		initialmouse = mousex;
	offset = jQuery("#threeD").offset();
	mousey = event.clientY - offset.top + jQuery(window).scrollTop();
}



jQuery(document).on("scrollstart",function() {
   isScrolling = true;	  
}); 
jQuery(document).on("scrollstop",function() {
   isScrolling = false;
}); 

jQuery(document).on("resizestart",function() {
   isResizing = true;
}); 
jQuery(document).on("resizestop",function() {
   isResizing = false;
}); 

if(webglAvailable()) {
	
	webglAvailable = 1;
	
	jQuery(".bannercontent2").css("display","block");
	
	// SET CAMEREA
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth/600, 200, 20000);
	cameraangle = 30;
	
	camera.position.set(0,1900,1000);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(0,1900,0));

	// SET SCENE
	var scene = new THREE.Scene();
	scene.fog=new THREE.Fog( 0x4584B4, 0.01, 5000 );

	
	// Dots	
	Dotgeometry = new THREE.Geometry();	
	for ( i = 0; i < 1000; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 6000 - 3000;
		radius = Math.random() * 3000 + 500;
		angle = Math.random() * 2 * Math.PI;
		
		while(Math.abs(vertex.x) < 200 && radius > 1800 && radius < 2200)
			radius += 400;
			
		vertex.y = Math.sin(angle)*radius;
		vertex.z = Math.cos(angle)*radius;

		Dotgeometry.vertices.push( vertex );
	}
	
	Dotmaterial = new THREE.PointCloudMaterial( { size: 16, map: THREE.ImageUtils.loadTexture( imgurl+"/particle.png" ), blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
	Dotmaterial.color.setHSL( 1, 1, 1 );

	DotParticles = new THREE.PointCloud( Dotgeometry, Dotmaterial );
	scene.add( DotParticles );
	
	// Clouds
	var Clouds = new Array();
	var CloudBases = new Array();
	for ( i = 0; i < 2; i ++ ) {
		posx = Math.random()*1500-1500;
		posy = Math.random()*750+1000-3000;
		posz = Math.random()*1000-1000;
		
		CloudBases[i] = [posx,posy,posz];
	}
	for ( i = 2; i < 4; i ++ ) {
		posx = Math.random()*1500;
		posy = Math.random()*750+1000-3000;
		posz = Math.random()*1000-1000;
		
		CloudBases[i] = [posx,posy,posz];
	}
	for ( i = 4; i < 6; i ++ ) {
		posx = Math.random()*3000-1500;
		posy = Math.random()*750+1000-3000;
		posz = Math.random()*1000-1000;
		
		CloudBases[i] = [posx,posy,posz];
	}
	
	for ( i = 0; i < 100; i ++ ) {

		size = Math.random()*500+250;
		var Cloudgeometry = new THREE.PlaneGeometry(size,size);
		var Cloudmaterial = new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture(imgurl+'/cloud.png'), transparent : true, color:0xffffff, side:THREE.BackSide, vertexColors: THREE.FaceColors, depthWrite: false, 
depthTest: false } );		
		//Cloudmaterial.map.needsUpdate = true; //ADDED
		
		var Cloud = new THREE.Mesh(Cloudgeometry,Cloudmaterial);
		Cloud.overdraw = true;

		// pick a base
		base = CloudBases[Math.floor(Math.random()*CloudBases.length)];
		posx = base[0]+Math.random()*600-300;
		posy = base[1]+Math.random()*600-300;
		posz = base[2]+Math.random()*600-300;
		
		
		Cloud.position.x = posx;
		Cloud.position.y = posy;
		Cloud.position.z = posz;
		
		Cloud.rotation.z = Math.random()* Math.PI*2;
		Cloud.rotation.x = -Math.PI*2/360*15;
		Cloud.rotation.y = Math.PI;
		
		Clouds[i] = {
			mesh: Cloud,
			x: posx,
			y: posy,
			z: posz,
			rot: Math.random()-0.5,
		};
		scene.add(Clouds[i].mesh);
		
		
	}
	
	
	
	// CREATE RENDERER	
	var renderer = webglAvailable ? new THREE.WebGLRenderer({ alpha: true, antialias: true}) : new THREE.CanvasRenderer({ alpha: true, antialias: true });
	
	renderer.setSize(jQuery("body").width(), 600);
	renderer.setClearColor( 0x000000, 0 );
	document.getElementById("threeD").appendChild(renderer.domElement);

	clock = new THREE.Clock();
	
	var mousex = 0;
	var mousey = 0;
	var currentmove = 0;
	var initialmouse = false;
	var isScrolling = false;
	var isResizing = false;
	var isRendering = false;
	var loadClouds = -1;
	intit_cloud();
}
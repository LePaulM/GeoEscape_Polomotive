var marker;
var layerGroup;
var map;

var p;

var obj_array;
var iterateur = 0;

var outil = false;
var correct_code;
/**
 * IDEES
 * 
 * un indice pour chaque objet à récupérer 
 * stocké dans la bdd
 * une div "INDICE" avec un bouton, et si tu clique sur le bouton ça te montre l'indice dans la div
 * 
 * ajout d'une description courte pour l'image dans l'inventaire
 * 
 */


window.onload = function() {
    /**
     * mode corresponde à la façon dont on va découvrir l'objet
     */
    obj_array = [[]];

    // pour accéder à une des variables :
    // console.log(object.lat);

    /***************            Request to database             ***************/
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        myFunction(this);
        }
    };
    xhttp.open("GET", "db.xml", true);
    xhttp.send();

    function myFunction(xml) {
        var i;
        var xmlDoc = xml.responseXML;

        var x = xmlDoc.getElementsByTagName("OBJ");
        for (i = 0; i <x.length; i++) {

            var objet = {
                id:parseInt(x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue),
                name:x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue,
                img:x[i].getElementsByTagName("IMG")[0].childNodes[0].nodeValue,
                lat:parseFloat(x[i].getElementsByTagName("LAT")[0].childNodes[0].nodeValue),
                lng:parseFloat(x[i].getElementsByTagName("LNG")[0].childNodes[0].nodeValue),
                minZoom:parseInt(x[i].getElementsByTagName("MINZOOM")[0].childNodes[0].nodeValue),
                avant:x[i].getElementsByTagName("AVANT")[0].childNodes[0].nodeValue,
                apres:x[i].getElementsByTagName("APRES")[0].childNodes[0].nodeValue,
                mode:x[i].getElementsByTagName("MODE")[0].childNodes[0].nodeValue,
            };

            /* console.log(objet); */
            obj_array.push(objet);
            
            /* console.log(obj_array); */

            // ajoute le premier marker sur la carte
            if (objet.id == 0 ) {
                // generate 1st marker
                /* console.log(obj_array[0]); */
                generate_object(obj_array[0]);
            }
        }
    }
    
    // sert à enlever le premier élément du tableau qui est vide
    // n définit le nombre d'éléments à supprimer,
    // à partir de la position pos
    var pos = 1, n = 1;
    obj_array = obj_array.splice(pos, n); 

    /* console.log(obj_array); */

    /***************                Map Management                  ***************/
    // adapte la taille de la carte à la taille de l'écran
    var height = window.innerHeight;
    var width = window.innerWidth;
    var map_height = height;
    $('#map').css('height', map_height);

    // metttre en place un système pour que l'inventaire aille à gauche sur l'écran et en plus petit lorqu'on est sur un écran de téléphone

    map = L.map('map').setView([48.84106538241659, 2.5879132747650146],17);
    layerGroup = L.layerGroup();

    // La clef d'api mapbox sert à accéder à l'affichage de la carte, ainsi qu'aux calculs d'itinéraires
    var mapboxToken = 'pk.eyJ1IjoiaWFtdmRvIiwiYSI6IkI1NGhfYXMifQ.2FD2Px_Fh2gAZCFTxdrL7g'
    // Génération du fond de carte mapbox via leaflet
    var mapbox_tilelayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 2,
        id: 'mapbox/satellite-v9',
        maxZoom: 20,
        zoom: 10,
        accessToken: mapboxToken
    });

    var CartoDB_VoyagerOnlyLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });
    
    mapbox_tilelayer.addTo(map);
    CartoDB_VoyagerOnlyLabels.addTo(map);
    L.control.scale().addTo(map);
    map.on('click',function(e) {
        console.log("Lat : "+e.latlng.lat+", Long : "+e.latlng.lng+", zoom : "+map.getZoom());
    });

    var north = L.control({position: "bottomright"});
    north.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML = '<img src="assets/images/jeu/north_arrow.png">';
        return div;
    }
    north.addTo(map);

    // initialise le chronomètre 
    countdownManager.init();
}


/**
 * 
 */
function generate_object(objet) {
    
    // les var sont à mettre en dehors de l'appel à la bdd
    console.log(objet);
    var id = objet.id;
    var name = objet.name;
    var img = objet.img;
    var lat = objet.lat;
    var lng = objet.lng;
    var latlng = L.latLng(lat,lng);
    var minZoom = objet.minZoom;
    var avant = objet.avant;
    var apres = objet.apres;
    var mode = objet.mode;

    /* console.log('outil : '+outil); */

    /* console.log(typeof marker); */

    if (typeof marker !== 'undefined') {
        marker.remove();
    }
    
    if (typeof p !== 'undefined') {
        $('#info_dialog').remove($('#info_dialog_text'));
    }
    
    p = '<p id="info_dialog_text">'+avant+'</p>';
    /* console.log(typeof p); */
    var button = "<button id='close_info_dialog' onclick='info_dialog_close()'>Fermer</button>";
    /* console.log(avant); */
    $('#info_dialog').empty();
    $('#info_dialog').append(p);
    $('#info_dialog').append(button);
    $('#info_dialog').show();


    // Ajoutez un marker à la position récupérée (créez une icône personnalisée de votre choix)
    var satellite_icon = L.icon({
        iconUrl: img,
    
        iconSize:     [75, 75], // size of the icon
        iconAnchor:   [37.5, 37.5], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });
    marker = L.marker(latlng, {icon: satellite_icon});
    layerGroup.addLayer(marker);
    
    
    if (map.getZoom()>=minZoom) {
        marker.addTo(map);
    }

    map.on('zoom', function(e){
        /* console.log(map.getZoom()); */
        /* console.log(outil); */
        if (map.getZoom()<minZoom || id == 3 && outil == false || id == 4 && outil == false|| id == 7 && outil == false) {
            marker.remove();
        } else {
            marker.addTo(map);
        }
    });
    map.on('move', function(e){
        /* console.log(map.getZoom()); */
        if (map.getZoom()<minZoom || id == 3 && outil == false || id == 4 && outil == false|| id == 7 && outil == false) {
            marker.remove();
        } else {
            marker.addTo(map);
        }
    });

    

    //console.log('type objet suivant : '+typeof objectTab[iterateur]);
    if (iterateur < 9) {
         if (mode == 'click')  {
            console.log('objet suivant : '+name);
            console.log('le mode de cet objet est : '+mode);
            // gestion de l'enigme portefeuille
            if (id == 0) {
                marker.on('click',function(e)  {
                    swal(apres);
                    // pour ajouter une description
                    var item = '<div class="item" id="portefeuille"></div>';
                    $('#inventaire').append(item);
                    var image = '<img class="img_inventaire" src='+img+' onclick="iteraction_inventaire(0)" alt="Réinitialise le chronomètre."></img>';
                    $('#portefeuille').append(image);
                    var text = '<p id="portefeuille_text">'+apres+'</p>';
                    $('#portefeuille').append(text);
                    iterateur++;
                    generate_object(obj_array[iterateur]);
                });
                // gestion de l'enigme la poste,la gare
            } else if (id == 2 || id == 8) {
                console.log(id);
                marker.on('click',function(e)  {
                    swal(apres);
                    iterateur++;
                    generate_object(obj_array[iterateur]);
                    marker.remove();
                });
                // gestion de l'enigme pizza
            } else if (id == 5) {
                marker.on('click',function(e)  {
                    swal(apres);
                    // pour ajouter une description
                    var item = '<div class="item" id="pizza"></div>';
                    $('#inventaire').append(item);
                    var image = '<img class="img_inventaire" src='+img+' onclick="iteraction_inventaire(5)" alt="Réinitialise le chronomètre."></img>';
                    $('#pizza').append(image);
                    var text = '<p class="text_inventaire" id="pizza_text">'+apres+'</p>';
                    $('#pizza').append(text);
                    
                    iterateur++;
                    generate_object(obj_array[iterateur]);
                });
            }
        } else if (mode == 'item')  {

            /* console.log(iterateur); */
            
            console.log('objet suivant : '+name);
            console.log('le mode de cet objet est : '+mode);

            // gestion de l'enigme thé glacé
            if (id == 3) {
                console.log(outil);

                if (outil == false) {
                    marker.remove();
                } else {
                    marker.addTo(map);
                    
                    marker.on('click',function(e)  {
                        outil = false;
                        swal(apres);
                        // pour ajouter une description et une image
                        var item = '<div class="item" id="iced_tea"></div>';
                        $('#inventaire').append(item);
                        var image = '<img class="img_inventaire" src='+img+' onclick="iteraction_inventaire(3)" alt="Réinitialise le chronomètre."></img>';
                        $('#iced_tea').append(image);
                        var text = '<p class="text_inventaire" id="iced_tea_text">'+apres+'</p>';
                        $('#iced_tea').append(text);
                        // on passe à l'objet suivant
                        iterateur++;
                        generate_object(obj_array[iterateur]);
                        
                    });
                }
                
            }
            // gestion de l'enigme gymnase
            if (id == 6) {
                console.log(outil);
                if (outil == false) {
                    marker.remove();
                } else {
                    marker.addTo(map);
                    
                    marker.on('click',function(e)  {
                        // on affiche le message de victoire
                        swal(apres);
                        // on passe à l'objet suivant
                        iterateur++;
                        generate_object(obj_array[iterateur]);
                        // on remet 'outil' en 'false'
                        outil = false;
                    });
                }
                
            }
        } else if (mode == 'code')  {

            console.log(iterateur);
            
            console.log('objet suivant : '+name);
            console.log('le mode de cet objet est : '+mode);

            // gestion de l'enigme téléphone
            if (id == 1) {
                correct_code = "77186N";
                console.log('code : '+correct_code);
                marker.on('click',function(e)  {
                    swal("Entrez le code de la résidence. Vous vous rappelez qu'il s'agit de son code postal puis des initiales de sa ville.", {
                        content: "input",
                      })
                      .then((value) => {
                        if (`${value}` == correct_code) {
                            // pour ajouter une description
                            var item = '<div class="item" id="telephone"></div>';
                            $('#inventaire').append(item);
                            var image = '<img class="img_inventaire" src='+img+' onclick="iteraction_inventaire(1)" alt="Réinitialise le chronomètre."></img>';
                            $('#telephone').append(image);
                            var text = '<p class="text_inventaire" id="telephone_text">'+apres+'</p>';
                            $('#telephone').append(text);
                            iterateur++;
                            generate_object(obj_array[iterateur]);
                            marker.remove();
                            swal(apres);
                        } else {
                            swal("Mauvaise réponse, tu peux retenter ta chance en cliquant sur le téléphone.");
                        }
                      });
                }); 
            }
            // gestion de l'enigme ami,moi
            if (id == 4 || id == 7) {
                
                if (outil == false) {
                    marker.remove();
                } else {
                    marker.addTo(map);
                    
                    marker.on('click',function(e)  {
                        swal("Choisis l'endroit le plus proche du stade pour être plus efficace.");
                        iterateur++;
                        generate_object(obj_array[iterateur]);
                        outil = false;
                    });
                }
            }
        }
    } else { 
        marker.on('click',function(e)  {
            swal(apres)
            .then((value) => {
                window.location.href="win.php";
            });
        });
    }
}
/**
 * user clique sur le téléphone
 * popup texte apparait
 * user rentre le code
 * on passe à l'objet suivant
 */
function popup_input() {
    var txt;
    var person = prompt("Please enter your name:", "Harry Potter");
    if (person == null || person == "") {
      txt = "User cancelled the prompt.";
    } else {
      txt = "Hello " + person + "! How are you today?";
    }
    document.getElementById("demo").innerHTML = txt;
  }
/**
 * mode :
 * code : user rentre un code pour dévérouiller un objet. il a un indice
 * click : l'utilisateur clique au bon endroit
 * objet : user utilise un objet qu'ila en sa possession pour en dévérouiller un autre
 */

 function info_dialog_close() {
     $('#info_dialog').hide();
 }

 
function iteraction_inventaire(objet) {
    console.log("**** vous intéragissez avec un objet ****")
    console.log("objet id : "+objet);
    console.log("iterateur : "+iterateur);
    // gestion de l'objet portefeuille
    if(objet == 0) {
        console.log('objet utilisé : portefeuille');
        
        // gestion de l'enigme thé glacé
        if (iterateur == 3) {
            outil = true;
            generate_object(obj_array[3]);
         }
         // gestion de l'objet portefeuille
         // gestion de l'enigme gymnase
         if (iterateur == 6) {
            outil = true;
            generate_object(obj_array[6]);
         }

         // gestion de l'objet telephone
    } else if(objet == 1) {
        console.log('objet utilisé : téléphone');
        // gestion de l'enigme ami
        if (iterateur == 4) {        
            correct_code = "13Eliette";
            console.log('code : '+correct_code);
            swal("Il faut que tu dévérouille ton téléphone pour pouvoir activer appeler ton ami. Mais quel est le code ? Tu te rappelle seulement qu'il commence par un nombre premier à 2 chiffres qui est réputé pour porter malheur suivi du prénom de ta soeur.", {
                content: "input",
              })
              .then((value) => {
                if (`${value}` == correct_code) {
                    outil = true;
                    generate_object(obj_array[4]);
                } else {
                    swal("Mauvaise réponse, tu peux retenter ta chance en cliquant sur ton téléphone.");
                }
              });
              
              // gestion de l'objet telephone
              // gestion de l'enigme moi
        } else if (iterateur == 7) {
            correct_code = "13Eliette";
            console.log('code : '+correct_code);
            swal("Il faut que tu dévérouille ton téléphone pour pouvoir activer la localisation. Mais quel est le code ? Rappelle toi, tu l'as vu tout à l'heure !", {
                content: "input",
              })
              .then((value) => {
                if (`${value}` == correct_code) {
                    outil = true;
                    generate_object(obj_array[7]);
                    
                } else {
                    swal("Mauvaise réponse, tu peux retenter ta chance en cliquant sur ton téléphone.");
                }
              });
        }
        
        // gestion de l'objet thé glacé
    } else if(objet == 3) {
        console.log('objet utilisé : thé glacé');
        // initialise le chronomètre 
        countdownManager.init();
        // enlève le thé glacé de l'inventaire
        $('#inventaire').remove($('#iced_tea'));
        
        // gestion de l'objet pizza
    } else if(objet == 5) {
        console.log('objet utilisé : pizza');
        // augmente d'une énigme, si on est à l'avant dernière ça fait gagner
        if (iterateur==8) {
            window.open("win.php","_self");
        } else {
            iterateur++;
            generate_object(obj_array[iterateur]);
        }
        // enlève la pizza de l'inventaire
        $('#inventaire').remove($('#pizza'));
    }
}


 /***************           Compte à rebours            ***************/ 
countdownManager = {

	// Configuration
	targetTime: null, // Date cible du compte à rebours (00:00:00)
    jeuFini: false, //la variable qui dira si le jeu est fini ou non

    displayElement: { // Elements HTML où sont affichés les informations
        hour: null,
        min:  null,
        sec:  null

    },

	// Initialisation du compte à rebours (à appeler 1 fois au chargement de la page)
	init: function(x){
        this.targetTime = new Date();   // on initialise la date cible à chaque nouveau niveau. Pour mettre un temps global on peut initialiser la date dès sa création
        // Récupération des références vers les éléments pour l'affichage
        // La référence n'est récupérée qu'une seule fois à l'initialisation pour optimiser les performances
        this.displayElement.min  = document.getElementById('countdown_min');
        this.displayElement.sec  = document.getElementById('countdown_sec');
        // Lancement du compte à rebours
        this.tick(); // Premier tick tout de suite
        
        console.log(this.jeuFini);
        window.setInterval("countdownManager.tick();", 1000); // Ticks suivant, répété toutes les secondes (1000 ms)
        
    },

	// Met à jour le compte à rebours (tic d'horloge)
	tick: function(){
        if (this.jeuFini == false){
            // Instant présent
            var timeNow  = new Date();
            // Calcul du temps restant
            var diff = this.dateDiff(timeNow, this.targetTime);
            // Si il reste moins de 5 minutes le temps se met en gras et en rouge
            if (diff.min < 5) {
                this.displayElement.min.innerHTML = "<b>" + diff.min + "<b>";
                this.displayElement.min.style.color = "red";
                this.displayElement.sec.innerHTML = "<b>" +  diff.sec + "<b>";
                this.displayElement.sec.style.color = "red";
            } else {
                this.displayElement.min.innerHTML = diff.min;
                this.displayElement.sec.innerHTML = diff.sec;
            }

            // Si le temps est écoulé on affiche une fenêtre avec un bouton confirmer qui permet de recommencer
            // et un bouton annuler qui nous fait retourner à la page d'intro du jeu
            if (diff.min <= 0 && diff.sec <= 0){
                console.log(this.jeuFini);
                this.displayElement.min.innerHTML = 0;
                this.displayElement.sec.innerHTML = 0;
                this.jeuFini = true;

                // pour télécharger une icon check tes mails et https://fontawesome.com/
                var img_lose = 'assets/images/jeu/lose2.png';

                fetch(`assets/images/jeu/lose2.png`)
                    .then(results => {
                        console.log(results.json());
                    });

                
                swal(
                    {
                        title: "Oh non, le temps est écoulé!",
                        text: "Voulez-vous recommencer?",
                        icon: img_lose,
                        buttons: {
                            recommencer:"Recommencer",
                            arreter:"Arreter",
                        },
                })
                .then((value) => {
                    switch (value) {
                        default:
                            window.open("game.php","_self");

                        case "recommencer":
                            window.open("game.php","_self");
                            break;

                        case "arreter":
                            window.location.href="index.php";
                            break;  
                    }
                });
            }
        }
	},

	// Calcul la différence entre 2 dates, en jour/heure/minute/seconde
	dateDiff: function(date1, date2){
		var diff = {}                           // Initialisation du retour
        //console.log('date1 : '+ date1);
        //console.log('date2 : '+ date2);
        var tmp = date2 - date1 + 600000 ; //600000 correspondent à 10 minutes

		tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
		diff.sec = tmp % 60;                    // Extraction du nombre de secondes
        tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
		diff.min = tmp % 60;                    // Extraction du nombre de minutes

		return diff;
	}
};
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Polomotive</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
   integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
   crossorigin=""/>
   <link rel="stylesheet" href="assets/css/game.css">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>

    
    <div id='map'></div>

    <div id='info_dialog'><p id='info_dialog_text'>Avant de partir, trouve ton porte-monnaie. Il se trouve chez toi, au Bois de Grace, au nord de ton école. Les objets ne s'affichent qu'à un certain niveau de zoom, essaie de zoomer sur le bois de grace pour trouver ton portefeuille.</p><button id='close_info_dialog' onclick='info_dialog_close()'>Fermer</button></div>

    <div id="countdown">
    	<strong>Temps restant</strong> :<br>
    	<span id="countdown_min" >--</span>
      <span> : </span>
    	<span id="countdown_sec" >--</span>
    </div>

    <div id='inventaire'><p id='inventaire_static_text'>Inventaire :<p></div>

    <!-- Leaflet Map -->
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
    integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
    crossorigin=""></script>
    <!-- JQuery -->
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/jquery.poptrox.min.js"></script>
    <!-- SweetAlert -->
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
    <!-- Main JS -->
    <script src="assets/js/game.js"></script>

</body>   
</html>


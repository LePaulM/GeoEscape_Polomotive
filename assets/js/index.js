var bg_img_1 = 'url(assets/images/histoire/paul_perdu3.jpg)';
var bg_img_2 = 'url(assets/images/histoire/paul_perdu1.jpg)';
var nb_click = 0;

document.body.style.backgroundImage = bg_img_1;

// ça ça change l'image de fond du site
window.onclick  = function(){
    nb_click++;
    if (nb_click < 2) {
        document.body.style.backgroundImage = bg_img_2;
        $('#histoire_text').css({top: 200, right: 200, position:'absolute',width:300});
    } else {
        window.location.href='game.php';
    }
    
}
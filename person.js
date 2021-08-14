console.log('in person');


let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
console.log(url_string_user);


function get_person(doc){
    if(url_string_user == doc.id)
    {
        let usrnme = document.getElementById("username");
        let nme = document.getElementById("name");
        let scre = document.getElementById("score");
        let cls = document.getElementById("class");


        usrnme.innerHTML = "username: " + doc.data().username;
        nme.innerHTML = "name: " + doc.data().name;
        scre.innerHTML = "score: " + doc.data().score.toString();
        cls.innerHTML = "class: " + doc.data().class;
    }
}


db.collection('students').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        get_person(doc);
    });
})


document.getElementById('submit').onclick = function() {
    window.location.href='/test/' + url_string_user;
}

document.getElementById('sout').onclick = function() {
    window.location.href='/';
}
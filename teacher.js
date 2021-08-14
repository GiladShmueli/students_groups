console.log('in teacher');
const sList = document.querySelector('#student-list');
let className = "";
let posted = 0;


let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
console.log(url_string_user);


function get_person(doc){
    if(url_string_user == doc.id)
    {
        className = doc.data().class;
        let usrnme = document.getElementById("username");
        let nme = document.getElementById("name");
        let scre = document.getElementById("class");

        usrnme.innerHTML = "username: " + doc.data().username;
        nme.innerHTML = "name: " + doc.data().name;
        scre.innerHTML = "class: " + doc.data().class;
    }
}


db.collection('teachers1').get().then(snapshot => {
   
    snapshot.docs.forEach(doc => {
        get_person(doc);
    });
    
})



function renderStudents(doc){

    let qdiv = document.createElement('div');
    let name = document.createElement('p');

    name.textContent = "name: " + doc.data().name  +" score: " +  doc.data().score;
    qdiv.appendChild(name);
    sList.appendChild(qdiv);
}




document.getElementById('submit').onclick = function() {
    //window.location.href='/test/' + url_string_user;
    if(posted == 0)
    {
        posted = 1;
        db.collection('students').get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                renderStudents(doc);
            });
        })
    }

}

document.getElementById('sout').onclick = function() {
    window.location.href='/';
}
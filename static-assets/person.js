console.log('in person');


let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
console.log(url_string_user);
let className;
let myScore = NaN;

function get_person(doc){
    if(url_string_user == doc.id)
    {
        let usrnme = document.getElementById("username");
        let nme = document.getElementById("name");
        let scre = document.getElementById("score");
        let cls = document.getElementById("class");
        let grp = document.getElementById("group");

        usrnme.innerHTML = "username: " + doc.data().username;
        nme.innerHTML = "name: " + doc.data().name;
        scre.innerHTML = "score: " + doc.data().score.toString();
        cls.innerHTML = "class: " + doc.data().class;
        grp.innerHTML = "group: " + doc.data().group;
        className = doc.data().class;
        myScore = doc.data().score;
    }
}


db.collection('students').doc(url_string_user).get().then(snapshot => {
    if(snapshot.exists)
        get_person(snapshot);
    else
    {
        console.log("does not exist")
        window.location.href='/';
    }

})

let info = [];
let groups, centers;
let disabled = false;
document.getElementById('show_graph').onclick = function() {
    if(disabled)
        return;
    disabled = true;
    db.collection('students').get().then(snapshot => {
        info = [];
        snapshot.docs.forEach(doc => {
            if(doc.data().class==className && doc.data().score >= 0)
            {
                info.push({
                    name: doc.data().name,
                    id: doc.id,
                    score: doc.data().score
                });
             }
        });
        groups, centers = kMeans(normalizeGrades(info.map(student => student.score)));
        
    }).then(temp => {
        let grades = info.map(i =>i.score);
        grades.sort((a, b) => {return a - b;});
        let img = createGraphPNG(grades, myScore);
        document.getElementById("graph").appendChild(img);
    });
}

document.getElementById('submit').onclick = function() {
    window.location.href='/test/' + url_string_user;
}

document.getElementById('sout').onclick = function() {
    window.location.href='/';
}
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

    name.textContent = "name: " + doc.data().name  +" score: " +  doc.data().score +
    "\t group: " + doc.data().group;
    qdiv.appendChild(name);
    sList.appendChild(qdiv);
}



let grades = [];
document.getElementById('submit').onclick = function() {
    //window.location.href='/test/' + url_string_user;
    if(posted == 0)
    {
       grades = []; 
        posted = 1;
        db.collection('students').get().then(snapshot => {
            
            snapshot.docs.forEach(doc => {
                if(doc.data().class==className)
                {
                    grades.push(parseFloat(doc.data().score));
                    renderStudents(doc);
                }
            });
            
        }).then(temp => {
            console.log(grades);
            grades.sort((a, b) => {return a - b;});
            let img = createGraphPNG(grades);
            document.getElementById("graph").appendChild(img);
        });
    }

}

document.getElementById('setgroups').onclick = function() {
    db.collection('students').get().then(snapshot => {
       grades=[];
        snapshot.docs.forEach(doc => {
            if(doc.data().class==className)
            {
                grades.push(parseFloat(doc.data().score));
            }
        });
        let groups = k_means(normalize_grades(grades));
        console.log(groups);
        let cnt = 0;
        snapshot.docs.forEach(item => {
            if(item.data().class==className)
            {
                db.collection('students').doc(item.id).update({
                    group: groups[cnt]
                })
                cnt++;
            }
        });
    })
}

document.getElementById('addstudent').onclick = function() {
    window.location.href = '/add/' + url_string_user 
}

document.getElementById('sout').onclick = function() {
    window.location.href='/';
}
//console.log('in teacher');
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

        usrnme.innerHTML = "אימייל: " + doc.data().username;
        nme.innerHTML = "שם: " + doc.data().name;
        scre.innerHTML = "כיתה: " + doc.data().class;
    }
}


db.collection('teachers1').doc(url_string_user).get().then(snapshot => {
   
    
    if(snapshot.exists)
    get_person(snapshot);
    else
    {
        console.log("does not exist")
        window.location.href='/';
    }
    
})


function renderStudents(doc){

    let qdiv = document.createElement('div');
    let name = document.createElement('p');
    let grade = document.createElement('p');
    let group = document.createElement('p');
    qdiv.setAttribute("class","row");

    name.setAttribute("class","col-4");
    group.setAttribute("class","col-4");
    grade.setAttribute("class","col-4");

    name.textContent = doc.data().name;
    grade.textContent = doc.data().score;
    group.textContent = doc.data().group;
    qdiv.appendChild(name);
    qdiv.appendChild(grade);
    qdiv.appendChild(group);
    sList.appendChild(qdiv);
}


let cen = [];
let grades = [];
let info = []; //info of students as objects {name:"", id:"", score:""}
document.getElementById('submit').onclick = function() {
    //window.location.href='/test/' + url_string_user;
    if(posted == 0)
    {
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
            const {groups, centers} = kMeans(normalizeGrades(info.map(student => student.score)));
            cen = centers;
            let cnt = 0;
            snapshot.docs.forEach(item => {
                if(item.data().class==className && item.data().score >= 0)
                {
                    db.collection('students').doc(item.id).update({
                        group: groups[cnt]
                    })
                    cnt++;
                }
            });
            return 0;
        }).then(res => {
            setTableHeader();
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
        })
    }
}

function setTableHeader(){
    let qdiv = document.createElement('div');
    let name = document.createElement('p');
    let grade = document.createElement('p');
    let group = document.createElement('p');
    qdiv.setAttribute("class","row");

    name.setAttribute("class","col-4 table-header");
    group.setAttribute("class","col-4 table-header");
    grade.setAttribute("class","col-4 table-header");

    name.textContent = "שם";
    grade.textContent = "ציון";
    group.textContent = "הקבצה";
    qdiv.appendChild(name);
    qdiv.appendChild(grade);
    qdiv.appendChild(group);
    sList.appendChild(qdiv);
}

document.getElementById('addstudent').onclick = function() {
    window.location.href = '/add/' + url_string_user 
}

document.getElementById('addquestion').onclick = function() {
    window.location.href = '/addq/' + url_string_user 
}

document.getElementById('sout').onclick = function() {
    window.location.href='/';
}
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
let grps = [];
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
                        score: doc.data().score,
                        group: 0
                    });
                }
            });
            const {groups, centers} = kMeans(normalizeGrades(info.map(student => student.score)));
            cen = centers;
            grps = groups;
            let cnt = 0;
            snapshot.docs.forEach(item => {
                if(item.data().class==className && item.data().score >= 0)
                {
                    db.collection('students').doc(item.id).update({
                        group: groups[cnt]
                    })
                    info[cnt].group = groups[cnt];
                    cnt++;
                }
            });
            return 0;
        }).then(res => {
            setTableHeader();
            grades = info.map(student => student.score); 
                    posted = 1;
                    db.collection('students').get().then(snapshot => {
                        snapshot.docs.forEach(doc => {
                            if(doc.data().class==className)
                            {
                                renderStudents(doc);
                            }
                        });
                    }).then(temp => {
                    });
                    grades.sort((a, b) => {return a - b;});
                    let img = createGraphPNG(grades);
                    
                    document.getElementById("graph").appendChild(img);
                    showData();
        })
    }
}

function showData() {
    let cddiv = document.getElementById("class-data");
    let avg = document.createElement('p');
    let stad = document.createElement('p');
    avg.setAttribute("class","col-4");
    stad.setAttribute("class","col-5");
    avg.innerHTML = "ממוצע כיתתי: " + final_average(grades).toFixed(2);
    stad.innerHTML = "סטיית תקן: " + std(grades).toFixed(2);
    cddiv.appendChild(avg);
    cddiv.appendChild(stad);
    //showGroupsData();
}

function showGroupsData() {
    
    let dev = [];
    info = info.sort((a, b) => { return a.score - b.score; });
    let t1 = info[0];
    let tags = grps.filter(onlyUnique); //calling a function
    let tag = tags[0];
    let t = 0;
    for (var i = 0; i < info.length; i++) {
        console.log("info["+i+"]  " + info[i].group);
        if (dev.length == 0 || info[i].group != undefined && info[i].group == t1.group) {
            dev.push(info[i]);
        } else if (dev.length > 0){
            
            addGroupData(dev, tag);
            tag = tags[++t];
            dev = [];
            t1 = info[i];
            console.log("t1--");
            console.log(t1);
        } else {
            console.log("t1++");
            console.log(t1);
            dev = [];
            t1 = info[i];
        }
    }
    addGroupData(dev, tag);
    tag = tags[++t];
}

function addGroupData(dev, tag) {
    let cddiv = document.getElementById("groups-data");
    var line = document.createElement('div');
    line.setAttribute("class","row");
    var group = document.createElement('p');
    var avg = document.createElement('p');
    var stad = document.createElement('p');
    var size = document.createElement('p');
    group.setAttribute("class", "col-2");
    avg.setAttribute("class", "col-3");
    stad.setAttribute("class", "col-3");
    size.setAttribute("class", "col-4");
    group.innerHTML = "הקבצה: " + info[tag].group;
    avg.innerHTML = "ממוצע: " + final_average(dev.map(d => d.score)).toFixed(2);
    stad.innerHTML = "סטיית תקן: " + std(dev.map(d => d.score)).toFixed(2);
    size.innerHTML = "מס' התלמידים בקבוצה: " + dev.length;
    line.appendChild(group);
    line.appendChild(avg);
    line.appendChild(stad);
    line.appendChild(size);
    cddiv.appendChild(line);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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
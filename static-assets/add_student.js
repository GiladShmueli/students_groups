const form = document.querySelector('#sign_in');
const qlist = document.querySelector('#student-list');

let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
let myclass;
db.collection('teachers1').doc(url_string_user).get().then(snapshot => {
    
    if(snapshot.exists)
        myclass = snapshot.data().class;
    else
    {
        console.log("does not exist");
        window.location.href='/';
    }
    return 0;
}).then(temp => {

    db.collection('students').onSnapshot(snapshot=>{

        let changes = snapshot.docChanges();
        changes.forEach(change=>{

            if(change.type == "added" && change.doc.data().class == myclass){
                renderstudent(change.doc)
            }
            else if(change.type == "removed" && change.doc.data().class == myclass){
            let li = qlist.querySelector('[data-id=' + change.doc.id + ']');
            qlist.removeChild(li);
            }
        })
    })
});

console.log(url_string_user);


function renderstudent(doc)
{
    let li = document.createElement('div');
    let marg = document.createElement('div');
    let name = document.createElement('span');
    let username = document.createElement('span');
    let password = document.createElement('span');
    
    let cross = setCrossButton();
    cross.setAttribute('data-id', doc.id);

    li.setAttribute("class", "row q-row");
    name.textContent = doc.data().name;
    username.textContent = doc.data().username;
    password.textContent = doc.data().password;
    name.setAttribute("class", "col-1 wide");
    username.setAttribute("class", "col-2 wide");
    password.setAttribute("class", "col-2 wide");
    marg.setAttribute("class","col-2");
    li.appendChild(marg);
    li.appendChild(cross);
    li.appendChild(name);
    li.appendChild(username);
    li.appendChild(password);

    qlist.appendChild(li);

    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('students').doc(id).delete();
    })
}

let res = document.getElementById("res");
form.addEventListener('submit',(e) => {
    console.log("testing");
    e.preventDefault();
    let found = false;

    db.collection('students').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.data().username == form.username.value)
            {
                found = true;
                res.innerHTML = "התלמיד/ה כבר קיים/ת"
            }
            
    })

    return found;

}).then(temp => {
        console.log(allInputFieldsFilled());
        if(!allInputFieldsFilled()){
            res.innerHTML = "נא למלא את כל השדות";
            return;
        }
        if(found == false)
        {
            db.collection('students').add({
                username: form.username.value,
                password: form.password.value,
                group: -1,
                score: -1,
                name: form.name.value,
                class: myclass
            });
            form.username.value = '';
            form.password.value = '';
            form.name.value = '';
            res.innerHTML = "התלמיד/ה נוסף/ה בהצלחה"

        }
    })


})

function setCrossButton(){
    let cross = document.createElement('button');
    cross.setAttribute("class","col-1 pushable");
    let s1 = document.createElement("span");
    let s2 =  document.createElement("span");
    let s3 =  document.createElement("span");
    s1.setAttribute("class","shadow");
    s2.setAttribute("class","edge");
    s3.setAttribute("class","front");
    s3.textContent = 'X';
    cross.appendChild(s1);
    cross.appendChild(s2);
    cross.appendChild(s3);
    return cross;
}

function allInputFieldsFilled(){
    return /\S/.test(form.username.value) && /\S/.test(form.password.value) && /\S/.test(form.name.value);
}
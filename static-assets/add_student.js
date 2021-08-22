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
    let li = document.createElement('li');
    let name = document.createElement('span');
    let username = document.createElement('span');
    let password = document.createElement('span');
    
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    username.textContent = doc.data().username;
    password.textContent = doc.data().password;
    cross.textContent = 'X';

    li.appendChild(name);
    li.appendChild(username);
    li.appendChild(password);
    li.appendChild(cross);

    qlist.appendChild(li);

    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('students').doc(id).delete();
    })
}

form.addEventListener('submit',(e) => {
    e.preventDefault();

    res = document.getElementById("res");
    let found = false;

    db.collection('students').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.data().username == form.username.value)
            {
                found = true;
                res.innerHTML = "student already exists."
            }
            
    })

    return found;

}).then(temp => {

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
            res.innerHTML = "student added."

        }
    })


})
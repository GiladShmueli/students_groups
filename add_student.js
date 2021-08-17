const form = document.querySelector('#sign_in');

let url_string = document.location.href;
var url_string_user = url_string.substr(url_string.lastIndexOf('/') + 1,url_string.length);
let myclass;
db.collection('teachers1').doc(url_string_user).get().then(snapshot => {
    myclass = snapshot.data().class
});
console.log(url_string_user);

form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection('students').add({
        username: form.username.value,
        password: form.password.value,
        group: -1,
        score: -1,
        name: form.name.value,
        class: myclass
    });
    
})
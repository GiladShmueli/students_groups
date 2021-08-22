const form = document.querySelector('#sign_in');
const qlist = document.querySelector('#question-list');

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

    //db.collection('tests1').get().then(snapshot => {
    //    snapshot.docs.forEach(doc => {
    //        renderques(doc)
    //    });
    //});

    db.collection('tests1').onSnapshot(snapshot=>{

        let changes = snapshot.docChanges();
        changes.forEach(change=>{

            if(change.type == "added"){
                renderques(change.doc)
            }
            else if(change.type == "removed"){
            let li = qlist.querySelector('[data-id=' + change.doc.id + ']');
            qlist.removeChild(li);
            }
        })
    })


});
console.log(url_string_user);

function renderques(doc)
{
    let li = document.createElement('li');
    let question = document.createElement('span');
    let answer = document.createElement('span');
    let option1 = document.createElement('span');
    let option2 = document.createElement('span');
    let option3 = document.createElement('span');
    let option4 = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    question.textContent = doc.data().question;
    answer.textContent = doc.data().answer;
    option1.textContent = doc.data().options[0];
    option2.textContent = doc.data().options[1];
    option3.textContent = doc.data().options[2];
    option4.textContent = doc.data().options[3];
    cross.textContent = 'X';

    li.appendChild(question);
    li.appendChild(answer);
    li.appendChild(option1);
    li.appendChild(option2);
    li.appendChild(option3);
    li.appendChild(option4);
    li.appendChild(cross);

    qlist.appendChild(li);

    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tests1').doc(id).delete();
    })
}

form.addEventListener('submit',(e) => {
    e.preventDefault();

    res = document.getElementById("res");
    let found = false;

    db.collection('tests1').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.data().question == form.question.value)
            {
                found = true;
                res.innerHTML = "question already exists."
            }
            
    })

    return found;

}).then(temp => {

        if(found == false)
        {
            db.collection('tests1').add({
                question: form.question.value,
                answer: form.answer.value,
                options: [form.option1.value,form.option2.value,form.option3.value,form.option4.value]
            });
            form.question.value = '';
            form.answer.value = '';
            form.option1.value = '';
            form.option2.value = '';
            form.option3.value = '';
            form.option4.value = '';
            res.innerHTML = "question added."

        }
    })


})
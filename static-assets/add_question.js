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
    let li = document.createElement('div');
    let marg = document.createElement('div');
    marg.setAttribute("class","col-1");
    let question = document.createElement('span');
    // let answer = document.createElement('span');
    // let option1 = document.createElement('span');
    // let option2 = document.createElement('span');
    // let option3 = document.createElement('span');
    // let option4 = document.createElement('span');
    let cross = setCrossButton();
    //cross.setAttribute('data-id', doc.id);
    li.setAttribute('data-id', doc.id);
    
    li.setAttribute("class", "row q-row");
    question.textContent = doc.data().question;
    question.setAttribute("class","col-9");
    
    // answer.textContent = doc.data().answer;
    // option1.textContent = doc.data().options[0];
    // option2.textContent = doc.data().options[1];
    // option3.textContent = doc.data().options[2];
    // option4.textContent = doc.data().options[3];
    
    li.appendChild(marg);
    li.appendChild(cross);
    li.appendChild(question);
    // li.appendChild(answer);
    // li.appendChild(option1);
    // li.appendChild(option2);
    // li.appendChild(option3);
    // li.appendChild(option4);

    qlist.appendChild(li);
    if(!(/[\u0590-\u05FF]/).test(question.textContent)){
        question.setAttribute("style","direction: ltr");
    }
    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('tests1').doc(id).delete();
    })
}

function setCrossButton(){
    let cross = document.createElement('button');
    cross.setAttribute("class","col-1 pushable shadow edge front");
    // let s1 = document.createElement("span");
    // let s2 =  document.createElement("span");
    // let s3 =  document.createElement("span");
    // s1.setAttribute("class","shadow");
    // s2.setAttribute("class","edge");
    // s3.setAttribute("class","front");
    cross.textContent = 'X';
    // cross.appendChild(s1);
    // cross.appendChild(s2);
    // cross.appendChild(s3);
    return cross;
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
                res.innerHTML = "השאלה כבר קיימת"
            }
            
    })

    return found;

}).then(temp => {
        if(!allInputFieldsFilled()){
            res.innerHTML = "נא למלא את כל השדות";
            return;
        }
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
            res.innerHTML = "השאלה נוספה בהצלחה"

        }
    })


})

function allInputFieldsFilled(){
    return /\S/.test(form.question.value) && /\S/.test(form.question.value) && /\S/.test(form.option1.value) &&
            /\S/.test(form.option2.value) && /\S/.test(form.option3.value) && /\S/.test(form.option4.value);
}

document.getElementById('back').onclick = function() {
    window.location.href = '/teacherp/' + url_string_user 
}
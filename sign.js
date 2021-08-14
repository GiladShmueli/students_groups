const form = document.querySelector('#sign_in');

let i = 0;

function check_person(doc,char){

    console.log(form.username.value);
    console.log(doc.data().username);
    if(form.username.value == doc.data().username && form.password.value == doc.data().password)
    {
        
        i = 1;
        if(char == "s")
            window.location.href='/personal/' + `${doc.id}`;
        else
            window.location.href='/teacherp/' + `${doc.id}`;
    }
}


form.addEventListener('submit',(e) => {
    e.preventDefault();

    db.collection('teachers1').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            check_person(doc,"t");
        });
    });


    db.collection('students').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            check_person(doc,"s");
        });
    }).then(temp => {
        console.log(temp);

        if(i == 0)
        console.log('not ok');
    else if(i == 1)
        console.log('ok');
        i = 0;
    });
   
})




function init_centers(k=4) {
    let lines = [];
    for(let i=1 ; i < k+1 ; i++){
       lines[i-1] = 100*i/(k+1);
    }
    return lines;
}

function pick_closest_center(centers, score){
    let result = 0;
    let distance = Math.abs(score-centers[0]);
    for(let i=1 ; i<centers.length ; i++) {
        if (Math.abs(score-centers[i]) < distance) {
            result = i;
            distance = Math.abs(score-centers[i]);
        }
    }
    return result;
}

function mean(add, old_mean) {
    return (add+old_mean[0])/(old_mean[1]+1);
}

function redefine_centers(scores, tags, k) {
    let centers = new Map();
    var i;
    for(i=0; i<k; i++) {
        centers.set(i, [undefined, 0]);
    }
    let tag;
    
    for (i=0 ; i<scores.length ; i++) {
        tag = tags[i];
        if (centers.get(tag)[0]==undefined) {
            centers.set(tag, [scores[i],1]);
        } else {
            centers.set(tag, [mean(scores[i], centers.get(tag)), centers.get(tag)[1]+1] );

        }
    }
    return centers.values();
}

function k_means(scores, k=4){
    let centers = init_centers(k);
    let tags = new Array(scores.length);
    let past;
    do {
        past = tags;
        for(var i=0; i< scores.length; i++){
            tags[i] = pick_closest_center(centers, scores[i]);
        }
        centers = redefine_centers(scores, tags, k);
    }while(past!=tags)
    return tags;
}

function normalize_grades(scores) {
    let max = Math.max.apply(null, scores);
    let min = Math.min.apply(null, scores);
    let n_scores = new Array();
    scores.forEach(element => {
        n_scores.push(100*(element-min)/(max-min))
    });
    return n_scores;
}

/*let scores = [0, 45, 12, 54, 89, 90, 100, 3, 50, 17, 56, 18, 85, 87];
console.log(k_means(scores));

scores = [50, 20, 30, 50, 40, 45, 25, 35, 60, 65, 60, 60];
console.log(k_means(normalize_grades(scores)));*/


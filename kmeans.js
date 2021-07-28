function init_centers(k=4) {
    let lines = [];
    for(let i=1 ; i < k+1 ; i++){
       lines[i] = 100*i/(k+1);
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

let scores = [0, 0.45, 0.12, 0.54, 0.89, 0.90, 1.00, 0.03, 0.50, 0.17, 0.56, 0.18, 0.85, 0.87]
console.log(k_means(scores));
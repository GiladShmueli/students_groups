function std(data) {
    let average = final_average(data);
    let size = data.length;
    let variance = 0;
    for(var i=0; i<size; i++) {
        variance += (data[i] - average) * (data[i] - average);
    }
    variance /= size;
    return Math.sqrt(variance);
}

function final_average(data) {
    let size = data.length;
    let sum = 0;
    for(var i=0; i<size; i++) {
        sum += data[i];
    }
    return sum/size;
}
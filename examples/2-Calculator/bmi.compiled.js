console.log("مرحبًا بكم في حاسبة الوزن!")

var الوزن = prompt("ماهو وزنك بالكيلوقرام؟");
var الطول = prompt("ماهو طولك بالسنتي متر إلى اقرب عدد صحيح");
var قياس = الوزن / (الطول / 100);
console.log("مقياس البي ام اي لك هو: " + قياس)
console.log("مرحبًا بكم في الحاسبة! 😁")
var رقم1 = parseFloat(prompt("ادخل الرقم الأول: "));
var رقم2 = parseFloat(prompt("ادخل الرقم الثاني: "));
var العملية = prompt("اكتب العملية المرادة: جمع، طرح، ضرب، أو قسمة: ");
if (العملية == "جمع") {
console.log(رقم1 + رقم2)

} else if (العملية == "طرح") {
console.log(رقم1 - رقم2)

} else if (العملية == "ضرب") {
console.log(رقم1 * رقم2)

} else if (العملية == "قسمة") {
console.log(رقم1 / رقم2)

} else {
console.log("عملية غير صحيحة")

}
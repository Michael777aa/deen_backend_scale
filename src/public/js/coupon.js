console.log("Coupon frontend javascript file");
function generateCouponName() {
  const randomName = "Coupon-" + Math.random().toString(36).substring(2, 8);
  document.getElementById("name").value = randomName;
}

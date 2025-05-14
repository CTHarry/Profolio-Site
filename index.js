function changeImage() {
    console.log("Image clicked");
    const image = document.getElementById("profilePic");

    image.classList.remove("spinY");
    void image.offsetWidth;
    image.classList.add("spinY");

    setTimeout(function() {
    if (image.src.includes("Hong%20Ye%20Wu.png")) {
        image.src = "Image/CTHarry.jpg";
        image.alt = "Grade 8 selfie, very cool!"
    } else {
        console.log(image.src);
        image.src = "Image/Hong Ye Wu.png";
        image.alt = "Newer selfie, also very cool!"
    }
    }, 160);
}

function updateNavOffset() {
  const nav = document.querySelector('.navbar');
  document.documentElement.style.setProperty(
    '--nav-height',
    `${nav.offsetHeight}px`
  );
}

window.addEventListener('load',  updateNavOffset);
window.addEventListener('resize', updateNavOffset);